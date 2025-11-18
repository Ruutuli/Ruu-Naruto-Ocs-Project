// Lore List Component

export function renderLoreList(loreEntries, onClick) {
  const container = document.createElement('div');
  
  const groupedByCategory = {
    village: [],
    technique: [],
    history: [],
    world: []
  };
  
  loreEntries.forEach(lore => {
    if (groupedByCategory[lore.category]) {
      groupedByCategory[lore.category].push(lore);
    } else {
      groupedByCategory.world.push(lore);
    }
  });
  
  const categoryIcons = {
    village: 'fa-city',
    technique: 'fa-fire',
    history: 'fa-scroll',
    world: 'fa-globe'
  };
  
  container.innerHTML = `
    ${Object.entries(groupedByCategory).map(([category, entries]) => {
      if (entries.length === 0) return '';
      
      return `
        <div class="lore-category-card">
          <div class="lore-category-header">
            <i class="fas ${categoryIcons[category] || 'fa-book'}" style="margin-right: 0.75rem;"></i>
            ${category.charAt(0).toUpperCase() + category.slice(1)} (${entries.length})
          </div>
          <div>
            ${entries.map(lore => `
              <div class="lore-entry-card" onclick="window.location.hash = 'lore/${lore.id}'">
                <div class="lore-entry-title">
                  <i class="fas fa-bookmark" style="color: var(--color-accent-2); margin-right: 0.5rem; font-size: 0.9rem;"></i>
                  ${lore.title || 'Untitled Lore'}
                </div>
                <div class="lore-entry-preview">
                  ${lore.content?.substring(0, 200) || 'No content available.'}${lore.content && lore.content.length > 200 ? '...' : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('')}
  `;
  
  return container;
}

