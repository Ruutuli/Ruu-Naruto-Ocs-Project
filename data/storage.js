// GitHub API-based storage for Naruto OC Website
// Saves directly to GitHub repository
// Files are saved to data/clans/, data/ocs/, etc. in your GitHub repo

import { githubConfig, getGitHubToken, saveGitHubToken } from './github-config.js';

class Storage {
  constructor() {
    this._cache = {
      ocs: new Map(),
      clans: new Map(),
      stories: new Map(),
      lore: new Map()
    };
    this._githubBase = `https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}`;
    this._token = null;
    this.init();
  }

  async init() {
    // Check for GitHub token (from config or localStorage)
    this._token = getGitHubToken();
    
    // Load all existing data from GitHub
    await this.loadAllFromGitHub();
  }

  // Get file SHA (required for updating existing files)
  async getFileSHA(path) {
    try {
      const response = await fetch(
        `${this._githubBase}/contents/${path}?ref=${githubConfig.branch}`,
        {
          headers: {
            'Authorization': `token ${this._token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        return data.sha;
      } else if (response.status === 404) {
        // File doesn't exist yet
        return null;
      } else {
        throw new Error(`Failed to get file SHA: ${response.statusText}`);
      }
    } catch (e) {
      console.error('Error getting file SHA:', e);
      return null;
    }
  }

  // Load all files from GitHub
  async loadAllFromGitHub() {
    if (!this._token) {
      console.warn('No GitHub token available, loading from static files');
      await this.loadAllFromStaticFiles();
      return;
    }

    try {
      const types = ['ocs', 'clans', 'stories', 'lore'];
      
      for (const type of types) {
        try {
          // Get directory contents from GitHub
          const response = await fetch(
            `${this._githubBase}/contents/data/${type}?ref=${githubConfig.branch}`,
            {
              headers: {
                'Authorization': `token ${this._token}`,
                'Accept': 'application/vnd.github.v3+json'
              }
            }
          );

          if (response.ok) {
            const files = await response.json();
            this._cache[type].clear();
            
            // Load each JSON file
            for (const file of files) {
              if (file.type === 'file' && file.name.endsWith('.json')) {
                try {
                  const fileResponse = await fetch(file.download_url);
                  if (fileResponse.ok) {
                    const data = await fileResponse.json();
                    if (data && data.id) {
                      this._cache[type].set(data.id, data);
                    }
                  }
                } catch (e) {
                  console.error(`Error loading ${file.name}:`, e);
                }
              }
            }
          } else if (response.status === 404) {
            // Directory doesn't exist yet, that's fine - silently handle
            // This is expected behavior when directories haven't been created in GitHub yet
          }
        } catch (e) {
          console.log(`Could not load ${type} from GitHub:`, e);
          // Fallback to static files
          await this.loadFromStaticFiles(type);
        }
      }
    } catch (e) {
      console.log('Could not load from GitHub, trying static files:', e);
      await this.loadAllFromStaticFiles();
    }
  }

  // Fallback: Load from static files
  async loadAllFromStaticFiles() {
    const types = ['ocs', 'clans', 'stories', 'lore'];
    
    for (const type of types) {
      await this.loadFromStaticFiles(type);
    }
  }

  async loadFromStaticFiles(type) {
    if (type === 'clans') {
      const knownFiles = ['clanChigiri'];
      for (const fileId of knownFiles) {
        try {
          const response = await fetch(`data/${type}/${fileId}.json`);
          if (response.ok) {
            const data = await response.json();
            this._cache[type].set(data.id, data);
          }
        } catch (e) {
          // File doesn't exist, skip it
        }
      }
    }
  }

  // Save a file to GitHub
  async saveFile(type, id, data) {
    if (!this._token) {
      this._token = getGitHubToken();
    }
    
    if (!this._token) {
      this.showNotification('Error: GitHub token not found. Please set it in data/github-config.js or localStorage.', 'error');
      return false;
    }

    try {
      const path = `data/${type}/${id}.json`;
      const content = JSON.stringify(data, null, 2);
      const encodedContent = btoa(unescape(encodeURIComponent(content)));
      
      // Get existing file SHA if it exists
      const sha = await this.getFileSHA(path);
      
      const body = {
        message: `Update ${type}: ${id}`,
        content: encodedContent,
        branch: githubConfig.branch
      };
      
      // If file exists, include SHA for update
      if (sha) {
        body.sha = sha;
      }

      const response = await fetch(
        `${this._githubBase}/contents/${path}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `token ${this._token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }
      );

      if (response.ok) {
        // Update cache
        this._cache[type].set(id, data);
        return true;
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save file');
      }
    } catch (e) {
      console.error(`Error saving ${type}/${id}.json:`, e);
      let errorMessage = e.message;
      
      if (e.message.includes('Bad credentials') || e.message.includes('401')) {
        errorMessage = 'Invalid GitHub token. Please refresh and enter a new token.';
        localStorage.removeItem('github_token');
        this._token = null;
      } else if (e.message.includes('404')) {
        errorMessage = 'Repository not found. Please check your GitHub config in data/github-config.js';
      }
      
      this.showNotification(`Error saving: ${errorMessage}`, 'error');
      return false;
    }
  }

  // Delete a file from GitHub
  async deleteFile(type, id) {
    if (!this._token) {
      this._token = getGitHubToken();
    }
    
    if (!this._token) {
      this.showNotification('Error: GitHub token not found. Please set it in data/github-config.js or localStorage.', 'error');
      return false;
    }

    try {
      const path = `data/${type}/${id}.json`;
      const sha = await this.getFileSHA(path);
      
      if (!sha) {
        // File doesn't exist
        this._cache[type].delete(id);
        return true;
      }

      const response = await fetch(
        `${this._githubBase}/contents/${path}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `token ${this._token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: `Delete ${type}: ${id}`,
            sha: sha,
            branch: githubConfig.branch
          })
        }
      );

      if (response.ok) {
        // Remove from cache
        this._cache[type].delete(id);
        return true;
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete file');
      }
    } catch (e) {
      console.error(`Error deleting ${type}/${id}.json:`, e);
      return false;
    }
  }

  // OC Methods
  async saveOC(oc) {
    const success = await this.saveFile('ocs', oc.id, oc);
    if (success) {
      this.showNotification('OC saved to GitHub!');
    }
    return oc;
  }

  getOC(id) {
    return this._cache.ocs.get(id) || null;
  }

  getAllOCs() {
    return Array.from(this._cache.ocs.values());
  }

  async deleteOC(id) {
    const success = await this.deleteFile('ocs', id);
    if (success) {
      this.showNotification('OC deleted from GitHub!');
    }
    return success;
  }

  // Clan Methods
  async saveClan(clan) {
    const success = await this.saveFile('clans', clan.id, clan);
    if (success) {
      this.showNotification('Clan saved to GitHub!');
    }
    return clan;
  }

  getClan(id) {
    return this._cache.clans.get(id) || null;
  }

  getAllClans() {
    return Array.from(this._cache.clans.values());
  }

  async deleteClan(id) {
    const success = await this.deleteFile('clans', id);
    if (success) {
      this.showNotification('Clan deleted from GitHub!');
    }
    return success;
  }

  // Story Methods
  async saveStory(story) {
    const success = await this.saveFile('stories', story.id, story);
    if (success) {
      this.showNotification('Story saved to GitHub!');
    }
    return story;
  }

  getStory(id) {
    return this._cache.stories.get(id) || null;
  }

  getAllStories() {
    return Array.from(this._cache.stories.values());
  }

  async deleteStory(id) {
    const success = await this.deleteFile('stories', id);
    if (success) {
      this.showNotification('Story deleted from GitHub!');
    }
    return success;
  }

  // Lore Methods
  async saveLore(lore) {
    const success = await this.saveFile('lore', lore.id, lore);
    if (success) {
      this.showNotification('Lore saved to GitHub!');
    }
    return lore;
  }

  getLore(id) {
    return this._cache.lore.get(id) || null;
  }

  getAllLore() {
    return Array.from(this._cache.lore.values());
  }

  async deleteLore(id) {
    const success = await this.deleteFile('lore', id);
    if (success) {
      this.showNotification('Lore deleted from GitHub!');
    }
    return success;
  }

  // Clear all methods (for admin)
  async clearAllOCs() {
    const ocs = this.getAllOCs();
    for (const oc of ocs) {
      await this.deleteFile('ocs', oc.id);
    }
    this._cache.ocs.clear();
  }

  async clearAllClans() {
    const clans = this.getAllClans();
    for (const clan of clans) {
      await this.deleteFile('clans', clan.id);
    }
    this._cache.clans.clear();
  }

  async clearAllStories() {
    const stories = this.getAllStories();
    for (const story of stories) {
      await this.deleteFile('stories', story.id);
    }
    this._cache.stories.clear();
  }

  async clearAllLore() {
    const lore = this.getAllLore();
    for (const item of lore) {
      await this.deleteFile('lore', item.id);
    }
    this._cache.lore.clear();
  }

  async clearAllData() {
    await this.clearAllOCs();
    await this.clearAllClans();
    await this.clearAllStories();
    await this.clearAllLore();
  }

  // Show notification
  showNotification(message, type = 'success') {
    const existing = document.getElementById('save-notification');
    if (existing) {
      existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.id = 'save-notification';
    const bgColor = type === 'error' ? '#d32f2f' : 'var(--color-accent-2, #E35E3F)';
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: ${bgColor};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      font-size: 0.9rem;
      animation: slideIn 0.3s ease-out;
    `;
    notification.innerHTML = `
      <i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>
      ${message}
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    if (!document.getElementById('notification-styles')) {
      style.id = 'notification-styles';
      document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Export singleton instance
const storage = new Storage();
export default storage;
