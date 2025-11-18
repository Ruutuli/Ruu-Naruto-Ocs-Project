// Lore Detail Component

import storage from '../data/storage.js';
import { renderMarkdown } from '../utils/markdown.js';

export function renderLoreDetail(lore) {
  const container = document.createElement('div');
  container.className = 'detail-scroll';
  
  const relatedOCs = lore.relatedOCs?.map(id => storage.getOC(id)).filter(oc => oc) || [];
  const relatedClans = lore.relatedClans?.map(id => storage.getClan(id)).filter(clan => clan) || [];
  
  const categoryIcons = {
    village: 'fa-city',
    technique: 'fa-fire',
    history: 'fa-scroll',
    world: 'fa-globe'
  };
  
  container.innerHTML = `
    <div class="detail-backdrop"></div>
    <div class="detail-header">
      <div class="detail-header-inner">
        <div class="detail-header-border"></div>
      </div>
    </div>
    <div class="detail-content">
      <h1 class="detail-title">${lore.title || 'Untitled Lore'}</h1>
      <div style="text-align: center; margin-bottom: 2rem;">
        <span class="lore-category-badge">
          <i class="fas ${categoryIcons[lore.category] || 'fa-book'}" style="margin-right: 0.5rem;"></i>
          ${(lore.category || 'world').charAt(0).toUpperCase() + (lore.category || 'world').slice(1)}
        </span>
      </div>
      
      ${relatedOCs.length > 0 ? `
        <div class="lore-related-section">
          <h3><i class="fas fa-users" style="margin-right: 0.5rem; color: var(--color-accent-2);"></i>Related OCs</h3>
          <div class="lore-related-grid">
            ${relatedOCs.map(oc => `
              <div class="lore-related-card" onclick="window.location.hash = 'ocs/${oc.id}'">
                <div style="font-weight: 600; color: var(--color-dark-2); text-transform: uppercase; margin-bottom: 0.5rem;">${oc.firstName} ${oc.lastName}</div>
                <div style="color: var(--color-text-dark); font-size: 0.9rem;">${oc.rank || 'Unknown Rank'}</div>
                ${oc.village ? `<div style="color: var(--color-text-dark); font-size: 0.85rem; margin-top: 0.25rem; opacity: 0.8;">${oc.village}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      ${relatedClans.length > 0 ? `
        <div class="lore-related-section">
          <h3><i class="fas fa-shield-alt" style="margin-right: 0.5rem; color: var(--color-accent-2);"></i>Related Clans</h3>
          <div class="lore-related-grid">
            ${relatedClans.map(clan => `
              <div class="lore-related-card" onclick="window.location.hash = 'clans/${clan.id}'">
                <div style="font-weight: 600; color: var(--color-dark-2); text-transform: uppercase; margin-bottom: 0.5rem;">${clan.name}</div>
                <div style="color: var(--color-text-dark); font-size: 0.9rem;">${clan.village || 'Unknown Village'}</div>
                ${clan.members?.length ? `<div style="color: var(--color-text-dark); font-size: 0.85rem; margin-top: 0.25rem; opacity: 0.8;">${clan.members.length} member${clan.members.length !== 1 ? 's' : ''}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      <div class="lore-related-section">
        <h3 style="margin-bottom: 1.5rem;"><i class="fas fa-scroll" style="margin-right: 0.5rem; color: var(--color-accent-2);"></i>Lore Content</h3>
        <div class="lore-content-section markdown-content">
          ${renderMarkdown(lore.content || 'No content available.')}
        </div>
      </div>
      
    </div>
  `;
  
  return container;
}

window.deleteLore = function(id) {
  if (!window.adminAuthenticated) {
    alert('You must be logged into the admin panel to delete data.');
    window.navigateTo('admin');
    return;
  }
  if (confirm('Are you sure you want to delete this lore entry? This action cannot be undone.')) {
    import('./../data/storage.js').then(module => {
      module.default.deleteLore(id);
      window.navigateTo('lore');
    });
  }
};

