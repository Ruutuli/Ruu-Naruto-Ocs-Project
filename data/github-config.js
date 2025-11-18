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
  // You can set it here, or it will be loaded from localStorage
  token: 'null', // Set your token here or use localStorage
};

// Function to get token from config, localStorage, or return null
export function getGitHubToken() {
  // First, try to get from config (if manually set)
  if (githubConfig.token && githubConfig.token !== 'null' && githubConfig.token.trim() !== '') {
    return githubConfig.token;
  }
  
  // Then, try to get from localStorage
  const storedToken = localStorage.getItem('github_token');
  if (storedToken) {
    return storedToken;
  }
  
  // If not found, return null (no prompt - will show error if needed)
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

