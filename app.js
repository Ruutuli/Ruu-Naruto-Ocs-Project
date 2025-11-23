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
  
  // Reset tabs
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

// Admin logout
window.adminLogout = function() {
  adminAuthenticated = false;
  window.adminAuthenticated = false;
  loadAdminPage();
};

// ============================================================================
// ------------------- Admin Clear Functions -------------------
// ============================================================================

// Check admin authentication
function requireAdminAuth() {
  if (!adminAuthenticated) {
    alert('Please log in to the admin panel first.');
    return false;
  }
  return true;
}

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

// Admin clear OCs
window.adminClearOCs = async function() {
  if (!requireAdminAuth()) return;
  
  if (confirm('Are you sure you want to delete ALL OCs? This will also clear OC references from clans, stories, and lore. This action cannot be undone!')) {
    try {
      await storage.clearAllOCs();
      updateCounts();
      refreshAfterAdminClear('ocs');
      alert('All OCs have been cleared!');
    } catch (error) {
      console.error('[app.js]❌ Failed to clear OCs:', error);
      alert('Failed to clear OCs. Please try again.');
    }
  }
};

// Admin clear clans
window.adminClearClans = async function() {
  if (!requireAdminAuth()) return;
  
  if (confirm('Are you sure you want to delete ALL clans? OC clan associations will be cleared. This action cannot be undone!')) {
    try {
      await storage.clearAllClans();
      updateCounts();
      refreshAfterAdminClear('clans');
      alert('All clans have been cleared!');
    } catch (error) {
      console.error('[app.js]❌ Failed to clear clans:', error);
      alert('Failed to clear clans. Please try again.');
    }
  }
};

// Admin clear stories
window.adminClearStories = async function() {
  if (!requireAdminAuth()) return;
  
  if (confirm('Are you sure you want to delete ALL stories? This action cannot be undone!')) {
    try {
      await storage.clearAllStories();
      updateCounts();
      refreshAfterAdminClear('stories');
      alert('All stories have been cleared!');
    } catch (error) {
      console.error('[app.js]❌ Failed to clear stories:', error);
      alert('Failed to clear stories. Please try again.');
    }
  }
};

// Admin clear lore
window.adminClearLore = async function() {
  if (!requireAdminAuth()) return;
  
  if (confirm('Are you sure you want to delete ALL lore entries? This action cannot be undone!')) {
    try {
      await storage.clearAllLore();
      updateCounts();
      refreshAfterAdminClear('lore');
      alert('All lore entries have been cleared!');
    } catch (error) {
      console.error('[app.js]❌ Failed to clear lore:', error);
      alert('Failed to clear lore. Please try again.');
    }
  }
};

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

// Admin add OC
window.adminAddOC = function() {
  if (!requireAdminAuth()) return;
  window.location.hash = 'ocs/new';
  if (window.showOCForm) {
    window.showOCForm();
  } else {
    // Function not ready yet, wait for it
    setTimeout(() => {
      if (window.showOCForm) window.showOCForm();
    }, 100);
  }
};

// Admin add clan
window.adminAddClan = function() {
  if (!requireAdminAuth()) return;
  window.location.hash = 'clans/new';
  if (window.showClanForm) {
    window.showClanForm();
  } else {
    setTimeout(() => {
      if (window.showClanForm) window.showClanForm();
    }, 100);
  }
};

// Admin add story
window.adminAddStory = function() {
  if (!requireAdminAuth()) return;
  window.location.hash = 'stories/new';
  if (window.showStoryForm) {
    window.showStoryForm();
  } else {
    setTimeout(() => {
      if (window.showStoryForm) window.showStoryForm();
    }, 100);
  }
};

// Admin add lore
window.adminAddLore = function() {
  if (!requireAdminAuth()) return;
  window.location.hash = 'lore/new';
  if (window.showLoreForm) {
    window.showLoreForm();
  } else {
    setTimeout(() => {
      if (window.showLoreForm) window.showLoreForm();
    }, 100);
  }
};

// ============================================================================
// ------------------- Admin Edit Section -------------------
// ============================================================================

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

// Load admin edit section
window.loadAdminEditSection = function(type, clickedElement) {
  if (!requireAdminAuth()) return;
  
  // Update active tab
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

// Require admin auth and redirect if not authenticated
function requireAdminAuthWithRedirect() {
  if (!adminAuthenticated) {
    alert('You must be logged into the admin panel to edit data.');
    navigateTo('admin');
    return false;
  }
  return true;
}

// Edit clan
window.editClan = function(id) {
  if (!requireAdminAuthWithRedirect()) return;
  window.location.hash = `clans/edit/${id}`;
};

// Edit story
window.editStory = function(id) {
  if (!requireAdminAuthWithRedirect()) return;
  window.location.hash = `stories/edit/${id}`;
};

// Edit lore
window.editLore = function(id) {
  if (!requireAdminAuthWithRedirect()) return;
  window.location.hash = `lore/edit/${id}`;
};

// ============================================================================
// ------------------- Initialization -------------------
// ============================================================================

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

// Setup navigation event listeners
function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link[data-page]');
  console.log('[app.js] Setting up navigation listeners, found', navLinks.length, 'nav links');
  
  if (navLinks.length === 0) {
    console.error('[app.js] No navigation links found!');
    // Try again after a short delay
    setTimeout(() => {
      const retryLinks = document.querySelectorAll('.nav-link[data-page]');
      console.log('[app.js] Retry: found', retryLinks.length, 'nav links');
      if (retryLinks.length > 0) {
        retryLinks.forEach(link => {
          const page = link.getAttribute('data-page');
          link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('[app.js] Nav link clicked:', page);
            navigateTo(page);
          });
        });
      }
    }, 100);
    return;
  }
  
  navLinks.forEach(link => {
    const page = link.getAttribute('data-page');
    console.log('[app.js] Attaching listener to link:', page);
    link.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('[app.js] Nav link clicked:', page);
      navigateTo(page);
    });
  });
  
  console.log('[app.js] Navigation listeners attached successfully');
}

// Setup hash-based routing
function setupRouting() {
  window.addEventListener('hashchange', handleHashChange);
  handleHashChange();
}

// Initialize app
function initializeApp() {
  console.log('[app.js] Initializing app...');
  console.log('[app.js] Document ready state:', document.readyState);
  
  setupNavigation();
  setupRouting();
  loadUserInfo();
  loadHomePage();
  updateCounts();
  updatePageTitle('home');
  
  console.log('[app.js] App initialized');
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

// Handle route for a specific type (ocs, clans, stories, lore)
function handleTypeRoute(type, hash, parts) {
  const routeConfig = {
    'ocs': { 
      listPage: 'ocs', 
      showForm: () => window.showOCForm(), 
      showDetail: (id) => window.showOCDetail(id) 
    },
    'clans': { 
      listPage: 'clans', 
      showForm: () => window.showClanForm(), 
      showDetail: (id) => window.showClanDetail(id) 
    },
    'stories': { 
      listPage: 'stories', 
      showForm: () => window.showStoryForm(), 
      showDetail: (id) => window.showStoryDetail(id) 
    },
    'lore': { 
      listPage: 'lore', 
      showForm: () => window.showLoreForm(), 
      showDetail: (id) => window.showLoreDetail(id) 
    }
  };
  
  const config = routeConfig[type];
  if (!config) return false;
  
  if (hash === type) {
    navigateTo(config.listPage, true); // Skip hash update since we're already handling hash change
    return true;
  }
  
  if (hash.startsWith(`${type}/`)) {
    const id = parts[1];
    
    if (id === 'new') {
      if (!requireAdminAuthWithRedirect()) return true;
      config.showForm();
      return true;
    }
    
    if (id === 'edit') {
      if (!requireAdminAuthWithRedirect()) return true;
      config.showForm(parts[2]);
      return true;
    }
    
    config.showDetail(id);
    return true;
  }
  
  return false;
}

// Handle hash change
function handleHashChange() {
  const hash = window.location.hash.substring(1);
  
  if (!hash || hash === 'home') {
    navigateTo('home', true); // Skip hash update since we're already handling hash change
    return;
  }
  
  if (hash === 'admin') {
    navigateTo('admin', true); // Skip hash update since we're already handling hash change
    return;
  }
  
  const parts = hash.split('/');
  const type = parts[0];
  
  // Handle type routes (ocs, clans, stories, lore)
  if (handleTypeRoute(type, hash, parts)) {
    return;
  }
  
  // Fallback to generic navigation
  navigateTo(hash, true); // Skip hash update since we're already handling hash change
}

// ============================================================================
// ------------------- Page Title Management -------------------
// ============================================================================

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

// Navigation function - define it here so it's available immediately
// This is the main navigation function used throughout the app
function navigateTo(page, skipHashUpdate = false) {
  console.log('[app.js] navigateTo called:', page, 'skipHashUpdate:', skipHashUpdate, 'currentPage:', currentPage);
  
  // If already on this page, just reload it
  if (currentPage === page && !skipHashUpdate) {
    console.log('[app.js] Already on page, reloading:', page);
    const loader = getPageLoader(page);
    if (loader) loader();
    // Still update hash if it's not correct
    if (window.location.hash !== `#${page}`) {
      window.location.hash = page;
    }
    return;
  }
  
  console.log('[app.js] Navigating to:', page);
  
  // Hide all page sections
  const allSections = document.querySelectorAll('.page-section');
  console.log('[app.js] Found', allSections.length, 'page sections');
  allSections.forEach(section => {
    section.classList.remove('active');
  });
  
  const targetPage = document.getElementById(`${page}-page`);
  if (!targetPage) {
    console.error('[app.js]❌ Page not found:', page, 'Looking for:', `${page}-page`);
    console.error('[app.js] Available page sections:', Array.from(allSections).map(s => s.id));
    return;
  }
  
  console.log('[app.js] Found target page, activating:', page);
  targetPage.classList.add('active');
  currentPage = page;
  
  // Only update hash if not skipping (to avoid triggering hashchange when already handling it)
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
    console.log('[app.js] Calling page loader for:', page);
    try {
      loader();
    } catch (error) {
      console.error('[app.js] Error loading page:', page, error);
    }
  } else {
    console.warn('[app.js] No page loader found for:', page);
  }
}

// Make navigateTo available on window for inline event handlers and debugging
window.navigateTo = navigateTo;

// Handle back button click
window.handleNavBack = function() {
  const backBtn = document.getElementById('nav-back-btn');
  const target = backBtn?.getAttribute('data-back-target') || 'home';
  navigateTo(target);
};

// ============================================================================
// ------------------- Home Page -------------------
// ============================================================================

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

// Load recent additions (all types)
function loadRecentAdditions() {
  const container = document.getElementById('recent-additions');
  
  if (!container) return;
  
  container.innerHTML = '';
  
  // Get recent items from each type (last 3-4 of each)
  const ocs = storage.getAllOCs().slice(-4).reverse();
  const clans = storage.getAllClans().slice(-4).reverse();
  const stories = storage.getAllStories().slice(-4).reverse();
  const lore = storage.getAllLore().slice(-4).reverse();
  
  // Combine all items with type info for sorting
  const allItems = [
    ...ocs.map(oc => ({ type: 'oc', item: oc, sortKey: oc.id })),
    ...clans.map(clan => ({ type: 'clan', item: clan, sortKey: clan.id })),
    ...stories.map(story => ({ type: 'story', item: story, sortKey: story.createdAt || story.id })),
    ...lore.map(l => ({ type: 'lore', item: l, sortKey: l.id }))
  ];
  
  // Sort by most recent (stories have createdAt, others use id which is typically chronological)
  // For simplicity, just reverse the array since items are already in reverse chronological order
  allItems.reverse();
  
  // Take the most recent 12 items
  const recentItems = allItems.slice(0, 12);
  
  if (recentItems.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--color-text-dark-2); padding: 1rem;">No recent additions yet.</p>';
    return;
  }
  
  recentItems.forEach(({ type, item }) => {
    let card;
    
    switch (type) {
      case 'oc':
        card = renderCompactOCCard(item, (id) => {
          window.location.hash = `ocs/${id}`;
        });
        break;
      case 'clan':
        card = renderCompactClanCard(item, (id) => {
          window.location.hash = `clans/${id}`;
        });
        break;
      case 'story':
        card = renderCompactStoryCard(item, (id) => {
          window.location.hash = `stories/${id}`;
        });
        break;
      case 'lore':
        card = renderCompactLoreCard(item, (id) => {
          window.location.hash = `lore/${id}`;
        });
        break;
      default:
        return;
    }
    
    if (card) {
      container.appendChild(card);
    }
  });
}

// Load home page
function loadHomePage() {
  updateCounts();
  loadRecentAdditions();
}

// ============================================================================
// ------------------- OC Functions -------------------
// ============================================================================

// OCs Page
function loadOCsPage() {
  const ocs = storage.getAllOCs();
  const container = document.getElementById('ocs-list');
  
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
  
  // Setup filters
  setupOCFilters();
}

function setupOCFilters() {
  const searchInput = document.getElementById('oc-search');
  const searchClear = document.getElementById('oc-search-clear');
  const villageFilter = document.getElementById('oc-village-filter');
  const rankFilter = document.getElementById('oc-rank-filter');
  
  // Show/hide clear button
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

window.editOC = function(id) {
  if (!adminAuthenticated) {
    alert('You must be logged into the admin panel to edit data.');
    navigateTo('admin');
    return;
  }
  window.location.hash = `ocs/edit/${id}`;
};

window.deleteOC = async function(id, type = 'ocs') {
  if (!adminAuthenticated) {
    alert('You must be logged into the admin panel to delete data.');
    navigateTo('admin');
    return;
  }
  if (confirm('Are you sure you want to delete this OC? This action cannot be undone.')) {
    await storage.deleteOC(id);
    updateCounts();
    // Refresh admin edit section if we're on admin page
    if (currentPage === 'admin') {
      loadAdminEditSection('ocs');
    } else {
      navigateTo('ocs');
    }
  }
};

window.deleteClan = async function(id, type = 'clans') {
  if (!adminAuthenticated) {
    alert('You must be logged into the admin panel to delete data.');
    navigateTo('admin');
    return;
  }
  if (confirm('Are you sure you want to delete this clan? This action cannot be undone.')) {
    await storage.deleteClan(id);
    updateCounts();
    // Refresh admin edit section if we're on admin page
    if (currentPage === 'admin') {
      loadAdminEditSection('clans');
    } else {
      navigateTo('clans');
    }
  }
};

window.deleteStory = async function(id, type = 'stories') {
  if (!adminAuthenticated) {
    alert('You must be logged into the admin panel to delete data.');
    navigateTo('admin');
    return;
  }
  if (confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
    await storage.deleteStory(id);
    updateCounts();
    // Refresh admin edit section if we're on admin page
    if (currentPage === 'admin') {
      loadAdminEditSection('stories');
    } else {
      navigateTo('stories');
    }
  }
};

window.deleteLore = async function(id, type = 'lore') {
  if (!adminAuthenticated) {
    alert('You must be logged into the admin panel to delete data.');
    navigateTo('admin');
    return;
  }
  if (confirm('Are you sure you want to delete this lore entry? This action cannot be undone.')) {
    await storage.deleteLore(id);
    updateCounts();
    // Refresh admin edit section if we're on admin page
    if (currentPage === 'admin') {
      loadAdminEditSection('lore');
    } else {
      navigateTo('lore');
    }
  }
};

// Clans Page
function loadClansPage() {
  const clans = storage.getAllClans();
  const container = document.getElementById('clans-list');
  
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

function setupClanFilters() {
  const searchInput = document.getElementById('clan-search');
  const searchClear = document.getElementById('clan-search-clear');
  const villageFilter = document.getElementById('clan-village-filter');
  
  // Show/hide clear button
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

// Stories Page
function loadStoriesPage() {
  const stories = storage.getAllStories();
  const container = document.getElementById('stories-list');
  
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

function setupStoryFilters() {
  const searchInput = document.getElementById('story-search');
  const searchClear = document.getElementById('story-search-clear');
  const tagFilter = document.getElementById('story-tag-filter');
  const tagClear = document.getElementById('story-tag-clear');
  
  // Show/hide clear buttons
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

// Lore Page
function loadLorePage() {
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

function setupLoreFilters() {
  const searchInput = document.getElementById('lore-search');
  const searchClear = document.getElementById('lore-search-clear');
  const categoryFilter = document.getElementById('lore-category-filter');
  
  // Show/hide clear button
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

