// Clan Detail Component

import storage from '../data/storage.js';
import { renderMarkdown } from '../utils/markdown.js';
import { convertImageUrl } from '../utils/imageUtils.js';

export function renderClanDetail(clan) {
  const container = document.createElement('div');
  container.className = 'detail-scroll';
  
  const members = clan.members?.map(id => storage.getOC(id)).filter(oc => oc) || [];
  
  // Helper to safely get nested values
  const getValue = (path, defaultValue = '') => {
    const keys = path.split('.');
    let value = clan;
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined || value === null) return defaultValue;
    }
    return value || defaultValue;
  };
  
  // Helper to check if a value exists
  const hasValue = (path) => {
    const val = getValue(path);
    if (Array.isArray(val)) return val.length > 0;
    return val && val.toString().trim() !== '';
  };
  
  // Helper to check if array has items
  const hasArray = (path) => {
    const val = getValue(path, []);
    return Array.isArray(val) && val.length > 0;
  };
  
  // Helper to get array values
  const getArrayValue = (path, defaultValue = []) => {
    const val = getValue(path, defaultValue);
    return Array.isArray(val) ? val : (val ? [val] : defaultValue);
  };
  
  // Build title with Kanji and Meaning
  let title = clan.name || 'Unnamed Clan';
  const titleParts = [];
  if (clan.kanji) {
    let kanjiPart = clan.kanji;
    if (getValue('meaning')) {
      kanjiPart += ` (${getValue('meaning')})`;
    }
    titleParts.push(kanjiPart);
  }
  if (titleParts.length > 0) {
    title += ` — ${titleParts.join(', ')}`;
  }
  
  // Tagline
  const tagline = getValue('tagline');
  
  // Ensure toggleCollapse function is available globally
  window.toggleCollapse = function(id) {
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
  
  container.innerHTML = `
    <div class="detail-backdrop"></div>
    <div class="detail-header">
      <div class="detail-header-inner">
        <div class="detail-header-border"></div>
      </div>
    </div>
    <div class="detail-content">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h1 class="detail-title" style="margin: 0;">${title}</h1>
        <button class="btn-naruto" onclick="window.editClan('${clan.id}')" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
          <i class="fas fa-edit"></i> Edit
        </button>
      </div>
      ${tagline ? `<div style="text-align: center; font-style: italic; color: var(--color-text-dark-2); margin-bottom: 1rem; padding: 0.5rem; background-color: rgba(227, 94, 63, 0.1); border-radius: 4px;">${tagline}</div>` : ''}
      
      <div class="clan-info-section" style="text-align: center;">
        ${clan.symbol ? 
          `<img src="${convertImageUrl(clan.symbol)}" alt="${clan.name} Symbol" style="width: 180px; height: 180px; border: 4px solid var(--color-dark-3); border-radius: 12px; box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2); margin-bottom: 1.5rem;">` 
          : '<div style="width: 180px; height: 180px; background: linear-gradient(135deg, var(--color-bg-1) 0%, var(--color-bg-2) 100%); border: 4px solid var(--color-dark-3); border-radius: 12px; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);"><span style="color: var(--color-text-dark-2); font-weight: 600; text-transform: uppercase;">No Symbol</span></div>'
        }
      </div>
      
      <!-- Clan Data Quick Info Box -->
      ${(() => {
        const hasDebut = hasValue('debut.manga') || hasValue('debut.anime') || hasValue('debut.novel') || hasValue('debut.movie') || hasValue('debut.game');
        const appearsIn = getArrayValue('appearsIn', []);
        const knownMembersList = (clan.knownMembers || clan.members || []).map(id => {
          const oc = storage.getOC(id);
          return oc ? oc.firstName + ' ' + oc.lastName : null;
        }).filter(Boolean);
        const jutsuList = (() => {
          const newFormatAbilities = clan.abilities && typeof clan.abilities === 'object' && !Array.isArray(clan.abilities);
          if (newFormatAbilities && Array.isArray(clan.abilities.signatureJutsu)) {
            return clan.abilities.signatureJutsu.map(j => j.split(' — ')[0]).slice(0, 5);
          }
          if (Array.isArray(clan.abilities)) {
            return clan.abilities.slice(0, 5);
          }
          return [];
        })();
        
        if (hasDebut || appearsIn.length > 0 || clan.village || knownMembersList.length > 0 || jutsuList.length > 0) {
          return `
            <div class="clan-info-section">
              <div class="info-grid" style="margin-bottom: 2rem;">
                <div class="info-row">
                  <div class="info-label">Clan Data</div>
                  <div class="info-content"></div>
                </div>
                ${hasDebut || appearsIn.length > 0 ? `
                  <div class="info-row">
                    <div class="info-label">Debut</div>
                    <div class="info-content">
                      ${hasValue('debut.manga') ? `<div><strong>Manga:</strong> ${getValue('debut.manga')}</div>` : ''}
                      ${hasValue('debut.anime') ? `<div><strong>Anime:</strong> ${getValue('debut.anime')}</div>` : ''}
                      ${hasValue('debut.novel') ? `<div><strong>Novel:</strong> ${getValue('debut.novel')}</div>` : ''}
                      ${hasValue('debut.movie') ? `<div><strong>Movie:</strong> ${getValue('debut.movie')}</div>` : ''}
                      ${hasValue('debut.game') ? `<div><strong>Game:</strong> ${getValue('debut.game')}</div>` : ''}
                    </div>
                  </div>
                  ${appearsIn.length > 0 ? `
                    <div class="info-row">
                      <div class="info-label">Appears in</div>
                      <div class="info-content">
                        ${appearsIn.map(media => `<span style="display: inline-block; padding: 0.25rem 0.5rem; margin: 0.25rem; background-color: var(--color-accent-2); color: white; border-radius: 4px; font-size: 0.85rem;">${media}</span>`).join('')}
                      </div>
                    </div>
                  ` : ''}
                ` : ''}
                ${clan.village ? `
                  <div class="info-row">
                    <div class="info-label">Affiliation</div>
                    <div class="info-content">${clan.village}</div>
                  </div>
                ` : ''}
                ${knownMembersList.length > 0 ? `
                  <div class="info-row">
                    <div class="info-label">Known Members</div>
                    <div class="info-content">
                      ${knownMembersList.map(member => `<div>• ${member}</div>`).join('')}
                    </div>
                  </div>
                ` : ''}
                ${jutsuList.length > 0 ? `
                  <div class="info-row">
                    <div class="info-label">Jutsu</div>
                    <div class="info-content">
                      ${jutsuList.map(jutsu => `<div>• ${jutsu}</div>`).join('')}
                      ${jutsuList.length >= 5 ? '<div style="font-style: italic; opacity: 0.8;">... and more</div>' : ''}
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          `;
        }
        return '';
      })()}
      
      ${hasValue('summary') ? `
        <div class="clan-info-section">
          <div style="line-height: 1.8; color: var(--color-text-dark-2); font-size: 1.1rem; font-weight: 500; padding: 1rem; background-color: rgba(227, 94, 63, 0.05); border-radius: 6px; border-left: 4px solid var(--color-accent-2);" class="markdown-content">${renderMarkdown(getValue('summary'))}</div>
        </div>
      ` : ''}
      
      ${hasValue('overview.origins') || hasValue('overview.knownFor') || hasValue('overview.purpose') || hasValue('overview.fitInUniverse') ? `
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleCollapse('overview-content')">
            <i class="fas fa-book-open" style="margin-right: 0.5rem;"></i> Overview <i class="japanese-header">概要</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="overview-content" class="collapsible-content">
            <div class="clan-info-section">
          ${hasValue('overview.origins') ? `
            <div style="margin-bottom: 1rem;">
              <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Origins:</strong>
              <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('overview.origins'))}</div>
            </div>
          ` : ''}
          ${hasValue('overview.knownFor') ? `
            <div style="margin-bottom: 1rem;">
              <strong style="color: var(--color-dark-2); font-size: 1.1rem;">What They Are Known For:</strong>
              <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('overview.knownFor'))}</div>
            </div>
          ` : ''}
          ${hasValue('overview.purpose') ? `
            <div style="margin-bottom: 1rem;">
              <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Their Purpose in the World:</strong>
              <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('overview.purpose'))}</div>
            </div>
          ` : ''}
          ${hasValue('overview.fitInUniverse') ? `
            <div style="margin-bottom: 1rem;">
              <strong style="color: var(--color-dark-2); font-size: 1.1rem;">How They Fit Into the Universe:</strong>
              <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('overview.fitInUniverse'))}</div>
            </div>
          ` : ''}
            </div>
          </div>
        </div>
      ` : ''}
      
      ${hasValue('kekkeiGenkai.name') || hasValue('kekkeiGenkai.description') ? `
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleCollapse('kekkei-genkai-content')">
            <i class="fas fa-eye" style="margin-right: 0.5rem;"></i> Kekkei Genkai / Hiden <i class="japanese-header">血継限界・秘伝</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="kekkei-genkai-content" class="collapsible-content">
            <div class="clan-info-section">
          ${hasValue('kekkeiGenkai.name') ? `
            <div style="margin-bottom: 1rem;">
              <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Name:</strong>
              <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; font-size: 1.1rem; font-weight: 600;">${getValue('kekkeiGenkai.name')}</div>
            </div>
          ` : ''}
          ${hasValue('kekkeiGenkai.description') ? `
            <div style="margin-bottom: 1rem;">
              <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Description:</strong>
              <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('kekkeiGenkai.description'))}</div>
            </div>
          ` : ''}
          ${hasValue('kekkeiGenkai.activation') ? `
            <div style="margin-bottom: 1rem;">
              <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Activation:</strong>
              <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('kekkeiGenkai.activation'))}</div>
            </div>
          ` : ''}
          ${hasArray('kekkeiGenkai.mechanics') ? `
            <div style="margin-bottom: 1rem;">
              <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Mechanics:</strong>
              <ul style="color: var(--color-text-dark-2); margin-top: 0.5rem; padding-left: 1.5rem;">
                ${getValue('kekkeiGenkai.mechanics', []).map(mechanic => `<li style="margin-bottom: 0.5rem; line-height: 1.6;">${renderMarkdown(mechanic)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          ${hasArray('kekkeiGenkai.strengths') ? `
            <div style="margin-bottom: 1rem;">
              <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Strengths:</strong>
              <ul style="color: var(--color-text-dark-2); margin-top: 0.5rem; padding-left: 1.5rem;">
                ${getValue('kekkeiGenkai.strengths', []).map(strength => `<li style="margin-bottom: 0.5rem; line-height: 1.6;">${renderMarkdown(strength)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          ${hasArray('kekkeiGenkai.weaknesses') ? `
            <div style="margin-bottom: 1rem;">
              <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Weaknesses:</strong>
              <ul style="color: var(--color-text-dark-2); margin-top: 0.5rem; padding-left: 1.5rem;">
                ${getValue('kekkeiGenkai.weaknesses', []).map(weakness => `<li style="margin-bottom: 0.5rem; line-height: 1.6;">${renderMarkdown(weakness)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
            </div>
          </div>
        </div>
      ` : ''}
      
      ${hasValue('geography.primaryLocation') || hasArray('geography.branches') || hasValue('geography.territory') || hasValue('geography.reputation') || hasValue('villagesLands.primaryLocation') || hasArray('villagesLands.branches') || hasValue('villagesLands.territory') || hasValue('villagesLands.reputation') ? `
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleCollapse('geography-content')">
            <i class="fas fa-map" style="margin-right: 0.5rem;"></i> Geography / Village Presence <i class="japanese-header">地理・村の存在</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="geography-content" class="collapsible-content">
            <div class="clan-info-section">
          ${hasValue('geography.primaryLocation') || hasValue('villagesLands.primaryLocation') ? `
            <div style="margin-bottom: 1rem;">
              <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Primary Location:</strong>
              <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('geography.primaryLocation') || getValue('villagesLands.primaryLocation'))}</div>
            </div>
          ` : ''}
          ${hasArray('geography.branches') || hasArray('villagesLands.branches') ? `
            <div style="margin-bottom: 1rem;">
              <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Branches in Other Villages:</strong>
              <ul style="color: var(--color-text-dark-2); margin-top: 0.5rem; padding-left: 1.5rem;">
                ${(() => {
                  const geoBranches = getArrayValue('geography.branches', []);
                  const villagesBranches = getArrayValue('villagesLands.branches', []);
                  const branches = geoBranches.length > 0 ? geoBranches : villagesBranches;
                  return branches.map(branch => `<li style="margin-bottom: 0.5rem; line-height: 1.6;">${renderMarkdown(branch)}</li>`).join('');
                })()}
              </ul>
            </div>
          ` : ''}
          ${hasValue('geography.territory') || hasValue('villagesLands.territory') ? `
            <div style="margin-bottom: 1rem;">
              <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Territory & Influence:</strong>
              <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('geography.territory') || getValue('villagesLands.territory'))}</div>
            </div>
          ` : ''}
          ${hasValue('geography.reputation') || hasValue('villagesLands.reputation') ? `
            <div style="margin-bottom: 1rem;">
              <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Reputation:</strong>
              <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('geography.reputation') || getValue('villagesLands.reputation'))}</div>
            </div>
          ` : ''}
            </div>
          </div>
        </div>
      ` : ''}
      
      ${hasValue('appearancePhysicalTraits') ? `
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleCollapse('appearance-content')">
            <i class="fas fa-user" style="margin-right: 0.5rem;"></i> Appearance / Physical Traits <i class="japanese-header">外見・身体的特徴</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="appearance-content" class="collapsible-content">
            <div class="clan-info-section">
              <div style="line-height: 1.8; color: var(--color-text-dark-2); font-size: 1.05rem;" class="markdown-content">${renderMarkdown(getValue('appearancePhysicalTraits'))}</div>
            </div>
          </div>
        </div>
      ` : ''}
      
      ${(() => {
        const newFormatAbilities = clan.abilities && typeof clan.abilities === 'object' && !Array.isArray(clan.abilities);
        const hasSignatureJutsu = newFormatAbilities && Array.isArray(clan.abilities.signatureJutsu) && clan.abilities.signatureJutsu.length > 0;
        const hasChakraNatures = newFormatAbilities && (clan.abilities.chakraNatures?.primary || clan.abilities.chakraNatures?.secondary || clan.abilities.chakraNatures?.rare);
        const hasCombatStyle = newFormatAbilities && clan.abilities.combatStyle && clan.abilities.combatStyle.trim() !== '';
        const hasRoleInVillage = newFormatAbilities && clan.abilities.roleInVillage && clan.abilities.roleInVillage.trim() !== '';
        const hasStrengths = newFormatAbilities && Array.isArray(clan.abilities.strengths) && clan.abilities.strengths.length > 0;
        const hasWeaknesses = newFormatAbilities && Array.isArray(clan.abilities.weaknesses) && clan.abilities.weaknesses.length > 0;
        const oldFormatAbilities = Array.isArray(clan.abilities) && clan.abilities.length > 0;
        return hasSignatureJutsu || hasChakraNatures || hasCombatStyle || hasRoleInVillage || hasStrengths || hasWeaknesses || oldFormatAbilities;
      })() ? `
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleCollapse('abilities-content')">
            <i class="fas fa-magic" style="margin-right: 0.5rem;"></i> Abilities <i class="japanese-header">能力</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="abilities-content" class="collapsible-content">
            <div class="clan-info-section">
          ${(() => {
            const newFormatAbilities = clan.abilities && typeof clan.abilities === 'object' && !Array.isArray(clan.abilities);
            const hasSignatureJutsu = newFormatAbilities && Array.isArray(clan.abilities.signatureJutsu) && clan.abilities.signatureJutsu.length > 0;
            const oldFormatAbilities = Array.isArray(clan.abilities) && clan.abilities.length > 0;
            
            if (hasSignatureJutsu) {
              return `
                <div style="margin-bottom: 1.5rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem; display: block; margin-bottom: 0.5rem;">Signature Jutsu:</strong>
                  <ul class="clan-abilities-list">
                    ${clan.abilities.signatureJutsu.map(jutsu => `<li><i class="fas fa-star" style="color: var(--color-accent-2); margin-right: 0.5rem;"></i>${renderMarkdown(jutsu)}</li>`).join('')}
                  </ul>
                </div>
              `;
            } else if (oldFormatAbilities) {
              return `
                <div style="margin-bottom: 1.5rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem; display: block; margin-bottom: 0.5rem;">Clan Abilities:</strong>
                  <ul class="clan-abilities-list">
                    ${clan.abilities.map(ability => `<li><i class="fas fa-star" style="color: var(--color-accent-2); margin-right: 0.5rem;"></i>${ability}</li>`).join('')}
                  </ul>
                </div>
              `;
            }
            return '';
          })()}
          ${(() => {
            const newFormatAbilities = clan.abilities && typeof clan.abilities === 'object' && !Array.isArray(clan.abilities);
            if (newFormatAbilities && (clan.abilities.chakraNatures?.primary || clan.abilities.chakraNatures?.secondary || clan.abilities.chakraNatures?.rare)) {
              const natures = [];
              if (clan.abilities.chakraNatures.primary) natures.push(`<strong>Primary:</strong> ${clan.abilities.chakraNatures.primary}`);
              if (clan.abilities.chakraNatures.secondary) natures.push(`<strong>Secondary:</strong> ${clan.abilities.chakraNatures.secondary}`);
              if (clan.abilities.chakraNatures.rare) natures.push(`<strong>Rare:</strong> ${clan.abilities.chakraNatures.rare}`);
              return `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Chakra Nature(s):</strong>
                  <div style="color: var(--color-text-dark-2); margin-top: 0.25rem;">${natures.join(' | ')}</div>
                </div>
              `;
            }
            return '';
          })()}
          ${(() => {
            const newFormatAbilities = clan.abilities && typeof clan.abilities === 'object' && !Array.isArray(clan.abilities);
            if (newFormatAbilities && clan.abilities.combatStyle && clan.abilities.combatStyle.trim() !== '') {
              return `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Combat Style:</strong>
                  <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(clan.abilities.combatStyle)}</div>
                </div>
              `;
            }
            return '';
          })()}
          ${(() => {
            const newFormatAbilities = clan.abilities && typeof clan.abilities === 'object' && !Array.isArray(clan.abilities);
            if (newFormatAbilities && clan.abilities.roleInVillage && clan.abilities.roleInVillage.trim() !== '') {
              return `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Role in Their Village:</strong>
                  <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(clan.abilities.roleInVillage)}</div>
                </div>
              `;
            }
            return '';
          })()}
          ${(() => {
            const newFormatAbilities = clan.abilities && typeof clan.abilities === 'object' && !Array.isArray(clan.abilities);
            if (newFormatAbilities && Array.isArray(clan.abilities.strengths) && clan.abilities.strengths.length > 0) {
              return `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Clan-wide Strengths:</strong>
                  <ul style="color: var(--color-text-dark-2); margin-top: 0.5rem; padding-left: 1.5rem;">
                    ${clan.abilities.strengths.map(strength => `<li style="margin-bottom: 0.5rem; line-height: 1.6;">${renderMarkdown(strength)}</li>`).join('')}
                  </ul>
                </div>
              `;
            }
            return '';
          })()}
          ${(() => {
            const newFormatAbilities = clan.abilities && typeof clan.abilities === 'object' && !Array.isArray(clan.abilities);
            if (newFormatAbilities && Array.isArray(clan.abilities.weaknesses) && clan.abilities.weaknesses.length > 0) {
              return `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Clan-wide Weaknesses:</strong>
                  <ul style="color: var(--color-text-dark-2); margin-top: 0.5rem; padding-left: 1.5rem;">
                    ${clan.abilities.weaknesses.map(weakness => `<li style="margin-bottom: 0.5rem; line-height: 1.6;">${renderMarkdown(weakness)}</li>`).join('')}
                  </ul>
                </div>
              `;
            }
            return '';
          })()}
            </div>
          </div>
        </div>
      ` : ''}
      
      ${hasValue('leaders.currentLeader') || hasArray('leaders.pastLeaders') || hasValue('leaders.heirs') ? `
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleCollapse('leaders-content')">
            <i class="fas fa-crown" style="margin-right: 0.5rem;"></i> Leaders <i class="japanese-header">リーダー</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="leaders-content" class="collapsible-content">
            <div class="clan-info-section">
          ${hasValue('leaders.currentLeader') ? `
            <div style="margin-bottom: 1rem;">
              <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Current Leader:</strong>
              <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('leaders.currentLeader'))}</div>
            </div>
          ` : ''}
          ${hasArray('leaders.pastLeaders') ? `
            <div style="margin-bottom: 1rem;">
              <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Past Leaders (Notable):</strong>
              <ul style="color: var(--color-text-dark-2); margin-top: 0.5rem; padding-left: 1.5rem;">
                ${getValue('leaders.pastLeaders', []).map(leader => `<li style="margin-bottom: 0.5rem; line-height: 1.6;">${renderMarkdown(leader)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          ${hasValue('leaders.heirs') ? `
            <div style="margin-bottom: 1rem;">
              <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Heirs:</strong>
              <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('leaders.heirs'))}</div>
            </div>
          ` : ''}
            </div>
          </div>
        </div>
      ` : ''}
      
      ${hasArray('notableMembers') ? `
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleCollapse('notable-members-content')">
            <i class="fas fa-users" style="margin-right: 0.5rem;"></i> Notable Clan Members <i class="japanese-header">著名な一族のメンバー</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="notable-members-content" class="collapsible-content">
            <div class="clan-info-section">
              <ul style="color: var(--color-text-dark-2); padding-left: 1.5rem;">
                ${getValue('notableMembers', []).map(member => `<li style="margin-bottom: 0.5rem; line-height: 1.6;">${renderMarkdown(member)}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      ` : ''}
      
      ${hasValue('clanHistory.ancientEra') || hasValue('clanHistory.feudalEra') || hasValue('clanHistory.foundingOfVillages') || hasValue('clanHistory.modernEra') || hasValue('history') ? `
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleCollapse('clan-history-content')">
            <i class="fas fa-scroll" style="margin-right: 0.5rem;"></i> Clan History <i class="japanese-header">一族の歴史</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="clan-history-content" class="collapsible-content">
            <div class="clan-info-section">
              ${hasValue('clanHistory.ancientEra') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Part I: Ancient Era</strong>
                  <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('clanHistory.ancientEra'))}</div>
                </div>
              ` : ''}
              ${hasValue('clanHistory.feudalEra') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Part II: Feudal Era / Warring States Period</strong>
                  <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('clanHistory.feudalEra'))}</div>
                </div>
              ` : ''}
              ${hasValue('clanHistory.foundingOfVillages') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Part III: Founding of the Hidden Villages</strong>
                  <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('clanHistory.foundingOfVillages'))}</div>
                </div>
              ` : ''}
              ${hasValue('clanHistory.modernEra') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Part IV: Modern Era</strong>
                  <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('clanHistory.modernEra'))}</div>
                </div>
              ` : ''}
              ${hasValue('history') ? `
                <div style="line-height: 1.8; color: var(--color-text-dark-2); font-size: 1.05rem; padding: 1rem; background-color: rgba(227, 94, 63, 0.05); border-radius: 6px; border-left: 4px solid var(--color-accent-2);" class="markdown-content">${renderMarkdown(clan.history)}</div>
              ` : ''}
            </div>
          </div>
        </div>
      ` : ''}
      
      ${hasValue('ocCreationAllowed') ? `
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleCollapse('oc-creation-policy-content')">
            <i class="fas fa-user-plus" style="margin-right: 0.5rem;"></i> OC Creation Policy <i class="japanese-header">OC作成ポリシー</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="oc-creation-policy-content" class="collapsible-content">
            <div class="clan-info-section">
              <div style="padding: 1rem; background-color: rgba(227, 94, 63, 0.05); border-radius: 6px; border-left: 4px solid var(--color-accent-2);">
                <strong style="color: var(--color-dark-2);">Are Others Allowed to Make OCs from This Clan?</strong>
                <div style="color: var(--color-text-dark-2); margin-top: 0.5rem; font-size: 1.1rem; font-weight: 600;">${getValue('ocCreationAllowed')}</div>
              </div>
            </div>
          </div>
        </div>
      ` : ''}
      
      ${hasValue('trivia') ? `
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleCollapse('trivia-content')">
            <i class="fas fa-lightbulb" style="margin-right: 0.5rem;"></i> Trivia <i class="japanese-header">トリビア</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="trivia-content" class="collapsible-content">
            <div class="clan-info-section">
              <div style="line-height: 1.8; color: var(--color-text-dark-2); font-size: 1.05rem; padding: 1rem; background-color: rgba(227, 94, 63, 0.05); border-radius: 6px; border-left: 4px solid var(--color-accent-2);" class="markdown-content">${renderMarkdown(getValue('trivia'))}</div>
            </div>
          </div>
        </div>
      ` : ''}
      
      ${hasValue('references') ? `
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleCollapse('references-content')">
            <i class="fas fa-book" style="margin-right: 0.5rem;"></i> References <i class="japanese-header">参考文献</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="references-content" class="collapsible-content">
            <div class="clan-info-section">
              <div style="line-height: 1.8; color: var(--color-text-dark-2); font-size: 1.05rem;" class="markdown-content">${renderMarkdown(getValue('references'))}</div>
            </div>
          </div>
        </div>
      ` : ''}
      
      ${hasValue('cultureTraditions.values') || hasValue('cultureTraditions.longHeldTraditions') || hasArray('cultureTraditions.clanSayings') ? `
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleCollapse('culture-traditions-content')">
            <i class="fas fa-torii-gate" style="margin-right: 0.5rem;"></i> Culture & Traditions <i class="japanese-header">文化と伝統</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="culture-traditions-content" class="collapsible-content">
            <div class="clan-info-section">
              ${hasArray('cultureTraditions.values') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Values:</strong>
                  <div style="color: var(--color-text-dark-2); margin-top: 0.25rem;">
                    ${getArrayValue('cultureTraditions.values', []).map(value => `<span style="display: inline-block; padding: 0.25rem 0.5rem; margin: 0.25rem; background-color: rgba(227, 94, 63, 0.1); border-radius: 4px; font-size: 0.9rem;">${value}</span>`).join('')}
                  </div>
                </div>
              ` : ''}
              ${hasValue('cultureTraditions.longHeldTraditions') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Long-held Traditions:</strong>
                  <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('cultureTraditions.longHeldTraditions'))}</div>
                </div>
              ` : ''}
              ${hasArray('cultureTraditions.clanSayings') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Clan Sayings or Proverbs:</strong>
                  <ul style="color: var(--color-text-dark-2); margin-top: 0.5rem; padding-left: 1.5rem;">
                    ${getArrayValue('cultureTraditions.clanSayings', []).map(saying => `<li style="margin-bottom: 0.5rem; line-height: 1.6; font-style: italic;">${renderMarkdown(saying)}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      ` : ''}
      
      ${hasValue('clanStructure.clanHead') || hasValue('clanStructure.councilElders') || hasValue('clanStructure.branchSystem') || hasValue('clanStructure.crestsSeals') || hasValue('clanStructure.politicalTensions') || hasValue('clanStructure.lawsRules') ? `
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleCollapse('clan-structure-content')">
            <i class="fas fa-sitemap" style="margin-right: 0.5rem;"></i> Clan Structure & Governance <i class="japanese-header">一族の構造と統治</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="clan-structure-content" class="collapsible-content">
            <div class="clan-info-section">
              ${hasValue('clanStructure.clanHead') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Clan Head:</strong>
                  <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('clanStructure.clanHead'))}</div>
                </div>
              ` : ''}
              ${hasValue('clanStructure.councilElders') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Council / Elders:</strong>
                  <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('clanStructure.councilElders'))}</div>
                </div>
              ` : ''}
              ${hasValue('clanStructure.branchSystem') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Branch System:</strong>
                  <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('clanStructure.branchSystem'))}</div>
                </div>
              ` : ''}
              ${hasValue('clanStructure.crestsSeals') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Crests / Seals:</strong>
                  <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('clanStructure.crestsSeals'))}</div>
                </div>
              ` : ''}
              ${hasValue('clanStructure.politicalTensions') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Political Tensions:</strong>
                  <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('clanStructure.politicalTensions'))}</div>
                </div>
              ` : ''}
              ${hasValue('clanStructure.lawsRules') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Laws & Rules:</strong>
                  <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('clanStructure.lawsRules'))}</div>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      ` : ''}
      
      ${hasValue('villagePlacement.primaryVillage') || hasValue('villagePlacement.dutiesAssigned') || hasValue('villagePlacement.relationsWithClans') || hasValue('villagePlacement.roleInConflicts') ? `
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleCollapse('village-politics-content')">
            <i class="fas fa-map-marked-alt" style="margin-right: 0.5rem;"></i> Village & Politics <i class="japanese-header">村と政治</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="village-politics-content" class="collapsible-content">
            <div class="clan-info-section">
              ${hasValue('villagePlacement.primaryVillage') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Primary Village:</strong>
                  <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('villagePlacement.primaryVillage'))}</div>
                </div>
              ` : ''}
              ${hasValue('villagePlacement.dutiesAssigned') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Village Duties:</strong>
                  <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('villagePlacement.dutiesAssigned'))}</div>
                </div>
              ` : ''}
              ${hasValue('villagePlacement.relationsWithClans') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Relations with Other Clans:</strong>
                  <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('villagePlacement.relationsWithClans'))}</div>
                </div>
              ` : ''}
              ${hasValue('villagePlacement.roleInConflicts') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Role in Major Conflicts:</strong>
                  <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('villagePlacement.roleInConflicts'))}</div>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      ` : ''}
      
      ${hasValue('combatInfo.signatureWeaponry') || hasArray('combatInfo.battleStrengths') || hasArray('combatInfo.battleWeaknesses') ? `
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleCollapse('combat-info-content')">
            <i class="fas fa-sword" style="margin-right: 0.5rem;"></i> Combat Information <i class="japanese-header">戦闘情報</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="combat-info-content" class="collapsible-content">
            <div class="clan-info-section">
              ${hasValue('combatInfo.signatureWeaponry') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Signature Weaponry:</strong>
                  <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('combatInfo.signatureWeaponry'))}</div>
                </div>
              ` : ''}
              ${hasArray('combatInfo.battleStrengths') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Battle Strengths:</strong>
                  <ul style="color: var(--color-text-dark-2); margin-top: 0.5rem; padding-left: 1.5rem;">
                    ${getArrayValue('combatInfo.battleStrengths', []).map(strength => `<li style="margin-bottom: 0.5rem; line-height: 1.6;">${renderMarkdown(strength)}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
              ${hasArray('combatInfo.battleWeaknesses') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Battle Weaknesses:</strong>
                  <ul style="color: var(--color-text-dark-2); margin-top: 0.5rem; padding-left: 1.5rem;">
                    ${getArrayValue('combatInfo.battleWeaknesses', []).map(weakness => `<li style="margin-bottom: 0.5rem; line-height: 1.6;">${renderMarkdown(weakness)}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      ` : ''}
      
      ${hasValue('clanSymbols.clanCrest') || hasArray('clanSymbols.artifacts') || hasValue('clanSymbols.secretKnowledge') ? `
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleCollapse('symbols-artifacts-content')">
            <i class="fas fa-scroll" style="margin-right: 0.5rem;"></i> Symbols, Artifacts & Secrets <i class="japanese-header">シンボル、遺物、秘密</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="symbols-artifacts-content" class="collapsible-content">
            <div class="clan-info-section">
              ${hasValue('clanSymbols.clanCrest') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Clan Crest:</strong>
                  <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('clanSymbols.clanCrest'))}</div>
                </div>
              ` : ''}
              ${hasArray('clanSymbols.artifacts') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Artifacts / Relics:</strong>
                  <ul style="color: var(--color-text-dark-2); margin-top: 0.5rem; padding-left: 1.5rem;">
                    ${getArrayValue('clanSymbols.artifacts', []).map(artifact => `<li style="margin-bottom: 0.5rem; line-height: 1.6;">${renderMarkdown(artifact)}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
              ${hasValue('clanSymbols.secretKnowledge') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Secret Knowledge:</strong>
                  <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('clanSymbols.secretKnowledge'))}</div>
                </div>
              ` : ''}
              ${hasArray('optionalExtras.restrictedTechniques') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Restricted Techniques (Kinjutsu):</strong>
                  <ul style="color: var(--color-text-dark-2); margin-top: 0.5rem; padding-left: 1.5rem;">
                    ${getArrayValue('optionalExtras.restrictedTechniques', []).map(tech => `<li style="margin-bottom: 0.5rem; line-height: 1.6;">${renderMarkdown(tech)}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      ` : ''}
      
      ${hasValue('optionalExtras.bloodlineMutations') || hasValue('optionalExtras.branchFamilySpecialties') || hasValue('optionalExtras.clanWeaknessDisease') || hasValue('optionalExtras.summoningContractHistory') || hasValue('optionalExtras.clanMotto') || hasValue('optionalExtras.clanRankingSystem') || hasValue('optionalExtras.clanArchitecture') ? `
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleCollapse('optional-extras-content')">
            <i class="fas fa-puzzle-piece" style="margin-right: 0.5rem;"></i> Optional Extras <i class="japanese-header">オプション追加</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="optional-extras-content" class="collapsible-content">
            <div class="clan-info-section">
              ${hasValue('optionalExtras.bloodlineMutations') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Bloodline Mutations:</strong>
                  <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('optionalExtras.bloodlineMutations'))}</div>
                </div>
              ` : ''}
              ${hasValue('optionalExtras.branchFamilySpecialties') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Branch Family Specialties:</strong>
                  <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('optionalExtras.branchFamilySpecialties'))}</div>
                </div>
              ` : ''}
              ${hasValue('optionalExtras.clanWeaknessDisease') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Clan Weakness Disease / Genetic Flaw:</strong>
                  <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('optionalExtras.clanWeaknessDisease'))}</div>
                </div>
              ` : ''}
              ${hasValue('optionalExtras.summoningContractHistory') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Summoning Contract History:</strong>
                  <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('optionalExtras.summoningContractHistory'))}</div>
                </div>
              ` : ''}
              ${hasValue('optionalExtras.clanMotto') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Clan Motto:</strong>
                  <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; font-size: 1.1rem; font-style: italic; font-weight: 600;">${getValue('optionalExtras.clanMotto')}</div>
                </div>
              ` : ''}
              ${hasValue('optionalExtras.clanRankingSystem') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Clan Ranking System:</strong>
                  <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('optionalExtras.clanRankingSystem'))}</div>
                </div>
              ` : ''}
              ${hasValue('optionalExtras.clanArchitecture') ? `
                <div style="margin-bottom: 1rem;">
                  <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Clan Architecture:</strong>
                  <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('optionalExtras.clanArchitecture'))}</div>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      ` : ''}
      
      ${hasArray('moodBoardImages') ? `
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleCollapse('mood-board-content')">
            <i class="fas fa-images" style="margin-right: 0.5rem;"></i> Aesthetic Mood Board <i class="japanese-header">美的ムードボード</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="mood-board-content" class="collapsible-content">
            <div class="clan-info-section">
              <div class="mood-board-grid">
                ${getValue('moodBoardImages', []).map((imgUrl, index) => `
                  <div class="mood-board-item" style="animation-delay: ${index * 0.1}s;">
                    <img src="${convertImageUrl(imgUrl)}" alt="Mood board image ${index + 1}" loading="lazy" onerror="this.style.display='none';">
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      ` : ''}
      
      <div class="collapsible-section">
        <div class="collapsible-header" onclick="toggleCollapse('clan-members-content')">
          <i class="fas fa-users" style="margin-right: 0.5rem;"></i> Clan Members <i class="japanese-header">一族のメンバー</i> (${members.length})
          <i class="fas fa-chevron-down bounce-arrow"></i>
        </div>
        <div id="clan-members-content" class="collapsible-content">
          <div class="clan-info-section">
            ${members.length > 0 ? `
              <div class="clan-members-grid">
                ${members.map(oc => `
                  <div class="clan-member-card" onclick="window.location.hash = 'ocs/${oc.id}'">
                    <div style="font-weight: 600; color: var(--color-dark-2); text-transform: uppercase; margin-bottom: 0.5rem;">${oc.firstName} ${oc.lastName}</div>
                    <div style="color: var(--color-text-dark); font-size: 0.9rem;">${oc.rank || 'Unknown Rank'}</div>
                    ${oc.village ? `<div style="color: var(--color-text-dark); font-size: 0.85rem; margin-top: 0.25rem; opacity: 0.8;">${oc.village}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : '<p style="text-align: center; color: var(--color-text-dark); font-style: italic; padding: 2rem;">No members yet.</p>'}
          </div>
        </div>
      </div>
      
    </div>
  `;
  
  return container;
}

window.deleteClan = function(id) {
  if (!window.adminAuthenticated) {
    alert('You must be logged into the admin panel to delete data.');
    window.navigateTo('admin');
    return;
  }
  if (confirm('Are you sure you want to delete this clan? This action cannot be undone.')) {
    import('./../data/storage.js').then(module => {
      module.default.deleteClan(id);
      window.navigateTo('clans');
    });
  }
};
