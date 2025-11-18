// Story Form Component

import { defaultStory, generateId } from '../data/default-data.js';
import storage from '../data/storage.js';

export function renderStoryForm(story = null, onSave) {
  const isEdit = !!story;
  const formStory = story || { ...defaultStory, id: generateId() };
  const ocs = storage.getAllOCs();
  
  const form = document.createElement('div');
  form.className = 'card-naruto';
  
  form.innerHTML = `
    <div class="card-header-naruto">
      <h2>${isEdit ? 'Edit' : 'Create'} Story</h2>
    </div>
    <div class="card-body">
      <form id="story-form" onsubmit="event.preventDefault(); window.saveStoryForm();">
        <div class="form-group">
          <label class="form-label">Title</label>
          <input type="text" class="form-control" id="title" value="${formStory.title || ''}" required>
        </div>
        
        <div class="form-group">
          <label class="form-label">Summary</label>
          <textarea class="form-control" id="summary" rows="4">${formStory.summary || ''}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Content</label>
          <textarea class="form-control" id="content" rows="20" style="font-family: monospace;">${formStory.content || ''}</textarea>
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
  
  window.saveStoryForm = () => {
    const storyData = {
      id: formStory.id,
      title: document.getElementById('title').value,
      summary: document.getElementById('summary').value,
      content: document.getElementById('content').value,
      tags: document.getElementById('tags').value.split(',').map(t => t.trim()).filter(t => t),
      characters: Array.from(document.getElementById('characters').selectedOptions).map(opt => opt.value),
      createdAt: formStory.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    onSave(storyData);
  };
  
  return form;
}

