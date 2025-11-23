// OC Detail Component - Full Data Book style character sheet renderer

import { natureReleases, getNatureRelease, getClanSymbol, getTechniqueTypeLabel, allTechniqueTypes } from '../data/options.js';
import storage from '../data/storage.js';
import { renderMarkdown } from '../utils/markdown.js';
import { convertImageUrl } from '../utils/imageUtils.js';
import { getMoralAlignmentDescription, getMBTIDescription, getEnneagramDescription, getEnneagramWingExplanation } from '../utils/personalityDescriptions.js';

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
      <!-- Edit Button -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 1rem;">
        <button class="btn-naruto" onclick="window.editOC('${oc.id}')" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
          <i class="fas fa-edit"></i> Edit
        </button>
      </div>
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
        </div>
        
        ${renderProfileImageWithEras(oc)}
        
        <div class="oc-badges" id="oc-badges-container">
          ${renderAllBadges(oc)}
        </div>
        
        <div class="oc-stats">
          ${renderStatsWithEras(oc)}
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
        <i class="fas fa-users" style="margin-right: 0.5rem;"></i> Relationships <i class="japanese-header">関係</i>
        <i class="fas fa-chevron-down bounce-arrow"></i>
      </div>
      <div id="relationships-content" class="collapsible-content">
        ${renderRelationships(oc)}
      </div>
    </div>
    
    <div id="family-collapse" class="collapsible-section">
      <div class="collapsible-header" onclick="toggleCollapse('family-content')">
        <i class="fas fa-home" style="margin-right: 0.5rem;"></i> Family <i class="japanese-header">家族</i>
        <i class="fas fa-chevron-down bounce-arrow"></i>
      </div>
      <div id="family-content" class="collapsible-content">
        ${renderFamily(oc)}
      </div>
    </div>
    
    <div id="physical-appearance-collapse" class="collapsible-section">
      <div class="collapsible-header" onclick="toggleCollapse('physical-appearance-content')">
        <i class="fas fa-user" style="margin-right: 0.5rem;"></i> Physical Appearance <i class="japanese-header">外見</i>
        <i class="fas fa-chevron-down bounce-arrow"></i>
      </div>
      <div id="physical-appearance-content" class="collapsible-content">
        ${renderPhysicalAppearance(oc)}
      </div>
    </div>
    
    <div id="appearance-by-era-collapse" class="collapsible-section">
      <div class="collapsible-header" onclick="toggleCollapse('appearance-by-era-content')">
        <i class="fas fa-history" style="margin-right: 0.5rem;"></i> Appearance by Era <i class="japanese-header">時代別の外見</i>
        <i class="fas fa-chevron-down bounce-arrow"></i>
      </div>
      <div id="appearance-by-era-content" class="collapsible-content">
        ${renderAppearanceByEra(oc)}
      </div>
    </div>
    
    <div id="affiliations-collapse" class="collapsible-section">
      <div class="collapsible-header" onclick="toggleCollapse('affiliations-content')">
        <i class="fas fa-flag" style="margin-right: 0.5rem;"></i> Affiliations <i class="japanese-header">所属</i>
        <i class="fas fa-chevron-down bounce-arrow"></i>
      </div>
      <div id="affiliations-content" class="collapsible-content">
        ${renderAffiliations(oc)}
      </div>
    </div>
    
    <div id="personality-collapse" class="collapsible-section">
      <div class="collapsible-header" onclick="toggleCollapse('personality-content')">
        <i class="fas fa-brain" style="margin-right: 0.5rem;"></i> Known Behavior <i class="japanese-header">既知の行動</i>
        <i class="fas fa-chevron-down bounce-arrow"></i>
      </div>
      <div id="personality-content" class="collapsible-content">
        ${renderKnownBehavior(oc)}
      </div>
    </div>
    
    <div id="abilities-collapse" class="collapsible-section">
      <div class="collapsible-header" onclick="toggleCollapse('abilities-content')">
        <i class="fas fa-fire" style="margin-right: 0.5rem;"></i> Abilities & Techniques <i class="japanese-header">能力と術</i>
        <i class="fas fa-chevron-down bounce-arrow"></i>
      </div>
      <div id="abilities-content" class="collapsible-content">
        ${renderAbilities(oc)}
      </div>
    </div>
    
    <div id="demeanor-collapse" class="collapsible-section">
      <div class="collapsible-header" onclick="toggleCollapse('demeanor-content')">
        <i class="fas fa-smile" style="margin-right: 0.5rem;"></i> Demeanor <i class="japanese-header">態度</i>
        <i class="fas fa-chevron-down bounce-arrow"></i>
      </div>
      <div id="demeanor-content" class="collapsible-content">
        ${renderDemeanor(oc)}
      </div>
    </div>
    
    <div class="appearance-section">
      <h1><i class="fas fa-tshirt" style="margin-right: 0.5rem;"></i> Appearance & Gear <i class="japanese-header">外見と装備</i></h1>
      ${oc.appearance?.image ? (
        oc.appearance.image.startsWith('fa-') || oc.appearance.image.startsWith('fas ') || oc.appearance.image.startsWith('far ') || oc.appearance.image.startsWith('fab ') ?
          `<div class="appearance-image-container"><div class="appearance-icon"><i class="${oc.appearance.image}"></i></div></div>` :
          `<div class="appearance-image-container"><img src="${convertImageUrl(oc.appearance.image)}" alt="Appearance" class="appearance-image"></div>`
      ) : ''}
      ${oc.appearance?.colors && oc.appearance.colors.length > 0 ? `
        <div class="color-palette-container">
          <div class="color-palette-label">Color Palette</div>
          <div class="color-palette">
            ${oc.appearance.colors.map(color => {
              // Normalize color for display - ensure it's a valid CSS color
              const normalizedColor = color ? color.trim() : '';
              if (!normalizedColor) return '';
              
              // If it's a hex code without #, add it
              const displayColor = /^[0-9A-Fa-f]{3,8}$/.test(normalizedColor) && !normalizedColor.startsWith('#') 
                ? `#${normalizedColor}` 
                : normalizedColor;
              
              return `<div class="color-swatch" style="background-color: ${displayColor};" title="${displayColor}"></div>`;
            }).filter(html => html).join('')}
          </div>
        </div>
      ` : ''}
      ${oc.appearance?.gear && oc.appearance.gear.length > 0 ? `
        <div class="gear-grid">
          ${oc.appearance.gear.map(gear => {
            // Handle both string and object formats
            if (typeof gear === 'string') {
              return renderGearItem({ name: gear, category: 'Item', material: '', use: '', information: [] });
            }
            return renderGearItem(gear);
          }).join('')}
        </div>
      ` : (!oc.appearance?.gear || oc.appearance.gear.length === 0 ? '<p style="color: var(--color-text-dark-2); font-style: italic; padding: 1rem;">No gear items recorded.</p>' : '')}
    </div>
    
      <div id="record-history-collapse" class="collapsible-section">
        <div class="collapsible-header" onclick="toggleCollapse('record-history-content')">
          <i class="fas fa-scroll" style="margin-right: 0.5rem;"></i> Record History <i class="japanese-header">記録履歴</i>
          <i class="fas fa-chevron-down bounce-arrow"></i>
        </div>
        <div id="record-history-content" class="collapsible-content">
          ${renderRecordHistory(oc)}
        </div>
      </div>
      
      <div id="other-media-collapse" class="collapsible-section">
        <div class="collapsible-header" onclick="toggleCollapse('other-media-content')">
          <i class="fas fa-film" style="margin-right: 0.5rem;"></i> In Other Media <i class="japanese-header">その他のメディア</i>
          <i class="fas fa-chevron-down bounce-arrow"></i>
        </div>
        <div id="other-media-content" class="collapsible-content">
          ${(() => {
            const otherMedia = oc.otherMedia || {};
            const novels = otherMedia.novel || [];
            const games = otherMedia.game || [];
            const ovas = otherMedia.ova || [];
            const movies = otherMedia.movies || [];
            const nonCanon = otherMedia.nonCanon || [];
            
            return `
              <div style="margin-bottom: 1rem;">
                <h4>Novel Appearances</h4>
                ${novels.length > 0 ? `
                  <ul style="list-style-type: disc; padding-left: 1.5rem;">
                    ${novels.map(novel => `<li>${novel}</li>`).join('')}
                  </ul>
                ` : '<p style="color: var(--color-text-dark-2); font-style: italic; padding-left: 1.5rem;">Not specified</p>'}
              </div>
              <div style="margin-bottom: 1rem;">
                <h4>Game Appearances</h4>
                ${games.length > 0 ? `
                  <ul style="list-style-type: disc; padding-left: 1.5rem;">
                    ${games.map(game => `<li>${game}</li>`).join('')}
                  </ul>
                ` : '<p style="color: var(--color-text-dark-2); font-style: italic; padding-left: 1.5rem;">Not specified</p>'}
              </div>
              <div style="margin-bottom: 1rem;">
                <h4>OVA Appearances</h4>
                ${ovas.length > 0 ? `
                  <ul style="list-style-type: disc; padding-left: 1.5rem;">
                    ${ovas.map(ova => `<li>${ova}</li>`).join('')}
                  </ul>
                ` : '<p style="color: var(--color-text-dark-2); font-style: italic; padding-left: 1.5rem;">Not specified</p>'}
              </div>
              <div style="margin-bottom: 1rem;">
                <h4>Movie Appearances</h4>
                ${movies.length > 0 ? `
                  <ul style="list-style-type: disc; padding-left: 1.5rem;">
                    ${movies.map(movie => `<li>${movie}</li>`).join('')}
                  </ul>
                ` : '<p style="color: var(--color-text-dark-2); font-style: italic; padding-left: 1.5rem;">Not specified</p>'}
              </div>
              <div style="margin-bottom: 1rem;">
                <h4>Non-Canon Events</h4>
                ${nonCanon.length > 0 ? `
                  <ul style="list-style-type: disc; padding-left: 1.5rem;">
                    ${nonCanon.map(nonCanonItem => `<li>${nonCanonItem}</li>`).join('')}
                  </ul>
                ` : '<p style="color: var(--color-text-dark-2); font-style: italic; padding-left: 1.5rem;">Not specified</p>'}
              </div>
            `;
          })()}
        </div>
      </div>
      
      <div class="media-section">
        <h3><i class="fas fa-ellipsis-h" style="margin-right: 0.5rem;"></i> Miscellaneous <i class="japanese-header">その他</i></h3>
        ${oc.themeSong || oc.themeSongLink ? `
        <p><strong>Theme Song:</strong> 
          ${oc.themeSong ? oc.themeSong : ''}
          ${oc.themeSongLink ? ` <a href="${oc.themeSongLink}" target="_blank" rel="noopener noreferrer" style="color: var(--color-accent-2); text-decoration: underline;">🔗 Listen</a>` : ''}
        </p>
        ` : ''}
        ${oc.voiceActors?.japanese || oc.voiceActors?.english ? `
        <p><strong>Voice Actors:</strong>
          ${oc.voiceActors.japanese ? `JP: ${oc.voiceActors.japanese}` : ''}
          ${oc.voiceActors.japanese && oc.voiceActors.english ? ' • ' : ''}
          ${oc.voiceActors.english ? `EN: ${oc.voiceActors.english}` : ''}
        </p>
        ` : ''}
        ${oc.quotes && oc.quotes.length > 0 ? `
        <div style="margin-top: 1rem;">
          <h4>Quotes <i class="japanese-header">名言</i></h4>
          <ul style="list-style-type: none; padding-left: 0;">
            ${oc.quotes.map(quote => `<li style="margin-bottom: 0.5rem; font-style: italic;">${quote}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
        ${oc.voiceLines && oc.voiceLines.length > 0 ? `
        <div style="margin-top: 1rem;">
          <h4>Voice Lines <i class="japanese-header">ボイスライン</i></h4>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${oc.voiceLines.map((voiceLine, index) => {
              const quote = typeof voiceLine === 'string' ? voiceLine : (voiceLine.quote || voiceLine.text || '');
              const mediaUrl = typeof voiceLine === 'object' ? (voiceLine.mediaUrl || voiceLine.videoUrl || voiceLine.audioUrl || '') : '';
              const mediaType = typeof voiceLine === 'object' ? (voiceLine.mediaType || '') : '';
              
              // Detect media type from URL if not specified
              let detectedType = mediaType;
              if (!detectedType && mediaUrl) {
                if (mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be')) {
                  detectedType = 'video';
                } else if (mediaUrl.match(/\.(mp4|webm|ogg|mov)$/i)) {
                  detectedType = 'video';
                } else if (mediaUrl.match(/\.(mp3|wav|ogg|m4a|aac)$/i)) {
                  detectedType = 'audio';
                }
              }
              
              // Convert YouTube URL to embed format
              let embedUrl = mediaUrl;
              if (mediaUrl && (mediaUrl.includes('youtube.com/watch') || mediaUrl.includes('youtu.be'))) {
                const youtubeId = mediaUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
                if (youtubeId) {
                  embedUrl = `https://www.youtube.com/embed/${youtubeId}`;
                  detectedType = 'video';
                }
              }
              
              let mediaHtml = '';
              if (embedUrl) {
                if (detectedType === 'video' || (!detectedType && embedUrl.includes('youtube'))) {
                  mediaHtml = `
                    <div style="margin-top: 0.5rem;">
                      <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: 4px; background: var(--color-bg-2);">
                        <iframe src="${embedUrl}" 
                                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen></iframe>
                      </div>
                    </div>
                  `;
                } else if (detectedType === 'audio' || (!detectedType && embedUrl.match(/\.(mp3|wav|ogg|m4a|aac)$/i))) {
                  mediaHtml = `
                    <div style="margin-top: 0.5rem;">
                      <audio controls style="width: 100%; max-width: 500px;">
                        <source src="${embedUrl}" type="audio/mpeg">
                        <source src="${embedUrl}" type="audio/wav">
                        <source src="${embedUrl}" type="audio/ogg">
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  `;
                } else {
                  // Default to video player for unknown types
                  mediaHtml = `
                    <div style="margin-top: 0.5rem;">
                      <video controls style="width: 100%; max-width: 500px; border-radius: 4px;">
                        <source src="${embedUrl}" type="video/mp4">
                        <source src="${embedUrl}" type="video/webm">
                        <source src="${embedUrl}" type="video/ogg">
                        Your browser does not support the video element.
                      </video>
                    </div>
                  `;
                }
              }
              
              return `
                <div style="padding: 1rem; background-color: rgba(227, 94, 63, 0.05); border-radius: 4px; border-left: 3px solid var(--color-accent-2);">
                  ${quote ? `<p style="margin-bottom: ${mediaUrl ? '0.5rem' : '0'}; font-style: italic; color: var(--color-text-dark-2);">"${quote}"</p>` : ''}
                  ${mediaHtml}
                </div>
              `;
            }).join('')}
          </div>
        </div>
        ` : ''}
        ${oc.trivia ? `
        <div style="margin-top: 1rem;">
          <h4>Trivia <i class="japanese-header">トリビア</i></h4>
          <p style="white-space: pre-line;">${oc.trivia}</p>
        </div>
        ` : ''}
      </div>
      
    <div id="gallery-collapse" class="collapsible-section">
      <div class="collapsible-header" onclick="toggleCollapse('gallery-content')">
        <i class="fas fa-images" style="margin-right: 0.5rem;"></i> Gallery <i class="japanese-header">ギャラリー</i>
        <i class="fas fa-chevron-down bounce-arrow"></i>
      </div>
      <div id="gallery-content" class="collapsible-content">
        ${oc.gallery && oc.gallery.length > 0 ? renderGallery(oc) : '<div class="relationships-empty"><p>No images in gallery.</p></div>'}
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
  
  // Make switchEraTab available globally
  window.switchEraTab = (era) => {
    // Store current view state (radar or list) before switching
    const previousPanel = container.querySelector('.stat-era-panel.active');
    let isRadarView = false;
    if (previousPanel) {
      const prevRadarContainer = previousPanel.querySelector('.radar-chart-container');
      const prevStatsList = previousPanel.querySelector('.stats-list-container');
      if (prevRadarContainer && prevRadarContainer.style.display !== 'none') {
        isRadarView = true;
      }
    }
    
    // Update tabs
    const tabs = container.querySelectorAll('.stat-era-tab');
    tabs.forEach(tab => {
      if (tab.dataset.era === era) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    
    // Update panels
    const panels = container.querySelectorAll('.stat-era-panel');
    const eraId = era.replace(/\s+/g, '-');
    panels.forEach(panel => {
      if (panel.id === `era-panel-${eraId}`) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
    
    // If radar chart is visible, update it with new era data
    const radarContainer = document.getElementById('detail-radar-chart-container');
    if (radarContainer && radarContainer.style.display !== 'none') {
      window.renderDetailRadarChart(eraId);
    }
  };
  
  // Radar chart functions for detail view
  window.toggleDetailStatsView = function() {
    const radarContainer = document.getElementById('detail-radar-chart-container');
    if (!radarContainer) return;
    
    // Get current era
    const statsContainer = document.querySelector('.oc-stats');
    let eraId = 'default';
    
    if (statsContainer) {
      const statsEraContainer = statsContainer.querySelector('.stats-era-container');
      if (statsEraContainer) {
        const activePanel = statsContainer.querySelector('.stat-era-panel.active');
        if (activePanel) {
          eraId = activePanel.id.replace('era-panel-', '');
        }
      }
    }
    
    const toggleIcon = document.getElementById('detail-stats-view-icon');
    const toggleText = document.getElementById('detail-stats-view-text');
    
    const isRadarVisible = radarContainer.style.display !== 'none';
    
    if (isRadarVisible) {
      // Hide radar chart
      radarContainer.style.display = 'none';
      toggleIcon.className = 'fas fa-chart-line';
      toggleText.textContent = 'Show Radar Chart';
    } else {
      // Show radar chart
      radarContainer.style.display = 'block';
      toggleIcon.className = 'fas fa-list';
      toggleText.textContent = 'Hide Radar Chart';
      
      // Render the radar chart
      window.renderDetailRadarChart(eraId);
    }
  };
  
  window.renderDetailRadarChart = function(eraId) {
    const canvas = document.getElementById('detail-radar-canvas');
    if (!canvas) return;
    
    const oc = window.currentOC || {};
    let stats;
    
    if (eraId === 'default') {
      // Default stats (no eras)
      stats = oc.stats || {};
    } else {
      // Era-based stats - convert eraId back to era name
      const eraName = eraId.replace(/-/g, ' ');
      stats = oc.statsByEra?.[eraName] || oc.stats || {};
    }
    
    // Set responsive size - ensure labels have plenty of room
    const parentContainer = canvas.parentElement;
    const containerWidth = parentContainer ? parentContainer.clientWidth : 800;
    // Use very conservative sizing with lots of padding to ensure labels never cut off
    const maxSize = Math.min(500, Math.max(350, containerWidth - 200)); // Much more padding (200px)
    canvas.width = maxSize;
    canvas.height = maxSize;
    canvas.style.width = maxSize + 'px';
    canvas.style.height = maxSize + 'px';
    
    const ctx = canvas.getContext('2d');
    const size = Math.min(canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    // Increase radius slightly since labels will be closer
    const radius = size * 0.32;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Stat labels
    const statLabels = {
      intelligence: 'Intelligence',
      stamina: 'Stamina',
      strength: 'Strength',
      speed: 'Speed',
      ninjutsu: 'Ninjutsu',
      genjutsu: 'Genjutsu',
      taijutsu: 'Taijutsu',
      handSeals: 'Hand Seals',
      fuinjutsu: 'Fuinjutsu'
    };
    
    const STAT_NAMES = ['intelligence', 'stamina', 'strength', 'speed', 'ninjutsu', 'genjutsu', 'taijutsu', 'handSeals', 'fuinjutsu'];
    const numStats = STAT_NAMES.length;
    const angleStep = (2 * Math.PI) / numStats;
    
    // Draw polygonal grid - green background with straight lines
    // Fill background with green
    ctx.fillStyle = '#506D63'; // Green background
    ctx.beginPath();
    // Draw outer polygon
    for (let i = 0; i < numStats; i++) {
      const angle = (i * angleStep) - (Math.PI / 2);
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
    
    // Draw inner grid levels (polygonal shapes) - lighter green lines for contrast
    ctx.strokeStyle = '#6B8E7A'; // Lighter green for grid lines
    ctx.lineWidth = 1.5;
    for (let level = 1; level <= 5; level++) {
      const levelRadius = (radius * level) / 5;
      ctx.beginPath();
      for (let i = 0; i < numStats; i++) {
        const angle = (i * angleStep) - (Math.PI / 2);
        const x = centerX + Math.cos(angle) * levelRadius;
        const y = centerY + Math.sin(angle) * levelRadius;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();
    }
    
    // Draw stat labels - white color with dark stroke for better readability
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#1a1a1a'; // Dark stroke for better contrast
    ctx.lineWidth = 4; // Thicker stroke for better readability
    const fontSize = Math.max(14, Math.min(20, size / 25)); // Larger font size
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    STAT_NAMES.forEach((statName, i) => {
      const angle = (i * angleStep) - (Math.PI / 2);
      // Position labels much closer to the chart edge
      const labelRadius = radius + (size * 0.06);
      const x = centerX + Math.cos(angle) * labelRadius;
      const y = centerY + Math.sin(angle) * labelRadius;
      // Draw text with dark stroke first, then white fill for better readability
      ctx.strokeText(statLabels[statName] || statName, x, y);
      ctx.fillText(statLabels[statName] || statName, x, y);
    });
    
    // Draw stat area - slightly transparent red
    ctx.fillStyle = 'rgba(220, 38, 38, 0.85)'; // Slightly transparent red fill
    ctx.strokeStyle = '#dc2626'; // Red border
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    STAT_NAMES.forEach((statName, i) => {
      const value = stats[statName] || 0;
      const normalizedValue = value / 5; // Normalize to 0-1
      const angle = (i * angleStep) - (Math.PI / 2);
      const r = radius * normalizedValue;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };
  
  // Make switchProfileImageEraTab available globally
  window.switchProfileImageEraTab = (era) => {
    // Update tabs
    const tabs = container.querySelectorAll('.profile-image-era-tab');
    tabs.forEach(tab => {
      if (tab.dataset.era === era) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    
    // Update panels
    const panels = container.querySelectorAll('.profile-image-era-panel');
    const eraId = era.replace(/\s+/g, '-');
    panels.forEach(panel => {
      if (panel.id === `profile-image-era-panel-${eraId}`) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
  };
  
  // Load clan badge images if clans exist, otherwise show kunai
  import('../data/storage.js').then(module => {
    // Handle backward compatibility: convert single values to arrays
    const clanIds = Array.isArray(oc.clanId) ? oc.clanId : (oc.clanId ? [oc.clanId] : []);
    const clanNames = Array.isArray(oc.clanName) ? oc.clanName : (oc.clanName ? [oc.clanName] : []);
    
    // Find all clan badge containers
    const badgeContainers = container.querySelectorAll('[id^="clan-badge-"]');
    
    badgeContainers.forEach((badgeContainer, index) => {
      const clanId = badgeContainer.getAttribute('data-clan-id');
      const clanName = badgeContainer.getAttribute('data-clan-name');
      
      let finalClanName = '';
      let symbolUrl = null;
      
      if (clanId) {
        // User-created clan - get from storage
        const clan = module.default.getClan(clanId);
        if (clan) {
          finalClanName = clan.name;
          symbolUrl = clan.symbol;
        }
      } else if (clanName) {
        // Predefined clan or custom clan name
        finalClanName = clanName;
        const predefinedClan = getClanSymbol(clanName);
        if (predefinedClan) {
          symbolUrl = predefinedClan.symbolUrl;
        }
      }
      
      if (finalClanName && symbolUrl) {
        badgeContainer.innerHTML = `<img src="${symbolUrl}" alt="${finalClanName}">`;
        badgeContainer.setAttribute('title', `Clan: ${finalClanName}`);
      } else if (finalClanName) {
        // Clan name exists but no symbol - use kunai with clan name in title
        badgeContainer.innerHTML = `<img src="images/assets/kunai.png" alt="No Clan Symbol">`;
        badgeContainer.setAttribute('title', `Clan: ${finalClanName}`);
      } else {
        // No clan, use kunai
        badgeContainer.innerHTML = `<img src="images/assets/kunai.png" alt="No Clan">`;
        badgeContainer.setAttribute('title', 'No Clan');
      }
    });
  });
  
  // Setup gallery lightbox functions
  setupGalleryLightbox();
  
  // Store current OC for radar chart access
  window.currentOC = oc;
  
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
    const rawImageUrl = typeof item === 'string' ? item : (item.url || item.image || '');
    const imageUrl = convertImageUrl(rawImageUrl);
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

function renderStatsWithEras(oc) {
  const eras = ['Part I', 'Part II', 'Blank Period', 'Gaiden', 'Boruto'];
  
  // Check if statsByEra exists and has data
  const hasEraStats = oc.statsByEra && Object.keys(oc.statsByEra).some(era => {
    const eraStats = oc.statsByEra[era];
    return eraStats && Object.values(eraStats).some(val => val > 0);
  });
  
  // If no era stats exist, use default stats
  if (!hasEraStats) {
    const defaultStats = oc.stats || {};
    return `
      <div class="stats-list-container" id="detail-stats-list-container">
        ${renderStat('Intelligence', defaultStats.intelligence || 0, 'intelligence')}
        ${renderStat('Stamina', defaultStats.stamina || 0, 'stamina')}
        ${renderStat('Strength', defaultStats.strength || 0, 'strength')}
        ${renderStat('Speed', defaultStats.speed || 0, 'speed')}
        ${renderStat('Ninjutsu', defaultStats.ninjutsu || 0, 'ninjutsu')}
        ${renderStat('Genjutsu', defaultStats.genjutsu || 0, 'genjutsu')}
        ${renderStat('Taijutsu', defaultStats.taijutsu || 0, 'taijutsu')}
        ${renderStat('Hand Seals', defaultStats.handSeals || 0, 'handSeals')}
        ${renderStat('Fuinjutsu', defaultStats.fuinjutsu || 0, 'fuinjutsu')}
      </div>
    `;
  }
  
  // Generate era tabs and stat panels
  const eraTabs = eras.map((era, index) => `
    <button class="stat-era-tab ${index === 0 ? 'active' : ''}" 
            onclick="switchEraTab('${era}')" 
            data-era="${era}">
      ${era}
    </button>
  `).join('');
  
  const eraPanels = eras.map((era, index) => {
    const eraStats = oc.statsByEra?.[era] || oc.stats || {};
    const isActive = index === 0 ? 'active' : '';
    const eraId = era.replace(/\s+/g, '-');
    return `
      <div class="stat-era-panel ${isActive}" id="era-panel-${eraId}">
        <div class="stats-list-container" id="detail-stats-list-${eraId}">
          ${renderStat('Intelligence', eraStats.intelligence || 0, 'intelligence')}
          ${renderStat('Stamina', eraStats.stamina || 0, 'stamina')}
          ${renderStat('Strength', eraStats.strength || 0, 'strength')}
          ${renderStat('Speed', eraStats.speed || 0, 'speed')}
          ${renderStat('Ninjutsu', eraStats.ninjutsu || 0, 'ninjutsu')}
          ${renderStat('Genjutsu', eraStats.genjutsu || 0, 'genjutsu')}
          ${renderStat('Taijutsu', eraStats.taijutsu || 0, 'taijutsu')}
          ${renderStat('Hand Seals', eraStats.handSeals || 0, 'handSeals')}
          ${renderStat('Fuinjutsu', eraStats.fuinjutsu || 0, 'fuinjutsu')}
        </div>
      </div>
    `;
  }).join('');
  
  return `
    <div class="stats-era-container">
      <div class="stats-era-tabs">
        ${eraTabs}
      </div>
      <div class="stats-era-content">
        ${eraPanels}
      </div>
    </div>
  `;
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
  const numValue = parseFloat(value) || 0;
  
  // Generate icons with support for half values
  const iconsHtml = Array.from({ length: 5 }, (_, i) => {
    const iconIndex = i + 1; // 1-based index (1, 2, 3, 4, 5)
    let iconState = 'stat-icon-empty';
    let isHalf = false;
    
    if (iconIndex <= Math.floor(numValue)) {
      // Fully filled
      iconState = 'stat-icon-filled';
    } else if (iconIndex === Math.ceil(numValue) && numValue % 1 !== 0) {
      // Half filled (e.g., if value is 2.5, iconIndex 3 should be half)
      iconState = 'stat-icon-half';
      isHalf = true;
    }
    
    if (isHalf) {
      // For half-filled icons, use a wrapper with two icons
      return `<span class="stat-icon-wrapper stat-icon-half-wrapper">
        <i class="fas ${iconClass} stat-icon stat-icon-empty"></i>
        <i class="fas ${iconClass} stat-icon stat-icon-filled stat-icon-half-overlay"></i>
      </span>`;
    } else {
      return `<i class="fas ${iconClass} stat-icon ${iconState}"></i>`;
    }
  }).join('');
  
  return `
    <div class="stat-row">
      <span class="stat-name">${name}</span>
      <span class="stat-icons">${iconsHtml}</span>
    </div>
  `;
}

function renderAllBadges(oc) {
  // Collect all badges (excluding rank)
  const allBadges = [];
  
  // Get village badges
  const villages = Array.isArray(oc.village) ? oc.village : (oc.village ? [oc.village] : []);
  const villageMap = {
    'Konohagakure': 'konoha.png', 'Konoha': 'konoha.png',
    'Sunagakure': 'suna.png', 'Suna': 'suna.png',
    'Kirigakure': 'kiri.png', 'Kiri': 'kiri.png',
    'Kumogakure': 'kumo.png', 'Kumo': 'kumo.png',
    'Iwagakure': 'iwa.png', 'Iwa': 'iwa.png',
    'Amegakure': 'ame.png', 'Ame': 'ame.png',
    'Otogakure': 'oto.png', 'Oto': 'oto.png',
    'Takigakure': 'taki.png', 'Taki': 'taki.png',
    'Yugagakure': 'yuga.png', 'Yuga': 'yuga.png',
    'Kusagakure': 'kusa.png', 'Kusa': 'kusa.png',
    'Uzushiogakure': 'uzu.png', 'Uzushio': 'uzu.png'
  };
  
  villages.forEach(v => {
    const img = villageMap[v] ? `images/assets/${villageMap[v]}` : null;
    if (img && allBadges.length < 5) {
      allBadges.push({
        type: 'village',
        html: `<div class="oc-badge" title="Village: ${v}"><img src="${img}" alt="${v}"></div>`
      });
    }
  });
  
  // Get clan badges (limited to remaining slots)
  const clanIds = Array.isArray(oc.clanId) ? oc.clanId : (oc.clanId ? [oc.clanId] : []);
  const clanNames = Array.isArray(oc.clanName) ? oc.clanName : (oc.clanName ? [oc.clanName] : []);
  const allClans = [...clanIds.map(id => ({ type: 'id', value: id })), ...clanNames.map(name => ({ type: 'name', value: name }))];
  
  let clanBadgeIndex = 0;
  allClans.forEach((clan) => {
    if (allBadges.length >= 5) return;
    const identifier = clan.value || 'none';
    const uniqueId = `${identifier}-${clanBadgeIndex}`;
    allBadges.push({
      type: 'clan',
      html: `<div class="oc-badge" id="clan-badge-${uniqueId}" title="Clan" data-clan-id="${clan.type === 'id' ? clan.value : ''}" data-clan-name="${clan.type === 'name' ? clan.value : ''}"></div>`
    });
    clanBadgeIndex++;
  });
  
  // Get land badges (limited to remaining slots)
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
  
  const seenLands = new Set();
  villages.forEach(v => {
    if (allBadges.length >= 5) return;
    const land = villageToLand[v];
    if (land && !seenLands.has(land.name)) {
      seenLands.add(land.name);
      const elementKanji = land.kanji.charAt(0);
      allBadges.push({
        type: 'land',
        html: `<div class="oc-badge land-badge" title="${land.name}" style="background-color: ${land.bgColor};"><span class="land-kanji" style="color: ${land.textColor};">${elementKanji}</span></div>`
      });
    }
  });
  
  // Limit to 5 badges and pad with empty badges if needed
  const limitedBadges = allBadges.slice(0, 5);
  const badgesHtml = limitedBadges.map(b => b.html).join('');
  const emptyBadgesNeeded = Math.max(0, 5 - limitedBadges.length);
  const emptyBadges = '<div class="oc-badge"></div>'.repeat(emptyBadgesNeeded);
  
  return badgesHtml + emptyBadges;
}

function renderVillageBadges(village) {
  // Handle backward compatibility: convert string to array
  const villages = Array.isArray(village) ? village : (village ? [village] : []);
  
  if (villages.length === 0) {
    return '<div class="oc-badge"></div>';
  }
  
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
  
  return villages.map(v => {
    const img = villageMap[v] ? `images/assets/${villageMap[v]}` : null;
    return img ? 
      `<div class="oc-badge" title="Village: ${v}">
        <img src="${img}" alt="${v}">
      </div>` 
      : '';
  }).join('');
}

function renderClanBadges(clanId, clanName) {
  // Handle backward compatibility: convert single values to arrays
  const clanIds = Array.isArray(clanId) ? clanId : (clanId ? [clanId] : []);
  const clanNames = Array.isArray(clanName) ? clanName : (clanName ? [clanName] : []);
  
  // Combine all clan identifiers
  const allClans = [...clanIds.map(id => ({ type: 'id', value: id })), ...clanNames.map(name => ({ type: 'name', value: name }))];
  
  if (allClans.length === 0) {
    return '<div class="oc-badge"></div>';
  }
  
  return allClans.map((clan, index) => {
    const identifier = clan.value || 'none';
    const uniqueId = `${identifier}-${index}`;
    return `<div class="oc-badge" id="clan-badge-${uniqueId}" title="Clan" data-clan-id="${clan.type === 'id' ? clan.value : ''}" data-clan-name="${clan.type === 'name' ? clan.value : ''}"></div>`;
  }).join('');
}

function renderLandBadges(village) {
  // Handle backward compatibility: convert string to array
  const villages = Array.isArray(village) ? village : (village ? [village] : []);
  
  if (villages.length === 0) {
    return '<div class="oc-badge"></div>';
  }
  
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
  
  // Get unique lands (avoid duplicates)
  const seenLands = new Set();
  return villages.map(v => {
    const land = villageToLand[v];
    if (!land || seenLands.has(land.name)) return '';
    seenLands.add(land.name);
    // Extract only the first character (element kanji)
    const elementKanji = land.kanji.charAt(0);
    return `
      <div class="oc-badge land-badge" title="${land.name}" style="background-color: ${land.bgColor};">
        <span class="land-kanji" style="color: ${land.textColor};">${elementKanji}</span>
      </div>
    `;
  }).join('');
}

// Helper function to find an OC by name (matches firstName, lastName, or full name)
function findOCByName(name) {
  if (!name || typeof name !== 'string') return null;
  
  const allOCs = storage.getAllOCs();
  const normalizedName = name.trim().toLowerCase();
  
  // Try to find exact match first
  for (const otherOC of allOCs) {
    const fullName = `${otherOC.firstName || ''} ${otherOC.lastName || ''}`.trim().toLowerCase();
    const firstName = (otherOC.firstName || '').trim().toLowerCase();
    const lastName = (otherOC.lastName || '').trim().toLowerCase();
    
    // Match full name, first name, or last name
    if (fullName === normalizedName || 
        firstName === normalizedName || 
        lastName === normalizedName ||
        fullName.includes(normalizedName) ||
        normalizedName.includes(fullName)) {
      return otherOC;
    }
  }
  
  return null;
}

// Helper function to render character names as links
function renderCharacterLinks(names, isArray = false) {
  if (!names) return '';
  
  const nameList = isArray ? names : [names];
  if (nameList.length === 0) return '';
  
  const links = nameList.map(name => {
    if (!name || typeof name !== 'string') return name;
    
    const matchedOC = findOCByName(name);
    if (matchedOC) {
      // Create clickable link
      return `<a href="#ocs/${matchedOC.id}" onclick="window.showOCDetail('${matchedOC.id}'); return false;" style="color: var(--color-accent-2); text-decoration: underline; cursor: pointer;">${name}</a>`;
    } else {
      // Just return the name as plain text if no match found
      return name;
    }
  });
  
  return links.join(', ');
}

function renderIdentifyingInfo(oc) {
  const info = oc.identifyingInfo || {};
  
  // Parse multi-era data for age
  const ageByEra = oc.ageByEra || {};
  const hasAgeByEra = Object.keys(ageByEra).length > 0 && Object.values(ageByEra).some(age => age && age.trim());
  
  // Parse multi-era data for height/weight
  const heightByEra = oc.heightByEra || {};
  const hasHeightByEra = Object.keys(heightByEra).length > 0 && Object.values(heightByEra).some(height => height && height.trim());
  
  const weightByEra = oc.weightByEra || {};
  const hasWeightByEra = Object.keys(weightByEra).length > 0 && Object.values(weightByEra).some(weight => weight && weight.trim());
  
  // Fallback to old format parsing
  const heightData = hasHeightByEra ? null : parseMultiEraData(info.height);
  const weightData = hasWeightByEra ? null : parseMultiEraData(info.weight);
  
  return `
    <div class="identifying-info">
      <h1><i class="fas fa-id-card" style="margin-right: 0.5rem;"></i> Identifying Information <i class="japanese-header">識別情報</i></h1>
      <div class="info-grid">
        ${renderInfoRow('Aliases', oc.aliases?.join(', ') || 'None')}
        ${(() => {
          // Show all name meanings on separate lines
          const lastNameMeaning = oc.lastNameMeaning;
          const firstNameMeaning = oc.firstNameMeaning;
          const fullNameMeaning = oc.nameMeaning;
          
          const meanings = [];
          if (lastNameMeaning) meanings.push(`<strong>Last:</strong> ${lastNameMeaning}`);
          if (firstNameMeaning) meanings.push(`<strong>First:</strong> ${firstNameMeaning}`);
          if (fullNameMeaning) meanings.push(`<strong>Full Name:</strong> ${fullNameMeaning}`);
          
          if (meanings.length > 0) {
            // Use divs instead of br for proper line breaks in flexbox
            const meaningsHtml = meanings.map(m => `<div style="margin-bottom: 0.25rem;">${m}</div>`).join('');
            return renderInfoRow('Name Meaning', `<div style="display: block;">${meaningsHtml}</div>`);
          }
          return renderInfoRow('Name Meaning', 'Not specified');
        })()}
        ${renderInfoRow('Date of Birth', formatDateOfBirth(oc.dob) || 'Unknown')}
        ${renderInfoRow('Zodiac', oc.zodiac || 'Not specified')}
        ${(() => {
          // Render age by era if available, otherwise use old format
          if (hasAgeByEra) {
            const ageParts = ['Part I', 'Part II', 'Blank Period', 'Gaiden', 'Boruto']
              .filter(era => ageByEra[era] && ageByEra[era].trim())
              .map(era => ({
                value: ageByEra[era],
                era: era
              }));
            if (ageParts.length > 0) {
              return renderMultiEraRow('Age', { hasEra: true, parts: ageParts });
            }
          }
          // Fallback to old format
          const ageData = parseMultiEraData(oc.age);
          return ageData.hasEra ? renderMultiEraRow('Age', ageData) : renderInfoRow('Age', oc.age?.toString() || 'Unknown');
        })()}
        ${renderInfoRow('Blood Type', oc.bloodType || 'Unknown')}
        ${renderInfoRow('Gender', oc.gender || 'Unknown')}
        ${renderInfoRow('Sexual Orientation', oc.sexualOrientation || 'Not specified')}
        ${renderInfoRow('Romantic Orientation', oc.romanticOrientation || 'Not specified')}
        ${oc.natureType ? renderNatureTypeRow(oc.natureType) : renderInfoRow('Nature Type', 'Not specified')}
        ${oc.kekkeiGenkai && oc.kekkeiGenkai.trim() && oc.kekkeiGenkai.toLowerCase() !== 'none' ? renderInfoRow('Kekkei Genkai', oc.kekkeiGenkai) : ''}
        ${oc.debut?.manga && oc.debut.manga.trim() && oc.debut.manga.toLowerCase() !== 'not specified' ? renderInfoRow('Debut (Manga)', oc.debut.manga) : ''}
        ${oc.debut?.anime && oc.debut.anime.trim() && oc.debut.anime.toLowerCase() !== 'not specified' ? renderInfoRow('Debut (Anime)', oc.debut.anime) : ''}
        ${oc.debut?.novel && oc.debut.novel.trim() && oc.debut.novel.toLowerCase() !== 'not specified' ? renderInfoRow('Debut (Novel)', oc.debut.novel) : ''}
        ${oc.debut?.movie && oc.debut.movie.trim() && oc.debut.movie.toLowerCase() !== 'not specified' ? renderInfoRow('Debut (Movie)', oc.debut.movie) : ''}
        ${oc.debut?.game && oc.debut.game.trim() && oc.debut.game.toLowerCase() !== 'not specified' ? renderInfoRow('Debut (Game)', oc.debut.game) : ''}
        ${oc.appearsIn && oc.appearsIn.length > 0 ? renderInfoRow('Appears In', oc.appearsIn.join(', ')) : ''}
        ${(() => {
          // Render height by era if available, otherwise use old format
          if (hasHeightByEra) {
            const heightParts = ['Part I', 'Part II', 'Blank Period', 'Gaiden', 'Boruto']
              .filter(era => heightByEra[era] && heightByEra[era].trim())
              .map(era => ({
                value: heightByEra[era],
                era: era
              }));
            if (heightParts.length > 0) {
              return renderMultiEraRow('Height', { hasEra: true, parts: heightParts });
            }
          }
          // Fallback to old format
          if (heightData && heightData.hasEra) {
            return renderMultiEraRow('Height', heightData);
          }
          return renderInfoRow('Height', info.height || 'Unknown');
        })()}
        ${(() => {
          // Render weight by era if available, otherwise use old format
          if (hasWeightByEra) {
            const weightParts = ['Part I', 'Part II', 'Blank Period', 'Gaiden', 'Boruto']
              .filter(era => weightByEra[era] && weightByEra[era].trim())
              .map(era => ({
                value: weightByEra[era],
                era: era
              }));
            if (weightParts.length > 0) {
              return renderMultiEraRow('Weight', { hasEra: true, parts: weightParts });
            }
          }
          // Fallback to old format
          if (weightData && weightData.hasEra) {
            return renderMultiEraRow('Weight', weightData);
          }
          return renderInfoRow('Weight', info.weight || 'Unknown');
        })()}
      </div>
      <div class="rank-section">
        <h2 class="rank-section-title"><i class="fas fa-tasks" style="margin-right: 0.5rem;"></i> Missions Completed <i class="japanese-header">完了した任務</i></h2>
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
        <div style="display: flex; justify-content: center; margin-top: 1.5rem;">
          <button type="button" class="btn-naruto btn-naruto-secondary" id="detail-stats-view-toggle" onclick="toggleDetailStatsView()" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
            <i class="fas fa-chart-line" id="detail-stats-view-icon"></i>
            <span id="detail-stats-view-text">Show Radar Chart</span>
          </button>
        </div>
        <div class="radar-chart-container" id="detail-radar-chart-container" style="display: none; margin-top: 1.5rem;">
          <canvas id="detail-radar-canvas"></canvas>
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

function formatDateOfBirth(dob) {
  if (!dob) return '';
  
  // Handle MM-DD format (no year)
  const match = dob.match(/^(\d{2})-(\d{2})$/);
  if (match) {
    const month = parseInt(match[1], 10) - 1; // 0-indexed for Date
    const day = parseInt(match[2], 10);
    
    if (month >= 0 && month < 12 && day >= 1 && day <= 31) {
      const monthName = new Date(2000, month).toLocaleString('en-US', { month: 'long' });
      return `${monthName} ${day}`;
    }
  }
  
  // Fallback: return as-is if format doesn't match
  return dob;
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
  
  // Format like the screenshot: each era on a new line with "Part I: value" format
  // For age, align values to the right; for height/weight, align values to the left
  const isAge = label.toLowerCase() === 'age';
  const isHeightOrWeight = label.toLowerCase() === 'height' || label.toLowerCase() === 'weight';
  const eraItems = data.parts.map(part => {
    const eraLabel = part.era ? `${part.era}:` : '';
    if (isAge) {
      return `<div class="era-item-line"><span class="era-label-text">${eraLabel}</span> <span class="age-value">${part.value}</span></div>`;
    }
    if (isHeightOrWeight) {
      return `<div class="era-item-line"><span class="era-label-text">${eraLabel}</span> <span class="era-value-left">${part.value}</span></div>`;
    }
    return `<div class="era-item-line">${eraLabel} ${part.value}</div>`;
  }).join('');
  
  return `
    <div class="info-row multi-era-row ${isAge ? 'age-row' : ''}">
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
      <h3><i class="fas fa-chess" style="margin-right: 0.5rem;"></i> Battle Strategy <i class="japanese-header">戦略</i></h3>
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
  const hasOverview = personality.overview && personality.overview.trim();
  const hasPositiveTraits = personality.positiveTraits && personality.positiveTraits.length > 0;
  const hasNegativeTraits = personality.negativeTraits && personality.negativeTraits.length > 0;
  const hasNeutralTraits = personality.neutralTraits && personality.neutralTraits.length > 0;
  const hasLikes = personality.likes && personality.likes.length > 0;
  const hasDislikes = personality.dislikes && personality.dislikes.length > 0;
  
  return `
    <div class="known-behavior">
      ${hasOverview ? `
        <div class="behavior-section">
          <h4>Overview <i class="japanese-header">概要</i></h4>
          <p class="personality-overview">${personality.overview}</p>
        </div>
      ` : ''}
      
      <div class="behavior-section">
        <h4>Positive Traits <i class="japanese-header">肯定的な特徴</i></h4>
        <ul class="behavior-list positive-traits">
          ${hasPositiveTraits
            ? personality.positiveTraits.map(trait => `<li>${trait}</li>`).join('')
            : '<li>Not specified</li>'
          }
        </ul>
      </div>
      
      <div class="behavior-section">
        <h4>Negative Traits <i class="japanese-header">否定的な特徴</i></h4>
        <ul class="behavior-list negative-traits">
          ${hasNegativeTraits
            ? personality.negativeTraits.map(trait => `<li>${trait}</li>`).join('')
            : '<li>Not specified</li>'
          }
        </ul>
      </div>
      
      <div class="behavior-section">
        <h4>Neutral Traits <i class="japanese-header">中立的な特徴</i></h4>
        <ul class="behavior-list neutral-traits">
          ${hasNeutralTraits
            ? personality.neutralTraits.map(trait => `<li>${trait}</li>`).join('')
            : '<li>Not specified</li>'
          }
        </ul>
      </div>
      
      <div class="behavior-section">
        <h4>Likes <i class="japanese-header">好き</i></h4>
        <ul class="behavior-list likes">
          ${hasLikes
            ? personality.likes.map(like => `<li>${like}</li>`).join('')
            : '<li>Not specified</li>'
          }
        </ul>
      </div>
      
      <div class="behavior-section">
        <h4>Dislikes <i class="japanese-header">嫌い</i></h4>
        <ul class="behavior-list dislikes">
          ${hasDislikes
            ? personality.dislikes.map(dislike => `<li>${dislike}</li>`).join('')
            : '<li>Not specified</li>'
          }
        </ul>
      </div>
      
      <div class="behavior-section">
        <h4>Fears / Core Wounds <i class="japanese-header">恐怖・核心的傷</i></h4>
        <ul class="behavior-list fears">
          ${(oc.fears && oc.fears.length > 0) 
            ? oc.fears.map(fear => `<li>${fear}</li>`).join('')
            : '<li>Not specified</li>'
          }
        </ul>
      </div>
      
      <div class="behavior-section">
        <h4>Personality Profile <i class="japanese-header">性格プロフィール</i></h4>
        <div class="personality-profile">
          ${oc.moralAlignment ? `
            <div style="margin-bottom: 1rem;">
              <p style="margin-bottom: 0.25rem;"><strong>Moral Alignment:</strong> ${oc.moralAlignment}</p>
              <p style="font-size: 0.85rem; color: var(--color-text-dark-2); margin-left: 1rem; font-style: italic;">
                ${getMoralAlignmentDescription(oc.moralAlignment)}
              </p>
            </div>
          ` : '<p><strong>Moral Alignment:</strong> Not specified</p>'}
          
          ${oc.mbti ? `
            <div style="margin-bottom: 1rem;">
              <p style="margin-bottom: 0.25rem;"><strong>MBTI:</strong> ${oc.mbti}</p>
              <p style="font-size: 0.85rem; color: var(--color-text-dark-2); margin-left: 1rem; font-style: italic;">
                ${getMBTIDescription(oc.mbti)}
              </p>
            </div>
          ` : '<p><strong>MBTI:</strong> Not specified</p>'}
          
          ${oc.enneagram ? `
            <div style="margin-bottom: 1rem;">
              <p style="margin-bottom: 0.25rem;"><strong>Enneagram:</strong> ${oc.enneagram}</p>
              <p style="font-size: 0.85rem; color: var(--color-text-dark-2); margin-left: 1rem; font-style: italic;">
                ${getEnneagramDescription(oc.enneagram)}
              </p>
              ${oc.enneagram.includes('w') ? `
                <p style="font-size: 0.75rem; color: var(--color-text-dark-2); margin-left: 1rem; margin-top: 0.25rem; opacity: 0.8;">
                  <i class="fas fa-info-circle" style="margin-right: 0.25rem;"></i>
                  Wings are adjacent Enneagram types that influence the core type, creating unique variations and expressions.
                </p>
              ` : ''}
            </div>
          ` : '<p><strong>Enneagram:</strong> Not specified</p>'}
        </div>
      </div>
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
        
        const convertedImageUrl = image ? convertImageUrl(image) : null;
        return `
          <div class="relationship-card">
            <div class="relationship-header">
              ${convertedImageUrl ? `<img src="${convertedImageUrl}" alt="${fullName}" class="relationship-icon">` : `<div class="relationship-icon-placeholder">${heartChart}</div>`}
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

function renderFamily(oc) {
  const family = oc.family || {};
  
  return `
    <div class="family-info">
      <div class="family-member"><i class="fas fa-male" style="margin-right: 0.5rem;"></i><strong>Father <i class="japanese-header">父親</i>:</strong> ${family.father || 'Not specified'}</div>
      <div class="family-member"><i class="fas fa-female" style="margin-right: 0.5rem;"></i><strong>Mother <i class="japanese-header">母親</i>:</strong> ${family.mother || 'Not specified'}</div>
      <div class="family-member">
        <i class="fas fa-user-friends" style="margin-right: 0.5rem;"></i><strong>Siblings <i class="japanese-header">兄弟姉妹</i>:</strong> ${(family.siblings && family.siblings.length > 0) ? family.siblings.join(', ') : 'Not specified'}
      </div>
      <div class="family-member">
        <i class="fas fa-users" style="margin-right: 0.5rem;"></i><strong>Other Relatives <i class="japanese-header">その他の親族</i>:</strong> ${(family.otherRelatives && family.otherRelatives.length > 0) ? family.otherRelatives.join(', ') : 'Not specified'}
      </div>
    </div>
  `;
}

function renderPhysicalAppearance(oc) {
  const info = oc.identifyingInfo || {};
  
  return `
    <div class="physical-appearance-info">
      <div class="appearance-item"><strong>Body Type:</strong> ${info.bodyType || 'Not specified'}</div>
      <div class="appearance-item"><strong>Eye Color:</strong> ${oc.eyeColor || 'Not specified'}</div>
      <div class="appearance-item"><strong>Hair Color:</strong> ${oc.hairColor || 'Not specified'}</div>
      <div class="appearance-item">
        <strong>Distinguishing Features:</strong> ${(oc.distinguishingFeatures && oc.distinguishingFeatures.length > 0) ? oc.distinguishingFeatures.join(', ') : 'Not specified'}
      </div>
    </div>
  `;
}

function renderAppearanceByEra(oc) {
  const eras = ['Part I', 'Part II', 'Blank Period', 'Gaiden', 'Boruto'];
  const appearanceByEra = oc.appearanceByEra || {};
  
  return `
    <div class="appearance-by-era">
      ${eras.map(era => {
        const eraApp = appearanceByEra[era] || {};
        return `
          <div style="margin-bottom: 2rem; padding: 1rem; border: 1px solid var(--color-border-2); border-radius: 4px;">
            <h4 style="color: var(--color-accent-2); margin-bottom: 1rem;">${era}</h4>
            <p><strong>Description:</strong> ${eraApp.description || 'Not specified'}</p>
            <p><strong>Signature Clothing:</strong> ${eraApp.clothing || 'Not specified'}</p>
            <p><strong>Accessories:</strong> ${eraApp.accessories || 'Not specified'}</p>
            <p><strong>Visual Motifs:</strong> ${eraApp.visualMotifs || 'Not specified'}</p>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderAffiliations(oc) {
  // Handle backward compatibility: convert single values to arrays
  const villages = Array.isArray(oc.village) ? oc.village : (oc.village ? [oc.village] : []);
  const clanIds = Array.isArray(oc.clanId) ? oc.clanId : (oc.clanId ? [oc.clanId] : []);
  const clanNames = Array.isArray(oc.clanName) ? oc.clanName : (oc.clanName ? [oc.clanName] : []);
  const ranks = Array.isArray(oc.rank) ? oc.rank : (oc.rank ? [oc.rank] : []);
  const classifications = Array.isArray(oc.classification) ? oc.classification : (oc.classification ? [oc.classification] : []);
  
  // Resolve clan names from clanIds
  const resolvedClanNames = clanIds.map(clanId => {
    const clan = storage.getClan(clanId);
    return clan ? clan.name : clanId;
  });
  const allClanNames = [...resolvedClanNames, ...clanNames].filter(Boolean);
  
  return `
    <div class="affiliations-info">
      <div class="affiliation-item"><strong>Village(s):</strong> ${villages.length > 0 ? villages.join(', ') : 'Not specified'}</div>
      <div class="affiliation-item"><strong>Clan(s):</strong> ${allClanNames.length > 0 ? allClanNames.join(', ') : 'Not specified'}</div>
      <div class="affiliation-item"><strong>Rank(s):</strong> ${ranks.length > 0 ? ranks.join(', ') : 'Not specified'}</div>
      <div class="affiliation-item"><strong>Classification(s):</strong> ${classifications.length > 0 ? classifications.join(', ') : 'Not specified'}</div>
      <div class="affiliation-item"><strong>Ninja Registration Number:</strong> ${oc.ninjaRegistrationNumber || 'Not specified'}</div>
      <div class="affiliation-item"><strong>Team Number:</strong> ${oc.teamNumber || 'Not specified'}</div>
      <div class="affiliation-item"><i class="fas fa-user-friends" style="margin-right: 0.5rem;"></i><strong>Teammates <i class="japanese-header">チームメイト</i>:</strong> ${(oc.teammates && oc.teammates.length > 0) ? renderCharacterLinks(oc.teammates, true) : 'Not specified'}</div>
      <div class="affiliation-item"><i class="fas fa-chalkboard-teacher" style="margin-right: 0.5rem;"></i><strong>Sensei <i class="japanese-header">先生</i>:</strong> ${oc.sensei ? renderCharacterLinks(oc.sensei, false) : 'Not specified'}</div>
      <div class="affiliation-item"><strong>Academy Graduation Age:</strong> ${oc.academyGraduationAge || 'Not specified'}</div>
      <div class="affiliation-item"><strong>Made Genin:</strong> ${oc.madeGenin || 'Not specified'}</div>
      <div class="affiliation-item"><strong>Made Chunin:</strong> ${oc.madeChunin || 'Not specified'}</div>
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
      ${associates.map(assoc => {
        const convertedImageUrl = assoc.image ? convertImageUrl(assoc.image) : null;
        return `
        <div style="margin-bottom: 1rem; padding: 1rem; background-color: var(--color-bg-1); border: 1px solid var(--color-dark-3);">
          ${convertedImageUrl ? `<img src="${convertedImageUrl}" style="width: 100px; height: 100px; float: left; margin-right: 1rem; border: 2px solid var(--color-dark-3);">` : ''}
          <strong>${assoc.name || 'Unknown'}</strong>
          <p>${assoc.description || ''}</p>
        </div>
      `;
      }).join('')}
    </div>
  `;
}

function renderDemeanor(oc) {
  const demeanor = oc.personality?.demeanor || {};
  
  const traitPairs = [
    { key: 'friendlyReserved', left: 'Friendly', right: 'Reserved' },
    { key: 'politeBlunt', left: 'Polite', right: 'Blunt' },
    { key: 'cleverFoolish', left: 'Clever', right: 'Foolish' },
    { key: 'sensitiveTough', left: 'Sensitive', right: 'Tough' },
    { key: 'braveTimid', left: 'Brave', right: 'Timid' },
    { key: 'carefulReckless', left: 'Careful', right: 'Reckless' },
    { key: 'sincereDeceptive', left: 'Sincere', right: 'Deceptive' },
    { key: 'diligentLazy', left: 'Diligent', right: 'Lazy' },
    { key: 'calmIrritable', left: 'Calm', right: 'Irritable' },
    { key: 'humorousSerious', left: 'Humorous', right: 'Serious' }
  ];
  
  return `
    <div class="demeanor-section">
      ${traitPairs.map(trait => {
        // Value is 1-10, where 1 = very left trait, 10 = very right trait
        // Default to 5.5 (middle) if not set
        const value = demeanor[trait.key] !== undefined ? demeanor[trait.key] : 5.5;
        const percentage = ((value - 1) / 9) * 100; // Convert 1-10 to 0-100%
        
        return `
          <div class="demeanor-row">
            <div class="demeanor-trait-label">
              <span class="trait-left">${trait.left}</span>
              <span class="trait-separator">–</span>
              <span class="trait-right">${trait.right}</span>
            </div>
            <div class="demeanor-slider-container">
              <div class="demeanor-slider-track">
                <div class="demeanor-slider-fill" style="width: ${percentage}%;"></div>
                <div class="demeanor-slider-marker" style="left: ${percentage}%;"></div>
              </div>
              <div class="demeanor-value">${Math.round(value)}</div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderAbilities(oc) {
  const hasChakraPhysical = oc.chakraPhysicalProwess && (
    oc.chakraPhysicalProwess.chakraReserves || 
    oc.chakraPhysicalProwess.chakraControl || 
    oc.chakraPhysicalProwess.strengthFeats || 
    oc.chakraPhysicalProwess.speedFeats || 
    oc.chakraPhysicalProwess.taijutsuSkill || 
    oc.chakraPhysicalProwess.trainingInfluences
  );
  
  const hasIntelligence = oc.intelligence && (
    oc.intelligence.academicPerformance || 
    oc.intelligence.analyticalAbility || 
    oc.intelligence.combatStrategy || 
    oc.intelligence.leadershipSkill
  );
  
  return `
    ${hasChakraPhysical ? `
    <div class="ability-category" style="margin-bottom: 2rem;">
      <h3>Chakra & Physical Prowess <i class="japanese-header">チャクラと体力</i></h3>
      ${oc.chakraPhysicalProwess.chakraReserves ? `<p><strong>Chakra Reserves:</strong> ${oc.chakraPhysicalProwess.chakraReserves}</p>` : ''}
      ${oc.chakraPhysicalProwess.chakraControl ? `<p><strong>Chakra Control:</strong> ${oc.chakraPhysicalProwess.chakraControl}</p>` : ''}
      ${oc.chakraPhysicalProwess.strengthFeats ? `<p><strong>Strength Feats:</strong> ${oc.chakraPhysicalProwess.strengthFeats}</p>` : ''}
      ${oc.chakraPhysicalProwess.speedFeats ? `<p><strong>Speed Feats:</strong> ${oc.chakraPhysicalProwess.speedFeats}</p>` : ''}
      ${oc.chakraPhysicalProwess.taijutsuSkill ? `<p><strong>Taijutsu Skill:</strong> ${oc.chakraPhysicalProwess.taijutsuSkill}</p>` : ''}
      ${oc.chakraPhysicalProwess.trainingInfluences ? `<p><strong>Training Influences:</strong> ${oc.chakraPhysicalProwess.trainingInfluences}</p>` : ''}
    </div>
    ` : ''}
    
    ${hasIntelligence ? `
    <div class="ability-category" style="margin-bottom: 2rem;">
      <h3>Intelligence <i class="japanese-header">知性</i></h3>
      ${oc.intelligence.academicPerformance ? `<p><strong>Academic Performance:</strong> ${oc.intelligence.academicPerformance}</p>` : ''}
      ${oc.intelligence.analyticalAbility ? `<p><strong>Analytical Ability:</strong> ${oc.intelligence.analyticalAbility}</p>` : ''}
      ${oc.intelligence.combatStrategy ? `<p><strong>Combat Strategy:</strong> ${oc.intelligence.combatStrategy}</p>` : ''}
      ${oc.intelligence.leadershipSkill ? `<p><strong>Leadership Skill:</strong> ${oc.intelligence.leadershipSkill}</p>` : ''}
    </div>
    ` : ''}
    
  ` + renderAbilitiesOriginal(oc);
}

function renderAbilitiesOriginal(oc) {
  const abilities = oc.abilities || {};
  
  // Determine taijutsu-style techniques
  const taijutsuTypes = ['taijutsu', 'kenjutsu', 'bojutsu', 'kayakujutsu', 'kusarigamajutsu', 
                         'kyujutsu', 'shurikenjutsu', 'tessenjutsu', 'bukijutsu', 'nintaijutsu'];
  
  // Helper to normalize technique keys (same as in form)
  const normalizeKey = (str) => str.toLowerCase().replace(/\s+/g, '').replace(/[–-]/g, '');
  
  // Helper to find technique label from normalized key
  const findTechniqueLabel = (normalizedKey) => {
    // Try direct lookup first
    const directLabel = getTechniqueTypeLabel(normalizedKey);
    if (directLabel) return directLabel;
    
    // Try to find by normalizing all technique values
    if (typeof allTechniqueTypes !== 'undefined' && Array.isArray(allTechniqueTypes)) {
      const found = allTechniqueTypes.find(tech => normalizeKey(tech.value) === normalizedKey);
      if (found) return found.label.split('–')[0].trim();
    }
    
    // Fallback: format the key nicely
    return normalizedKey.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') ||
           normalizedKey.charAt(0).toUpperCase() + normalizedKey.slice(1);
  };
  
  let html = '';
  
  // Render all ability types dynamically
  Object.keys(abilities).forEach(type => {
    if (!Array.isArray(abilities[type]) || abilities[type].length === 0) return;
    
    const isTaijutsu = taijutsuTypes.includes(type.toLowerCase());
    const typeLabel = findTechniqueLabel(type);
    
    html += abilities[type].map(ability => {
      if (isTaijutsu) {
        return `
          <div class="ability-section">
            <h3 class="ability-header">${typeLabel}</h3>
            <div class="ability-content">
              <div class="ability-style">Style: ${ability.style || 'Content'}</div>
              <div style="font-size: 12px; border-top: 1px solid var(--color-dark-3); padding-top: 0.5rem;">
                <span>Base Style: ${ability.baseStyle || 'Content'}</span>
              </div>
              <div style="font-size: 12px; border-bottom: 1px solid var(--color-dark-3); padding: 0.5rem 0;">
                <span>Mastery: </span>
                <span>${renderRatingStars(ability.mastery || 3)}</span>
              </div>
              <p class="ability-description">${ability.description || ''}</p>
            </div>
          </div>
        `;
      } else {
        return `
          <div class="ability-section">
            <h3 class="ability-header">${typeLabel}</h3>
            <div class="ability-content">
              <div class="ability-style">Style: ${ability.style || 'Content'} <small style="float: right;">${ability.rank || 'C'}</small></div>
              <div style="font-size: 12px; border-top: 1px solid var(--color-dark-3); padding-top: 0.5rem;">
                <span>Difficulty: ${renderRatingStars(ability.difficulty || 3)}</span>
              </div>
              <div style="font-size: 12px; border-bottom: 1px solid var(--color-dark-3); padding: 0.5rem 0;">
                <span>Chakra Intensity: ${renderRatingStars(ability.chakraIntensity || 3)}</span>
              </div>
              <p class="ability-description">${ability.description || ''}</p>
            </div>
          </div>
        `;
      }
    }).join('');
  });
  
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
    const rawImageUrl = typeof item === 'string' ? item : (item.url || item.image || '');
    const imageUrl = convertImageUrl(rawImageUrl);
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

function renderRecordHistory(oc) {
  const entries = [];
  
  // Add life stages if they have content
  const childhood = oc.recordHistory?.childhood?.trim();
  const adolescence = oc.recordHistory?.adolescence?.trim();
  const adulthood = oc.recordHistory?.adulthood?.trim();
  
  if (childhood) {
    entries.push({ title: 'Childhood', content: childhood });
  }
  if (adolescence) {
    entries.push({ title: 'Adolescence', content: adolescence });
  }
  if (adulthood) {
    entries.push({ title: 'Adulthood', content: adulthood });
  }
  
  // Add story arcs
  if (oc.storyArcs && oc.storyArcs.length > 0) {
    oc.storyArcs.forEach(arc => {
      let content = '';
      if (arc.summary) {
        content += `<p>${arc.summary}</p>`;
      }
      if (arc.keyEvents && arc.keyEvents.length > 0) {
        content += `<h4 style="margin-bottom: 0.5rem; margin-top: 1rem;">Key Events:</h4>`;
        content += `<ul style="list-style-type: disc; padding-left: 1.5rem;">`;
        content += arc.keyEvents.map(event => `<li style="margin-bottom: 0.25rem;">${event}</li>`).join('');
        content += `</ul>`;
      }
      if (content) {
        entries.push({ title: arc.name || 'Unnamed Arc', content: content });
      }
    });
  }
  
  // If no entries, show empty message
  if (entries.length === 0) {
    return '<div class="relationships-empty"><p>No history recorded.</p></div>';
  }
  
  // Render all entries in the same format
  return entries.map((entry, index) => {
    const id = `history-${entry.title.toLowerCase().replace(/\s+/g, '-')}-${index}`;
    // Check if content is already HTML (from story arcs) or plain text (from record history)
    const isHtml = entry.content.trim().startsWith('<');
    const renderedContent = isHtml ? entry.content : renderMarkdown(entry.content);
    
    return `
      <div class="history-entry" style="margin-bottom: ${index < entries.length - 1 ? '1.5rem' : '0'};">
        <div class="history-entry-header" onclick="toggleCollapse('${id}')">
          ${entry.title}
          <i class="fas fa-chevron-down bounce-arrow"></i>
        </div>
        <div id="${id}" class="history-entry-content markdown-content">
          ${renderedContent}
        </div>
      </div>
    `;
  }).join('');
}

function renderGearItem(gear) {
  // Handle simple string format
  if (typeof gear === 'string') {
    return `
      <div class="gear-item">
        <div>
          <div class="gear-icon">⚔</div>
          <span class="gear-name">${gear}</span>
        </div>
      </div>
    `;
  }
  
  // Determine icon display
  let iconHtml = '<div class="gear-icon">⚔</div>';
  if (gear.icon) {
    if (gear.icon.startsWith('fa-') || gear.icon.startsWith('fas ') || gear.icon.startsWith('far ') || gear.icon.startsWith('fab ')) {
      iconHtml = `<div class="gear-icon" style="font-size: 1.5rem; color: var(--color-accent-2);"><i class="${gear.icon}"></i></div>`;
    } else if (gear.icon.startsWith('http') || gear.icon.startsWith('data:')) {
      iconHtml = `<div class="gear-icon" style="width: 60px; height: 60px; padding: 0; overflow: hidden; display: flex; align-items: center; justify-content: center;"><img src="${gear.icon}" alt="${gear.name || 'Gear'}" style="width: 100%; height: 100%; object-fit: contain;"></div>`;
    }
  }
  
  return `
    <div class="gear-item">
      <div>
        ${iconHtml}
        <span class="gear-name">${gear.name || 'Item Name'}</span>
      </div>
      ${gear.info && gear.info.length > 0 ? `
        <ul class="gear-info">
          ${gear.info.map(info => `<li>${info}</li>`).join('')}
        </ul>
      ` : ''}
    </div>
  `;
}

function getNatureTypeIcon(natureType) {
  const release = getNatureRelease(natureType);
  return release ? release.iconUrl : '';
}

function renderNatureTypeRow(natureType) {
  // Handle both array and string formats for backward compatibility
  const natureTypes = Array.isArray(natureType) ? natureType : (natureType ? [natureType] : []);
  
  if (natureTypes.length === 0) {
    return '';
  }
  
  // If multiple types, render them all
  if (natureTypes.length > 1) {
    const typesHtml = natureTypes.map(type => {
      const release = getNatureRelease(type);
      if (!release) {
        return `<span style="display: inline-block; margin-right: 1rem; margin-bottom: 0.5rem;">${type}</span>`;
      }
      
      const iconUrl = release.iconUrl;
      const iconHtml = iconUrl ? `<img src="${iconUrl}" alt="${type}" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 4px; display: inline-block;">` : '';
      
      return `
        <div style="display: inline-block; margin-right: 1rem; margin-bottom: 0.5rem; padding: 0.5rem; background-color: var(--color-bg-1); border: 1px solid var(--color-border-2); border-radius: 4px;">
          ${iconHtml}${type}
        </div>
      `;
    }).join('');
    
    return `
      <div class="info-row">
        <div class="info-content" style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${typesHtml}
        </div>
        ${renderInfoLabel('nature type')}
      </div>
    `;
  }
  
  // Single type - original format
  const type = natureTypes[0];
  const release = getNatureRelease(type);
  if (!release) {
    return `
      <div class="info-row">
        ${renderInfoContent(type)}
        ${renderInfoLabel('nature type')}
      </div>
    `;
  }
  
  const iconUrl = release.iconUrl;
  const iconHtml = iconUrl ? `<img src="${iconUrl}" alt="${type}" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 8px; display: inline-block;">` : '';
  
  return `
    <div class="info-row">
      ${renderInfoContent(`${iconHtml}${type}`)}
      ${renderInfoLabel('nature type')}
    </div>
  `;
}

function renderProfileImageWithEras(oc) {
  const eras = ['Part I', 'Part II', 'Blank Period', 'Gaiden', 'Boruto'];
  const imagesByEra = oc.imagesByEra || {};
  
  // Check if any era-specific images exist
  const hasEraImages = Object.keys(imagesByEra).some(era => imagesByEra[era] && imagesByEra[era].trim());
  
  // If no era images, use default profile image
  if (!hasEraImages) {
    const profileImageUrl = oc.profileImage ? convertImageUrl(oc.profileImage) : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
    return `<img src="${profileImageUrl}" alt="${oc.firstName} ${oc.lastName}" class="oc-profile-image">`;
  }
  
  // Generate era tabs
  const eraTabs = eras.map((era, index) => {
    const hasImage = imagesByEra[era] && imagesByEra[era].trim();
    return `
      <button class="profile-image-era-tab ${index === 0 ? 'active' : ''}" 
              onclick="switchProfileImageEraTab('${era}')" 
              data-era="${era}"
              ${!hasImage ? 'style="opacity: 0.5;"' : ''}>
        ${era}
      </button>
    `;
  }).join('');
  
  // Generate image panels
  const imagePanels = eras.map((era, index) => {
    const imageUrl = imagesByEra[era] && imagesByEra[era].trim() 
      ? convertImageUrl(imagesByEra[era].trim())
      : convertImageUrl(oc.profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png');
    const isActive = index === 0 ? 'active' : '';
    return `
      <div class="profile-image-era-panel ${isActive}" id="profile-image-era-panel-${era.replace(/\s+/g, '-')}">
        <img src="${imageUrl}" alt="${oc.firstName} ${oc.lastName} - ${era}" class="oc-profile-image">
      </div>
    `;
  }).join('');
  
  return `
    <div class="profile-image-era-container">
      <div class="profile-image-era-tabs">
        ${eraTabs}
      </div>
      <div class="profile-image-era-content">
        ${imagePanels}
      </div>
    </div>
  `;
}

