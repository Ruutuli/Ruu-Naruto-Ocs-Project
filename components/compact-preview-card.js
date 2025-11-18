// Compact Preview Card Component - Small preview cards for homepage Recent Additions

export function renderCompactOCCard(oc, onClick) {
  const card = document.createElement('div');
  card.className = 'compact-preview-card compact-oc-card';
  card.style.cursor = 'pointer';
  
  const villageImage = getVillageImage(oc.village);
  
  card.innerHTML = `
    <div class="compact-card-image">
      ${oc.profileImage ? 
        `<img src="${oc.profileImage}" alt="${oc.firstName} ${oc.lastName}">` 
        : `<div class="compact-card-placeholder">
            <i class="fas fa-user-ninja"></i>
          </div>`
      }
    </div>
    <div class="compact-card-content">
      <div class="compact-card-type-badge">OC</div>
      <h4 class="compact-card-title">${oc.lastName || ''} ${oc.firstName || ''}</h4>
      <div class="compact-card-meta">
        ${villageImage ? `<img src="images/assets/${villageImage}" alt="${oc.village}" class="compact-village-icon">` : ''}
        <span>${oc.village || 'Unknown'}</span>
        ${oc.rank ? `<span class="compact-card-separator">•</span><span>${oc.rank}</span>` : ''}
      </div>
    </div>
  `;
  
  card.addEventListener('click', () => onClick(oc.id));
  
  return card;
}

export function renderCompactClanCard(clan, onClick) {
  const card = document.createElement('div');
  card.className = 'compact-preview-card compact-clan-card';
  card.style.cursor = 'pointer';
  
  card.innerHTML = `
    <div class="compact-card-image">
      ${clan.symbol ? 
        `<img src="${clan.symbol}" alt="${clan.name} Symbol">` 
        : `<div class="compact-card-placeholder">
            <i class="fas fa-shield-alt"></i>
          </div>`
      }
    </div>
    <div class="compact-card-content">
      <div class="compact-card-type-badge">Clan</div>
      <h4 class="compact-card-title">${clan.name || 'Unnamed Clan'}</h4>
      <div class="compact-card-meta">
        <span>${clan.village || 'Unknown'}</span>
        ${clan.members?.length > 0 ? `<span class="compact-card-separator">•</span><span>${clan.members.length} member${clan.members.length !== 1 ? 's' : ''}</span>` : ''}
      </div>
    </div>
  `;
  
  card.addEventListener('click', () => onClick(clan.id));
  
  return card;
}

export function renderCompactStoryCard(story, onClick) {
  const card = document.createElement('div');
  card.className = 'compact-preview-card compact-story-card';
  card.style.cursor = 'pointer';
  
  const date = story.createdAt ? new Date(story.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
  
  card.innerHTML = `
    <div class="compact-card-image">
      <div class="compact-card-placeholder" style="background: linear-gradient(135deg, var(--color-accent-2) 0%, var(--color-dark-2) 100%);">
        <i class="fas fa-scroll"></i>
      </div>
    </div>
    <div class="compact-card-content">
      <div class="compact-card-type-badge">Story</div>
      <h4 class="compact-card-title">${story.title || 'Untitled Story'}</h4>
      <div class="compact-card-meta">
        ${date ? `<span>${date}</span>` : ''}
        ${story.tags && story.tags.length > 0 ? `<span class="compact-card-separator">•</span><span>${story.tags.length} tag${story.tags.length !== 1 ? 's' : ''}</span>` : ''}
      </div>
    </div>
  `;
  
  card.addEventListener('click', () => onClick(story.id));
  
  return card;
}

export function renderCompactLoreCard(lore, onClick) {
  const card = document.createElement('div');
  card.className = 'compact-preview-card compact-lore-card';
  card.style.cursor = 'pointer';
  
  const categoryIcons = {
    village: 'fa-city',
    technique: 'fa-fire',
    history: 'fa-scroll',
    world: 'fa-globe'
  };
  
  const icon = categoryIcons[lore.category] || 'fa-book';
  
  card.innerHTML = `
    <div class="compact-card-image">
      <div class="compact-card-placeholder" style="background: linear-gradient(135deg, var(--color-dark-3) 0%, var(--color-dark-2) 100%);">
        <i class="fas ${icon}"></i>
      </div>
    </div>
    <div class="compact-card-content">
      <div class="compact-card-type-badge">Lore</div>
      <h4 class="compact-card-title">${lore.title || 'Untitled Lore'}</h4>
      <div class="compact-card-meta">
        ${lore.category ? `<span style="text-transform: capitalize;">${lore.category}</span>` : ''}
      </div>
    </div>
  `;
  
  card.addEventListener('click', () => onClick(lore.id));
  
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

