// Lore Form Component

import { defaultLore, generateId } from '../data/default-data.js';
import storage from '../data/storage.js';
import { loreCategories, generateOptions } from '../data/options.js';

export function renderLoreForm(lore = null, onSave) {
  const isEdit = !!lore;
  const formLore = lore || { ...defaultLore, id: generateId() };
  const ocs = storage.getAllOCs();
  const clans = storage.getAllClans();
  
  const form = document.createElement('div');
  form.className = 'card-naruto';
  
  form.innerHTML = `
    <div class="card-header-naruto">
      <h2>${isEdit ? 'Edit' : 'Create'} Lore Entry</h2>
    </div>
    <div class="card-body">
      <form id="lore-form" onsubmit="event.preventDefault(); window.saveLoreForm();">
        <div class="form-group">
          <label class="form-label">Title</label>
          <input type="text" class="form-control" id="title" value="${formLore.title || ''}" required>
        </div>
        
        <div class="form-group">
          <label class="form-label">Category</label>
          <select class="form-control" id="category" required>
            ${generateOptions(loreCategories, formLore.category || '')}
          </select>
        </div>
        
        <div class="form-group">
          <label class="form-label">Content</label>
          <textarea class="form-control" id="content" rows="15" style="font-family: monospace;">${formLore.content || ''}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Related OCs</label>
          <select class="form-control" id="relatedOCs" multiple size="6">
            ${ocs.map(oc => `
              <option value="${oc.id}" ${(formLore.relatedOCs || []).includes(oc.id) ? 'selected' : ''}>
                ${oc.firstName} ${oc.lastName} - ${oc.rank}
              </option>
            `).join('')}
          </select>
          <small>Hold Ctrl/Cmd to select multiple OCs</small>
        </div>
        
        <div class="form-group">
          <label class="form-label">Related Clans</label>
          <select class="form-control" id="relatedClans" multiple size="6">
            ${clans.map(clan => `
              <option value="${clan.id}" ${(formLore.relatedClans || []).includes(clan.id) ? 'selected' : ''}>
                ${clan.name} - ${clan.village}
              </option>
            `).join('')}
          </select>
          <small>Hold Ctrl/Cmd to select multiple clans</small>
        </div>
        
        <div class="mt-4">
          <button type="submit" class="btn-naruto">${isEdit ? 'Update' : 'Create'} Lore Entry</button>
          <button type="button" class="btn-naruto btn-naruto-secondary" onclick="window.navigateTo('lore')" style="margin-left: 0.5rem;">Cancel</button>
        </div>
      </form>
    </div>
  `;
  
  window.saveLoreForm = () => {
    const loreData = {
      id: formLore.id,
      title: document.getElementById('title').value,
      category: document.getElementById('category').value,
      content: document.getElementById('content').value,
      relatedOCs: Array.from(document.getElementById('relatedOCs').selectedOptions).map(opt => opt.value),
      relatedClans: Array.from(document.getElementById('relatedClans').selectedOptions).map(opt => opt.value)
    };
    
    onSave(loreData);
  };
  
  return form;
}

