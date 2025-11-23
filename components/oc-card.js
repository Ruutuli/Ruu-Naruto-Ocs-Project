// OC Card Component - Preview card for OC listing

export function renderOCCard(oc, onClick) {
  const card = document.createElement('div');
  card.className = 'card-naruto oc-card fade-in';
  card.style.cursor = 'pointer';
  
  const villageImage = getVillageImage(oc.village);
  const rankClass = `rank-${oc.rank.toLowerCase().replace('-', '-')}`;
  
  card.innerHTML = `
    <div class="oc-card-image-wrapper">
      ${oc.profileImage ? 
        `<img src="${oc.profileImage}" alt="${oc.firstName} ${oc.lastName}" class="oc-card-image">` 
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
          <span><strong>Age:</strong> ${oc.age || 'N/A'}</span>
        </div>
        ${villageImage ? `
        <div class="oc-card-village">
          <img src="images/assets/${villageImage}" alt="${oc.village}" class="oc-card-village-icon">
          <span>${oc.village || 'Unknown'}</span>
        </div>
        ` : `<div class="oc-card-village"><span>${oc.village || 'Unknown'}</span></div>`}
      </div>
      ${(oc.clanId || oc.clanName) ? `
        <div class="oc-card-clan">
          <i class="fas fa-users"></i>
          <span><strong>Clan:</strong> <span id="clan-name-${oc.clanId || oc.clanName || 'none'}" class="oc-card-clan-name">${oc.clanName || 'Loading...'}</span></span>
        </div>
      ` : ''}
      <div class="oc-card-actions">
        <button class="btn-naruto" onclick="event.stopPropagation();">
          <i class="fas fa-eye"></i> View Details
        </button>
      </div>
    </div>
  `;
  
  card.addEventListener('click', () => onClick(oc.id));
  
  // Load clan name if exists
  if (oc.clanId) {
    import('../data/storage.js').then(module => {
      const clan = module.default.getClan(oc.clanId);
      const clanNameEl = card.querySelector(`#clan-name-${oc.clanId}`);
      if (clanNameEl && clan) {
        clanNameEl.textContent = clan.name;
      } else if (clanNameEl && !clan) {
        // Clan not found, remove the loading text
        clanNameEl.textContent = 'Unknown';
      }
    });
  } else if (oc.clanName) {
    // Predefined or custom clan name - already displayed in template
    // No need to load anything
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

