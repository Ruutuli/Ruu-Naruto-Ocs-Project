// Clan Detail Component

import storage from '../data/storage.js';
import { renderMarkdown } from '../utils/markdown.js';

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
          `<img src="${clan.symbol}" alt="${clan.name} Symbol" style="width: 180px; height: 180px; border: 4px solid var(--color-dark-3); border-radius: 12px; box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2); margin-bottom: 1.5rem;">` 
          : '<div style="width: 180px; height: 180px; background: linear-gradient(135deg, var(--color-bg-1) 0%, var(--color-bg-2) 100%); border: 4px solid var(--color-dark-3); border-radius: 12px; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);"><span style="color: var(--color-text-dark-2); font-weight: 600; text-transform: uppercase;">No Symbol</span></div>'
        }
        <div class="clan-info-row" style="justify-content: center; border-bottom: 2px solid var(--color-accent-2); padding-bottom: 1rem; margin-bottom: 1rem;">
          <div class="clan-info-label">Village:</div>
          <div class="clan-info-value" style="font-size: 1.2rem; font-weight: 600;">${clan.village || 'Unknown'}</div>
        </div>
      </div>
      
      ${hasValue('summary') ? `
        <div class="clan-info-section">
          <div style="line-height: 1.8; color: var(--color-text-dark-2); font-size: 1.1rem; font-weight: 500; padding: 1rem; background-color: rgba(227, 94, 63, 0.05); border-radius: 6px; border-left: 4px solid var(--color-accent-2);" class="markdown-content">${renderMarkdown(getValue('summary'))}</div>
        </div>
      ` : ''}
      
      ${hasValue('overview.origins') || hasValue('overview.knownFor') || hasValue('overview.purpose') || hasValue('overview.fitInUniverse') ? `
        <div class="clan-info-section">
          <h3><i class="fas fa-book-open" style="margin-right: 0.5rem;"></i> Overview <i class="japanese-header">概要</i></h3>
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
      ` : ''}
      
      ${hasValue('kekkeiGenkai.name') || hasValue('kekkeiGenkai.description') ? `
        <div class="clan-info-section">
          <h3><i class="fas fa-eye" style="margin-right: 0.5rem;"></i> Kekkei Genkai / Hiden <i class="japanese-header">血継限界・秘伝</i></h3>
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
      ` : ''}
      
      ${hasValue('villagesLands.primaryLocation') || hasArray('villagesLands.branches') || hasValue('villagesLands.territory') || hasValue('villagesLands.reputation') ? `
        <div class="clan-info-section">
          <h3><i class="fas fa-map" style="margin-right: 0.5rem;"></i> Village / Region Presence <i class="japanese-header">村・地域の存在</i></h3>
          ${hasValue('villagesLands.primaryLocation') ? `
            <div style="margin-bottom: 1rem;">
              <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Primary Location:</strong>
              <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('villagesLands.primaryLocation'))}</div>
            </div>
          ` : ''}
          ${hasArray('villagesLands.branches') ? `
            <div style="margin-bottom: 1rem;">
              <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Branches in Other Villages:</strong>
              <ul style="color: var(--color-text-dark-2); margin-top: 0.5rem; padding-left: 1.5rem;">
                ${getValue('villagesLands.branches', []).map(branch => `<li style="margin-bottom: 0.5rem; line-height: 1.6;">${renderMarkdown(branch)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          ${hasValue('villagesLands.territory') ? `
            <div style="margin-bottom: 1rem;">
              <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Territory & Influence:</strong>
              <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('villagesLands.territory'))}</div>
            </div>
          ` : ''}
          ${hasValue('villagesLands.reputation') ? `
            <div style="margin-bottom: 1rem;">
              <strong style="color: var(--color-dark-2); font-size: 1.1rem;">Reputation:</strong>
              <div style="color: var(--color-text-dark-2); margin-top: 0.25rem; line-height: 1.8;" class="markdown-content">${renderMarkdown(getValue('villagesLands.reputation'))}</div>
            </div>
          ` : ''}
        </div>
      ` : ''}
      
      ${hasValue('appearancePhysicalTraits') ? `
        <div class="clan-info-section">
          <h3><i class="fas fa-user" style="margin-right: 0.5rem;"></i> Appearance / Physical Traits <i class="japanese-header">外見・身体的特徴</i></h3>
          <div style="line-height: 1.8; color: var(--color-text-dark-2); font-size: 1.05rem;" class="markdown-content">${renderMarkdown(getValue('appearancePhysicalTraits'))}</div>
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
        <div class="clan-info-section">
          <h3><i class="fas fa-magic" style="margin-right: 0.5rem;"></i> Abilities <i class="japanese-header">能力</i></h3>
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
      ` : ''}
      
      ${hasValue('leaders.currentLeader') || hasArray('leaders.pastLeaders') || hasValue('leaders.heirs') ? `
        <div class="clan-info-section">
          <h3><i class="fas fa-crown" style="margin-right: 0.5rem;"></i> Leaders <i class="japanese-header">リーダー</i></h3>
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
      ` : ''}
      
      ${hasArray('notableMembers') ? `
        <div class="clan-info-section">
          <h3><i class="fas fa-users" style="margin-right: 0.5rem;"></i> Notable Clan Members <i class="japanese-header">著名な一族のメンバー</i></h3>
          <ul style="color: var(--color-text-dark-2); padding-left: 1.5rem;">
            ${getValue('notableMembers', []).map(member => `<li style="margin-bottom: 0.5rem; line-height: 1.6;">${renderMarkdown(member)}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      ${hasValue('history') ? `
        <div class="clan-info-section">
          <h3><i class="fas fa-scroll" style="margin-right: 0.5rem;"></i> History <i class="japanese-header">歴史</i></h3>
          <div style="line-height: 1.8; color: var(--color-text-dark-2); font-size: 1.05rem; padding: 1rem; background-color: rgba(227, 94, 63, 0.05); border-radius: 6px; border-left: 4px solid var(--color-accent-2);" class="markdown-content">${renderMarkdown(clan.history)}</div>
        </div>
      ` : ''}
      
      ${hasValue('ocCreationAllowed') ? `
        <div class="clan-info-section">
          <h3><i class="fas fa-user-plus" style="margin-right: 0.5rem;"></i> OC Creation Policy <i class="japanese-header">OC作成ポリシー</i></h3>
          <div style="padding: 1rem; background-color: rgba(227, 94, 63, 0.05); border-radius: 6px; border-left: 4px solid var(--color-accent-2);">
            <strong style="color: var(--color-dark-2);">Are Others Allowed to Make OCs from This Clan?</strong>
            <div style="color: var(--color-text-dark-2); margin-top: 0.5rem; font-size: 1.1rem; font-weight: 600;">${getValue('ocCreationAllowed')}</div>
          </div>
        </div>
      ` : ''}
      
      ${hasValue('trivia') ? `
        <div class="clan-info-section">
          <h3><i class="fas fa-lightbulb" style="margin-right: 0.5rem;"></i> Trivia <i class="japanese-header">トリビア</i></h3>
          <div style="line-height: 1.8; color: var(--color-text-dark-2); font-size: 1.05rem; padding: 1rem; background-color: rgba(227, 94, 63, 0.05); border-radius: 6px; border-left: 4px solid var(--color-accent-2);" class="markdown-content">${renderMarkdown(getValue('trivia'))}</div>
        </div>
      ` : ''}
      
      ${hasValue('references') ? `
        <div class="clan-info-section">
          <h3><i class="fas fa-book" style="margin-right: 0.5rem;"></i> References <i class="japanese-header">参考文献</i></h3>
          <div style="line-height: 1.8; color: var(--color-text-dark-2); font-size: 1.05rem;" class="markdown-content">${renderMarkdown(getValue('references'))}</div>
        </div>
      ` : ''}
      
      ${hasArray('moodBoardImages') ? `
        <div class="clan-info-section">
          <h3><i class="fas fa-images" style="margin-right: 0.5rem;"></i> Aesthetic Mood Board <i class="japanese-header">美的ムードボード</i></h3>
          <div class="mood-board-grid">
            ${getValue('moodBoardImages', []).map((imgUrl, index) => `
              <div class="mood-board-item" style="animation-delay: ${index * 0.1}s;">
                <img src="${imgUrl}" alt="Mood board image ${index + 1}" loading="lazy" onerror="this.style.display='none';">
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      <div class="clan-info-section">
        <h3><i class="fas fa-users" style="margin-right: 0.5rem;"></i> Clan Members <i class="japanese-header">一族のメンバー</i> (${members.length})</h3>
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
