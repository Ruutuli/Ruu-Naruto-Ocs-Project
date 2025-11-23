// Story Detail Component

import storage from '../data/storage.js';
import { renderMarkdown } from '../utils/markdown.js';
import { convertImageUrl } from '../utils/imageUtils.js';

export function renderStoryDetail(story) {
  const container = document.createElement('div');
  container.className = 'detail-scroll';
  
  const characters = story.characters?.map(id => storage.getOC(id)).filter(oc => oc) || [];
  const createdAt = story.createdAt ? new Date(story.createdAt).toLocaleDateString() : 'Unknown';
  const updatedAt = story.updatedAt ? new Date(story.updatedAt).toLocaleDateString() : 'Unknown';
  
  // Support for chapters - if story has chapters array, use it; otherwise use content as single chapter
  const chapters = story.chapters || (story.content ? [{ title: 'Chapter 1', content: story.content }] : []);
  const currentChapterIndex = story.currentChapterIndex !== undefined ? story.currentChapterIndex : 0;
  const currentChapter = chapters[currentChapterIndex] || chapters[0] || { title: 'No Chapter', content: 'No content available.' };
  
  // Create chapter navigation
  const chapterNav = chapters.length > 1 ? `
    <div class="story-chapter-nav">
      <select class="story-chapter-select" id="story-chapter-select" onchange="window.changeStoryChapter('${story.id}', parseInt(this.value))">
        ${chapters.map((chapter, index) => `
          <option value="${index}" ${index === currentChapterIndex ? 'selected' : ''}>
            Chapter ${index + 1}${chapter.title ? `: ${chapter.title}` : ''}
          </option>
        `).join('')}
      </select>
      <div class="story-chapter-nav-buttons">
        <button class="story-chapter-btn" ${currentChapterIndex === 0 ? 'disabled' : ''} 
          onclick="window.changeStoryChapter('${story.id}', ${currentChapterIndex - 1})">
          <i class="fas fa-chevron-left"></i> Previous
        </button>
        <button class="story-chapter-btn" ${currentChapterIndex >= chapters.length - 1 ? 'disabled' : ''} 
          onclick="window.changeStoryChapter('${story.id}', ${currentChapterIndex + 1})">
          Next <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  ` : '';
  
  container.innerHTML = `
    <div class="detail-backdrop"></div>
    <div class="detail-header">
      <div class="detail-header-inner">
        <div class="detail-header-border"></div>
      </div>
    </div>
    <div class="detail-content">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h1 class="detail-title" style="margin: 0;">${story.title || 'Untitled Story'}</h1>
        <button class="btn-naruto" onclick="window.editStory('${story.id}')" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
          <i class="fas fa-edit"></i> Edit
        </button>
      </div>
      
      <div class="story-meta-section">
        <div class="story-meta-item">
          <i class="fas fa-calendar" style="color: var(--color-accent-2); margin-right: 0.5rem;"></i>
          <strong>Created:</strong> ${createdAt}
        </div>
        ${story.updatedAt && story.updatedAt !== story.createdAt ? `
          <div class="story-meta-item">
            <i class="fas fa-edit" style="color: var(--color-accent-2); margin-right: 0.5rem;"></i>
            <strong>Updated:</strong> ${updatedAt}
          </div>
        ` : ''}
        ${story.author ? `
          <div class="story-meta-item">
            <i class="fas fa-user" style="color: var(--color-accent-2); margin-right: 0.5rem;"></i>
            <strong>Author:</strong> ${story.author}
          </div>
        ` : ''}
        ${chapters.length > 1 ? `
          <div class="story-meta-item">
            <i class="fas fa-book" style="color: var(--color-accent-2); margin-right: 0.5rem;"></i>
            <strong>Chapters:</strong> ${chapters.length}
          </div>
        ` : ''}
      </div>
      
      ${story.tags && story.tags.length > 0 ? `
        <div class="story-tags-container">
          ${story.tags.map(tag => `<span class="story-tag">${tag}</span>`).join('')}
        </div>
      ` : ''}
      
      ${story.summary ? `
        <div class="story-summary-section">
          <h3><i class="fas fa-scroll" style="margin-right: 0.5rem; color: var(--color-accent-2);"></i>Summary</h3>
          <div class="story-summary-text markdown-content">${renderMarkdown(story.summary)}</div>
        </div>
      ` : ''}
      
      ${characters.length > 0 ? `
        <div class="story-characters-section">
          <h3><i class="fas fa-users" style="margin-right: 0.5rem; color: var(--color-accent-2);"></i>Characters</h3>
          <div class="story-characters-grid">
            ${characters.map(oc => {
              const profileImageUrl = oc.profileImage ? convertImageUrl(oc.profileImage) : null;
              return `
              <div class="story-character-card" onclick="window.location.hash = 'ocs/${oc.id}'">
                ${profileImageUrl ? `<img src="${profileImageUrl}" style="width: 100%; max-height: 120px; object-fit: cover; margin-bottom: 0.5rem; border-radius: 4px;">` : ''}
                <div style="font-weight: 600; color: var(--color-dark-2); text-transform: uppercase; margin-bottom: 0.5rem;">${oc.firstName} ${oc.lastName}</div>
                <div style="color: var(--color-text-dark); font-size: 0.9rem;">${oc.rank || 'Unknown Rank'}</div>
                ${oc.village ? `<div style="color: var(--color-text-dark); font-size: 0.85rem; margin-top: 0.25rem; opacity: 0.8;">${oc.village}</div>` : ''}
              </div>
            `;
            }).join('')}
          </div>
        </div>
      ` : ''}
      
      ${chapterNav}
      
      ${chapters.length > 1 ? `
        <div class="story-chapter-header">
          <div class="story-chapter-title">${currentChapter.title || `Chapter ${currentChapterIndex + 1}`}</div>
          <div class="story-chapter-number">Chapter ${currentChapterIndex + 1} of ${chapters.length}</div>
        </div>
      ` : ''}
      
      <div class="story-content-section" id="story-content-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
          ${chapters.length > 1 ? '' : '<h3 style="margin: 0;"><i class="fas fa-scroll" style="margin-right: 0.5rem; color: var(--color-accent-2);"></i>Story Content</h3>'}
          <button class="btn-naruto" id="reader-mode-toggle" onclick="window.toggleReaderMode()" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
            <i class="fas fa-book-reader"></i> <span id="reader-mode-text">Reader Mode</span>
          </button>
        </div>
        <div class="story-content-text markdown-content" id="story-content-text">${renderMarkdown(currentChapter.content || 'No content available.')}</div>
      </div>
      
      ${chapters.length > 1 ? `
        <div class="story-chapter-nav story-chapter-nav-bottom">
          <button class="story-chapter-btn" ${currentChapterIndex === 0 ? 'disabled' : ''} 
            onclick="window.changeStoryChapter('${story.id}', ${currentChapterIndex - 1})">
            <i class="fas fa-chevron-left"></i> Previous Chapter
          </button>
          <div class="story-chapter-info">
            Chapter ${currentChapterIndex + 1} of ${chapters.length}
          </div>
          <button class="story-chapter-btn" ${currentChapterIndex >= chapters.length - 1 ? 'disabled' : ''} 
            onclick="window.changeStoryChapter('${story.id}', ${currentChapterIndex + 1})">
            Next Chapter <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      ` : ''}
      
    </div>
  `;
  
  return container;
}

// Chapter navigation function
window.changeStoryChapter = function(storyId, chapterIndex) {
  import('./../data/storage.js').then(module => {
    const storage = module.default;
    const story = storage.getStory(storyId);
    if (!story) return;
    
    const chapters = story.chapters || (story.content ? [{ title: 'Chapter 1', content: story.content }] : []);
    if (chapterIndex < 0 || chapterIndex >= chapters.length) return;
    
    // Update current chapter index
    story.currentChapterIndex = chapterIndex;
    storage.saveStory(story);
    
    // Re-render the story detail
    import('./story-detail.js').then(detailModule => {
      const container = document.getElementById('story-detail-container');
      const detail = detailModule.renderStoryDetail(story);
      container.innerHTML = '';
      container.appendChild(detail);
      
      // Restore reader mode if it was active
      window.restoreReaderMode();
      
      // Scroll to top of content
      const contentSection = container.querySelector('.story-content-section');
      if (contentSection) {
        contentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
};

window.deleteStory = function(id) {
  if (!window.adminAuthenticated) {
    alert('You must be logged into the admin panel to delete data.');
    window.navigateTo('admin');
    return;
  }
  if (confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
    import('./../data/storage.js').then(module => {
      module.default.deleteStory(id);
      window.navigateTo('stories');
    });
  }
};

// Reader mode toggle
window.toggleReaderMode = function() {
  const container = document.querySelector('.detail-content');
  const contentSection = document.getElementById('story-content-section');
  const contentText = document.getElementById('story-content-text');
  const toggleBtn = document.getElementById('reader-mode-toggle');
  const toggleText = document.getElementById('reader-mode-text');
  
  if (!container || !contentSection || !contentText) return;
  
  const isReaderMode = container.classList.toggle('reader-mode-active');
  
  if (isReaderMode) {
    toggleText.textContent = 'Exit Reader Mode';
    toggleBtn.innerHTML = '<i class="fas fa-times"></i> <span id="reader-mode-text">Exit Reader Mode</span>';
    // Scroll to content
    setTimeout(() => {
      contentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  } else {
    toggleText.textContent = 'Reader Mode';
    toggleBtn.innerHTML = '<i class="fas fa-book-reader"></i> <span id="reader-mode-text">Reader Mode</span>';
  }
  
  // Save preference to localStorage
  localStorage.setItem('storyReaderMode', isReaderMode ? 'true' : 'false');
};

// Restore reader mode preference on load
window.restoreReaderMode = function() {
  const savedMode = localStorage.getItem('storyReaderMode');
  if (savedMode === 'true') {
    const container = document.querySelector('.detail-content');
    if (container) {
      container.classList.add('reader-mode-active');
      const toggleBtn = document.getElementById('reader-mode-toggle');
      if (toggleBtn) {
        toggleBtn.innerHTML = '<i class="fas fa-times"></i> <span id="reader-mode-text">Exit Reader Mode</span>';
      }
    }
  }
};

