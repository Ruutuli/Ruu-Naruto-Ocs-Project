// OC Card Component - Preview card for OC listing

import { convertImageUrl } from '../utils/imageUtils.js';

export function renderOCCard(oc, onClick) {
  const card = document.createElement('div');
  card.className = 'card-naruto oc-card fade-in';
  card.style.cursor = 'pointer';
  
  // Handle backward compatibility: convert single values to arrays
  const villages = Array.isArray(oc.village) ? oc.village : (oc.village ? [oc.village] : []);
  const ranks = Array.isArray(oc.rank) ? oc.rank : (oc.rank ? [oc.rank] : []);
  const villageImage = villages.length > 0 ? getVillageImage(villages[0]) : null;
  const rankClass = ranks.length > 0 ? `rank-${ranks[0].toLowerCase().replace('-', '-')}` : '';
  const villageDisplay = villages.length > 0 ? villages.join(', ') : 'Unknown';
  
  // Get age display: prioritize Part I age from ageByEra, then check for range in age field
  let ageDisplay = 'N/A';
  if (oc.ageByEra && oc.ageByEra['Part I'] && oc.ageByEra['Part I'].trim()) {
    ageDisplay = oc.ageByEra['Part I'].trim();
  } else if (oc.age) {
    const ageStr = oc.age.toString().trim();
    // Check if it's a range (e.g., "12-13", "12-15")
    if (ageStr.includes('-')) {
      ageDisplay = ageStr;
    } else {
      // Check if it contains era markers and extract first value
      const eraMatch = ageStr.match(/^(\d+(?:-\d+)?)/);
      if (eraMatch) {
        ageDisplay = eraMatch[1];
      } else {
        ageDisplay = ageStr;
      }
    }
  }
  
  // Get display image with priority: displayImage > profileImage > imagesByEra
  let profileImageUrl = null;
  if (oc.displayImage && oc.displayImage.trim()) {
    profileImageUrl = convertImageUrl(oc.displayImage);
  } else if (oc.profileImage && oc.profileImage.trim()) {
    profileImageUrl = convertImageUrl(oc.profileImage);
  } else if (oc.imagesByEra && typeof oc.imagesByEra === 'object') {
    // Find first available era image
    const eras = Object.keys(oc.imagesByEra);
    for (const era of eras) {
      const eraImage = oc.imagesByEra[era];
      if (eraImage && eraImage.trim()) {
        profileImageUrl = convertImageUrl(eraImage);
        break;
      }
    }
  }
  
  card.innerHTML = `
    <div class="oc-card-image-wrapper">
      ${profileImageUrl ? 
        `<img src="${profileImageUrl}" alt="${oc.firstName} ${oc.lastName}" class="oc-card-image">` 
        : `<div class="oc-card-placeholder">
            <i class="fas fa-user-ninja"></i>
            <span>No Image</span>
          </div>`
      }
    </div>
    <div class="card-header-naruto">
      <h3 class="mb-0">${oc.lastName || ''} ${oc.firstName || ''}</h3>
    </div>
    <div class="card-body">
      <div class="oc-card-info-row">
        <div class="oc-card-info-item">
          <i class="fas fa-birthday-cake"></i>
          <span><strong>Age:</strong> ${ageDisplay}</span>
        </div>
        ${villageImage ? `
        <div class="oc-card-village">
          <img src="images/assets/${villageImage}" alt="${villageDisplay}" class="oc-card-village-icon">
          <span>${villageDisplay}</span>
        </div>
        ` : `<div class="oc-card-village"><span>${villageDisplay}</span></div>`}
      </div>
      ${(() => {
        const clanIds = Array.isArray(oc.clanId) ? oc.clanId : (oc.clanId ? [oc.clanId] : []);
        const clanNames = Array.isArray(oc.clanName) ? oc.clanName : (oc.clanName ? [oc.clanName] : []);
        const hasClans = clanIds.length > 0 || clanNames.length > 0;
        if (!hasClans) return '';
        
        const allClanNames = [...clanIds.map(id => 'Loading...'), ...clanNames];
        const clanDisplay = allClanNames.length > 0 ? allClanNames.join(', ') : 'Loading...';
        const clanIdStr = clanIds.length > 0 ? clanIds[0] : (clanNames.length > 0 ? clanNames[0] : 'none');
        // Ensure we always stringify valid arrays (never null/undefined)
        const clanIdsJson = JSON.stringify(clanIds || []);
        const clanNamesJson = JSON.stringify(clanNames || []);
        
        return `
        <div class="oc-card-clan">
          <i class="fas fa-users"></i>
          <span><strong>Clan:</strong> <span id="clan-name-${clanIdStr}" class="oc-card-clan-name" data-clan-ids="${clanIdsJson}" data-clan-names="${clanNamesJson}">${clanDisplay}</span></span>
        </div>
      `;
      })()}
      <div class="oc-card-actions">
        <button class="btn-naruto" onclick="event.stopPropagation();">
          <i class="fas fa-eye"></i> View Details
        </button>
      </div>
    </div>
  `;
  
  card.addEventListener('click', () => onClick(oc.id));
  
  // Load clan names if exist
  const clanNameEl = card.querySelector('.oc-card-clan-name');
  if (clanNameEl) {
    const clanIdsAttr = clanNameEl.getAttribute('data-clan-ids');
    const clanNamesAttr = clanNameEl.getAttribute('data-clan-names');
    
    let clanIds = [];
    let clanNames = [];
    
    try {
      if (clanIdsAttr && clanIdsAttr.trim() && clanIdsAttr.trim() !== 'null' && clanIdsAttr.trim() !== 'undefined') {
        const parsed = JSON.parse(clanIdsAttr.trim());
        clanIds = Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      // Silently handle parse errors - attribute may be malformed or empty
      clanIds = [];
    }
    
    try {
      if (clanNamesAttr && clanNamesAttr.trim() && clanNamesAttr.trim() !== 'null' && clanNamesAttr.trim() !== 'undefined') {
        const parsed = JSON.parse(clanNamesAttr.trim());
        clanNames = Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      // Silently handle parse errors - attribute may be malformed or empty
      clanNames = [];
    }
    
    if (clanIds.length > 0) {
      // Load clans asynchronously - fetch directly from file
      (async () => {
        try {
          // Load all clans asynchronously
          const loadPromises = clanIds.map(async (clanId) => {
            try {
              const response = await fetch(`data/clans/${clanId}.json`);
              if (response.ok) {
                const clanData = await response.json();
                if (clanData && clanData.name) {
                  return clanData.name;
                }
              }
            } catch (e) {
              // File doesn't exist or error loading
            }
            return 'Unknown';
          });
          
          const loadedClanNames = await Promise.all(loadPromises);
          const allClanNames = [...loadedClanNames, ...clanNames];
          if (clanNameEl) {
            clanNameEl.textContent = allClanNames.length > 0 ? allClanNames.join(', ') : 'Unknown';
          }
        } catch (e) {
          console.error('Error loading clans:', e);
          if (clanNameEl) {
            clanNameEl.textContent = 'Unknown';
          }
        }
      })();
    } else if (clanNames.length > 0) {
      // Predefined or custom clan names - already displayed in template
      clanNameEl.textContent = clanNames.join(', ');
    }
  }
  
  return card;
}

function getVillageImage(village) {
  const villageMap = {
    'Konohagakure': 'konoha.png',
    'Konoha': 'konoha.png',
    'Sunagakure': 'suna.png',
    'Suna': 'suna.png',
    'Kirigakure': 'kiri.png',
    'Kiri': 'kiri.png',
    'Kumogakure': 'kumo.png',
    'Kumo': 'kumo.png',
    'Iwagakure': 'iwa.png',
    'Iwa': 'iwa.png',
    'Amegakure': 'ame.png',
    'Ame': 'ame.png',
    'Otogakure': 'oto.png',
    'Oto': 'oto.png',
    'Takigakure': 'taki.png',
    'Taki': 'taki.png',
    'Yugagakure': 'yuga.png',
    'Yuga': 'yuga.png',
    'Kusagakure': 'kusa.png',
    'Kusa': 'kusa.png',
    'Uzushiogakure': 'uzu.png',
    'Uzushio': 'uzu.png'
  };
  
  return villageMap[village] || null;
}

