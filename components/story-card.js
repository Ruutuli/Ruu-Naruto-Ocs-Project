// Story Card Component - Preview card for story listing

export function renderStoryCard(story, onClick) {
  const card = document.createElement('div');
  card.className = 'card-naruto story-card fade-in';
  card.style.cursor = 'pointer';
  
  const date = story.createdAt ? new Date(story.createdAt).toLocaleDateString() : 'Unknown date';
  const chapterCount = story.chapters?.length || (story.content ? 1 : 0);
  
  card.innerHTML = `
    <div class="card-header-naruto">
      <h3 class="mb-0" style="text-transform: uppercase; letter-spacing: 1px;">${story.title || 'Untitled Story'}</h3>
    </div>
    <div class="card-body" style="padding: 1.5rem;">
      <div class="mb-2" style="padding: 0.5rem; background-color: rgba(80, 109, 99, 0.1); border-radius: 4px; margin-bottom: 0.75rem;">
        <strong style="color: var(--color-dark-2); text-transform: uppercase; font-size: 0.85rem;">Created:</strong> 
        <span style="color: var(--color-text-dark-2); font-weight: 500;">${date}</span>
        ${story.updatedAt && story.updatedAt !== story.createdAt ? 
          `<br><strong style="color: var(--color-dark-2); text-transform: uppercase; font-size: 0.85rem;">Updated:</strong> <span style="color: var(--color-text-dark-2); font-weight: 500;">${new Date(story.updatedAt).toLocaleDateString()}</span>` 
          : ''}
      </div>
      ${chapterCount > 1 ? `
        <div style="padding: 0.5rem; background-color: rgba(227, 94, 63, 0.1); border-radius: 4px; margin-bottom: 0.75rem; text-align: center;">
          <i class="fas fa-book" style="color: var(--color-accent-2); margin-right: 0.5rem;"></i>
          <strong style="color: var(--color-dark-2);">${chapterCount} Chapters</strong>
        </div>
      ` : ''}
      ${story.summary ? `
        <p style="margin-top: 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--color-text-dark); max-height: 120px; overflow: hidden; text-overflow: ellipsis; padding: 0.75rem; background-color: var(--color-bg-1); border-left: 3px solid var(--color-accent-2); border-radius: 4px;">
          ${story.summary.substring(0, 200)}${story.summary.length > 200 ? '...' : ''}
        </p>
      ` : '<p style="color: #999; font-style: italic; padding: 0.75rem;">No summary available.</p>'}
      ${story.tags && story.tags.length > 0 ? `
        <div style="margin-top: 1rem; display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${story.tags.map(tag => `<span class="badge" style="background-color: var(--color-accent-2); color: white; padding: 0.35rem 0.75rem; border-radius: 15px; font-size: 0.8rem; font-weight: 600; text-transform: uppercase;">${tag}</span>`).join('')}
        </div>
      ` : ''}
      ${story.characters && story.characters.length > 0 ? `
        <div style="margin-top: 1rem; padding: 0.5rem; background-color: rgba(80, 109, 99, 0.1); border-radius: 4px; text-align: center;">
          <i class="fas fa-users" style="color: var(--color-dark-3); margin-right: 0.5rem;"></i>
          <strong style="color: var(--color-dark-2); font-size: 0.9rem;">Characters:</strong> 
          <span style="color: var(--color-text-dark-2); font-weight: 500;">${story.characters.length}</span>
        </div>
      ` : ''}
      <div class="text-center mt-3">
        <button class="btn-naruto" onclick="event.stopPropagation();" style="width: 100%;">
          <i class="fas fa-book-open"></i> Read Story
        </button>
      </div>
    </div>
  `;
  
  card.addEventListener('click', () => onClick(story.id));
  
  return card;
}

