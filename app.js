// Main Application File - Routing and Page Management

import storage from './data/storage.js';
import { renderOCCard } from './components/oc-card.js';
import { renderOCDetail } from './components/oc-detail.js';
import { renderClanCard } from './components/clan-card.js';
import { renderStoryCard } from './components/story-card.js';

// Routing System
let currentPage = 'home';
let currentOCId = null;
let currentClanId = null;
let currentStoryId = null;
let currentLoreId = null;
let editingOC = null;
let editingClan = null;
let editingStory = null;
let editingLore = null;

// Utility function to clear all data (exposed globally for console use)
window.clearAllData = function() {
  if (confirm('Are you sure you want to delete ALL data? This action cannot be undone!')) {
    storage.clearAllData();
    // Refresh the current page
    if (currentPage === 'home') {
      loadHomePage();
    } else if (currentPage === 'ocs') {
      loadOCsPage();
    } else if (currentPage === 'clans') {
      loadClansPage();
    } else if (currentPage === 'stories') {
      loadStoriesPage();
    } else if (currentPage === 'lore') {
      loadLorePage();
    }
    updateCounts();
    alert('All data has been cleared!');
  }
};

// Utility function to clear all OCs only (exposed globally for console use)
window.clearAllOCs = function() {
  if (confirm('Are you sure you want to delete ALL OCs? This action cannot be undone!')) {
    storage.clearAllOCs();
    // Refresh the current page
    if (currentPage === 'home') {
      loadHomePage();
    } else if (currentPage === 'ocs') {
      loadOCsPage();
    } else if (currentPage === 'clan-detail' || currentPage === 'story-detail' || currentPage === 'lore-detail') {
      navigateTo('home');
    }
    updateCounts();
    alert('All OCs have been cleared!');
  }
};

// Admin Page Functionality
let adminAuthenticated = false;
window.adminAuthenticated = false; // Expose to window for other modules
const ADMIN_PASSWORD = 'admin123'; // Change this to your desired password

function loadAdminPage() {
  // Reset admin state when loading the page
  adminAuthenticated = false;
  window.adminAuthenticated = false;
  const loginSection = document.getElementById('admin-login-section');
  const panelSection = document.getElementById('admin-panel-section');
  const errorDiv = document.getElementById('admin-error');
  const passwordInput = document.getElementById('admin-password');
  
  if (loginSection) loginSection.style.display = 'block';
  if (panelSection) panelSection.style.display = 'none';
  if (errorDiv) errorDiv.style.display = 'none';
  if (passwordInput) passwordInput.value = '';
  
  // Reset edit section
  const editContent = document.getElementById('admin-edit-content');
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

window.checkAdminPassword = function() {
  const passwordInput = document.getElementById('admin-password');
  const errorDiv = document.getElementById('admin-error');
  const loginSection = document.getElementById('admin-login-section');
  const panelSection = document.getElementById('admin-panel-section');
  
  if (!passwordInput) return;
  
  if (passwordInput.value === ADMIN_PASSWORD) {
    adminAuthenticated = true;
    window.adminAuthenticated = true;
    if (loginSection) loginSection.style.display = 'none';
    if (panelSection) panelSection.style.display = 'block';
    if (errorDiv) errorDiv.style.display = 'none';
    // Load OCs edit section by default
    setTimeout(() => window.loadAdminEditSection('ocs'), 100);
  } else {
    adminAuthenticated = false;
    window.adminAuthenticated = false;
    if (errorDiv) errorDiv.style.display = 'block';
    if (passwordInput) passwordInput.value = '';
    if (passwordInput) passwordInput.focus();
  }
};

window.adminLogout = function() {
  adminAuthenticated = false;
  window.adminAuthenticated = false;
  loadAdminPage();
};

window.adminClearOCs = function() {
  if (!adminAuthenticated) {
    alert('Please log in to the admin panel first.');
    return;
  }
  if (confirm('Are you sure you want to delete ALL OCs? This will also clear OC references from clans, stories, and lore. This action cannot be undone!')) {
    storage.clearAllOCs();
    updateCounts();
    alert('All OCs have been cleared!');
    if (currentPage === 'ocs' || currentPage === 'home') {
      if (currentPage === 'ocs') {
        loadOCsPage();
      } else {
        loadHomePage();
      }
    }
  }
};

window.adminClearClans = function() {
  if (!adminAuthenticated) {
    alert('Please log in to the admin panel first.');
    return;
  }
  if (confirm('Are you sure you want to delete ALL clans? OC clan associations will be cleared. This action cannot be undone!')) {
    storage.clearAllClans();
    updateCounts();
    alert('All clans have been cleared!');
    if (currentPage === 'clans' || currentPage === 'home') {
      if (currentPage === 'clans') {
        loadClansPage();
      } else {
        loadHomePage();
      }
    }
  }
};

window.adminClearStories = function() {
  if (!adminAuthenticated) {
    alert('Please log in to the admin panel first.');
    return;
  }
  if (confirm('Are you sure you want to delete ALL stories? This action cannot be undone!')) {
    storage.clearAllStories();
    updateCounts();
    alert('All stories have been cleared!');
    if (currentPage === 'stories' || currentPage === 'home') {
      if (currentPage === 'stories') {
        loadStoriesPage();
      } else {
        loadHomePage();
      }
    }
  }
};

window.adminClearLore = function() {
  if (!adminAuthenticated) {
    alert('Please log in to the admin panel first.');
    return;
  }
  if (confirm('Are you sure you want to delete ALL lore entries? This action cannot be undone!')) {
    storage.clearAllLore();
    updateCounts();
    alert('All lore entries have been cleared!');
    if (currentPage === 'lore' || currentPage === 'home') {
      if (currentPage === 'lore') {
        loadLorePage();
      } else {
        loadHomePage();
      }
    }
  }
};

window.adminClearAll = function() {
  if (!adminAuthenticated) {
    alert('Please log in to the admin panel first.');
    return;
  }
  if (confirm('⚠️ FINAL WARNING ⚠️\n\nAre you absolutely sure you want to delete EVERYTHING?\n\nThis will permanently delete:\n- All OCs\n- All Clans\n- All Stories\n- All Lore\n\nThis action CANNOT be undone!\n\nType "DELETE ALL" to confirm:')) {
    const confirmation = prompt('Type "DELETE ALL" (in all caps) to confirm:');
    if (confirmation === 'DELETE ALL') {
      storage.clearAllData();
      updateCounts();
      alert('All data has been permanently deleted!');
      navigateTo('home');
      loadHomePage();
    } else {
      alert('Confirmation failed. No data was deleted.');
    }
  }
};

// Admin functions to add new data
window.adminAddOC = function() {
  if (!adminAuthenticated) {
    alert('Please log in to the admin panel first.');
    return;
  }
  window.location.hash = 'ocs/new';
  showOCForm();
};

window.adminAddClan = function() {
  if (!adminAuthenticated) {
    alert('Please log in to the admin panel first.');
    return;
  }
  window.location.hash = 'clans/new';
  showClanForm();
};

window.adminAddStory = function() {
  if (!adminAuthenticated) {
    alert('Please log in to the admin panel first.');
    return;
  }
  window.location.hash = 'stories/new';
  showStoryForm();
};

window.adminAddLore = function() {
  if (!adminAuthenticated) {
    alert('Please log in to the admin panel first.');
    return;
  }
  window.location.hash = 'lore/new';
  showLoreForm();
};

// Load admin edit section
window.loadAdminEditSection = function(type, clickedElement) {
  if (!adminAuthenticated) {
    alert('Please log in to the admin panel first.');
    return;
  }
  
  // Update active tab
  document.querySelectorAll('.admin-edit-tab').forEach(tab => {
    tab.classList.remove('active');
    tab.style.borderBottom = '3px solid transparent';
    tab.style.color = 'var(--color-text-dark-2)';
    tab.style.fontWeight = 'normal';
  });
  
  const activeTab = clickedElement || document.querySelector(`.admin-edit-tab[onclick*="${type}"]`);
  if (activeTab) {
    activeTab.classList.add('active');
    activeTab.style.borderBottom = '3px solid var(--color-accent-2)';
    activeTab.style.color = 'var(--color-dark-2)';
    activeTab.style.fontWeight = '600';
  }
  
  const contentDiv = document.getElementById('admin-edit-content');
  if (!contentDiv) return;
  
  import('./data/storage.js').then(module => {
    const storage = module.default;
    let items = [];
    let itemType = '';
    let editFunction = '';
    
    switch(type) {
      case 'ocs':
        items = storage.getAllOCs();
        itemType = 'OC';
        editFunction = 'editOC';
        break;
      case 'clans':
        items = storage.getAllClans();
        itemType = 'Clan';
        editFunction = 'editClan';
        break;
      case 'stories':
        items = storage.getAllStories();
        itemType = 'Story';
        editFunction = 'editStory';
        break;
      case 'lore':
        items = storage.getAllLore();
        itemType = 'Lore';
        editFunction = 'editLore';
        break;
    }
    
    if (items.length === 0) {
      contentDiv.innerHTML = `<p style="text-align: center; color: var(--color-text-dark-2); padding: 2rem;">No ${itemType.toLowerCase()}s found. Use "Add New ${itemType}" to create one.</p>`;
      return;
    }
    
    contentDiv.innerHTML = `
      <div style="display: grid; gap: 0.75rem;">
        ${items.map(item => {
          let displayName = '';
          if (type === 'ocs') {
            displayName = `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'Unnamed OC';
          } else if (type === 'clans') {
            displayName = item.name || 'Unnamed Clan';
          } else if (type === 'stories') {
            displayName = item.title || 'Untitled Story';
          } else if (type === 'lore') {
            displayName = item.title || 'Untitled Lore';
          }
          
          return `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--color-bg-2); border-radius: 6px; border: 1px solid var(--color-dark-2);">
              <div style="flex: 1;">
                <div style="font-weight: 600; color: var(--color-dark-2); margin-bottom: 0.25rem;">${displayName}</div>
                ${type === 'ocs' && item.village ? `<div style="font-size: 0.85rem; color: var(--color-text-dark-2);">${item.village} • ${item.rank || 'Unknown Rank'}</div>` : ''}
                ${type === 'clans' && item.village ? `<div style="font-size: 0.85rem; color: var(--color-text-dark-2);">${item.village} • ${item.members?.length || 0} member${(item.members?.length || 0) !== 1 ? 's' : ''}</div>` : ''}
                ${type === 'stories' && item.tags ? `<div style="font-size: 0.85rem; color: var(--color-text-dark-2);">${item.tags.slice(0, 3).join(', ')}</div>` : ''}
                ${type === 'lore' && item.category ? `<div style="font-size: 0.85rem; color: var(--color-text-dark-2);">${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</div>` : ''}
              </div>
              <button class="btn-naruto" onclick="window.${editFunction}('${item.id}')" style="margin-left: 1rem; white-space: nowrap;">
                <i class="fas fa-edit"></i> Edit
              </button>
            </div>
          `;
        }).join('')}
      </div>
    `;
  });
};

// Edit functions
window.editClan = function(id) {
  if (!adminAuthenticated) {
    alert('You must be logged into the admin panel to edit data.');
    navigateTo('admin');
    return;
  }
  window.location.hash = `clans/edit/${id}`;
};

window.editStory = function(id) {
  if (!adminAuthenticated) {
    alert('You must be logged into the admin panel to edit data.');
    navigateTo('admin');
    return;
  }
  window.location.hash = `stories/edit/${id}`;
};

window.editLore = function(id) {
  if (!adminAuthenticated) {
    alert('You must be logged into the admin panel to edit data.');
    navigateTo('admin');
    return;
  }
  window.location.hash = `lore/edit/${id}`;
};

// Utility function to remove duplicate Chigiri clans
function removeDuplicateChigiriClans() {
  const existingClans = storage.getAllClans();
  const chigiriClans = existingClans.filter(c => 
    c.name && (c.name.toLowerCase() === 'chigiri' || c.name.toLowerCase().includes('chigiri'))
  );
  
  if (chigiriClans.length > 1) {
    // Keep the most complete one (prefer the one with more data fields)
    chigiriClans.sort((a, b) => {
      const aDataCount = Object.keys(a).filter(k => a[k] !== null && a[k] !== undefined && a[k] !== '').length;
      const bDataCount = Object.keys(b).filter(k => b[k] !== null && b[k] !== undefined && b[k] !== '').length;
      return bDataCount - aDataCount;
    });
    
    const keepClan = chigiriClans[0];
    const removeIds = chigiriClans.slice(1).map(c => c.id);
    
    // Remove duplicates
    removeIds.forEach(id => {
      storage.deleteClan(id);
      console.log('🗑️ Removed duplicate Chigiri Clan with ID:', id);
    });
    
    console.log('✅ Kept Chigiri Clan with ID:', keepClan.id);
    return keepClan;
  }
  
  return chigiriClans[0] || null;
}

// Utility function to add Chigiri Clan (exposed globally for console use)
window.addChigiriClan = function() {
  // First, remove any duplicates
  const existingClan = removeDuplicateChigiriClans();
  
  if (existingClan) {
    // Update symbol if it's missing
    if (!existingClan.symbol) {
      existingClan.symbol = 'images/assets/chigiriclan.png';
      storage.saveClan(existingClan);
      console.log('✅ Chigiri Clan symbol updated!');
    }
    console.log('Chigiri Clan already exists with ID:', existingClan.id);
    return existingClan;
  }
  
  const chigiriClan = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    name: 'Chigiri',
    symbol: 'images/assets/chigiriclan.png',
    village: 'Iron',
    description: `🔶 Chigiri Clan - 契り (destiny; fate; karma)

The Chigiri Clan is an ancient and enigmatic clan spread across the ninja world. Renowned for their intelligence-gathering skills and deep connection to fate, they are bound by traditions rooted in their unique role as caretakers of the madousho, a living archive of knowledge passed down through generations. Their Kekkei Genkai, Divine Release, reflects their divine heritage tied to the Ōtsutsuki.

🔶 Overview

The Chigiri Clan originated from a tragedy involving a handmaiden of Kaguya Ōtsutsuki. Over time, they became intelligence brokers and diviners, revered for their vast knowledge and precision. With branches in major villages, they maintain neutrality and focus on preserving their legacy. Despite their spread, the main family resides in the neutral Land of Iron.

🔶 Kekkei Genkai

Name: Divine Release (神聖遁, Shinsei-ton)

Description: Divine Release is a Kekkei Genkai that allows users to see the "red strings of fate" for other individuals. These strings represent the paths a person's life may take, and the user can guide them toward the fate that will best fulfill their lives. Essentially, it serves as a form of fortune-telling or future sight.

Activation: Divine Release must be activated and uses Yin chakra.

Mechanics:
• The clarity and intensity of the red strings depend on the user's proficiency. More skilled users are capable of providing clearer and more detailed readings.
• Users cannot manipulate or alter the strings; they are only able to observe and interpret them.
• The ability can identify potential dangers or disruptions in a person's fate, making it commonly used for predicting significant events, such as death.

Strengths:
• Enables users to provide insightful guidance to others, ensuring the best possible outcomes for their lives.
• Highly valued for its predictive capabilities, especially in foreseeing dangers or life-threatening events.
• A profound ability tied to the spiritual realm, showcasing the Chigiri Clan's expertise in intelligence and divination.

Weaknesses:
• Prolonged use can lead to mental exhaustion, particularly for users less skilled in managing the strain of the ability.
• The emotional toll of seeing tragic or disturbing fates can affect the mental state of the user.
• Fate cannot be altered directly by the user, as Divine Release only allows observation, limiting its application in combat or immediate crises.

🔶 Family Traditions

• Long Hair Tradition: Long hair symbolizes wisdom and familial pride.
• Coming-of-Age Ceremony: Members uncover secret knowledge or a hidden truth to prove their worth as intel gatherers. This tradition emphasizes their skills in observation and deduction.
• Boneworking: Members use bones for divination and crafting weapons, a skill passed down since the clan's inception.
• Open Discussions: Taboo topics like death, sex, and other sensitive subjects are openly discussed. The clan believes in educating members on all aspects of life to foster a well-rounded and knowledgeable perspective.
• Non-Interference: Clan members are prohibited from altering the fate of others directly, adhering to the belief that destiny must take its natural course.
• Marriage Practices: Males marry distant members from within the family while daughters are married into influential families to strengthen alliances and elevate the clan's status.
• Community Raising of Children: The entire clan takes an active role in raising children. Members believe in immersion as key to development, encouraging children to experience and learn as much as possible from a young age.
• Encouragement of Exploration: Adolescents are encouraged to safely explore and experiment with themselves and others, reflecting the clan's acceptance of personal growth and diversity.
• Focus on Destiny: Clan members are raised with the ingrained belief that every individual has a predetermined path to follow. Children are taught to respect their own fate and the fates of others from an early age.
• Council Oversight: Each village branch has a council of older Chigiri members to guide and make key decisions for their branch. These councils ensure traditions are upheld and provide a structured community environment.

Clan Philosophy: "There is no malice in information. They are only written and spoken words. What you choose to do with it, is where the crisis lies!"

🔶 Villages/Lands

Primary Location: The main family resides in the Land of Iron. The main branch maintains neutrality and refrains from affiliating with any specific village or land, allowing them to serve as mediators and impartial observers when necessary.

Other Locations: Branches exist in all major villages, with each specializing in unique elemental affinities and tactical skills tailored to their region:
• Branch of Fire (Land of Fire): Specializes in Fire Release, medical ninjutsu, and barrier techniques.
• Branch of Earth (Land of Earth): Known for Earth Release, summoning techniques, and sealing jutsu.
• Branch of Wind (Land of Wind): Experts in Wind Release, fan-based combat, and illusionary transformations.
• Branch of Lightning (Land of Lightning): Specializes in Lightning Release, space-time ninjutsu, and cursed seals.
• Branch of Water (Land of Water): Proficient in Water Release, chakra absorption techniques, and forbidden jutsu.

Territory: While the Chigiri do not control territory in the traditional sense, their influence as intelligence gatherers and keepers of knowledge makes them an invaluable resource for the villages they inhabit. Their extensive library networks in each village serve as centers of learning and information.

Reputation: The Chigiri are widely respected as scholars, bookkeepers, and masters of intelligence. However, their insatiable thirst for knowledge and nosy tendencies can make them appear overly meticulous or intrusive to outsiders. This duality has led to mixed perceptions, ranging from reverence to suspicion.

Clan Councils: Each village has a local council composed of senior Chigiri members who oversee their branch's affairs and report back to the main family. These councils maintain order and ensure adherence to clan traditions while fostering relationships with their respective villages.

War Contributions: Despite their preference for support roles, the Chigiri are duty-bound to defend their home villages during times of war. However, they follow an unspoken rule: members of the clan never harm one another, even if they serve opposing sides. This peculiar tradition hints at a mysterious curse jutsu within the clan.

🔶 Appearance/Physical Traits

Hair: White, silver, or gray.
Eyes: Eye colors include soft pink, golden yellow, and icy blue.
Skin: Members typically have medium-toned skin with a pinkish undertone.

Distinct Features:
• Short and round eyebrows, a soft but distinguishing characteristic.
• Lean and athletic builds with a focus on agility and grace.

Clothing: Members prefer a combination of modern and traditional Japanese styles. Tight-fitting clothing underneath provides practicality for combat, while traditional garments like kimonos, hakama, or obi sashes are worn on top for elegance.

Clan Colors: Deep plum, crimson, pale gold, and beige are the official colors of the Chigiri Clan. These colors are often reflected in their clothing and accessories, symbolizing their unity and heritage.

Hair Accessories: Clan members frequently adorn their hair with intricate ornaments, such as ribbons, clasps, or pins. These accessories often carry symbolic meaning, indicating rank, marital status, or family branch.

🔶 Leaders

Current Leader(s): The head of the clan resides in the Land of Iron, overseeing all branches.

Past Leaders:
• Taro Chigiri: Sought to protect his family from the Ōtsutsuki curse.
• Miki Chigiri: The first to establish the Chigiri Council.

Heirs: TBD

🔶 Chigiri Clan Members

Akene Chigiri, Kae Chigiri, Nerin Chigiri, Natsuno Chigiri, Ayuna Chigiri, Tsubomi Chigiri, Maizou Chigiri, Rei Chigiri, Taro Chigiri, Eikene Chigiri`,
    abilities: [
      'Divine Release (神聖遁, Shinsei-ton) - Kekkei Genkai: See red strings of fate',
      'Bone Divination - Traditional technique using carved bones for prediction and divination',
      'Fuinjutsu and Hiden Jutsu - Advanced sealing techniques, barriers, and secret clan techniques',
      'Intel-Based Jutsu - Techniques that amplify intelligence-gathering capabilities',
      'Fire Release (Main Branch)',
      'Yin Release (Main Branch)',
      'Fire Release (Branch of Fire)',
      'Earth Release (Branch of Earth)',
      'Water Release (Branch of Water)',
      'Wind Release (Branch of Wind)',
      'Lightning Release (Branch of Lightning)',
      'Medical Ninjutsu (Branch of Fire)',
      'Barrier Techniques (Branch of Fire)',
      'Summoning Techniques (Branch of Earth)',
      'Sealing Jutsu (Branch of Earth)',
      'Fan-Based Combat (Branch of Wind)',
      'Illusionary Transformations (Branch of Wind)',
      'Space-Time Ninjutsu (Branch of Lightning)',
      'Cursed Seals (Branch of Lightning)',
      'Chakra Absorption Techniques (Branch of Water)',
      'Forbidden Jutsu (Branch of Water)',
      'Weapon-Based Combat (bone-crafted weapons)',
      'Misdirection and Psychological Manipulation',
      'Sensory-Based Tracking',
      'Information Brokerage',
      'Espionage Specialization',
      'Diplomatic Advisory'
    ],
    history: `🔶 History Part 1

The origins of the Chigiri Clan trace back to Rei, the inaugural madousho. Rei served as a handmaiden for Kaguya, tending to her infant twin sons. One day, while attending to a fussy Hamura, Rei accidentally stumbled upon the book known as the madousho. This chance encounter marked the beginning of Rei becoming the first vessel for the madousho.

Kaguya discovered an unconscious Rei following the incident, and the pages of her madousho were left blank.

Rei never recovered full consciousness; any remnants of the girl's original personality were now erased. It seemed as if her own soul was imprisoned within her. Kaguya proved incapable of reversing the effects of her curse seal on Rei and her madousho. Rei became a living, breathing madousho, marking the inaugural instance of many to follow.

However, a significant complication arose in this narrative—Rei was pregnant. Devoid of her own will or consciousness, Rei was unfit to raise a child. Upon the child's birth, it was sent off to be raised by Rei's relatives. The family harbored deep resentment towards Kaguya Ōtsutsuki for taking Rei away from them. The child, named Taro by his relatives, harbored an early and intense desire for revenge against the witch who had separated him from his mother.

Prior to any revenge being carried out, Kaguya was sealed away by her own children. While relieved that Kaguya was no longer a threat to the world, Taro remained skeptical of her offspring. Despite searching for his mother after Kaguya's sealing, Taro found no trace of her. Eventually, Taro settled down and had one child, a daughter named Eikene.

Several unsettling traits marked Taro's daughter. She possessed knowledge beyond her years, a trait inherited from her grandmother, Rei—the role of being the vessel to the madousho.

The recurrence of the curse in his daughter reignited Taro's resentment towards the Ōtsutsuki. Driven by a quest for revenge and a desire to liberate his daughter and future generations from the influence and ties to the Ōtsutsuki clan, Taro sought out Hamura. He was aware that Hamura's influence played a role in what had befallen his mother.

By this time, Hamura had taken residence on the Moon, rendering him impossible to contact. However, he had left behind a child on Earth—a son named Yasha Ōtsutsuki.

Taro tracked down Yasha with the intention of using the boy to break the seal on his daughter, ensuring the curse wouldn't haunt his family in generations to come. However, Yasha wasn't particularly cooperative. His presence on Earth was a consequence of various reasons, including his disagreeable behavior and personality.

Surprisingly, Yasha and Eikene developed an unexpected closeness over time, which made Taro uneasy. Eventually, the two decided to elope, escaping to another land to begin anew. Despite Yasha's best efforts to undo the jutsu inflicted on Eikene's family by her grandmother, he was unsuccessful.

Despite these setbacks, Yasha pledged to remain by Eikene's side and vowed never to cease his attempts to break the curse placed upon her.

After a period, the couple expanded to have four children. Yasha, realizing the impossibility of breaking the curse on Eikene and their future descendants, proposed turning her affliction into a useful tool.

Adopting her last name, Yasha and Eikene Chigiri inadvertently became the founders of the Chigiri clan. Numerous precautions were implemented to safeguard the future vessels of the madousho, ensuring it remained within the family's control. They went to great lengths, even deciding their children's marriages and eventually endorsing unions between family members.

Descendants spanning children, grandchildren, and beyond inherited Eikene's insatiable thirst for knowledge and Yasha's proficiency in divination. This gave rise to numerous traditions within the newly established clan.

🔶 History Part 2

Following Eikene's passing, the next manifestation of the madousho emerged in the form of a child named Miki. Miki implemented several significant measures, including the formation of the Chigiri Council to safeguard the existence of the madousho and make pivotal decisions for the clan. Additionally, Miki pioneered the creation of Kekkei Genkai, introducing Divine Release and Tengenjutsu.

As time passed, the knowledge of the madousho was concealed even from ordinary members of the clan, with only the current head and the council being privy to its existence.

Several years later, the Chigiri clan had become well-established and had outgrown its initial small village. The council deemed it appropriate for the clan to expand its horizons and settle in other villages.

They dispersed, contributing to their new home villages by establishing libraries and predominantly serving as a productive force rather than engaging as soldiers. (Chigiri have big NPC energy)

Under the initial influence of Taro's determination to secure the madousho's safety within the family, the clan gradually steered toward specific traits through careful marital choices. This encompassed various factors, from physical appearances and chakra types to intelligence levels.

In the early stages, if a Chigiri exhibited undesirable traits at birth, they were prohibited from marrying or having children, with rumors even circulating about the disposal of such individuals. Over time, certain traits emerged as a result of inbreeding. Distinctive characteristics for the Chigiri included hair colors like white, gray, and silver, eye colors ranging from pink, gold, to ice blue, and a medium skin tone.

In the Modern era, the Chigiri clan is dispersed across every village. Each village maintains a small council that reports to the main council and the head of the clan. The head of the clan, along with the main family, resides in The Land of Iron. The main branch maintains neutrality and refrains from affiliating with any village or land. Present-day Chigiri are recognized as bookkeepers and an intelligence-based clan.

🔶 Madousho

The madousho is a book crafted and owned by Kaguya Ōtsutsuki. Its contents encompass a wide range, from personal diary entries to intricate details about Jutsu and Chakra. However, a curse was cast upon the book, subjecting anyone who reads its pages to a particular curse.

This curse became identified as the Soul Binding talisman, a form of Juinjutsu.

The mechanism behind it was straightforward: individuals lacking Kaguya's chakra signature would trigger the seal. By merely reading a single word from the book, their soul would be drawn into it, rendering their body an empty vessel. The book version of the madousho had claimed numerous souls.

The last instance when the seal was activated involved a girl named Rei. Unexpectedly, due to the unintentional interference of an infant Hamura, the seal went awry. Instead of Rei's soul being drawn into the book, the complete contents of the book and the past souls it had absorbed were transferred and sealed inside Rei.

This marked the beginning of the transformation of the madousho into a living and breathing entity. The seal forever connected Rei and her descendants to the Ōtsutsuki.

The human form of the madousho operated similarly to the book version, with the exception that the human version absorbed any and all information in its vicinity. Thanks to the seal, the madousho underwent a form of reincarnation, perpetuating its existence through successive generations.

This marks the origin of the Chigiri Clan. The living madousho, now a sentient being, accumulated information across generations. Anything learned by the current vessel of the madousho became accessible to the subsequent madousho.

Furthermore, any content physically written by individuals possessing a chakra signature from the Chigiri Clan or Ōtsutsuki Clan was assimilated by the madousho, a consequence of the initial seal on the original book form.

The madousho maintains a rudimentary level of conscious functioning, retaining remnants of Rei's soul. When the vessel of the madousho enters something known as madousho Mode, they relinquish their free will to enable the functioning of the mode and access information.

Given the inherent nature of the madousho, the recent dozen vessels have been subjected to a Cursed Tongue Eradication Seal jutsu. This measure aims to prevent the madousho from vocalizing any information it acquires.

The fate of the madousho vessel remains unreadable. The inability to discern their fate, along with the seal on their forehead, serves as the distinctive markers of a new vessel. Since their fate cannot be ascertained, the head of the clan assigns them a fabricated destiny to follow.

Currently, the present madousho has the capability to access an extensive pool of information dating back to the inception of chakra itself. This knowledge spans a wide spectrum, encompassing clan histories, forbidden and lost jutsu, and even personal grievances. It becomes a potent and perilous tool when wielded effectively.`,
    members: []
  };
  
  storage.saveClan(chigiriClan);
  console.log('✅ Chigiri Clan added successfully!');
  console.log('Clan ID:', chigiriClan.id);
  updateCounts();
  return chigiriClan;
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupRouting();
  loadUserInfo();
  // Automatically add Chigiri Clan if it doesn't exist
  window.addChigiriClan();
  loadHomePage();
  updateCounts();
  // Set initial page title
  updatePageTitle('home');
});

// Load user info to home page
function loadUserInfo() {
  import('./data/user-info.js').then(module => {
    const info = module.userInfo;
    const nameEl = document.getElementById('home-name');
    const pronounsEl = document.getElementById('home-pronouns');
    const ageEl = document.getElementById('home-age');
    const signEl = document.getElementById('home-sign');
    const timezoneEl = document.getElementById('home-timezone');
    
    if (nameEl) nameEl.textContent = info.name;
    if (pronounsEl) pronounsEl.textContent = info.pronouns;
    if (ageEl) ageEl.textContent = info.age;
    if (signEl) signEl.textContent = info.sign;
    if (timezoneEl) timezoneEl.textContent = info.timezone;
  });
}

// Setup navigation event listeners
function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link[data-page]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.getAttribute('data-page');
      navigateTo(page);
    });
  });
}

// Setup hash-based routing
function setupRouting() {
  window.addEventListener('hashchange', handleHashChange);
  handleHashChange();
}

function handleHashChange() {
  const hash = window.location.hash.substring(1);
  
  if (!hash || hash === 'home') {
    navigateTo('home');
  } else if (hash.startsWith('ocs')) {
    if (hash === 'ocs') {
      navigateTo('ocs');
    } else if (hash.startsWith('ocs/')) {
      const parts = hash.split('/');
      const id = parts[1];
      if (id === 'new') {
        if (!adminAuthenticated) {
          alert('You must be logged into the admin panel to add new data.');
          navigateTo('admin');
          return;
        }
        showOCForm();
      } else if (id === 'edit') {
        if (!adminAuthenticated) {
          alert('You must be logged into the admin panel to edit data.');
          navigateTo('admin');
          return;
        }
        showOCForm(parts[2]);
      } else {
        showOCDetail(id);
      }
    }
  } else if (hash.startsWith('clans')) {
    if (hash === 'clans') {
      navigateTo('clans');
    } else if (hash.startsWith('clans/')) {
      const parts = hash.split('/');
      const id = parts[1];
      if (id === 'new') {
        if (!adminAuthenticated) {
          alert('You must be logged into the admin panel to add new data.');
          navigateTo('admin');
          return;
        }
        showClanForm();
      } else if (id === 'edit') {
        if (!adminAuthenticated) {
          alert('You must be logged into the admin panel to edit data.');
          navigateTo('admin');
          return;
        }
        showClanForm(parts[2]);
      } else {
        showClanDetail(id);
      }
    }
  } else if (hash.startsWith('stories')) {
    if (hash === 'stories') {
      navigateTo('stories');
    } else if (hash.startsWith('stories/')) {
      const parts = hash.split('/');
      const id = parts[1];
      if (id === 'new') {
        if (!adminAuthenticated) {
          alert('You must be logged into the admin panel to add new data.');
          navigateTo('admin');
          return;
        }
        showStoryForm();
      } else if (id === 'edit') {
        if (!adminAuthenticated) {
          alert('You must be logged into the admin panel to edit data.');
          navigateTo('admin');
          return;
        }
        showStoryForm(parts[2]);
      } else {
        showStoryDetail(id);
      }
    }
  } else if (hash.startsWith('lore')) {
    if (hash === 'lore') {
      navigateTo('lore');
    } else if (hash.startsWith('lore/')) {
      const parts = hash.split('/');
      const id = parts[1];
      if (id === 'new') {
        if (!adminAuthenticated) {
          alert('You must be logged into the admin panel to add new data.');
          navigateTo('admin');
          return;
        }
        showLoreForm();
      } else if (id === 'edit') {
        if (!adminAuthenticated) {
          alert('You must be logged into the admin panel to edit data.');
          navigateTo('admin');
          return;
        }
        showLoreForm(parts[2]);
      } else {
        showLoreDetail(id);
      }
    }
  } else if (hash === 'admin') {
    navigateTo('admin');
  } else {
    navigateTo(hash);
  }
}

// Update page title based on current page
function updatePageTitle(page, itemName = null) {
  const baseTitle = 'Naruto OC | Website';
  
  let title = baseTitle;
  
  switch(page) {
    case 'home':
      title = 'Home | ' + baseTitle;
      break;
    case 'ocs':
      title = 'OCs | ' + baseTitle;
      break;
    case 'oc-detail':
      title = itemName ? `${itemName} | OCs | ${baseTitle}` : 'OC Detail | ' + baseTitle;
      break;
    case 'oc-form':
      title = editingOC ? `Edit OC | ${baseTitle}` : `New OC | ${baseTitle}`;
      break;
    case 'clans':
      title = 'Clans | ' + baseTitle;
      break;
    case 'clan-detail':
      title = itemName ? `${itemName} | Clans | ${baseTitle}` : 'Clan Detail | ' + baseTitle;
      break;
    case 'clan-form':
      title = editingClan ? `Edit Clan | ${baseTitle}` : `New Clan | ${baseTitle}`;
      break;
    case 'stories':
      title = 'Stories | ' + baseTitle;
      break;
    case 'story-detail':
      title = itemName ? `${itemName} | Stories | ${baseTitle}` : 'Story Detail | ' + baseTitle;
      break;
    case 'story-form':
      title = editingStory ? `Edit Story | ${baseTitle}` : `New Story | ${baseTitle}`;
      break;
    case 'lore':
      title = 'Lore | ' + baseTitle;
      break;
    case 'lore-detail':
      title = itemName ? `${itemName} | Lore | ${baseTitle}` : 'Lore Detail | ' + baseTitle;
      break;
    case 'lore-form':
      title = editingLore ? `Edit Lore | ${baseTitle}` : `New Lore | ${baseTitle}`;
      break;
    case 'admin':
      title = 'Admin | ' + baseTitle;
      break;
    default:
      title = baseTitle;
  }
  
  document.title = title;
}

// Navigation function
window.navigateTo = function(page) {
  // Hide all pages
  document.querySelectorAll('.page-section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Show target page
  const targetPage = document.getElementById(`${page}-page`);
  if (targetPage) {
    targetPage.classList.add('active');
    currentPage = page;
    window.location.hash = page;
    
    // Update page title
    updatePageTitle(page);
    
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-page') === page) {
        link.classList.add('active');
      }
    });
    
    // Show/hide back button
    updateBackButton(page);
    
    // Load page content
    if (page === 'home') {
      loadHomePage();
    } else if (page === 'ocs') {
      loadOCsPage();
    } else if (page === 'clans') {
      loadClansPage();
    } else if (page === 'stories') {
      loadStoriesPage();
    } else if (page === 'lore') {
      loadLorePage();
    } else if (page === 'admin') {
      loadAdminPage();
    }
  }
};

// Update back button visibility and target
function updateBackButton(page) {
  const backItem = document.getElementById('nav-back-item');
  const backBtn = document.getElementById('nav-back-btn');
  
  // Pages that should show back button
  const detailPages = ['oc-detail', 'oc-form', 'clan-detail', 'clan-form', 
                       'story-detail', 'story-form', 'lore-detail', 'lore-form'];
  
  if (detailPages.includes(page)) {
    // Determine which list page to go back to
    let backTarget = 'home';
    if (page.startsWith('oc')) {
      backTarget = 'ocs';
    } else if (page.startsWith('clan')) {
      backTarget = 'clans';
    } else if (page.startsWith('story')) {
      backTarget = 'stories';
    } else if (page.startsWith('lore')) {
      backTarget = 'lore';
    }
    
    backBtn.setAttribute('data-back-target', backTarget);
    backItem.style.display = 'block';
  } else {
    backItem.style.display = 'none';
  }
}

// Handle back button click
window.handleNavBack = function() {
  const backBtn = document.getElementById('nav-back-btn');
  const target = backBtn.getAttribute('data-back-target') || 'home';
  navigateTo(target);
};

// Home Page
function loadHomePage() {
  updateCounts();
  loadRecentOCs();
}

function updateCounts() {
  const ocs = storage.getAllOCs();
  const clans = storage.getAllClans();
  const stories = storage.getAllStories();
  const lore = storage.getAllLore();
  
  // Update quick links on home page
  const quickOcCount = document.getElementById('quick-oc-count');
  const quickClanCount = document.getElementById('quick-clan-count');
  const quickStoryCount = document.getElementById('quick-story-count');
  const quickLoreCount = document.getElementById('quick-lore-count');
  
  if (quickOcCount) quickOcCount.textContent = `(${ocs.length} ${ocs.length === 1 ? 'character' : 'characters'})`;
  if (quickClanCount) quickClanCount.textContent = `(${clans.length} ${clans.length === 1 ? 'clan' : 'clans'})`;
  if (quickStoryCount) quickStoryCount.textContent = `(${stories.length} ${stories.length === 1 ? 'story' : 'stories'})`;
  if (quickLoreCount) quickLoreCount.textContent = `(${lore.length} ${lore.length === 1 ? 'entry' : 'entries'})`;
}

function loadRecentOCs() {
  const ocs = storage.getAllOCs().slice(-6).reverse();
  const container = document.getElementById('recent-ocs');
  
  if (ocs.length === 0) {
    container.innerHTML = '<p class="text-center" style="grid-column: 1 / -1; color: #999;">No OCs yet. <a href="#ocs" onclick="window.showOCForm()">Create your first OC!</a></p>';
    return;
  }
  
  container.innerHTML = '';
  ocs.forEach(oc => {
    const card = renderOCCard(oc, (id) => {
      window.location.hash = `ocs/${id}`;
    });
    container.appendChild(card);
  });
}

// OCs Page
function loadOCsPage() {
  const ocs = storage.getAllOCs();
  const container = document.getElementById('ocs-list');
  
  if (ocs.length === 0) {
    container.innerHTML = '<p class="text-center" style="grid-column: 1 / -1; color: #999;">No OCs found. <a href="#" onclick="window.showOCForm()">Create your first OC!</a></p>';
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
        oc.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
      }
      storage.saveOC(oc);
      window.location.hash = `ocs/${oc.id}`;
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

window.deleteOC = function(id) {
  if (!adminAuthenticated) {
    alert('You must be logged into the admin panel to delete data.');
    navigateTo('admin');
    return;
  }
  if (confirm('Are you sure you want to delete this OC? This action cannot be undone.')) {
    storage.deleteOC(id);
    navigateTo('ocs');
    updateCounts();
  }
};

// Clans Page
function loadClansPage() {
  const clans = storage.getAllClans();
  const container = document.getElementById('clans-list');
  
  if (clans.length === 0) {
    container.innerHTML = '<p class="text-center" style="grid-column: 1 / -1; color: #999;">No clans found. <a href="#" onclick="window.showClanForm()">Create your first clan!</a></p>';
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
  // Check if this is a template request (e.g., 'chigiri')
  let templateData = null;
  if (id === 'chigiri') {
    // Load Chigiri template data
    import('./data/chigiri-clan-data.js').then(dataModule => {
      templateData = dataModule.chigiriClanData;
      editingClan = templateData;
      loadClanForm();
    });
    return;
  }
  
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
          clan.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        }
        storage.saveClan(clan);
        window.location.hash = `clans/${clan.id}`;
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
    container.innerHTML = '<p class="text-center" style="grid-column: 1 / -1; color: #999;">No stories found. <a href="#" onclick="window.showStoryForm()">Create your first story!</a></p>';
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
        story.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        story.createdAt = new Date().toISOString();
        story.updatedAt = story.createdAt;
      }
      storage.saveStory(story);
      window.location.hash = `stories/${story.id}`;
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
      container.innerHTML = '<p class="text-center" style="color: #999;">No lore entries found. <a href="#" onclick="window.showLoreForm()">Create your first lore entry!</a></p>';
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
        lore.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
      }
      storage.saveLore(lore);
      window.location.hash = `lore/${lore.id}`;
    });
    container.innerHTML = '';
    container.appendChild(form);
  });
};

