// GitHub Configuration
// Set your GitHub repository details here

export const githubConfig = {
  // Your GitHub username
  owner: 'Ruutuli',
  
  // Repository name
  repo: 'Ruu-Naruto-Ocs-Project',
  
  // Branch name (usually 'main' or 'master')
  branch: 'main',
  
  // GitHub Personal Access Token
  // Get one at: https://github.com/settings/tokens
  // Required scopes: 'repo' (full control of private repositories)
  // Store this securely - never commit it to GitHub!
  // Token should be stored in localStorage (use saveGitHubToken() function)
  // or set via environment variable
  token: null, // Use localStorage instead - never hardcode tokens!
};

// Function to load token from server .env file (async)
async function loadTokenFromEnv() {
  try {
    // Only try on localhost
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' || 
        window.location.hostname === '') {
      const response = await fetch('/api/github-token');
      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          // Save to localStorage for future use
          saveGitHubToken(data.token);
          return data.token;
        }
      }
    }
  } catch (error) {
    // Silently fail - server might not be running or endpoint not available
    console.log('Could not load token from server:', error.message);
  }
  return null;
}

// Function to get token from config, .env (via server), localStorage, or return null
export async function getGitHubToken() {
  // First, try to get from config (if manually set)
  if (githubConfig.token && githubConfig.token !== 'null' && githubConfig.token.trim() !== '') {
    return githubConfig.token;
  }
  
  // Then, try to get from localStorage
  const storedToken = localStorage.getItem('github_token');
  if (storedToken) {
    return storedToken;
  }
  
  // Try to load from server .env file (only on localhost)
  const envToken = await loadTokenFromEnv();
  if (envToken) {
    return envToken;
  }
  
  // If not found, return null (no prompt - will show error if needed)
  return null;
}

// Synchronous version for backwards compatibility (checks localStorage and config only)
export function getGitHubTokenSync() {
  // First, try to get from config (if manually set)
  if (githubConfig.token && githubConfig.token !== 'null' && githubConfig.token.trim() !== '') {
    return githubConfig.token;
  }
  
  // Then, try to get from localStorage
  const storedToken = localStorage.getItem('github_token');
  if (storedToken) {
    return storedToken;
  }
  
  return null;
}

// Function to save token to localStorage
export function saveGitHubToken(token) {
  localStorage.setItem('github_token', token);
}

// Function to clear token
export function clearGitHubToken() {
  localStorage.removeItem('github_token');
}

