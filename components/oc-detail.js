// OC Detail Component - Full Data Book style character sheet renderer

export function renderOCDetail(oc) {
  const container = document.createElement('div');
  container.className = 'detail-scroll';
  
  container.innerHTML = `
    <div class="detail-backdrop"></div>
    <div class="detail-header">
      <div class="detail-header-inner">
        <div class="detail-header-border"></div>
      </div>
    </div>
    <div class="detail-content">
      <div class="oc-sheet-character-info">
        <div class="oc-sheet-left">
        <div class="oc-name-card">
          <div style="margin-bottom: 0.75rem;">
            <h3 style="margin-bottom: 0.25rem;">
              Last Name <i style="font-size:.8rem;">名字</i>
            </h3>
            <div style="font-size: 1.2rem; margin-top: 0.25rem;">
              ${oc.lastName || ''}
            </div>
          </div>
          <div style="margin-bottom: 0.75rem;">
            <h3 style="margin-bottom: 0.25rem;">
              First Name <i style="font-size:.8rem;">名前</i>
            </h3>
            <div style="font-size: 1.2rem; margin-top: 0.25rem;">
              ${oc.firstName || ''}
            </div>
          </div>
          ${oc.nameJapanese ? `
            <div style="font-size: 1rem; margin-top: 0.5rem; color: var(--color-text-2);">
              ${oc.nameJapanese}
            </div>
          ` : ''}
          ${oc.nameMeaning ? `
            <div style="font-size: 0.9rem; margin-top: 0.3rem; color: var(--color-text-3); font-style: italic;">
              "${oc.nameMeaning}"
            </div>
          ` : ''}
        </div>
        
        ${oc.profileImage ? 
          `<img src="${oc.profileImage}" alt="${oc.firstName} ${oc.lastName}" class="oc-profile-image">` 
          : `<img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="Profile" class="oc-profile-image">`
        }
        
        <div class="oc-badges" id="oc-badges-container">
          ${renderVillageBadge(oc.village)}
          ${renderClanBadge(oc.clanId)}
          ${renderLandBadge(oc.village)}
        </div>
        
        <div class="oc-stats">
          ${renderStat('Intelligence', oc.stats.intelligence, 'intelligence')}
          ${renderStat('Stamina', oc.stats.stamina, 'stamina')}
          ${renderStat('Strength', oc.stats.strength, 'strength')}
          ${renderStat('Speed', oc.stats.speed, 'speed')}
          ${renderStat('Ninjutsu', oc.stats.ninjutsu, 'ninjutsu')}
          ${renderStat('Genjutsu', oc.stats.genjutsu, 'genjutsu')}
          ${renderStat('Taijutsu', oc.stats.taijutsu, 'taijutsu')}
          ${renderStat('Hand Seals', oc.stats.handSeals, 'handSeals')}
          ${renderStat('Fuinjutsu', oc.stats.fuinjutsu || 0, 'fuinjutsu')}
        </div>
        </div>
        
        <div class="oc-sheet-right">
          ${renderIdentifyingInfo(oc)}
        </div>
      </div>
      
      <div class="oc-sheet-full-width">
        ${renderBattleStrategy(oc)}
      </div>
      
      <div id="relationships-collapse" class="collapsible-section">
      <div class="collapsible-header" onclick="toggleCollapse('relationships-content')">
        Relationships <i class="japanese-header">関係</i>
        <i class="fas fa-chevron-down bounce-arrow"></i>
      </div>
      <div id="relationships-content" class="collapsible-content">
        ${renderRelationships(oc)}
      </div>
    </div>
    
    <div id="personality-collapse" class="collapsible-section">
      <div class="collapsible-header" onclick="toggleCollapse('personality-content')">
        Known Behavior <i class="japanese-header">既知の行動</i>
        <i class="fas fa-chevron-down bounce-arrow"></i>
      </div>
      <div id="personality-content" class="collapsible-content">
        ${renderKnownBehavior(oc)}
      </div>
    </div>
    
    <div id="abilities-collapse" class="collapsible-section">
      <div class="collapsible-header" onclick="toggleCollapse('abilities-content')">
        Abilities & Techniques <i class="japanese-header">能力と術</i>
        <i class="fas fa-chevron-down bounce-arrow"></i>
      </div>
      <div id="abilities-content" class="collapsible-content">
        ${renderAbilities(oc)}
      </div>
    </div>
    
    <div id="demeanor-collapse" class="collapsible-section">
      <div class="collapsible-header" onclick="toggleCollapse('demeanor-content')">
        Demeanor <i class="japanese-header">態度</i>
        <i class="fas fa-chevron-down bounce-arrow"></i>
      </div>
      <div id="demeanor-content" class="collapsible-content">
        ${renderDemeanor(oc)}
      </div>
    </div>
    
    <div class="record-history">
      <h1>Record History <i class="japanese-header">記録履歴</i></h1>
      ${renderHistoryEntry('Childhood', oc.recordHistory?.childhood || '')}
      ${renderHistoryEntry('Adolescence', oc.recordHistory?.adolescence || '')}
      ${renderHistoryEntry('Adulthood', oc.recordHistory?.adulthood || '')}
    </div>
    
    ${oc.appearance ? `
      <div class="appearance-section">
        <h1>Appearance & Gear <i class="japanese-header">外見と装備</i></h1>
        ${oc.appearance.image ? `<div class="appearance-image-container"><img src="${oc.appearance.image}" alt="Appearance" class="appearance-image"></div>` : ''}
        ${oc.appearance.colors && oc.appearance.colors.length > 0 ? `
          <div class="color-palette">
            ${oc.appearance.colors.map(color => `<div class="color-swatch" style="background-color: ${color};"></div>`).join('')}
          </div>
        ` : ''}
        ${oc.appearance.gear && oc.appearance.gear.length > 0 ? `
          <div class="gear-grid">
            ${oc.appearance.gear.map(gear => {
              // Handle both string and object formats
              if (typeof gear === 'string') {
                return renderGearItem({ name: gear, category: 'Item', material: '', use: '', information: [] });
              }
              return renderGearItem(gear);
            }).join('')}
          </div>
        ` : ''}
      </div>
    ` : ''}
    
      ${oc.themeSong || oc.voiceActors?.japanese || oc.voiceActors?.english ? `
      <div class="media-section">
        <h3>Media & Representation <i class="japanese-header">メディアと表現</i></h3>
        ${oc.themeSong ? `<p><strong>Theme Song:</strong> ${oc.themeSong}</p>` : ''}
        ${oc.voiceActors?.japanese || oc.voiceActors?.english ? `
        <p><strong>Voice Actors:</strong>
          ${oc.voiceActors.japanese ? `JP: ${oc.voiceActors.japanese}` : ''}
          ${oc.voiceActors.japanese && oc.voiceActors.english ? ' • ' : ''}
          ${oc.voiceActors.english ? `EN: ${oc.voiceActors.english}` : ''}
        </p>
        ` : ''}
      </div>
      ` : ''}
      
    <div id="gallery-collapse" class="collapsible-section">
      <div class="collapsible-header" onclick="toggleCollapse('gallery-content')">
        Gallery <i class="japanese-header">ギャラリー</i>
        <i class="fas fa-chevron-down bounce-arrow"></i>
      </div>
      <div id="gallery-content" class="collapsible-content">
        ${renderGallery(oc)}
      </div>
    </div>
      <div class="oc-sheet-footer">
        <div>authorized personnel only<br>shinobi registration file</div>
      </div>
    </div>
  `;
  
  // Make toggleCollapse available globally
  window.toggleCollapse = (id) => {
    const content = document.getElementById(id);
    if (content) {
      const isActive = content.classList.contains('active');
      content.classList.toggle('active');
      
      // Find the associated arrow and rotate it
      const header = content.previousElementSibling;
      if (header) {
        const arrow = header.querySelector('.bounce-arrow');
        if (arrow) {
          if (isActive) {
            arrow.style.transform = 'rotate(0deg)';
          } else {
            arrow.style.transform = 'rotate(180deg)';
          }
        }
      }
    }
  };
  
  // Load clan badge image if clan exists, otherwise show kunai
  import('../data/storage.js').then(module => {
    const badgeContainer = container.querySelector(`#clan-badge-${oc.clanId || 'none'}`);
    if (badgeContainer) {
      if (oc.clanId) {
        const clan = module.default.getClan(oc.clanId);
        if (clan && clan.symbol) {
          badgeContainer.innerHTML = `<img src="${clan.symbol}" alt="${clan.name}">`;
          badgeContainer.setAttribute('title', `Clan: ${clan.name}`);
        } else {
          // No clan symbol, use kunai
          badgeContainer.innerHTML = `<img src="images/assets/kunai.png" alt="No Clan">`;
          badgeContainer.setAttribute('title', 'No Clan');
        }
      } else {
        // No clan, use kunai
        badgeContainer.innerHTML = `<img src="images/assets/kunai.png" alt="No Clan">`;
        badgeContainer.setAttribute('title', 'No Clan');
      }
    }
  });
  
  // Setup gallery lightbox functions
  setupGalleryLightbox();
  
  return container;
}

// Gallery Lightbox Functions
let galleryLightboxSetup = false;

function setupGalleryLightbox() {
  // Only setup once
  if (galleryLightboxSetup) return;
  galleryLightboxSetup = true;
  
  // Make functions globally available
  window.openGalleryLightbox = function(galleryId, index) {
    const lightbox = document.getElementById(`${galleryId}-lightbox`);
    if (!lightbox) return;
    
    const gallery = window.galleryData[galleryId];
    if (!gallery || !gallery[index]) return;
    
    const item = gallery[index];
    const imageUrl = typeof item === 'string' ? item : (item.url || item.image || '');
    const caption = typeof item === 'object' && item.caption ? item.caption : '';
    const title = typeof item === 'object' && item.title ? item.title : '';
    
    const lightboxImage = document.getElementById(`${galleryId}-lightbox-image`);
    const lightboxCaption = document.getElementById(`${galleryId}-lightbox-caption`);
    const lightboxCounter = document.getElementById(`${galleryId}-lightbox-counter`);
    
    if (lightboxImage) {
      lightboxImage.src = imageUrl;
      lightboxImage.alt = caption || title || `Gallery image ${index + 1}`;
    }
    
    if (lightboxCaption) {
      lightboxCaption.textContent = caption || title || '';
      lightboxCaption.style.display = (caption || title) ? 'block' : 'none';
    }
    
    if (lightboxCounter) {
      lightboxCounter.textContent = `${index + 1} / ${gallery.length}`;
    }
    
    // Store current index
    lightbox.dataset.currentIndex = index;
    
    // Show lightbox
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };
  
  window.closeGalleryLightbox = function(galleryId) {
    const lightbox = document.getElementById(`${galleryId}-lightbox`);
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = ''; // Restore scrolling
    }
  };
  
  window.navigateGallery = function(galleryId, direction) {
    const lightbox = document.getElementById(`${galleryId}-lightbox`);
    if (!lightbox) return;
    
    const gallery = window.galleryData[galleryId];
    if (!gallery) return;
    
    let currentIndex = parseInt(lightbox.dataset.currentIndex || '0');
    currentIndex += direction;
    
    // Wrap around
    if (currentIndex < 0) {
      currentIndex = gallery.length - 1;
    } else if (currentIndex >= gallery.length) {
      currentIndex = 0;
    }
    
    window.openGalleryLightbox(galleryId, currentIndex);
  };
  
  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    const activeLightbox = document.querySelector('.gallery-lightbox.active');
    if (!activeLightbox) return;
    
    const galleryId = activeLightbox.id.replace('-lightbox', '');
    
    if (e.key === 'Escape') {
      window.closeGalleryLightbox(galleryId);
    } else if (e.key === 'ArrowLeft') {
      window.navigateGallery(galleryId, -1);
    } else if (e.key === 'ArrowRight') {
      window.navigateGallery(galleryId, 1);
    }
  });
}

function renderStat(name, value, iconType) {
  const icons = {
    'intelligence': 'fa-brain',
    'stamina': 'fa-heart',
    'strength': 'fa-dumbbell',
    'speed': 'fa-tachometer-alt',
    'ninjutsu': 'fa-fire',
    'genjutsu': 'fa-eye',
    'taijutsu': 'fa-fist-raised',
    'handSeals': 'fa-hands-praying',
    'fuinjutsu': 'fa-scroll'
  };
  
  const iconClass = icons[iconType] || 'fa-circle';
  const iconsHtml = Array.from({ length: 5 }, (_, i) => 
    `<i class="fas ${iconClass} stat-icon ${i < value ? 'stat-icon-filled' : 'stat-icon-empty'}"></i>`
  ).join('');
  
  return `
    <div class="stat-row">
      <span class="stat-name">${name}</span>
      <span class="stat-icons">${iconsHtml}</span>
    </div>
  `;
}

function renderRankBadge(rank) {
  const rankLetters = {
    'Genin': 'G',
    'Chunin': 'C',
    'Jonin': 'J',
    'S-Rank': 'S'
  };
  
  return `
    <div class="oc-badge" title="Rank: ${rank}">
      <span style="font-weight: bold; font-size: 1.2rem;">${rankLetters[rank] || '?'}</span>
    </div>
  `;
}

function renderVillageBadge(village) {
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
  
  const img = villageMap[village] ? `images/assets/${villageMap[village]}` : null;
  
  return img ? 
    `<div class="oc-badge" title="Village: ${village}">
      <img src="${img}" alt="${village}">
    </div>` 
    : '<div class="oc-badge"></div>';
}

function renderClanBadge(clanId) {
  // Will be populated dynamically after rendering
  return `<div class="oc-badge" id="clan-badge-${clanId || 'none'}" title="Clan"></div>`;
}

function renderLandBadge(village) {
  const villageToLand = {
    'Konohagakure': { name: 'Land of Fire', kanji: '火の国', bgColor: '#DC143C', textColor: '#FFFFFF' },
    'Konoha': { name: 'Land of Fire', kanji: '火の国', bgColor: '#DC143C', textColor: '#FFFFFF' },
    'Sunagakure': { name: 'Land of Wind', kanji: '風の国', bgColor: '#F0E68C', textColor: '#000000' },
    'Suna': { name: 'Land of Wind', kanji: '風の国', bgColor: '#F0E68C', textColor: '#000000' },
    'Kirigakure': { name: 'Land of Water', kanji: '水の国', bgColor: '#1E90FF', textColor: '#FFFFFF' },
    'Kiri': { name: 'Land of Water', kanji: '水の国', bgColor: '#1E90FF', textColor: '#FFFFFF' },
    'Kumogakure': { name: 'Land of Lightning', kanji: '雷の国', bgColor: '#FFD700', textColor: '#000000' },
    'Kumo': { name: 'Land of Lightning', kanji: '雷の国', bgColor: '#FFD700', textColor: '#000000' },
    'Iwagakure': { name: 'Land of Earth', kanji: '土の国', bgColor: '#8B4513', textColor: '#FFFFFF' },
    'Iwa': { name: 'Land of Earth', kanji: '土の国', bgColor: '#8B4513', textColor: '#FFFFFF' },
    'Amegakure': { name: 'Land of Rain', kanji: '雨の国', bgColor: '#708090', textColor: '#FFFFFF' },
    'Ame': { name: 'Land of Rain', kanji: '雨の国', bgColor: '#708090', textColor: '#FFFFFF' },
    'Otogakure': { name: 'Land of Sound', kanji: '音の国', bgColor: '#9370DB', textColor: '#FFFFFF' },
    'Oto': { name: 'Land of Sound', kanji: '音の国', bgColor: '#9370DB', textColor: '#FFFFFF' },
    'Takigakure': { name: 'Land of Waterfalls', kanji: '滝の国', bgColor: '#87CEEB', textColor: '#000000' },
    'Taki': { name: 'Land of Waterfalls', kanji: '滝の国', bgColor: '#87CEEB', textColor: '#000000' },
    'Yugagakure': { name: 'Land of Hot Water', kanji: '湯の国', bgColor: '#FF6347', textColor: '#FFFFFF' },
    'Yuga': { name: 'Land of Hot Water', kanji: '湯の国', bgColor: '#FF6347', textColor: '#FFFFFF' },
    'Kusagakure': { name: 'Land of Grass', kanji: '草の国', bgColor: '#9ACD32', textColor: '#000000' },
    'Kusa': { name: 'Land of Grass', kanji: '草の国', bgColor: '#9ACD32', textColor: '#000000' },
    'Uzushiogakure': { name: 'Land of Whirlpools', kanji: '渦の国', bgColor: '#191970', textColor: '#FFFFFF' },
    'Uzushio': { name: 'Land of Whirlpools', kanji: '渦の国', bgColor: '#191970', textColor: '#FFFFFF' }
  };
  
  const land = villageToLand[village];
  
  if (land) {
    // Extract only the first character (element kanji)
    const elementKanji = land.kanji.charAt(0);
    return `
      <div class="oc-badge land-badge" title="${land.name}" style="background-color: ${land.bgColor};">
        <span class="land-kanji" style="color: ${land.textColor};">${elementKanji}</span>
      </div>
    `;
  }
  
  return '<div class="oc-badge"></div>';
}

function renderIdentifyingInfo(oc) {
  const info = oc.identifyingInfo || {};
  
  // Combine orientation fields
  const orientation = getOrientation(oc);
  
  // Parse multi-era data
  const ageData = parseMultiEraData(oc.age);
  const heightData = parseMultiEraData(info.height);
  const weightData = parseMultiEraData(info.weight);
  
  return `
    <div class="identifying-info">
      <h1>Identifying Information <i class="japanese-header">識別情報</i></h1>
      <div class="info-grid">
        ${renderInfoRow('Aliases', oc.aliases?.join(', ') || 'None')}
        ${renderInfoRow('Date of Birth', oc.dob || 'Unknown')}
        ${oc.zodiac ? renderInfoRow('Zodiac', oc.zodiac) : ''}
        ${ageData.hasEra ? renderMultiEraRow('Age', ageData) : renderInfoRow('Age', oc.age?.toString() || 'Unknown')}
        ${renderInfoRow('Blood Type', oc.bloodType || 'Unknown')}
        ${renderInfoRow('Gender', oc.gender || 'Unknown')}
        ${orientation ? renderInfoRow('Orientation', orientation) : ''}
        ${renderInfoRow('Chakra Type', oc.chakraType || 'Unknown')}
        ${oc.kekkeiGenkai ? renderInfoRow('Kekkei Genkai', oc.kekkeiGenkai) : ''}
        ${oc.ninjaRegistrationNumber ? renderInfoRow('Ninja Registration Number', oc.ninjaRegistrationNumber) : ''}
        ${oc.academyGraduationAge ? renderInfoRow('Academy Graduation Age', oc.academyGraduationAge) : ''}
        ${oc.classification && oc.classification.length > 0 ? renderInfoRow('Classification', oc.classification.join(', ')) : ''}
        <div class="info-row">
          ${renderInfoContent(info.madeGenin || 'Unknown')}
          ${renderInfoLabel('Made Genin')}
          ${renderInfoContent(info.madeChunin || 'Unknown')}
          ${renderInfoLabel('Made Chunin')}
        </div>
        ${renderInfoRow('Body Type', info.bodyType || 'Unknown')}
        ${heightData.hasEra ? renderMultiEraRow('Height', heightData) : renderInfoRow('Height', info.height || 'Unknown')}
        ${weightData.hasEra ? renderMultiEraRow('Weight', weightData) : renderInfoRow('Weight', info.weight || 'Unknown')}
      </div>
      <div class="rank-section">
        <h2 class="rank-section-title">Missions Completed <i class="japanese-header">完了した任務</i></h2>
        <div class="rank-row">
          ${['S', 'A', 'B', 'C', 'D'].map(rank => {
            const missionCount = oc.missions?.[rank.toLowerCase()] || 0;
            return `
              <div class="rank-badge" data-rank="${rank}" title="${missionCount} ${missionCount === 1 ? 'mission' : 'missions'} completed">
                <span class="rank-letter">${rank}</span>
                <span class="mission-count">${missionCount}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

function getOrientation(oc) {
  const sexual = oc.sexualOrientation;
  const romantic = oc.romanticOrientation;
  
  if (!sexual && !romantic) return null;
  
  const sexualPart = sexual ? (sexual.toLowerCase().endsWith('sexual') ? sexual.toLowerCase() : `${sexual.toLowerCase()}sexual`) : '';
  const romanticPart = romantic ? (romantic.toLowerCase().endsWith('romantic') ? romantic.toLowerCase() : `${romantic.toLowerCase()}romantic`) : '';
  
  const parts = [sexualPart, romanticPart].filter(Boolean);
  
  if (parts.length === 0) return null;
  if (parts.length === 1) return parts[0];
  return parts.join('/');
}

function parseMultiEraData(data) {
  if (!data) {
    return { hasEra: false, content: 'Unknown' };
  }
  
  // Convert to string if it's a number
  const dataStr = typeof data === 'string' ? data : String(data);
  
  // Check if it contains era markers like (Part I), (Part II), etc.
  const eraPattern = /\(([^)]+)\)/g;
  const matches = [...dataStr.matchAll(eraPattern)];
  
  if (matches.length === 0) {
    return { hasEra: false, content: dataStr };
  }
  
  // Split by comma and process each part
  // Format: "149-150 cm (Part I), 156 cm (Part II)"
  const parts = [];
  const segments = dataStr.split(',').map(s => s.trim());
  
  segments.forEach(segment => {
    // Extract era marker from segment like "149-150 cm (Part I)"
    const eraMatch = segment.match(/\(([^)]+)\)/);
    if (eraMatch) {
      // Remove the era marker to get the value
      const value = segment.replace(/\s*\([^)]+\)\s*/, '').trim();
      const era = eraMatch[1];
      if (value) {
        parts.push({ value: value, era: era });
      }
    } else {
      // No era marker in this segment
      parts.push({ value: segment, era: null });
    }
  });
  
  if (parts.length > 0 && parts.some(p => p.era !== null)) {
    return { hasEra: true, parts: parts };
  }
  
  return { hasEra: false, content: dataStr };
}

function renderMultiEraRow(label, data) {
  if (!data.hasEra || !data.parts) {
    return renderInfoRow(label, data.content || 'Unknown');
  }
  
  const eraItems = data.parts.map(part => {
    const eraLabel = part.era ? `<span class="era-label">${part.era}</span>` : '';
    return `<span class="era-item">${part.value} ${eraLabel}</span>`;
  }).join(' / ');
  
  return `
    <div class="info-row multi-era-row">
      <div class="info-content multi-era-content">${eraItems}</div>
      <div class="info-label"><small>${label.toLowerCase()}</small></div>
    </div>
  `;
}

function renderInfoRow(label, content) {
  return `
    <div class="info-row">
      ${renderInfoContent(content)}
      ${renderInfoLabel(label)}
    </div>
  `;
}

function renderInfoContent(content) {
  return `<div class="info-content">${content || 'Content'}</div>`;
}

function renderInfoLabel(label) {
  return `<div class="info-label"><small>${label.toLowerCase()}</small></div>`;
}

function renderBattleStrategy(oc) {
  const strategy = oc.battleStrategy || {};
  
  return `
    <div class="battle-strategy">
      <h3>Battle Strategy <i class="japanese-header">戦略</i></h3>
      <div class="strategy-text">
        <strong>In a team:</strong> ${strategy.inTeam || 'Content'}<br>
        <strong>Alone:</strong> ${strategy.alone || 'Content'}
      </div>
      <div class="strategy-grid">
        <div class="strategy-box">
          <h4>Field Position <i class="japanese-header">陣形</i></h4>
          <div class="strategy-box-content">${strategy.fieldPosition || 'Content'}</div>
        </div>
        <div class="strategy-box">
          <h4>Effective Distance <i class="japanese-header">有効距離</i></h4>
          <div class="strategy-box-content">${strategy.effectiveDistance || 'Content'}</div>
        </div>
        <div class="strategy-box">
          <h4>Specialty <i class="japanese-header">専門</i></h4>
          <div class="strategy-box-content">${strategy.specialty || 'Content'}</div>
        </div>
        <div class="strategy-box">
          <h4>Notable Abilities <i class="japanese-header">特筆すべき能力</i></h4>
          <div class="strategy-box-content">${strategy.notableAbilities || 'Content'}</div>
        </div>
      </div>
    </div>
  `;
}

function renderKnownBehavior(oc) {
  const personality = oc.personality || {};
  
  return `
    <div class="known-behavior">
      <div class="behavior-section">
        <h4>Likes <i class="japanese-header">好き</i></h4>
        <ul class="behavior-list likes">
          ${(personality.likes || []).length > 0 
            ? personality.likes.map(like => `<li>${like}</li>`).join('')
            : '<li>Content</li>'
          }
        </ul>
      </div>
      <div class="behavior-section">
        <h4>Dislikes <i class="japanese-header">嫌い</i></h4>
        <ul class="behavior-list dislikes">
          ${(personality.dislikes || []).length > 0
            ? personality.dislikes.map(dislike => `<li>${dislike}</li>`).join('')
            : '<li>Content</li>'
          }
        </ul>
      </div>
      ${oc.fears && oc.fears.length > 0 ? `
      <div class="behavior-section">
        <h4>Fears / Core Wounds <i class="japanese-header">恐怖・核心的傷</i></h4>
        <ul class="behavior-list fears">
          ${oc.fears.map(fear => `<li>${fear}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
      ${oc.moralAlignment || oc.mbti || oc.enneagram ? `
      <div class="behavior-section">
        <h4>Personality Profile <i class="japanese-header">性格プロフィール</i></h4>
        <div class="personality-profile">
          ${oc.moralAlignment ? `<p><strong>Moral Alignment:</strong> ${oc.moralAlignment}</p>` : ''}
          ${oc.mbti ? `<p><strong>MBTI:</strong> ${oc.mbti}</p>` : ''}
          ${oc.enneagram ? `<p><strong>Enneagram:</strong> ${oc.enneagram}</p>` : ''}
        </div>
      </div>
      ` : ''}
    </div>
  `;
}

function renderRelationships(oc) {
  const relationships = oc.relationships || oc.knownAssociates || [];
  
  if (relationships.length === 0) {
    return '<div class="relationships-empty"><p>No relationships recorded.</p></div>';
  }
  
  const relationshipIcons = {
    'love': '❤️‍🔥',
    'loveInterest': '❤️‍🔥',
    'codependent': '💜',
    'unstable': '💜',
    'closeFriend': '💚',
    'friend': '💚',
    'rival': '💙',
    'family': '💛',
    'clan': '💛',
    'enemy': '🖤',
    'traumatic': '🖤',
    'complicated': '🤎',
    'gray': '🤎',
    'distant': '🤍',
    'limited': '🤍'
  };
  
  return `
    <div class="relationships-grid">
      ${relationships.map(rel => {
        const relationshipType = (rel.relationshipType || rel.type || 'friend').toLowerCase();
        const heartEmoji = relationshipIcons[relationshipType] || relationshipIcons[rel.heartChart] || (rel.heartChart || '🤍');
        const heartChart = rel.heartChart || heartEmoji;
        const name = rel.name || rel.character || 'Unknown';
        const description = rel.description || '';
        const image = rel.image || rel.icon || '';
        const fullName = rel.fullName || name;
        const typeLabel = rel.relationshipType || rel.type || 'Unknown Relationship';
        
        return `
          <div class="relationship-card">
            <div class="relationship-header">
              ${image ? `<img src="${image}" alt="${fullName}" class="relationship-icon">` : `<div class="relationship-icon-placeholder">${heartChart}</div>`}
              <div class="relationship-info">
                <h4 class="relationship-name">${fullName}</h4>
                <div class="relationship-type">
                  <span class="heart-chart">${heartChart}</span>
                  <span class="relationship-label">${typeLabel}</span>
                </div>
              </div>
            </div>
            <div class="relationship-description">
              ${description}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderKnownAssociates(oc) {
  const associates = oc.knownAssociates || [];
  
  if (associates.length === 0) {
    return '<div><p>No known associates recorded.</p></div>';
  }
  
  return `
    <div>
      <h3>Known Associates <i class="japanese-header">既知の関係者</i></h3>
      ${associates.map(assoc => `
        <div style="margin-bottom: 1rem; padding: 1rem; background-color: var(--color-bg-1); border: 1px solid var(--color-dark-3);">
          ${assoc.image ? `<img src="${assoc.image}" style="width: 100px; height: 100px; float: left; margin-right: 1rem; border: 2px solid var(--color-dark-3);">` : ''}
          <strong>${assoc.name || 'Unknown'}</strong>
          <p>${assoc.description || ''}</p>
        </div>
      `).join('')}
    </div>
  `;
}

function renderDemeanor(oc) {
  const demeanor = oc.personality?.demeanor || {};
  const traits = [
    'charisma', 'extraversion', 'energy', 'empathy', 'impulsivity',
    'neuroticism', 'intuition', 'observation', 'sensitivity',
    'generosity', 'respectForAuthority'
  ];
  
  return `
    <div class="demeanor-section">
      ${traits.map(trait => {
        const value = demeanor[trait] || 3;
        return `
          <div class="demeanor-row">
            <div class="demeanor-name">${trait.replace(/([A-Z])/g, ' $1').toLowerCase()}</div>
            <div class="demeanor-rating">
              ${Array.from({ length: 5 }, (_, i) => 
                `<span class="rating-circle ${i < value ? 'filled' : ''}"></span>`
              ).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderAbilities(oc) {
  const abilities = oc.abilities || {};
  
  let html = '';
  
  if (abilities.taijutsu && abilities.taijutsu.length > 0) {
    html += abilities.taijutsu.map(tai => `
      <div class="ability-section">
        <h3 class="ability-header">Taijutsu <i class="japanese-header">体術</i></h3>
        <div class="ability-content">
          <div class="ability-style">Style: ${tai.style || 'Content'}</div>
          <div style="font-size: 12px; border-top: 1px solid var(--color-dark-3); padding-top: 0.5rem;">
            <span>Base Style: ${tai.baseStyle || 'Content'}</span>
          </div>
          <div style="font-size: 12px; border-bottom: 1px solid var(--color-dark-3); padding: 0.5rem 0;">
            <span>Mastery: </span>
            <span>${renderRatingStars(tai.mastery || 3)}</span>
          </div>
          <p class="ability-description">${tai.description || ''}</p>
        </div>
      </div>
    `).join('');
  }
  
  if (abilities.ninjutsu && abilities.ninjutsu.length > 0) {
    html += abilities.ninjutsu.map(nin => `
      <div class="ability-section">
        <h3 class="ability-header">Ninjutsu <i class="japanese-header">忍術</i></h3>
        <div class="ability-content">
          <div class="ability-style">Style: ${nin.style || 'Content'} <small style="float: right;">${nin.rank || 'C'}</small></div>
          <div style="font-size: 12px; border-top: 1px solid var(--color-dark-3); padding-top: 0.5rem;">
            <span>Difficulty: ${renderRatingStars(nin.difficulty || 3)}</span>
          </div>
          <div style="font-size: 12px; border-bottom: 1px solid var(--color-dark-3); padding: 0.5rem 0;">
            <span>Chakra Intensity: ${renderRatingStars(nin.chakraIntensity || 3)}</span>
          </div>
          <p class="ability-description">${nin.description || ''}</p>
        </div>
      </div>
    `).join('');
  }
  
  return html || '<p>No abilities recorded.</p>';
}

function renderGallery(oc) {
  const gallery = oc.gallery || [];
  
  if (gallery.length === 0) {
    return '<p>No images in gallery.</p>';
  }
  
  // Generate unique ID for this gallery
  const galleryId = `gallery-${oc.id || Date.now()}`;
  
  const galleryHtml = gallery.map((item, index) => {
    // Support both string (image URL) and object (image URL + caption/title)
    const imageUrl = typeof item === 'string' ? item : (item.url || item.image || '');
    const caption = typeof item === 'object' && item.caption ? item.caption : '';
    const title = typeof item === 'object' && item.title ? item.title : '';
    
    return `
      <div class="gallery-item" onclick="openGalleryLightbox('${galleryId}', ${index})">
        <img src="${imageUrl}" alt="${caption || title || `Gallery image ${index + 1}`}" loading="lazy">
        ${caption || title ? `<div class="gallery-item-caption">${caption || title}</div>` : ''}
      </div>
    `;
  }).join('');
  
  // Store gallery data for lightbox
  if (!window.galleryData) {
    window.galleryData = {};
  }
  window.galleryData[galleryId] = gallery;
  
  return `
    <div class="gallery-container" id="${galleryId}">
      <div class="gallery-grid">
        ${galleryHtml}
      </div>
    </div>
    
    <!-- Lightbox Modal -->
    <div id="${galleryId}-lightbox" class="gallery-lightbox" onclick="closeGalleryLightbox('${galleryId}')">
      <div class="gallery-lightbox-content" onclick="event.stopPropagation()">
        <button class="gallery-lightbox-close" onclick="closeGalleryLightbox('${galleryId}')" aria-label="Close">
          <i class="fas fa-times"></i>
        </button>
        <button class="gallery-lightbox-prev" onclick="navigateGallery('${galleryId}', -1)" aria-label="Previous">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="gallery-lightbox-next" onclick="navigateGallery('${galleryId}', 1)" aria-label="Next">
          <i class="fas fa-chevron-right"></i>
        </button>
        <img id="${galleryId}-lightbox-image" src="" alt="" class="gallery-lightbox-image">
        <div class="gallery-lightbox-caption" id="${galleryId}-lightbox-caption"></div>
        <div class="gallery-lightbox-counter" id="${galleryId}-lightbox-counter"></div>
      </div>
    </div>
  `;
}

function renderRatingStars(value) {
  return Array.from({ length: 5 }, (_, i) => 
    `<span style="color: ${i < value ? '#FFD700' : '#ccc'};">★</span>`
  ).join('');
}

function renderHistoryEntry(title, content) {
  const id = title.toLowerCase().replace(' ', '-');
  return `
    <div class="history-entry">
      <div class="history-entry-header" onclick="toggleCollapse('history-${id}')">
        ${title}
        <i class="fas fa-chevron-down bounce-arrow"></i>
      </div>
      <div id="history-${id}" class="history-entry-content">
        <p>${content || 'Content not available.'}</p>
      </div>
    </div>
  `;
}

function renderGearItem(gear) {
  return `
    <div class="gear-item">
      <div>
        <div class="gear-icon">⚔</div>
        <span class="gear-name">${gear.name || 'Item Name'}</span>
      </div>
      <div class="gear-category">
        ${gear.category || 'Category'} <small><em>${gear.material || ''}</em></small>. ${gear.use || ''}
      </div>
      ${gear.info && gear.info.length > 0 ? `
        <ul class="gear-info">
          ${gear.info.map(info => `<li>${info}</li>`).join('')}
        </ul>
      ` : ''}
    </div>
  `;
}

