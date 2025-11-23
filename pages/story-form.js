// Story Form Component

import { defaultStory, generateId } from '../data/default-data.js';
import storage from '../data/storage.js';

export function renderStoryForm(story = null, onSave) {
  const isEdit = !!story;
  const formStory = story || { ...defaultStory, id: generateId() };
  const ocs = storage.getAllOCs();
  
  // Handle backward compatibility: if story has content but no chapters, convert to single chapter
  let chapters = formStory.chapters || [];
  if (!chapters.length && formStory.content) {
    chapters = [{ title: 'Chapter 1', content: formStory.content }];
  }
  // If no chapters at all, start with one empty chapter
  if (!chapters.length) {
    chapters = [{ title: '', content: '' }];
  }
  
  const form = document.createElement('div');
  form.className = 'card-naruto';
  
  // Generate chapters HTML
  const chaptersHTML = chapters.map((chapter, index) => `
    <div class="chapter-item" data-chapter-index="${index}" style="border: 2px solid var(--color-accent-2); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; background-color: var(--color-bg-1);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h3 style="margin: 0; color: var(--color-dark-2); text-transform: uppercase; font-size: 1.1rem;">
          <i class="fas fa-book" style="color: var(--color-accent-2); margin-right: 0.5rem;"></i>
          Chapter ${index + 1}
        </h3>
        ${chapters.length > 1 ? `
          <button type="button" class="btn-naruto btn-naruto-danger" onclick="window.removeChapter(${index})" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
            <i class="fas fa-trash"></i> Remove
          </button>
        ` : ''}
      </div>
      <div class="form-group">
        <label class="form-label">Chapter Title</label>
        <input type="text" class="form-control chapter-title" data-chapter-index="${index}" 
               value="${chapter.title || ''}" 
               placeholder="Chapter ${index + 1}">
      </div>
      <div class="form-group">
        <label class="form-label">Chapter Content</label>
        <textarea class="form-control chapter-content" data-chapter-index="${index}" 
                  rows="15" style="font-family: monospace;">${chapter.content || ''}</textarea>
      </div>
    </div>
  `).join('');
  
  form.innerHTML = `
    <div class="card-header-naruto">
      <h2>${isEdit ? 'Edit' : 'Create'} Story</h2>
    </div>
    <div class="card-body">
      <form id="story-form" onsubmit="event.preventDefault(); window.saveStoryForm();">
        <!-- Save Button at Top -->
        <div class="mb-4" style="display: flex; justify-content: flex-start; gap: 0.5rem; padding-bottom: 1rem; border-bottom: 2px solid var(--color-border-2);">
          <button type="submit" class="btn-naruto">
            <i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Create'} Story
          </button>
          <button type="button" class="btn-naruto btn-naruto-secondary" onclick="window.navigateTo('stories')">
            <i class="fas fa-times"></i> Cancel
          </button>
        </div>
        <div class="form-group">
          <label class="form-label">Title</label>
          <input type="text" class="form-control" id="title" value="${formStory.title || ''}" required>
        </div>
        
        <div class="form-group">
          <label class="form-label">Summary</label>
          <textarea class="form-control" id="summary" rows="4">${formStory.summary || ''}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Author</label>
          <input type="text" class="form-control" id="author" value="${formStory.author || ''}" placeholder="Leave empty if you wrote it">
          <small style="color: var(--color-text-dark-2); font-size: 0.85rem;">Leave empty if you are the author</small>
        </div>
        
        <div class="form-group">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <label class="form-label" style="margin: 0;">Chapters</label>
            <button type="button" class="btn-naruto" onclick="window.addChapter()" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
              <i class="fas fa-plus"></i> Add Chapter
            </button>
          </div>
          <div id="chapters-container">
            ${chaptersHTML}
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Tags (comma-separated)</label>
          <input type="text" class="form-control" id="tags" value="${(formStory.tags || []).join(', ')}" placeholder="tag1, tag2, tag3">
        </div>
        
        <div class="form-group">
          <label class="form-label">Characters</label>
          <select class="form-control" id="characters" multiple size="8">
            ${ocs.map(oc => `
              <option value="${oc.id}" ${(formStory.characters || []).includes(oc.id) ? 'selected' : ''}>
                ${oc.firstName} ${oc.lastName} - ${oc.rank}
              </option>
            `).join('')}
          </select>
          <small>Hold Ctrl/Cmd to select multiple characters</small>
        </div>
        
        <div class="mt-4">
          <button type="submit" class="btn-naruto">${isEdit ? 'Update' : 'Create'} Story</button>
          <button type="button" class="btn-naruto btn-naruto-secondary" onclick="window.navigateTo('stories')" style="margin-left: 0.5rem;">Cancel</button>
        </div>
      </form>
    </div>
  `;
  
  // Chapter management functions
  window.addChapter = () => {
    const container = document.getElementById('chapters-container');
    const chapterIndex = container.children.length;
    const chapterDiv = document.createElement('div');
    chapterDiv.className = 'chapter-item';
    chapterDiv.setAttribute('data-chapter-index', chapterIndex);
    chapterDiv.style.cssText = 'border: 2px solid var(--color-accent-2); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; background-color: var(--color-bg-1);';
    chapterDiv.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h3 style="margin: 0; color: var(--color-dark-2); text-transform: uppercase; font-size: 1.1rem;">
          <i class="fas fa-book" style="color: var(--color-accent-2); margin-right: 0.5rem;"></i>
          Chapter ${chapterIndex + 1}
        </h3>
        <button type="button" class="btn-naruto btn-naruto-danger" onclick="window.removeChapter(${chapterIndex})" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
          <i class="fas fa-trash"></i> Remove
        </button>
      </div>
      <div class="form-group">
        <label class="form-label">Chapter Title</label>
        <input type="text" class="form-control chapter-title" data-chapter-index="${chapterIndex}" 
               placeholder="Chapter ${chapterIndex + 1}">
      </div>
      <div class="form-group">
        <label class="form-label">Chapter Content</label>
        <textarea class="form-control chapter-content" data-chapter-index="${chapterIndex}" 
                  rows="15" style="font-family: monospace;"></textarea>
      </div>
    `;
    container.appendChild(chapterDiv);
    updateChapterNumbers();
  };
  
  window.removeChapter = (index) => {
    const container = document.getElementById('chapters-container');
    const chapterItems = container.querySelectorAll('.chapter-item');
    if (chapterItems.length <= 1) {
      alert('A story must have at least one chapter.');
      return;
    }
    chapterItems[index].remove();
    updateChapterNumbers();
  };
  
  const updateChapterNumbers = () => {
    const container = document.getElementById('chapters-container');
    const chapterItems = container.querySelectorAll('.chapter-item');
    chapterItems.forEach((item, index) => {
      item.setAttribute('data-chapter-index', index);
      const titleInput = item.querySelector('.chapter-title');
      const contentTextarea = item.querySelector('.chapter-content');
      if (titleInput) {
        titleInput.setAttribute('data-chapter-index', index);
        if (!titleInput.value) {
          titleInput.placeholder = `Chapter ${index + 1}`;
        }
      }
      if (contentTextarea) {
        contentTextarea.setAttribute('data-chapter-index', index);
      }
      const header = item.querySelector('h3');
      if (header) {
        header.innerHTML = `<i class="fas fa-book" style="color: var(--color-accent-2); margin-right: 0.5rem;"></i>Chapter ${index + 1}`;
      }
      // Show remove button only if more than one chapter
      const removeBtn = item.querySelector('button');
      if (removeBtn && chapterItems.length > 1) {
        removeBtn.style.display = 'block';
        removeBtn.setAttribute('onclick', `window.removeChapter(${index})`);
      } else if (removeBtn) {
        removeBtn.style.display = 'none';
      }
    });
  };
  
  window.saveStoryForm = () => {
    const container = document.getElementById('chapters-container');
    const chapterItems = container.querySelectorAll('.chapter-item');
    const chapters = Array.from(chapterItems).map(item => {
      const titleInput = item.querySelector('.chapter-title');
      const contentTextarea = item.querySelector('.chapter-content');
      return {
        title: titleInput ? titleInput.value.trim() : '',
        content: contentTextarea ? contentTextarea.value : ''
      };
    }).filter(chapter => chapter.content.trim() || chapter.title.trim()); // Remove empty chapters
    
    if (chapters.length === 0) {
      alert('Please add at least one chapter with content.');
      return;
    }
    
    const storyData = {
      id: formStory.id,
      title: document.getElementById('title').value,
      summary: document.getElementById('summary').value.trim(),
      author: document.getElementById('author').value.trim(),
      chapters: chapters,
      tags: document.getElementById('tags').value.split(',').map(t => t.trim()).filter(t => t),
      characters: Array.from(document.getElementById('characters').selectedOptions).map(opt => opt.value),
      createdAt: formStory.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentChapterIndex: formStory.currentChapterIndex || 0
    };
    
    onSave(storyData);
  };
  
  return form;
}

