// ============================================================================
// ------------------- Main Application File -------------------
// ============================================================================
// Routing and Page Management

// ============================================================================
// ------------------- Imports -------------------
// ============================================================================

import storage from './data/storage.js';
import { renderOCCard } from './components/oc-card.js';
import { renderOCDetail } from './components/oc-detail.js';
import { renderClanCard } from './components/clan-card.js';
import { renderStoryCard } from './components/story-card.js';
import { 
  renderCompactOCCard, 
  renderCompactClanCard, 
  renderCompactStoryCard, 
  renderCompactLoreCard 
} from './components/compact-preview-card.js';

// ============================================================================
// ------------------- State Variables -------------------
// ============================================================================

let currentPage = 'home';
let currentOCId = null;
let currentClanId = null;
let currentStoryId = null;
let currentLoreId = null;
let editingOC = null;
let editingClan = null;
let editingStory = null;
let editingLore = null;
let adminAuthenticated = false;
const ADMIN_PASSWORD = 'admin123';

window.adminAuthenticated = false;

// ============================================================================
// ------------------- Utility Functions -------------------
// ============================================================================

// ------------------- Page Refresh ------------------
// Refresh current page after data operations
function refreshCurrentPage() {
  const pageLoaders = {
    'home': loadHomePage,
    'ocs': loadOCsPage,
    'clans': loadClansPage,
    'stories': loadStoriesPage,
    'lore': loadLorePage
  };
  
  const loader = pageLoaders[currentPage];
  if (loader) loader();
}

// ------------------- Clear Data Utilities ------------------
// Clear all data utility
window.clearAllData = async function() {
  if (confirm('Are you sure you want to delete ALL data? This action cannot be undone!')) {
    try {
      await storage.clearAllData();
      refreshCurrentPage();
      updateCounts();
      alert('All data has been cleared!');
    } catch (error) {
      console.error('[app.js]❌ Failed to clear all data:', error);
      alert('Failed to clear data. Please try again.');
    }
  }
};

// Clear all OCs utility
window.clearAllOCs = async function() {
  if (confirm('Are you sure you want to delete ALL OCs? This action cannot be undone!')) {
    try {
      await storage.clearAllOCs();
      if (['clan-detail', 'story-detail', 'lore-detail'].includes(currentPage)) {
        navigateTo('home');
      } else {
        refreshCurrentPage();
      }
      updateCounts();
      alert('All OCs have been cleared!');
    } catch (error) {
      console.error('[app.js]❌ Failed to clear OCs:', error);
      alert('Failed to clear OCs. Please try again.');
    }
  }
};

// ============================================================================
// ------------------- Admin Authentication -------------------
// ============================================================================

// ------------------- Admin Page Loader ------------------
// Load admin page and reset state
function loadAdminPage() {
  adminAuthenticated = false;
  window.adminAuthenticated = false;
  
  const loginSection = document.getElementById('admin-login-section');
  const panelSection = document.getElementById('admin-panel-section');
  const errorDiv = document.getElementById('admin-error');
  const passwordInput = document.getElementById('admin-password');
  const editContent = document.getElementById('admin-edit-content');
  
  if (loginSection) loginSection.style.display = 'block';
  if (panelSection) panelSection.style.display = 'none';
  if (errorDiv) errorDiv.style.display = 'none';
  if (passwordInput) passwordInput.value = '';
  if (editContent) {
    editContent.innerHTML = '<p style="text-align: center; color: var(--color-text-dark-2); padding: 2rem;">Select a category above to view and edit entries.</p>';
  }
  
  document.querySelectorAll('.admin-edit-tab').forEach((tab, index) => {
    if (index === 0) {
      tab.classList.add('active');
      tab.style.borderBottom = '3px solid var(--color-accent-2)';
      tab.style.color = 'var(--color-dark-2)';
      tab.style.fontWeight = '600';
    } else {
      tab.classList.remove('active');
      tab.style.borderBottom = '3px solid transparent';
      tab.style.color = 'var(--color-text-dark-2)';
      tab.style.fontWeight = 'normal';
    }
  });
}

// ------------------- Admin Password Check ------------------
// Check admin password
window.checkAdminPassword = function() {
  const passwordInput = document.getElementById('admin-password');
  const errorDiv = document.getElementById('admin-error');
  const loginSection = document.getElementById('admin-login-section');
  const panelSection = document.getElementById('admin-panel-section');
  
  if (!passwordInput) {
    console.error('[app.js]❌ Admin password input not found');
    return;
  }
  
  if (passwordInput.value === ADMIN_PASSWORD) {
    adminAuthenticated = true;
    window.adminAuthenticated = true;
    if (loginSection) loginSection.style.display = 'none';
    if (panelSection) panelSection.style.display = 'block';
    if (errorDiv) errorDiv.style.display = 'none';
    setTimeout(() => window.loadAdminEditSection('ocs'), 100);
  } else {
    adminAuthenticated = false;
    window.adminAuthenticated = false;
    if (errorDiv) errorDiv.style.display = 'block';
    if (passwordInput) {
      passwordInput.value = '';
      passwordInput.focus();
    }
  }
};

// ------------------- Admin Logout ------------------
// Admin logout
window.adminLogout = function() {
  adminAuthenticated = false;
  window.adminAuthenticated = false;
  loadAdminPage();
};

// ============================================================================
// ------------------- Admin Clear Functions -------------------
// ============================================================================

// ------------------- Admin Authentication ------------------
// Check admin authentication
function requireAdminAuth() {
  if (!adminAuthenticated) {
    alert('Please log in to the admin panel first.');
    return false;
  }
  return true;
}

// ------------------- Admin Clear Helpers ------------------
// Refresh page after admin clear operation
function refreshAfterAdminClear(pageType) {
  if (currentPage === pageType || currentPage === 'home') {
    if (currentPage === pageType) {
      const loaders = {
        'ocs': loadOCsPage,
        'clans': loadClansPage,
        'stories': loadStoriesPage,
        'lore': loadLorePage
      };
      const loader = loaders[pageType];
      if (loader) loader();
    } else {
      loadHomePage();
    }
  }
}

// Generic admin clear function
async function adminClearData(type, config) {
  if (!requireAdminAuth()) return;
  
  if (confirm(config.confirmMessage)) {
    try {
      await config.clearFunction();
      updateCounts();
      refreshAfterAdminClear(type);
      alert(config.successMessage);
    } catch (error) {
      console.error(`[app.js]❌ Failed to clear ${type}:`, error);
      alert(config.errorMessage);
    }
  }
}

// Admin clear OCs
window.adminClearOCs = () => adminClearData('ocs', {
  confirmMessage: 'Are you sure you want to delete ALL OCs? This will also clear OC references from clans, stories, and lore. This action cannot be undone!',
  clearFunction: () => storage.clearAllOCs(),
  successMessage: 'All OCs have been cleared!',
  errorMessage: 'Failed to clear OCs. Please try again.'
});

// Admin clear clans
window.adminClearClans = () => adminClearData('clans', {
  confirmMessage: 'Are you sure you want to delete ALL clans? OC clan associations will be cleared. This action cannot be undone!',
  clearFunction: () => storage.clearAllClans(),
  successMessage: 'All clans have been cleared!',
  errorMessage: 'Failed to clear clans. Please try again.'
});

// Admin clear stories
window.adminClearStories = () => adminClearData('stories', {
  confirmMessage: 'Are you sure you want to delete ALL stories? This action cannot be undone!',
  clearFunction: () => storage.clearAllStories(),
  successMessage: 'All stories have been cleared!',
  errorMessage: 'Failed to clear stories. Please try again.'
});

// Admin clear lore
window.adminClearLore = () => adminClearData('lore', {
  confirmMessage: 'Are you sure you want to delete ALL lore entries? This action cannot be undone!',
  clearFunction: () => storage.clearAllLore(),
  successMessage: 'All lore entries have been cleared!',
  errorMessage: 'Failed to clear lore. Please try again.'
});

// Admin clear all data
window.adminClearAll = async function() {
  if (!requireAdminAuth()) return;
  
  if (confirm('⚠️ FINAL WARNING ⚠️\n\nAre you absolutely sure you want to delete EVERYTHING?\n\nThis will permanently delete:\n- All OCs\n- All Clans\n- All Stories\n- All Lore\n\nThis action CANNOT be undone!\n\nType "DELETE ALL" to confirm:')) {
    const confirmation = prompt('Type "DELETE ALL" (in all caps) to confirm:');
    if (confirmation === 'DELETE ALL') {
      try {
        await storage.clearAllData();
        updateCounts();
        alert('All data has been permanently deleted!');
        navigateTo('home');
        loadHomePage();
      } catch (error) {
        console.error('[app.js]❌ Failed to clear all data:', error);
        alert('Failed to clear all data. Please try again.');
      }
    } else {
      alert('Confirmation failed. No data was deleted.');
    }
  }
};

// ============================================================================
// ------------------- Admin Add Functions -------------------
// ============================================================================

// ------------------- Admin Add Helper ------------------
// Generic admin add function
function adminAddItem(type, formFunction) {
  if (!requireAdminAuth()) return;
  window.location.hash = `${type}/new`;
  if (formFunction) {
    formFunction();
  } else {
    setTimeout(() => {
      if (formFunction) formFunction();
    }, 100);
  }
}

// Admin add OC
window.adminAddOC = () => adminAddItem('ocs', window.showOCForm);

// Admin add clan
window.adminAddClan = () => adminAddItem('clans', window.showClanForm);

// Admin add story
window.adminAddStory = () => adminAddItem('stories', window.showStoryForm);

// Admin add lore
window.adminAddLore = () => adminAddItem('lore', window.showLoreForm);

// ============================================================================
// ------------------- Admin Edit Section -------------------
// ============================================================================

// ------------------- Admin Tab Styling ------------------
// Update admin tab styling
function updateAdminTab(tab, isActive) {
  if (isActive) {
    tab.classList.add('active');
    tab.style.borderBottom = '3px solid var(--color-accent-2)';
    tab.style.color = 'var(--color-dark-2)';
    tab.style.fontWeight = '600';
  } else {
    tab.classList.remove('active');
    tab.style.borderBottom = '3px solid transparent';
    tab.style.color = 'var(--color-text-dark-2)';
    tab.style.fontWeight = 'normal';
  }
}

// ------------------- Item Display Helpers ------------------
// Get item display name based on type
function getItemDisplayName(item, type) {
  if (type === 'ocs') {
    return `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'Unnamed OC';
  } else if (type === 'clans') {
    return item.name || 'Unnamed Clan';
  } else if (type === 'stories' || type === 'lore') {
    return item.title || (type === 'stories' ? 'Untitled Story' : 'Untitled Lore');
  }
  return 'Unknown';
}

// Get item metadata for display
function getItemMetadata(item, type) {
  if (type === 'ocs' && item.village) {
    return `${item.village} • ${item.rank || 'Unknown Rank'}`;
  } else if (type === 'clans' && item.village) {
    const memberCount = item.members?.length || 0;
    return `${item.village} • ${memberCount} member${memberCount !== 1 ? 's' : ''}`;
  } else if (type === 'stories' && item.tags) {
    return item.tags.slice(0, 3).join(', ');
  } else if (type === 'lore' && item.category) {
    return item.category.charAt(0).toUpperCase() + item.category.slice(1);
  }
  return '';
}

// ------------------- Admin Edit Section Loader ------------------
// Load admin edit section
window.loadAdminEditSection = function(type, clickedElement) {
  if (!requireAdminAuth()) return;
  
  document.querySelectorAll('.admin-edit-tab').forEach(tab => {
    updateAdminTab(tab, false);
  });
  
  const activeTab = clickedElement || document.querySelector(`.admin-edit-tab[onclick*="${type}"]`);
  if (activeTab) {
    updateAdminTab(activeTab, true);
  }
  
  const contentDiv = document.getElementById('admin-edit-content');
  if (!contentDiv) {
    console.error('[app.js]❌ Admin edit content div not found');
    return;
  }
  
  import('./data/storage.js').then(module => {
    const storage = module.default;
    const typeConfig = {
      'ocs': { getItems: () => storage.getAllOCs(), editFunction: 'editOC', deleteFunction: 'deleteOC' },
      'clans': { getItems: () => storage.getAllClans(), editFunction: 'editClan', deleteFunction: 'deleteClan' },
      'stories': { getItems: () => storage.getAllStories(), editFunction: 'editStory', deleteFunction: 'deleteStory' },
      'lore': { getItems: () => storage.getAllLore(), editFunction: 'editLore', deleteFunction: 'deleteLore' }
    };
    
    const config = typeConfig[type];
    if (!config) {
      console.error('[app.js]❌ Invalid admin edit type:', type);
      return;
    }
    
    const items = config.getItems();
    
    if (items.length === 0) {
      contentDiv.innerHTML = '';
      return;
    }
    
    contentDiv.innerHTML = `
      <div style="display: grid; gap: 0.75rem;">
        ${items.map(item => {
          const displayName = getItemDisplayName(item, type);
          const metadata = getItemMetadata(item, type);
          
          return `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--color-bg-2); border-radius: 6px; border: 1px solid var(--color-dark-2);">
              <div style="flex: 1;">
                <div style="font-weight: 600; color: var(--color-dark-2); margin-bottom: 0.25rem;">${displayName}</div>
                ${metadata ? `<div style="font-size: 0.85rem; color: var(--color-text-dark-2);">${metadata}</div>` : ''}
              </div>
              <div style="display: flex; gap: 0.5rem; margin-left: 1rem;">
                <button class="btn-naruto" onclick="window.${config.editFunction}('${item.id}')" style="white-space: nowrap;">
                  <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-naruto" onclick="window.${config.deleteFunction}('${item.id}', '${type}')" style="white-space: nowrap; background: var(--color-error, #d32f2f); border-color: var(--color-error, #d32f2f);">
                  <i class="fas fa-trash"></i> Delete
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }).catch(error => {
    console.error('[app.js]❌ Failed to load admin edit section:', error);
  });
};

// ============================================================================
// ------------------- Edit Functions -------------------
// ============================================================================

// ------------------- Admin Auth with Redirect ------------------
// Require admin auth and redirect if not authenticated
function requireAdminAuthWithRedirect() {
  if (!adminAuthenticated) {
    alert('You must be logged into the admin panel to edit data.');
    navigateTo('admin');
    return false;
  }
  return true;
}

// ------------------- Prompt for Admin Password ------------------
// Prompt for admin password before editing
window.promptForAdminPassword = function(callback) {
  const password = prompt('Enter admin password to edit:');
  if (password === ADMIN_PASSWORD) {
    adminAuthenticated = true;
    window.adminAuthenticated = true;
    if (callback) callback();
    return true;
  } else if (password !== null) {
    alert('Incorrect password. Access denied.');
    return false;
  }
  return false;
};

// ------------------- Edit Item Functions ------------------
// Generic edit function with password prompt
function editItemWithPassword(type, id) {
  window.promptForAdminPassword(() => {
    window.location.hash = `${type}/edit/${id}`;
  });
}

// Edit OC
window.editOC = (id) => editItemWithPassword('ocs', id);

// Edit clan
window.editClan = (id) => editItemWithPassword('clans', id);

// Edit story
window.editStory = (id) => editItemWithPassword('stories', id);

// Edit lore
window.editLore = (id) => editItemWithPassword('lore', id);

// ============================================================================
// ------------------- Initialization -------------------
// ============================================================================

// ------------------- User Info Loader ------------------
// Load user info to home page
function loadUserInfo() {
  import('./data/user-info.js').then(module => {
    const info = module.userInfo;
    const elements = {
      name: document.getElementById('home-name'),
      pronouns: document.getElementById('home-pronouns'),
      age: document.getElementById('home-age'),
      sign: document.getElementById('home-sign'),
      timezone: document.getElementById('home-timezone')
    };
    
    if (elements.name) elements.name.textContent = info.name;
    if (elements.pronouns) elements.pronouns.textContent = info.pronouns;
    if (elements.age) elements.age.textContent = info.age;
    if (elements.sign) elements.sign.textContent = info.sign;
    if (elements.timezone) elements.timezone.textContent = info.timezone;
  }).catch(error => {
    console.error('[app.js]❌ Failed to load user info:', error);
  });
}

// ------------------- Navigation Setup ------------------
// Setup navigation event listeners
function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link[data-page]');
  
  if (navLinks.length === 0) {
    setTimeout(() => {
      const retryLinks = document.querySelectorAll('.nav-link[data-page]');
      if (retryLinks.length > 0) {
        retryLinks.forEach(link => {
          const page = link.getAttribute('data-page');
          link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            navigateTo(page);
          });
        });
      }
    }, 100);
    return;
  }
  
  navLinks.forEach(link => {
    const page = link.getAttribute('data-page');
    link.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      navigateTo(page);
    });
  });
}

// ============================================================================
// ------------------- Window Functions (must be defined before routing) -------------------
// ============================================================================

// ------------------- OC Detail/Form Functions ------------------
window.showOCDetail = function(id) {
  const oc = storage.getOC(id);
  if (!oc) {
    navigateTo('ocs');
    return;
  }
  
  currentOCId = id;
  const detailPage = document.getElementById('oc-detail-page');
  const currentActive = document.querySelector('.page-section.active');
  if (currentActive) currentActive.classList.remove('active');
  detailPage.classList.add('active');
  currentPage = 'oc-detail';
  updateBackButton('oc-detail');
  
  // Update page title with OC name
  const ocName = `${oc.firstName || ''} ${oc.lastName || ''}`.trim() || 'Unnamed OC';
  updatePageTitle('oc-detail', ocName);
  
  const container = document.getElementById('oc-detail-container');
  const detail = renderOCDetail(oc);
  container.innerHTML = '';
  container.appendChild(detail);
};

window.showOCForm = function(id = null) {
  editingOC = id ? storage.getOC(id) : null;
  const formPage = document.getElementById('oc-form-page');
  const currentActive = document.querySelector('.page-section.active');
  if (currentActive) currentActive.classList.remove('active');
  formPage.classList.add('active');
  currentPage = 'oc-form';
  updateBackButton('oc-form');
  
  // Update page title
  updatePageTitle('oc-form');
  
  // Import and render form dynamically
  import('./pages/oc-form.js').then(module => {
    const container = document.getElementById('oc-form-container');
    const form = module.renderOCForm(editingOC, (oc) => {
      if (editingOC) {
        oc.id = editingOC.id;
      } else {
        // Generate ID: oc + FirstName (e.g., "ocAkene")
        const firstName = (oc.firstName || '').trim();
        if (firstName) {
          oc.id = 'oc' + firstName.charAt(0).toUpperCase() + firstName.slice(1).replace(/[^a-zA-Z0-9]/g, '');
        } else {
          oc.id = 'oc' + Date.now().toString(36);
        }
      }
      storage.saveOC(oc).then(() => {
        window.location.hash = `ocs/${oc.id}`;
      });
    });
    container.innerHTML = '';
    container.appendChild(form);
  });
};

// ------------------- Clan Detail/Form Functions ------------------
window.showClanDetail = function(id) {
  // Import and render clan detail dynamically
  import('./pages/clan-detail.js').then(module => {
    const clan = storage.getClan(id);
    if (!clan) {
      navigateTo('clans');
      return;
    }
    
    currentClanId = id;
    const detailPage = document.getElementById('clan-detail-page');
    const currentActive = document.querySelector('.page-section.active');
    if (currentActive) currentActive.classList.remove('active');
    detailPage.classList.add('active');
    currentPage = 'clan-detail';
    updateBackButton('clan-detail');
    
    // Update page title with clan name
    const clanName = clan.name || 'Unnamed Clan';
    updatePageTitle('clan-detail', clanName);
    
    const container = document.getElementById('clan-detail-container');
    const detail = module.renderClanDetail(clan);
    container.innerHTML = '';
    container.appendChild(detail);
  });
};

window.showClanForm = function(id = null) {
  editingClan = id ? storage.getClan(id) : null;
  loadClanForm();
  
  function loadClanForm() {
    const formPage = document.getElementById('clan-form-page');
    const currentActive = document.querySelector('.page-section.active');
    if (currentActive) currentActive.classList.remove('active');
    formPage.classList.add('active');
    currentPage = 'clan-form';
    updateBackButton('clan-form');
    
    // Update page title
    updatePageTitle('clan-form');
    
    import('./pages/clan-form.js').then(module => {
      const container = document.getElementById('clan-form-container');
      const form = module.renderClanForm(editingClan, (clan) => {
        if (editingClan && editingClan.id) {
          clan.id = editingClan.id;
        } else {
          // Generate ID: clan + Name (e.g., "clanChigiri")
          const clanName = (clan.name || '').trim();
          if (clanName) {
            clan.id = 'clan' + clanName.charAt(0).toUpperCase() + clanName.slice(1).replace(/[^a-zA-Z0-9]/g, '');
          } else {
            clan.id = 'clan' + Date.now().toString(36);
          }
        }
        storage.saveClan(clan).then(() => {
          window.location.hash = `clans/${clan.id}`;
        });
      });
      container.innerHTML = '';
      container.appendChild(form);
    });
  }
};

// ------------------- Story Detail/Form Functions ------------------
window.showStoryDetail = function(id) {
  import('./pages/story-detail.js').then(module => {
    const story = storage.getStory(id);
    if (!story) {
      navigateTo('stories');
      return;
    }
    
    currentStoryId = id;
    const detailPage = document.getElementById('story-detail-page');
    const currentActive = document.querySelector('.page-section.active');
    if (currentActive) currentActive.classList.remove('active');
    detailPage.classList.add('active');
    currentPage = 'story-detail';
    updateBackButton('story-detail');
    
    // Update page title with story title
    const storyTitle = story.title || 'Untitled Story';
    updatePageTitle('story-detail', storyTitle);
    
    const container = document.getElementById('story-detail-container');
    const detail = module.renderStoryDetail(story);
    container.innerHTML = '';
    container.appendChild(detail);
    
    // Restore reader mode if it was active
    setTimeout(() => {
      if (window.restoreReaderMode) {
        window.restoreReaderMode();
      }
    }, 100);
  });
};

window.showStoryForm = function(id = null) {
  editingStory = id ? storage.getStory(id) : null;
  const formPage = document.getElementById('story-form-page');
  const currentActive = document.querySelector('.page-section.active');
  if (currentActive) currentActive.classList.remove('active');
  formPage.classList.add('active');
  currentPage = 'story-form';
  updateBackButton('story-form');
  
  // Update page title
  updatePageTitle('story-form');
  
  import('./pages/story-form.js').then(module => {
    const container = document.getElementById('story-form-container');
    const form = module.renderStoryForm(editingStory, (story) => {
      if (editingStory) {
        story.id = editingStory.id;
        story.updatedAt = new Date().toISOString();
      } else {
        // Generate ID: story + Title (e.g., "storyName")
        const storyTitle = (story.title || '').trim();
        if (storyTitle) {
          const cleanTitle = storyTitle.replace(/[^a-zA-Z0-9]/g, '');
          story.id = 'story' + cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
        } else {
          story.id = 'story' + Date.now().toString(36);
        }
        story.createdAt = new Date().toISOString();
        story.updatedAt = story.createdAt;
      }
      storage.saveStory(story).then(() => {
        window.location.hash = `stories/${story.id}`;
      });
    });
    container.innerHTML = '';
    container.appendChild(form);
  });
};

// ------------------- Lore Detail/Form Functions ------------------
window.showLoreDetail = function(id) {
  import('./pages/lore-detail.js').then(module => {
    const lore = storage.getLore(id);
    if (!lore) {
      navigateTo('lore');
      return;
    }
    
    currentLoreId = id;
    const detailPage = document.getElementById('lore-detail-page');
    const currentActive = document.querySelector('.page-section.active');
    if (currentActive) currentActive.classList.remove('active');
    detailPage.classList.add('active');
    currentPage = 'lore-detail';
    updateBackButton('lore-detail');
    
    // Update page title with lore title
    const loreTitle = lore.title || 'Untitled Lore';
    updatePageTitle('lore-detail', loreTitle);
    
    const container = document.getElementById('lore-detail-container');
    const detail = module.renderLoreDetail(lore);
    container.innerHTML = '';
    container.appendChild(detail);
  });
};

window.showLoreForm = function(id = null) {
  editingLore = id ? storage.getLore(id) : null;
  const formPage = document.getElementById('lore-form-page');
  const currentActive = document.querySelector('.page-section.active');
  if (currentActive) currentActive.classList.remove('active');
  formPage.classList.add('active');
  currentPage = 'lore-form';
  updateBackButton('lore-form');
  
  // Update page title
  updatePageTitle('lore-form');
  
  import('./pages/lore-form.js').then(module => {
    const container = document.getElementById('lore-form-container');
    const form = module.renderLoreForm(editingLore, (lore) => {
      if (editingLore) {
        lore.id = editingLore.id;
      } else {
        // Generate ID: lore + Title (e.g., "loreName")
        const loreTitle = (lore.title || '').trim();
        if (loreTitle) {
          const cleanTitle = loreTitle.replace(/[^a-zA-Z0-9]/g, '');
          lore.id = 'lore' + cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
        } else {
          lore.id = 'lore' + Date.now().toString(36);
        }
      }
      storage.saveLore(lore).then(() => {
        window.location.hash = `lore/${lore.id}`;
      });
    });
    container.innerHTML = '';
    container.appendChild(form);
  });
};

// ------------------- Routing Setup ------------------
// Setup hash-based routing
function setupRouting() {
  window.addEventListener('hashchange', handleHashChange);
  handleHashChange();
}

// ------------------- App Initialization ------------------
// Initialize app
function initializeApp() {
  setupNavigation();
  setupRouting();
  loadUserInfo();
  loadHomePage();
  updateCounts();
  updatePageTitle('home');
}

// For ES modules, DOM is usually already ready when module executes
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // DOM is already ready
  initializeApp();
}

// ============================================================================
// ------------------- Routing -------------------
// ============================================================================

// ------------------- Type Route Handler ------------------
// Handle route for a specific type (ocs, clans, stories, lore)
function handleTypeRoute(type, hash, parts) {
  const routeConfig = {
    'ocs': { 
      listPage: 'ocs', 
      showForm: window.showOCForm,
      showDetail: window.showOCDetail
    },
    'clans': { 
      listPage: 'clans', 
      showForm: window.showClanForm,
      showDetail: window.showClanDetail
    },
    'stories': { 
      listPage: 'stories', 
      showForm: window.showStoryForm,
      showDetail: window.showStoryDetail
    },
    'lore': { 
      listPage: 'lore', 
      showForm: window.showLoreForm,
      showDetail: window.showLoreDetail
    }
  };
  
  const config = routeConfig[type];
  if (!config) return false;
  
  if (hash === type) {
    navigateTo(config.listPage, true);
    return true;
  }
  
  if (hash.startsWith(`${type}/`)) {
    const id = parts[1];
    
    if (id === 'new') {
      if (!requireAdminAuthWithRedirect()) return true;
      if (typeof config.showForm === 'function') {
        config.showForm();
      } else {
        console.error(`[app.js]❌ ${type} form function not defined`);
      }
      return true;
    }
    
    if (id === 'edit') {
      if (!requireAdminAuthWithRedirect()) return true;
      if (typeof config.showForm === 'function') {
        config.showForm(parts[2]);
      } else {
        console.error(`[app.js]❌ ${type} form function not defined`);
      }
      return true;
    }
    
    if (typeof config.showDetail === 'function') {
      config.showDetail(id);
    } else {
      console.error(`[app.js]❌ ${type} detail function not defined`);
      navigateTo(config.listPage, true);
    }
    return true;
  }
  
  return false;
}

// ------------------- Hash Change Handler ------------------
// Handle hash change
function handleHashChange() {
  const hash = window.location.hash.substring(1);
  
  if (!hash || hash === 'home') {
    navigateTo('home', true);
    return;
  }
  
  if (hash === 'admin') {
    navigateTo('admin', true);
    return;
  }
  
  const parts = hash.split('/');
  const type = parts[0];
  
  if (handleTypeRoute(type, hash, parts)) {
    return;
  }
  
  navigateTo(hash, true);
}

// ============================================================================
// ------------------- Page Title Management -------------------
// ============================================================================

// ------------------- Page Title Updater ------------------
// Update page title based on current page
function updatePageTitle(page, itemName = null) {
  const baseTitle = 'Naruto OC | Website';
  
  const titleMap = {
    'home': `Home | ${baseTitle}`,
    'ocs': `OCs | ${baseTitle}`,
    'oc-detail': itemName ? `${itemName} | OCs | ${baseTitle}` : `OC Detail | ${baseTitle}`,
    'oc-form': editingOC ? `Edit OC | ${baseTitle}` : `New OC | ${baseTitle}`,
    'clans': `Clans | ${baseTitle}`,
    'clan-detail': itemName ? `${itemName} | Clans | ${baseTitle}` : `Clan Detail | ${baseTitle}`,
    'clan-form': editingClan ? `Edit Clan | ${baseTitle}` : `New Clan | ${baseTitle}`,
    'stories': `Stories | ${baseTitle}`,
    'story-detail': itemName ? `${itemName} | Stories | ${baseTitle}` : `Story Detail | ${baseTitle}`,
    'story-form': editingStory ? `Edit Story | ${baseTitle}` : `New Story | ${baseTitle}`,
    'lore': `Lore | ${baseTitle}`,
    'lore-detail': itemName ? `${itemName} | Lore | ${baseTitle}` : `Lore Detail | ${baseTitle}`,
    'lore-form': editingLore ? `Edit Lore | ${baseTitle}` : `New Lore | ${baseTitle}`,
    'admin': `Admin | ${baseTitle}`
  };
  
  document.title = titleMap[page] || baseTitle;
}

// ============================================================================
// ------------------- Navigation -------------------
// ============================================================================

// ------------------- Back Button Helpers ------------------
// Get back target for detail/form pages
function getBackTarget(page) {
  const backTargetMap = {
    'oc': 'ocs',
    'clan': 'clans',
    'story': 'stories',
    'lore': 'lore'
  };
  
  for (const [prefix, target] of Object.entries(backTargetMap)) {
    if (page.startsWith(prefix)) {
      return target;
    }
  }
  return 'home';
}

// Update back button visibility and target
function updateBackButton(page) {
  const backItem = document.getElementById('nav-back-item');
  const backBtn = document.getElementById('nav-back-btn');
  
  const detailPages = ['oc-detail', 'oc-form', 'clan-detail', 'clan-form', 
                       'story-detail', 'story-form', 'lore-detail', 'lore-form'];
  
  if (detailPages.includes(page)) {
    const backTarget = getBackTarget(page);
    if (backBtn) backBtn.setAttribute('data-back-target', backTarget);
    if (backItem) backItem.style.display = 'block';
  } else {
    if (backItem) backItem.style.display = 'none';
  }
}

// ------------------- Page Loader Helper ------------------
// Get page loader function
function getPageLoader(page) {
  const loaders = {
    'home': loadHomePage,
    'ocs': loadOCsPage,
    'clans': loadClansPage,
    'stories': loadStoriesPage,
    'lore': loadLorePage,
    'admin': loadAdminPage
  };
  return loaders[page];
}

// ------------------- Navigation Function ------------------
// Main navigation function used throughout the app
function navigateTo(page, skipHashUpdate = false) {
  if (currentPage === page && !skipHashUpdate) {
    const loader = getPageLoader(page);
    if (loader) loader();
    if (window.location.hash !== `#${page}`) {
      window.location.hash = page;
    }
    return;
  }
  
  const allSections = document.querySelectorAll('.page-section');
  allSections.forEach(section => {
    section.classList.remove('active');
  });
  
  const targetPage = document.getElementById(`${page}-page`);
  if (!targetPage) {
    console.error('[app.js]❌ Page not found:', `${page}-page`);
    return;
  }
  
  targetPage.classList.add('active');
  currentPage = page;
  
  if (!skipHashUpdate && window.location.hash !== `#${page}`) {
    window.location.hash = page;
  }
  
  updatePageTitle(page);
  
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-page') === page) {
      link.classList.add('active');
    }
  });
  
  updateBackButton(page);
  
  const loader = getPageLoader(page);
  if (loader) {
    try {
      loader();
    } catch (error) {
      console.error('[app.js]❌ Error loading page:', page, error);
    }
  }
}

// Make navigateTo available on window for inline event handlers
window.navigateTo = navigateTo;

// ------------------- Back Button Handler ------------------
// Handle back button click
window.handleNavBack = function() {
  const backBtn = document.getElementById('nav-back-btn');
  const target = backBtn?.getAttribute('data-back-target') || 'home';
  navigateTo(target);
};

// ============================================================================
// ------------------- Home Page -------------------
// ============================================================================

// ------------------- Count Updater ------------------
// Update counts on home page
function updateCounts() {
  const ocs = storage.getAllOCs();
  const clans = storage.getAllClans();
  const stories = storage.getAllStories();
  const lore = storage.getAllLore();
  
  const countElements = {
    'quick-oc-count': { count: ocs.length, singular: 'character', plural: 'characters' },
    'quick-clan-count': { count: clans.length, singular: 'clan', plural: 'clans' },
    'quick-story-count': { count: stories.length, singular: 'story', plural: 'stories' },
    'quick-lore-count': { count: lore.length, singular: 'entry', plural: 'entries' }
  };
  
  Object.entries(countElements).forEach(([id, data]) => {
    const element = document.getElementById(id);
    if (element) {
      const word = data.count === 1 ? data.singular : data.plural;
      element.textContent = `(${data.count} ${word})`;
    }
  });
}

// ------------------- Recent Additions Loader ------------------
// Load recent additions (all types)
function loadRecentAdditions() {
  const container = document.getElementById('recent-additions');
  
  if (!container) return;
  
  container.innerHTML = '';
  
  const ocs = storage.getAllOCs().slice(-4).reverse();
  const clans = storage.getAllClans().slice(-4).reverse();
  const stories = storage.getAllStories().slice(-4).reverse();
  const lore = storage.getAllLore().slice(-4).reverse();
  
  const allItems = [
    ...ocs.map(oc => ({ type: 'oc', item: oc, sortKey: oc.id })),
    ...clans.map(clan => ({ type: 'clan', item: clan, sortKey: clan.id })),
    ...stories.map(story => ({ type: 'story', item: story, sortKey: story.createdAt || story.id })),
    ...lore.map(l => ({ type: 'lore', item: l, sortKey: l.id }))
  ];
  
  allItems.reverse();
  const recentItems = allItems.slice(0, 12);
  
  if (recentItems.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--color-text-dark-2); padding: 1rem;">No recent additions yet.</p>';
    return;
  }
  
  const cardRenderers = {
    'oc': renderCompactOCCard,
    'clan': renderCompactClanCard,
    'story': renderCompactStoryCard,
    'lore': renderCompactLoreCard
  };
  
  const hashPaths = {
    'oc': 'ocs',
    'clan': 'clans',
    'story': 'stories',
    'lore': 'lore'
  };
  
  recentItems.forEach(({ type, item }) => {
    const renderer = cardRenderers[type];
    if (renderer) {
      const card = renderer(item, (id) => {
        window.location.hash = `${hashPaths[type]}/${id}`;
      });
      if (card) {
        container.appendChild(card);
      }
    }
  });
}

// ------------------- Home Page Loader ------------------
// Load home page
function loadHomePage() {
  updateCounts();
  loadRecentAdditions();
}

// ============================================================================
// ------------------- OC Functions -------------------
// ============================================================================

// ------------------- OCs Page Loader ------------------
// OCs Page
async function loadOCsPage() {
  // Wait for storage to be ready before loading OCs
  await storage.ready();
  
  const ocs = storage.getAllOCs();
  const container = document.getElementById('ocs-list');
  
  if (!container) {
    console.warn('OC list container not found');
    return;
  }
  
  if (ocs.length === 0) {
    container.innerHTML = '';
    return;
  }
  
  container.innerHTML = '';
  ocs.forEach(oc => {
    const card = renderOCCard(oc, (id) => {
      window.location.hash = `ocs/${id}`;
    });
    container.appendChild(card);
  });
  
  setupOCFilters();
}

// ------------------- OC Filters Setup ------------------
function setupOCFilters() {
  const searchInput = document.getElementById('oc-search');
  const searchClear = document.getElementById('oc-search-clear');
  const villageFilter = document.getElementById('oc-village-filter');
  const rankFilter = document.getElementById('oc-rank-filter');
  
  if (searchInput && searchClear) {
    searchInput.addEventListener('input', () => {
      searchClear.style.display = searchInput.value ? 'block' : 'none';
    });
  }
  
  const applyFilters = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const village = villageFilter.value;
    const rank = rankFilter.value;
    
    const ocs = storage.getAllOCs();
    const filtered = ocs.filter(oc => {
      const matchesSearch = !searchTerm || 
        `${oc.firstName} ${oc.lastName}`.toLowerCase().includes(searchTerm) ||
        oc.aliases?.some(a => a.toLowerCase().includes(searchTerm));
      const matchesVillage = !village || oc.village === village;
      const matchesRank = !rank || oc.rank === rank;
      
      return matchesSearch && matchesVillage && matchesRank;
    });
    
    const container = document.getElementById('ocs-list');
    container.innerHTML = '';
    
    if (filtered.length === 0) {
      container.innerHTML = '<p class="text-center" style="grid-column: 1 / -1; color: #999;">No OCs match your filters.</p>';
      return;
    }
    
    filtered.forEach(oc => {
      const card = renderOCCard(oc, (id) => {
        window.location.hash = `ocs/${id}`;
      });
      container.appendChild(card);
    });
  };
  
  searchInput.addEventListener('input', applyFilters);
  villageFilter.addEventListener('change', applyFilters);
  rankFilter.addEventListener('change', applyFilters);
}

// ------------------- OC Edit/Delete Functions ------------------
window.editOC = function(id) {
  if (!adminAuthenticated) {
    alert('You must be logged into the admin panel to edit data.');
    navigateTo('admin');
    return;
  }
  window.location.hash = `ocs/edit/${id}`;
};

// ------------------- Delete Functions ------------------
// Generic delete function
async function deleteItem(type, id, config) {
  if (!adminAuthenticated) {
    alert('You must be logged into the admin panel to delete data.');
    navigateTo('admin');
    return;
  }
  if (confirm(config.confirmMessage)) {
    await config.deleteFunction(id);
    updateCounts();
    if (currentPage === 'admin') {
      loadAdminEditSection(type);
    } else {
      navigateTo(type);
    }
  }
}

window.deleteOC = (id) => deleteItem('ocs', id, {
  confirmMessage: 'Are you sure you want to delete this OC? This action cannot be undone.',
  deleteFunction: (id) => storage.deleteOC(id)
});

window.deleteClan = (id) => deleteItem('clans', id, {
  confirmMessage: 'Are you sure you want to delete this clan? This action cannot be undone.',
  deleteFunction: (id) => storage.deleteClan(id)
});

window.deleteStory = (id) => deleteItem('stories', id, {
  confirmMessage: 'Are you sure you want to delete this story? This action cannot be undone.',
  deleteFunction: (id) => storage.deleteStory(id)
});

window.deleteLore = (id) => deleteItem('lore', id, {
  confirmMessage: 'Are you sure you want to delete this lore entry? This action cannot be undone.',
  deleteFunction: (id) => storage.deleteLore(id)
});

// ------------------- Clans Page Loader ------------------
// Clans Page
async function loadClansPage() {
  // Wait for storage to be ready before loading clans
  await storage.ready();
  
  const clans = storage.getAllClans();
  const container = document.getElementById('clans-list');
  
  if (!container) {
    console.warn('Clan list container not found');
    return;
  }
  
  if (clans.length === 0) {
    container.innerHTML = '';
    return;
  }
  
  container.innerHTML = '';
  clans.forEach(clan => {
    const card = renderClanCard(clan, (id) => {
      window.location.hash = `clans/${id}`;
    });
    container.appendChild(card);
  });
  
  setupClanFilters();
}

// ------------------- Clan Filters Setup ------------------
function setupClanFilters() {
  const searchInput = document.getElementById('clan-search');
  const searchClear = document.getElementById('clan-search-clear');
  const villageFilter = document.getElementById('clan-village-filter');
  
  if (searchInput && searchClear) {
    searchInput.addEventListener('input', () => {
      searchClear.style.display = searchInput.value ? 'block' : 'none';
    });
  }
  
  const applyFilters = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const village = villageFilter.value;
    
    const clans = storage.getAllClans();
    const filtered = clans.filter(clan => {
      const matchesSearch = !searchTerm || 
        clan.name.toLowerCase().includes(searchTerm) ||
        clan.description?.toLowerCase().includes(searchTerm);
      const matchesVillage = !village || clan.village === village;
      
      return matchesSearch && matchesVillage;
    });
    
    const container = document.getElementById('clans-list');
    container.innerHTML = '';
    
    if (filtered.length === 0) {
      container.innerHTML = '<p class="text-center" style="grid-column: 1 / -1; color: #999;">No clans match your filters.</p>';
      return;
    }
    
    filtered.forEach(clan => {
      const card = renderClanCard(clan, (id) => {
        window.location.hash = `clans/${id}`;
      });
      container.appendChild(card);
    });
  };
  
  searchInput.addEventListener('input', applyFilters);
  villageFilter.addEventListener('change', applyFilters);
}

// ------------------- Stories Page Loader ------------------
// Stories Page
async function loadStoriesPage() {
  // Wait for storage to be ready before loading stories
  await storage.ready();
  
  const stories = storage.getAllStories();
  const container = document.getElementById('stories-list');
  
  if (!container) {
    console.warn('Story list container not found');
    return;
  }
  
  if (stories.length === 0) {
    container.innerHTML = '';
    return;
  }
  
  container.innerHTML = '';
  stories.forEach(story => {
    const card = renderStoryCard(story, (id) => {
      window.location.hash = `stories/${id}`;
    });
    container.appendChild(card);
  });
  
  setupStoryFilters();
}

// ------------------- Story Filters Setup ------------------
function setupStoryFilters() {
  const searchInput = document.getElementById('story-search');
  const searchClear = document.getElementById('story-search-clear');
  const tagFilter = document.getElementById('story-tag-filter');
  const tagClear = document.getElementById('story-tag-clear');
  
  if (searchInput && searchClear) {
    searchInput.addEventListener('input', () => {
      searchClear.style.display = searchInput.value ? 'block' : 'none';
    });
  }
  if (tagFilter && tagClear) {
    tagFilter.addEventListener('input', () => {
      tagClear.style.display = tagFilter.value ? 'block' : 'none';
    });
  }
  
  const applyFilters = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const tag = tagFilter.value.toLowerCase();
    
    const stories = storage.getAllStories();
    const filtered = stories.filter(story => {
      const matchesSearch = !searchTerm || 
        story.title.toLowerCase().includes(searchTerm) ||
        story.summary?.toLowerCase().includes(searchTerm);
      const matchesTag = !tag || 
        story.tags?.some(t => t.toLowerCase().includes(tag));
      
      return matchesSearch && matchesTag;
    });
    
    const container = document.getElementById('stories-list');
    container.innerHTML = '';
    
    if (filtered.length === 0) {
      container.innerHTML = '<p class="text-center" style="grid-column: 1 / -1; color: #999;">No stories match your filters.</p>';
      return;
    }
    
    filtered.forEach(story => {
      const card = renderStoryCard(story, (id) => {
        window.location.hash = `stories/${id}`;
      });
      container.appendChild(card);
    });
  };
  
  searchInput.addEventListener('input', applyFilters);
  tagFilter.addEventListener('input', applyFilters);
}

// ------------------- Lore Page Loader ------------------
// Lore Page
async function loadLorePage() {
  // Wait for storage to be ready before loading lore
  await storage.ready();
  
  import('./pages/lore-list.js').then(module => {
    const lore = storage.getAllLore();
    const container = document.getElementById('lore-list');
    
    if (lore.length === 0) {
      container.innerHTML = '';
      return;
    }
    
    const list = module.renderLoreList(lore, (id) => {
      window.location.hash = `lore/${id}`;
    });
    container.innerHTML = '';
    container.appendChild(list);
    
    setupLoreFilters();
  });
}

// ------------------- Lore Filters Setup ------------------
function setupLoreFilters() {
  const searchInput = document.getElementById('lore-search');
  const searchClear = document.getElementById('lore-search-clear');
  const categoryFilter = document.getElementById('lore-category-filter');
  
  if (searchInput && searchClear) {
    searchInput.addEventListener('input', () => {
      searchClear.style.display = searchInput.value ? 'block' : 'none';
    });
  }
  
  const applyFilters = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    
    const lore = storage.getAllLore();
    const filtered = lore.filter(l => {
      const matchesSearch = !searchTerm || 
        l.title.toLowerCase().includes(searchTerm) ||
        l.content?.toLowerCase().includes(searchTerm);
      const matchesCategory = !category || l.category === category;
      
      return matchesSearch && matchesCategory;
    });
    
    import('./pages/lore-list.js').then(module => {
      const container = document.getElementById('lore-list');
      const list = module.renderLoreList(filtered, (id) => {
        window.location.hash = `lore/${id}`;
      });
      container.innerHTML = '';
      container.appendChild(list);
    });
  };
  
  searchInput.addEventListener('input', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);
}

