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
    this._isLocalhost = this.isLocalhost();
    this.init();
  }

  // Check if running on localhost
  isLocalhost() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' || 
           window.location.hostname === '';
  }

  async init() {
    // Check for GitHub token (from config, .env, or localStorage)
    this._token = await getGitHubToken();
    
    // Load all existing data from GitHub (with localStorage fallback for loading only)
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
    // Try GitHub API first (works for public repos even without token)
    try {
      const types = ['ocs', 'clans', 'stories', 'lore'];
      
      for (const type of types) {
        try {
          // Get directory contents from GitHub (works for public repos without token)
          const headers = {
            'Accept': 'application/vnd.github.v3+json'
          };
          if (this._token) {
            headers['Authorization'] = `token ${this._token}`;
          }
          
          const response = await fetch(
            `${this._githubBase}/contents/data/${type}?ref=${githubConfig.branch}`,
            { headers }
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
            // On localhost, try localStorage as fallback
            if (this._isLocalhost) {
              this.loadTypeFromLocalStorage(type);
            }
          } else if (response.status === 403 && !this._token) {
            // Rate limited or private repo - fallback to static files or localStorage
            if (this._isLocalhost) {
              // Try localStorage first on localhost
              this.loadTypeFromLocalStorage(type);
            } else {
              await this.loadFromStaticFiles(type);
            }
          }
        } catch (e) {
          console.log(`Could not load ${type} from GitHub:`, e);
          // Fallback to localStorage on localhost, otherwise static files
          if (this._isLocalhost) {
            this.loadTypeFromLocalStorage(type);
          } else {
            await this.loadFromStaticFiles(type);
          }
        }
      }
    } catch (e) {
      console.log('Could not load from GitHub:', e);
      // On localhost, try localStorage, otherwise static files
      if (this._isLocalhost) {
        await this.loadAllFromLocalStorage();
      } else {
        await this.loadAllFromStaticFiles();
      }
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
    // Try to discover files dynamically
    // First, try to get a manifest file that lists available files
    try {
      const manifestResponse = await fetch(`data/${type}/manifest.json`);
      if (manifestResponse.ok) {
        const manifest = await manifestResponse.json();
        const files = manifest.files || [];
        for (const fileId of files) {
          await this.loadStaticFile(type, fileId);
        }
        return;
      }
    } catch (e) {
      // Manifest doesn't exist, continue to other methods
    }

    // If no manifest, try to discover files by attempting to load them
    // This is a fallback - we'll try common patterns
    // Note: This is not ideal but works when we can't list directories
    await this.discoverStaticFiles(type);
  }

  async loadStaticFile(type, fileId) {
    try {
      const response = await fetch(`data/${type}/${fileId}.json`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.id) {
          this._cache[type].set(data.id, data);
        }
      }
    } catch (e) {
      // File doesn't exist or other error, skip it silently
    }
  }

  async discoverStaticFiles(type) {
    // Try to discover files by checking if common file patterns exist
    // This is a best-effort approach when we can't list directories
    // We'll try files that might exist based on IDs we've seen in the cache or common patterns
    
    // Since we can't list directories in the browser, we'll rely on:
    // 1. Files already loaded from GitHub (if any)
    // 2. Files that might be referenced by other loaded data
    
    // For now, we'll just skip discovery and let files be loaded on-demand
    // when they're accessed through the application
    // This prevents unnecessary 404 errors
  }

  // Save to localStorage (for localhost fallback)
  saveToLocalStorage(type, id, data) {
    try {
      const key = `naruto_oc_${type}_${id}`;
      localStorage.setItem(key, JSON.stringify(data));
      
      // Also maintain a list of all IDs for this type
      const listKey = `naruto_oc_${type}_list`;
      let idList = JSON.parse(localStorage.getItem(listKey) || '[]');
      if (!idList.includes(id)) {
        idList.push(id);
        localStorage.setItem(listKey, JSON.stringify(idList));
      }
      
      // Update cache
      this._cache[type].set(id, data);
      return true;
    } catch (e) {
      console.error(`Error saving to localStorage:`, e);
      return false;
    }
  }

  // Load a single type from localStorage
  loadTypeFromLocalStorage(type) {
    const listKey = `naruto_oc_${type}_list`;
    const idList = JSON.parse(localStorage.getItem(listKey) || '[]');
    
    for (const id of idList) {
      const key = `naruto_oc_${type}_${id}`;
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (parsed && parsed.id) {
            this._cache[type].set(parsed.id, parsed);
          }
        } catch (e) {
          console.error(`Error loading ${type}/${id} from localStorage:`, e);
        }
      }
    }
  }

  // Load from localStorage (for localhost fallback)
  loadAllFromLocalStorage() {
    const types = ['ocs', 'clans', 'stories', 'lore'];
    
    for (const type of types) {
      this.loadTypeFromLocalStorage(type);
    }
  }

  // Prompt user to enter GitHub token
  async promptForGitHubToken() {
    const token = prompt(
      'GitHub Personal Access Token required to save data.\n\n' +
      'Get your token at: https://github.com/settings/tokens\n' +
      'Required scope: "repo" (full control of private repositories)\n\n' +
      'Enter your GitHub token:'
    );
    
    if (token && token.trim()) {
      saveGitHubToken(token.trim());
      this._token = token.trim();
      return true;
    }
    return false;
  }

  // Save a file to GitHub
  async saveFile(type, id, data) {
    if (!this._token) {
      this._token = await getGitHubToken();
    }
    
    // If no token, prompt user to enter it
    if (!this._token) {
      const tokenEntered = await this.promptForGitHubToken();
      if (!tokenEntered) {
        this.showNotification('GitHub token is required to save data. Operation cancelled.', 'error');
        return false;
      }
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

  // Delete from localStorage (for localhost fallback)
  deleteFromLocalStorage(type, id) {
    try {
      const key = `naruto_oc_${type}_${id}`;
      localStorage.removeItem(key);
      
      // Remove from ID list
      const listKey = `naruto_oc_${type}_list`;
      let idList = JSON.parse(localStorage.getItem(listKey) || '[]');
      idList = idList.filter(existingId => existingId !== id);
      localStorage.setItem(listKey, JSON.stringify(idList));
      
      // Remove from cache
      this._cache[type].delete(id);
      return true;
    } catch (e) {
      console.error(`Error deleting from localStorage:`, e);
      return false;
    }
  }

  // Delete a file from GitHub
  async deleteFile(type, id) {
    if (!this._token) {
      this._token = await getGitHubToken();
    }
    
    // If no token, prompt user to enter it
    if (!this._token) {
      const tokenEntered = await this.promptForGitHubToken();
      if (!tokenEntered) {
        this.showNotification('GitHub token is required to delete data. Operation cancelled.', 'error');
        return false;
      }
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
    // Try to load on-demand if not in cache (non-blocking)
    if (!this._cache.ocs.has(id)) {
      this.loadStaticFile('ocs', id).catch(() => {
        // Silently fail - file might not exist
      });
    }
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
    // Try to load on-demand if not in cache (non-blocking)
    if (!this._cache.clans.has(id)) {
      this.loadStaticFile('clans', id).catch(() => {
        // Silently fail - file might not exist
      });
    }
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
    // Try to load on-demand if not in cache (non-blocking)
    if (!this._cache.stories.has(id)) {
      this.loadStaticFile('stories', id).catch(() => {
        // Silently fail - file might not exist
      });
    }
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
    // Try to load on-demand if not in cache (non-blocking)
    if (!this._cache.lore.has(id)) {
      this.loadStaticFile('lore', id).catch(() => {
        // Silently fail - file might not exist
      });
    }
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
