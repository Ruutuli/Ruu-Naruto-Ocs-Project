// Clan Card Component - Preview card for clan listing

import { renderMarkdown } from '../utils/markdown.js';

export function renderClanCard(clan, onClick) {
  const card = document.createElement('div');
  card.className = 'card-naruto clan-card fade-in';
  card.style.cursor = 'pointer';
  
  // Truncate description for preview (smart truncation that respects markdown)
  let descriptionPreview = '';
  if (clan.description) {
    const maxLength = 150;
    // Remove markdown formatting for length calculation
    const plainText = clan.description
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .replace(/#{1,6}\s+/g, '')
      .replace(/`([^`]+)`/g, '$1');
    
    if (plainText.length > maxLength) {
      // Find a good truncation point (end of word/sentence)
      let truncateAt = maxLength;
      const lastSpace = plainText.lastIndexOf(' ', maxLength);
      const lastPeriod = plainText.lastIndexOf('.', maxLength);
      const lastNewline = plainText.lastIndexOf('\n', maxLength);
      
      // Prefer truncating at sentence end, then word end, then newline
      if (lastPeriod > maxLength * 0.7) {
        truncateAt = lastPeriod + 1;
      } else if (lastSpace > maxLength * 0.7) {
        truncateAt = lastSpace;
      } else if (lastNewline > 0) {
        truncateAt = lastNewline;
      }
      
      // Truncate the original markdown text (not plain text) to preserve formatting
      const truncatedMarkdown = clan.description.substring(0, truncateAt) + '...';
      descriptionPreview = renderMarkdown(truncatedMarkdown);
    } else {
      // Render full markdown if within limit
      descriptionPreview = renderMarkdown(clan.description);
    }
  }
  
  card.innerHTML = `
    <div class="card-header-naruto">
      <h3 class="mb-0" style="text-transform: uppercase; letter-spacing: 1px;">${clan.name || 'Unnamed Clan'}</h3>
    </div>
    <div class="card-body" style="padding: 1.5rem;">
      ${clan.symbol ? 
        `<img src="${clan.symbol}" alt="${clan.name} Symbol" class="clan-symbol" style="width: 120px; height: 120px; margin: 0 auto 1.5rem; display: block; border: 3px solid var(--color-dark-3); border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);">` 
        : `<div style="width: 120px; height: 120px; background: linear-gradient(135deg, var(--color-bg-1) 0%, var(--color-bg-2) 100%); border: 3px solid var(--color-dark-3); border-radius: 8px; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);">
            <span style="color: var(--color-text-dark-2); font-weight: 600; text-transform: uppercase; font-size: 0.85rem;">No Symbol</span>
          </div>`
      }
      <div class="text-center mb-2" style="padding: 0.5rem; background-color: rgba(227, 94, 63, 0.1); border-radius: 4px; margin-bottom: 0.75rem;">
        <strong style="color: var(--color-dark-2); text-transform: uppercase; font-size: 0.9rem;">Village:</strong> 
        <span style="color: var(--color-text-dark-2); font-weight: 500;">${clan.village || 'Unknown'}</span>
      </div>
      <div class="text-center mb-2" style="padding: 0.5rem; background-color: rgba(80, 109, 99, 0.1); border-radius: 4px; margin-bottom: 1rem;">
        <strong style="color: var(--color-dark-2); text-transform: uppercase; font-size: 0.9rem;">Members:</strong> 
        <span style="color: var(--color-text-dark-2); font-weight: 500; font-size: 1.1rem;">${clan.members?.length || 0}</span>
      </div>
      ${descriptionPreview ? `
        <div style="margin-top: 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--color-text-dark); max-height: 100px; overflow: hidden; padding: 0.75rem; background-color: var(--color-bg-1); border-left: 3px solid var(--color-accent-2); border-radius: 4px;" class="markdown-content">
          ${descriptionPreview}
        </div>
      ` : ''}
      <div class="text-center mt-3">
        <button class="btn-naruto" onclick="event.stopPropagation();" style="width: 100%;">View Details</button>
      </div>
    </div>
  `;
  
  card.addEventListener('click', () => onClick(clan.id));
  
  return card;
}

