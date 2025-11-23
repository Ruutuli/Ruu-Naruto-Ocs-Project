// OC Form Component - Create/Edit OC form

import { defaultOC, generateId } from '../data/default-data.js';
import storage from '../data/storage.js';
import { natureReleases, getAllNatureReleaseNames, getAllClanNames, getClanSymbol } from '../data/options.js';
import { convertImageUrl } from '../utils/imageUtils.js';
import { 
  villages, 
  ranks, 
  zodiacSigns, 
  moralAlignments, 
  mbtiTypes, 
  enneagramTypes, 
  months, 
  days,
  bloodTypes,
  genders,
  sexualOrientations,
  romanticOrientations,
  allTechniqueTypes,
  getTechniqueTypeLabel,
  ninjaClassifications,
  generateOptions,
  generateGroupedOptions,
  generateDatalistOptions
} from '../data/options.js';

export function renderOCForm(oc = null, onSave) {
  const isEdit = !!oc;
  const formOC = oc || { ...defaultOC, id: generateId() };
  const clans = storage.getAllClans();
  
  // Get predefined clan names from options.js
  const predefinedClanNames = getAllClanNames();
  
  // Handle backward compatibility: convert single values to arrays
  const formOCVillages = Array.isArray(formOC.village) ? formOC.village : (formOC.village ? [formOC.village] : []);
  const formOCRanks = Array.isArray(formOC.rank) ? formOC.rank : (formOC.rank ? [formOC.rank] : []);
  
  // Handle clans - support both old format (single clanId/clanName) and new format (arrays)
  const formOCClanIds = Array.isArray(formOC.clanId) ? formOC.clanId : (formOC.clanId ? [formOC.clanId] : []);
  const formOCClanNames = Array.isArray(formOC.clanName) ? formOC.clanName : (formOC.clanName ? [formOC.clanName] : []);
  
  // Get current clan names for display
  const currentClanNames = [];
  // Add clanIds (user-created clans)
  formOCClanIds.forEach(clanId => {
    const clan = clans.find(c => c.id === clanId);
    if (clan) {
      currentClanNames.push(clan.name);
    } else if (typeof clanId === 'string' && predefinedClanNames.includes(clanId)) {
      // If clanId is actually a predefined clan name
      currentClanNames.push(clanId);
    }
  });
  // Add clanNames (predefined or custom clan names)
  formOCClanNames.forEach(clanName => {
    if (clanName && !currentClanNames.includes(clanName)) {
      currentClanNames.push(clanName);
    }
  });
  
  // Combine user-created clans and predefined clans for autocomplete
  const allClanOptions = [
    ...clans.map(clan => ({ name: clan.name, id: clan.id, type: 'user' })),
    ...predefinedClanNames.map(name => ({ name, id: null, type: 'predefined' }))
  ];
  
  // Remove duplicates (in case user created a clan with same name as predefined)
  const uniqueClans = [];
  const seenNames = new Set();
  allClanOptions.forEach(clan => {
    if (!seenNames.has(clan.name)) {
      seenNames.add(clan.name);
      uniqueClans.push(clan);
    } else {
      // If duplicate, prefer user-created over predefined
      const existing = uniqueClans.find(c => c.name === clan.name);
      if (existing && existing.type === 'predefined' && clan.type === 'user') {
        const index = uniqueClans.indexOf(existing);
        uniqueClans[index] = clan;
      }
    }
  });
  
  const form = document.createElement('div');
  form.className = 'card-naruto';
  
  form.innerHTML = `
    <div class="card-header-naruto">
      <h2>${isEdit ? 'Edit' : 'Create'} OC</h2>
    </div>
    <div class="card-body">
      <form id="oc-form" onsubmit="event.preventDefault(); window.saveOCForm();">
        <!-- Save Button at Top -->
        <div class="mb-4" style="display: flex; justify-content: flex-start; gap: 0.5rem; padding-bottom: 1rem; border-bottom: 2px solid var(--color-border-2);">
          <button type="submit" class="btn-naruto">
            <i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Create'} OC
          </button>
          <button type="button" class="btn-naruto btn-naruto-secondary" onclick="window.navigateTo('ocs')">
            <i class="fas fa-times"></i> Cancel
          </button>
        </div>
        <!-- Basic Info -->
        <h3 class="mb-3">Basic Information</h3>
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Last Name 名字 <small style="font-weight: normal; color: var(--color-text-dark-2);">(e.g., Chigiri)</small></label>
              <input type="text" class="form-control" id="lastName" value="${formOC.lastName || ''}">
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">First Name 名前 <small style="font-weight: normal; color: var(--color-text-dark-2);">(e.g., Akene)</small></label>
              <input type="text" class="form-control" id="firstName" value="${formOC.firstName || ''}" required>
            </div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Name in Kanji/Hiragana/Katakana</label>
              <input type="text" class="form-control" id="nameJapanese" value="${formOC.nameJapanese || ''}" placeholder="e.g., 千切 明音">
            </div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Last Name Meaning</label>
              <input type="text" class="form-control" id="lastNameMeaning" value="${formOC.lastNameMeaning || ''}" placeholder="e.g., Thousand cuts">
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">First Name Meaning</label>
              <input type="text" class="form-control" id="firstNameMeaning" value="${formOC.firstNameMeaning || ''}" placeholder="e.g., bright sound">
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Full Name Meaning <small style="font-weight: normal; color: var(--color-text-dark-2);">(Optional - will auto-combine if left empty)</small></label>
          <input type="text" class="form-control" id="nameMeaning" value="${formOC.nameMeaning || ''}" placeholder="e.g., Thousand cuts, bright sound">
        </div>
        
        <div class="form-group">
          <label class="form-label">Aliases (comma-separated)</label>
          <input type="text" class="form-control" id="aliases" value="${formOC.aliases?.join(', ') || ''}">
        </div>
        
        <div class="form-group">
          <label class="form-label">Profile Image URL</label>
          <input type="text" class="form-control" id="profileImage" value="${formOC.profileImage || ''}" placeholder="Enter image URL">
          <small class="form-text text-muted">Default image (used if no era-specific images are set)</small>
        </div>
        
        <!-- Images by Era -->
        <h3 class="mb-3 mt-4">Images by Era <i class="japanese-header">時代別の画像</i></h3>
        <div class="mb-4">
          <p class="text-muted" style="margin-bottom: 1rem;">Add images for different eras. These will be displayed with tabs in the detail view.</p>
          <div class="image-era-tabs" style="display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap;">
            ${['Part I', 'Part II', 'Blank Period', 'Gaiden', 'Boruto'].map((era, index) => `
              <button type="button" class="btn-naruto btn-naruto-secondary image-era-tab ${index === 0 ? 'active' : ''}" 
                      onclick="switchImageEraTab('${era}')" 
                      data-era="${era}"
                      style="font-size: 0.85rem; padding: 0.5rem 1rem;">
                ${era}
              </button>
            `).join('')}
          </div>
          <div class="image-era-content">
            ${['Part I', 'Part II', 'Blank Period', 'Gaiden', 'Boruto'].map((era, index) => {
              const eraImage = formOC.imagesByEra?.[era] || '';
              const isActive = index === 0 ? 'active' : '';
              return `
                <div class="image-era-panel ${isActive}" id="image-era-panel-${era.replace(/\s+/g, '-')}" 
                     style="${index !== 0 ? 'display: none;' : ''}">
                  <div class="form-group">
                    <label class="form-label">Image URL for ${era}</label>
                    <input type="text" class="form-control" id="imageEra-${era}" 
                           value="${eraImage}" 
                           placeholder="Enter image URL for ${era}">
                    ${eraImage ? `
                      <div style="margin-top: 0.5rem;">
                        <img src="${convertImageUrl(eraImage)}" alt="${era} image" 
                             style="max-width: 200px; max-height: 200px; border: 1px solid var(--color-border-2); border-radius: 4px; object-fit: contain;"
                             onerror="this.style.display='none'">
                      </div>
                    ` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <!-- Debut Information -->
        <h3 class="mb-3 mt-4">Debut Information</h3>
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Debut (Manga)</label>
              <input type="text" class="form-control" id="debutManga" value="${formOC.debut?.manga || ''}" placeholder="e.g., Chapter 1">
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Debut (Anime)</label>
              <input type="text" class="form-control" id="debutAnime" value="${formOC.debut?.anime || ''}" placeholder="e.g., Episode 1">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Debut (Novel)</label>
              <input type="text" class="form-control" id="debutNovel" value="${formOC.debut?.novel || ''}" placeholder="e.g., Novel Title">
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Debut (Movie)</label>
              <input type="text" class="form-control" id="debutMovie" value="${formOC.debut?.movie || ''}" placeholder="e.g., Movie Title">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Debut (Game)</label>
              <input type="text" class="form-control" id="debutGame" value="${formOC.debut?.game || ''}" placeholder="e.g., Game Title">
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Appears In</label>
              <div style="margin-top: 0.5rem;">
                ${['Anime', 'Manga', 'Novel', 'Game', 'Movie'].map(media => `
                  <label style="display: inline-block; margin-right: 1rem; margin-bottom: 0.5rem;">
                    <input type="checkbox" value="${media}" 
                           ${(formOC.appearsIn || []).includes(media) ? 'checked' : ''}
                           id="appearsIn-${media}">
                    ${media}
                  </label>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Personal Information -->
        <h3 class="mb-3 mt-4">Personal Information <i class="japanese-header">個人情報</i></h3>
        <div class="row">
          <div class="col-12 col-md-4">
            <div class="form-group">
              <label class="form-label">Date of Birth</label>
              <div class="row" style="margin: 0;">
                <div class="col-6" style="padding-right: 0.25rem;">
                  <select class="form-control" id="dobMonth">
                    <option value="">Month</option>
                    ${(() => {
                      // Parse existing dob: handle both MM-DD and YYYY-MM-DD formats
                      let existingMonth = '';
                      if (formOC.dob) {
                        const parts = formOC.dob.split('-');
                        // If YYYY-MM-DD format, month is at index 1; if MM-DD, it's at index 0
                        existingMonth = parts.length === 3 ? parts[1] : (parts.length === 2 ? parts[0] : '');
                      }
                      return generateOptions(months, existingMonth);
                    })()}
                  </select>
                </div>
                <div class="col-6" style="padding-left: 0.25rem;">
                  <select class="form-control" id="dobDay">
                    <option value="">Day</option>
                    ${(() => {
                      // Parse existing dob: handle both MM-DD and YYYY-MM-DD formats
                      let existingDay = '';
                      if (formOC.dob) {
                        const parts = formOC.dob.split('-');
                        // If YYYY-MM-DD format, day is at index 2; if MM-DD, it's at index 1
                        existingDay = parts.length === 3 ? parts[2] : (parts.length === 2 ? parts[1] : '');
                      }
                      return generateOptions(days, existingDay);
                    })()}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-8">
            <div class="form-group">
              <label class="form-label">Age by Era</label>
              <div class="age-era-inputs">
                <div class="row">
                  ${(() => {
                    // Helper function to extract age value from old format or ageByEra
                    const getAgeValue = (era) => {
                      // First check ageByEra
                      if (formOC.ageByEra && formOC.ageByEra[era]) {
                        return formOC.ageByEra[era];
                      }
                      // Then check old format string (e.g., "Part I: 12–13, Part II: 15–17")
                      if (typeof formOC.age === 'string') {
                        // Escape special regex characters in era name
                        const escapedEra = era.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        // Match era: value pattern, value can contain dashes, numbers, and spaces
                        const eraMatch = formOC.age.match(new RegExp(`${escapedEra}:\\s*([^,]+)`));
                        if (eraMatch && eraMatch[1]) {
                          return eraMatch[1].trim();
                        }
                      }
                      return '';
                    };
                    
                    const eras = [
                      { key: 'Part I', label: 'Part I Age', placeholder: 'e.g., 12–13' },
                      { key: 'Part II', label: 'Part II Age', placeholder: 'e.g., 15–17' },
                      { key: 'Blank Period', label: 'Blank Period Age', placeholder: 'e.g., 17–19' },
                      { key: 'Gaiden', label: 'Gaiden Age', placeholder: 'e.g., 20' },
                      { key: 'Boruto', label: 'Boruto Age', placeholder: 'e.g., 32' }
                    ];
                    
                    return eras.map(era => `
                      <div class="col-md-6 col-lg-4" style="margin-bottom: 0.75rem;">
                        <label style="font-size: 0.85rem; color: var(--color-text-dark-2); margin-bottom: 0.25rem; display: block;">${era.label}</label>
                        <input type="text" class="form-control" id="age-${era.key}" 
                               value="${getAgeValue(era.key)}" 
                               placeholder="${era.placeholder}">
                      </div>
                    `).join('');
                  })()}
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="form-group">
              <label class="form-label">Blood Type</label>
              <select class="form-control" id="bloodType">
                <option value="">Select Blood Type</option>
                ${generateOptions(bloodTypes, formOC.bloodType || '')}
              </select>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="form-group">
              <label class="form-label">Zodiac Sign</label>
              <select class="form-control" id="zodiac">
                <option value="">Select Zodiac Sign</option>
                ${generateOptions(zodiacSigns, formOC.zodiac || '')}
              </select>
            </div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-12 col-md-4">
            <div class="form-group">
              <label class="form-label">Gender</label>
              <select class="form-control" id="gender">
                <option value="">Select Gender</option>
                ${generateOptions(genders, formOC.gender || '')}
              </select>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="form-group">
              <label class="form-label">Sexual Orientation</label>
              <select class="form-control" id="sexualOrientation">
                <option value="">Select Sexual Orientation</option>
                ${generateOptions(sexualOrientations, formOC.sexualOrientation || '')}
              </select>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="form-group">
              <label class="form-label">Romantic Orientation</label>
              <select class="form-control" id="romanticOrientation">
                <option value="">Select Romantic Orientation</option>
                ${generateOptions(romanticOrientations, formOC.romanticOrientation || '')}
              </select>
            </div>
          </div>
        </div>
        
        <!-- Family Information -->
        <h3 class="mb-3 mt-4">Family Information</h3>
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Father</label>
              <input type="text" class="form-control" id="familyFather" value="${formOC.family?.father || ''}" placeholder="e.g., Father's Name">
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Mother</label>
              <input type="text" class="form-control" id="familyMother" value="${formOC.family?.mother || ''}" placeholder="e.g., Mother's Name">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Siblings (one per line)</label>
              <textarea class="form-control" id="familySiblings" rows="4" placeholder="e.g., Older Brother&#10;Younger Sister">${(formOC.family?.siblings || []).join('\n')}</textarea>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Other Relatives (one per line)</label>
              <textarea class="form-control" id="familyOtherRelatives" rows="4" placeholder="e.g., Uncle&#10;Aunt&#10;Cousin">${(formOC.family?.otherRelatives || []).join('\n')}</textarea>
            </div>
          </div>
        </div>
        
        <!-- Physical Appearance -->
        <h3 class="mb-3 mt-4">Physical Appearance <i class="japanese-header">外見</i></h3>
        <div class="row">
          <div class="col-12 col-md-4">
            <div class="form-group">
              <label class="form-label">Body Type</label>
              <input type="text" class="form-control" id="bodyType" value="${formOC.identifyingInfo?.bodyType || ''}">
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="form-group">
              <label class="form-label">Eye Color</label>
              <input type="text" class="form-control" id="eyeColor" value="${formOC.eyeColor || ''}" placeholder="e.g., Brown">
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="form-group">
              <label class="form-label">Hair Color</label>
              <input type="text" class="form-control" id="hairColor" value="${formOC.hairColor || ''}" placeholder="e.g., Black">
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Distinguishing Features <small style="font-weight: normal; color: var(--color-text-dark-2);">(one per line - scars, tattoos, etc.)</small></label>
          <textarea class="form-control" id="distinguishingFeatures" rows="3">${(formOC.distinguishingFeatures || []).join('\n')}</textarea>
        </div>
        
        <!-- Affiliations -->
        <h3 class="mb-3 mt-4">Affiliations <i class="japanese-header">所属</i></h3>
        <div class="row">
          <div class="col-12 col-md-4">
            <div class="form-group">
              <label class="form-label">Village</label>
              <select class="form-control" id="village" multiple size="6">
                ${villages.map(village => `
                  <option value="${village.value}" ${formOCVillages.includes(village.value) ? 'selected' : ''}>
                    ${village.label}
                  </option>
                `).join('')}
              </select>
              <small style="color: var(--color-text-dark-2);">Hold Ctrl/Cmd to select multiple villages</small>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="form-group">
              <label class="form-label">Rank</label>
              <select class="form-control" id="rank" multiple size="6">
                ${ranks.map(rank => `
                  <option value="${rank.value}" ${formOCRanks.includes(rank.value) ? 'selected' : ''}>
                    ${rank.label}
                  </option>
                `).join('')}
              </select>
              <small style="color: var(--color-text-dark-2);">Hold Ctrl/Cmd to select multiple ranks</small>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="form-group">
              <label class="form-label">Clan</label>
              <select class="form-control" id="clanName" multiple size="6">
                ${uniqueClans.map(clan => `
                  <option value="${clan.name}" ${currentClanNames.includes(clan.name) ? 'selected' : ''}>
                    ${clan.name}${clan.type === 'predefined' ? ' (Predefined)' : ''}
                  </option>
                `).join('')}
              </select>
              <small style="color: var(--color-text-dark-2);">Hold Ctrl/Cmd to select multiple clans</small>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Classification (comma-separated)</label>
          <input type="text" class="form-control" id="classification" list="classification-datalist" value="${(formOC.classification || []).join(', ')}" placeholder="e.g., Genin, Fate Reader, Missing-nin">
          <datalist id="classification-datalist">
            ${generateDatalistOptions(ninjaClassifications)}
          </datalist>
        </div>
        
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Ninja Registration Number</label>
              <input type="text" class="form-control" id="ninjaRegistrationNumber" value="${formOC.ninjaRegistrationNumber || ''}">
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Team Number</label>
              <input type="text" class="form-control" id="teamNumber" value="${formOC.teamNumber || ''}" placeholder="e.g., Team 7">
            </div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Teammates (comma-separated)</label>
              <input type="text" class="form-control" id="teammates" value="${(formOC.teammates || []).join(', ')}" placeholder="e.g., Naruto, Sasuke">
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Sensei</label>
              <input type="text" class="form-control" id="sensei" value="${formOC.sensei || ''}" placeholder="e.g., Kakashi Hatake">
            </div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-12 col-md-4">
            <div class="form-group">
              <label class="form-label">Academy Graduation Age</label>
              <input type="number" class="form-control" id="academyGraduationAge" value="${formOC.academyGraduationAge || ''}" min="0">
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="form-group">
              <label class="form-label">Made Genin</label>
              <input type="text" class="form-control" id="madeGenin" value="${formOC.madeGenin || formOC.identifyingInfo?.madeGenin || ''}" placeholder="e.g., Age 12">
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="form-group">
              <label class="form-label">Made Chunin</label>
              <input type="text" class="form-control" id="madeChunin" value="${formOC.madeChunin || formOC.identifyingInfo?.madeChunin || ''}" placeholder="e.g., Age 15">
            </div>
          </div>
        </div>
        
        <!-- Abilities & Powers -->
        <h3 class="mb-3 mt-4">Abilities & Powers <i class="japanese-header">能力と力</i></h3>
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Nature Type <small style="font-weight: normal; color: var(--color-text-dark-2);">(Hold Ctrl/Cmd to select multiple)</small></label>
              <select class="form-control" id="natureType" multiple size="5" style="min-height: 120px;">
                ${(() => {
                  // Handle both array and string formats for backward compatibility
                  const currentTypes = Array.isArray(formOC.natureType) 
                    ? formOC.natureType 
                    : (formOC.natureType ? [formOC.natureType] : []);
                  
                  const allNames = getAllNatureReleaseNames();
                  return allNames.map(name => {
                    const release = natureReleases[name];
                    const isSelected = currentTypes.includes(name) ? 'selected' : '';
                    let displayText = name;
                    if (release.kanji) {
                      displayText += ` (${release.kanji}, ${release.romaji})`;
                    }
                    if (release.strongAgainst && release.weakAgainst) {
                      displayText += ` - Strong: ${release.strongAgainst}, Weak: ${release.weakAgainst}`;
                    }
                    if (release.components) {
                      displayText += ` - ${release.components.join(' + ')}`;
                    }
                    return `<option value="${name}" ${isSelected}>${displayText}</option>`;
                  }).join('');
                })()}
              </select>
              <small style="color: var(--color-text-dark-2); font-size: 0.85rem; display: block; margin-top: 0.25rem;">
                Selected: <span id="natureType-count">0</span>
              </small>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Kekkei Genkai</label>
              <input type="text" class="form-control" id="kekkeiGenkai" value="${formOC.kekkeiGenkai || ''}">
            </div>
          </div>
        </div>
        
        <!-- Chakra & Physical Prowess -->
        <h4 class="mb-3 mt-4">Chakra & Physical Prowess</h4>
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Chakra Reserves</label>
              <textarea class="form-control" id="chakraReserves" rows="2">${formOC.chakraPhysicalProwess?.chakraReserves || ''}</textarea>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Chakra Control</label>
              <textarea class="form-control" id="chakraControl" rows="2">${formOC.chakraPhysicalProwess?.chakraControl || ''}</textarea>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Strength Feats</label>
              <textarea class="form-control" id="strengthFeats" rows="2">${formOC.chakraPhysicalProwess?.strengthFeats || ''}</textarea>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Speed Feats</label>
              <textarea class="form-control" id="speedFeats" rows="2">${formOC.chakraPhysicalProwess?.speedFeats || ''}</textarea>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Taijutsu Skill</label>
              <textarea class="form-control" id="taijutsuSkill" rows="2">${formOC.chakraPhysicalProwess?.taijutsuSkill || ''}</textarea>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Training Influences</label>
              <textarea class="form-control" id="trainingInfluences" rows="2">${formOC.chakraPhysicalProwess?.trainingInfluences || ''}</textarea>
            </div>
          </div>
        </div>
        
        <!-- Intelligence -->
        <h4 class="mb-3 mt-4">Intelligence</h4>
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Academic Performance</label>
              <textarea class="form-control" id="academicPerformance" rows="2">${formOC.intelligence?.academicPerformance || ''}</textarea>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Analytical Ability</label>
              <textarea class="form-control" id="analyticalAbility" rows="2">${formOC.intelligence?.analyticalAbility || ''}</textarea>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Combat Strategy</label>
              <textarea class="form-control" id="combatStrategy" rows="2">${formOC.intelligence?.combatStrategy || ''}</textarea>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Leadership Skill</label>
              <textarea class="form-control" id="leadershipSkill" rows="2">${formOC.intelligence?.leadershipSkill || ''}</textarea>
            </div>
          </div>
        </div>
        
        <div id="abilities-editor" class="mt-3 mb-3">
          <label class="form-label mb-2">Abilities & Techniques</label>
          <div class="card-naruto" style="padding: 1rem; margin-bottom: 1rem;">
            <div id="abilities-container">
              ${(() => {
                // Initialize abilities object with all technique types
                const defaultAbilities = {};
                allTechniqueTypes.forEach(tech => {
                  const key = tech.value.toLowerCase().replace(/\s+/g, '').replace(/[–-]/g, '');
                  defaultAbilities[key] = [];
                });
                // Keep backward compatibility with old types
                const oldTypes = ['taijutsu', 'ninjutsu', 'genjutsu', 'fuinjutsu', 'kenjutsu', 'senjutsu', 'medical', 'other'];
                oldTypes.forEach(type => {
                  if (!defaultAbilities[type]) {
                    defaultAbilities[type] = [];
                  }
                });
                
                const abilities = formOC.abilities || defaultAbilities;
                let html = '';
                
                // Render all technique types
                Object.keys(abilities).forEach(type => {
                  if (Array.isArray(abilities[type])) {
                    abilities[type].forEach((ability, index) => {
                      html += renderAbilityEditor(type, ability, index);
                    });
                  }
                });
                
                return html || '<p class="text-muted">No abilities added yet. Click a button below to add abilities.</p>';
              })()}
            </div>
            <div class="mt-2" style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              ${allTechniqueTypes.map(tech => {
                const key = tech.value.toLowerCase().replace(/\s+/g, '').replace(/[–-]/g, '');
                const label = tech.label.split('–')[0].trim(); // Get short name before the dash
                return `<button type="button" class="btn-naruto btn-naruto-secondary" onclick="addAbility('${key}')">+ Add ${label}</button>`;
              }).join('')}
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Theme Song</label>
              <input type="text" class="form-control" id="themeSong" value="${formOC.themeSong || ''}" placeholder="e.g., Song Title by Artist">
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Theme Song Link</label>
              <input type="url" class="form-control" id="themeSongLink" value="${formOC.themeSongLink || ''}" placeholder="https://...">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Voice Actor (Japanese)</label>
              <input type="text" class="form-control" id="voiceActorJP" value="${formOC.voiceActors?.japanese || ''}">
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Voice Actor (English)</label>
              <input type="text" class="form-control" id="voiceActorEN" value="${formOC.voiceActors?.english || ''}">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-4">
            <div class="form-group">
              <label class="form-label">Moral Alignment</label>
              <select class="form-control" id="moralAlignment">
                <option value="">Select Alignment</option>
                ${generateOptions(moralAlignments, formOC.moralAlignment || '')}
              </select>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="form-group">
              <label class="form-label">MBTI</label>
              <select class="form-control" id="mbti">
                <option value="">Select MBTI Type</option>
                ${generateGroupedOptions(mbtiTypes, formOC.mbti || '')}
              </select>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="form-group">
              <label class="form-label">Enneagram</label>
              <select class="form-control" id="enneagram">
                <option value="">Select Enneagram Type</option>
                ${generateGroupedOptions(enneagramTypes, formOC.enneagram || '')}
              </select>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Fears / Core Wounds (one per line)</label>
          <textarea class="form-control" id="fears" rows="4">${(formOC.fears || []).join('\n')}</textarea>
        </div>
        
        <!-- Mission Counts -->
        <h3 class="mb-3 mt-4">Mission Counts</h3>
        <div class="row">
          <div class="col-6 col-sm-4 col-md-2">
            <div class="form-group">
              <label class="form-label">S-Rank</label>
              <input type="number" class="form-control" id="missionS" value="${formOC.missions?.s || 0}" min="0">
            </div>
          </div>
          <div class="col-6 col-sm-4 col-md-2">
            <div class="form-group">
              <label class="form-label">A-Rank</label>
              <input type="number" class="form-control" id="missionA" value="${formOC.missions?.a || 0}" min="0">
            </div>
          </div>
          <div class="col-6 col-sm-4 col-md-2">
            <div class="form-group">
              <label class="form-label">B-Rank</label>
              <input type="number" class="form-control" id="missionB" value="${formOC.missions?.b || 0}" min="0">
            </div>
          </div>
          <div class="col-6 col-sm-4 col-md-2">
            <div class="form-group">
              <label class="form-label">C-Rank</label>
              <input type="number" class="form-control" id="missionC" value="${formOC.missions?.c || 0}" min="0">
            </div>
          </div>
          <div class="col-6 col-sm-4 col-md-2">
            <div class="form-group">
              <label class="form-label">D-Rank</label>
              <input type="number" class="form-control" id="missionD" value="${formOC.missions?.d || 0}" min="0">
            </div>
          </div>
        </div>
        
        <!-- Stats -->
        <h3 class="mb-3 mt-4">Stats (1-5)</h3>
        <div class="stats-form-container">
          <div class="stats-form-tabs">
            <button type="button" class="stats-form-tab active" onclick="switchStatsEraTab('Part I')" data-era="Part I">Part I</button>
            <button type="button" class="stats-form-tab" onclick="switchStatsEraTab('Part II')" data-era="Part II">Part II</button>
            <button type="button" class="stats-form-tab" onclick="switchStatsEraTab('Blank Period')" data-era="Blank Period">Blank Period</button>
            <button type="button" class="stats-form-tab" onclick="switchStatsEraTab('Gaiden')" data-era="Gaiden">Gaiden</button>
            <button type="button" class="stats-form-tab" onclick="switchStatsEraTab('Boruto')" data-era="Boruto">Boruto</button>
          </div>
          <div class="stats-form-content">
            ${(() => {
              const eras = ['Part I', 'Part II', 'Blank Period', 'Gaiden', 'Boruto'];
              const statNames = ['intelligence', 'stamina', 'strength', 'speed', 'ninjutsu', 'genjutsu', 'taijutsu', 'handSeals', 'fuinjutsu'];
              
              // Helper function to get stat value for an era, checking previous eras if not found
              const getStatValue = (era, statName) => {
                // First check if this era has the stat
                const eraStats = formOC.statsByEra?.[era];
                if (eraStats && eraStats[statName] !== undefined) {
                  return eraStats[statName];
                }
                
                // If not found, check previous eras in order
                const currentIndex = eras.indexOf(era);
                for (let i = currentIndex - 1; i >= 0; i--) {
                  const prevEra = eras[i];
                  const prevEraStats = formOC.statsByEra?.[prevEra];
                  if (prevEraStats && prevEraStats[statName] !== undefined) {
                    return prevEraStats[statName];
                  }
                }
                
                // Fall back to default stats
                if (formOC.stats && formOC.stats[statName] !== undefined) {
                  return formOC.stats[statName];
                }
                
                // Final fallback to default values
                return statName === 'fuinjutsu' ? 0 : 3;
              };
              
              return eras.map((era, index) => {
                const isActive = index === 0 ? 'active' : '';
                return `
                  <div class="stats-form-panel ${isActive}" id="stats-form-panel-${era.replace(/\s+/g, '-')}">
                    <div class="stats-container">
                      <div class="stats-grid">
                        ${statNames.map(statName => 
                          renderStatInput(`${statName}-${era}`, getStatValue(era, statName))
                        ).join('')}
                      </div>
                    </div>
                  </div>
                `;
              }).join('');
            })()}
          </div>
        </div>
        
        <div class="row">
          <div class="col-12">
            <div class="form-group">
              <label class="form-label">Height by Era</label>
              <div class="height-era-inputs">
                <div class="row">
                  ${(() => {
                    // Helper function to extract height value from old format or heightByEra
                    const getHeightValue = (era) => {
                      // First check heightByEra
                      if (formOC.heightByEra && formOC.heightByEra[era]) {
                        return formOC.heightByEra[era];
                      }
                      // Then check old format string (e.g., "148.5 cm–150.1 cm (Part I), 161 cm (Part II)")
                      if (typeof formOC.identifyingInfo?.height === 'string') {
                        const escapedEra = era.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        const eraMatch = formOC.identifyingInfo.height.match(new RegExp(`${escapedEra}:\\s*([^,]+)`));
                        if (eraMatch && eraMatch[1]) {
                          return eraMatch[1].trim();
                        }
                        // Also check for (Part I) format
                        const eraMatch2 = formOC.identifyingInfo.height.match(new RegExp(`([^,]+)\\s*\\(${escapedEra}\\)`));
                        if (eraMatch2 && eraMatch2[1]) {
                          return eraMatch2[1].trim();
                        }
                      }
                      return '';
                    };
                    
                    const eras = [
                      { key: 'Part I', label: 'Part I Height', placeholder: 'e.g., 148.5 cm–150.1 cm' },
                      { key: 'Part II', label: 'Part II Height', placeholder: 'e.g., 161 cm' },
                      { key: 'Blank Period', label: 'Blank Period Height', placeholder: 'e.g., 165 cm' },
                      { key: 'Gaiden', label: 'Gaiden Height', placeholder: 'e.g., 165 cm' },
                      { key: 'Boruto', label: 'Boruto Height', placeholder: 'e.g., 170 cm' }
                    ];
                    
                    return eras.map(era => `
                      <div class="col-md-6 col-lg-4" style="margin-bottom: 0.75rem;">
                        <label style="font-size: 0.85rem; color: var(--color-text-dark-2); margin-bottom: 0.25rem; display: block;">${era.label}</label>
                        <input type="text" class="form-control" id="height-${era.key}" 
                               value="${getHeightValue(era.key)}" 
                               placeholder="${era.placeholder}">
                      </div>
                    `).join('');
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-12">
            <div class="form-group">
              <label class="form-label">Weight by Era</label>
              <div class="weight-era-inputs">
                <div class="row">
                  ${(() => {
                    // Helper function to extract weight value from old format or weightByEra
                    const getWeightValue = (era) => {
                      // First check weightByEra
                      if (formOC.weightByEra && formOC.weightByEra[era]) {
                        return formOC.weightByEra[era];
                      }
                      // Then check old format string
                      if (typeof formOC.identifyingInfo?.weight === 'string') {
                        const escapedEra = era.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        const eraMatch = formOC.identifyingInfo.weight.match(new RegExp(`${escapedEra}:\\s*([^,]+)`));
                        if (eraMatch && eraMatch[1]) {
                          return eraMatch[1].trim();
                        }
                        // Also check for (Part I) format
                        const eraMatch2 = formOC.identifyingInfo.weight.match(new RegExp(`([^,]+)\\s*\\(${escapedEra}\\)`));
                        if (eraMatch2 && eraMatch2[1]) {
                          return eraMatch2[1].trim();
                        }
                      }
                      return '';
                    };
                    
                    const eras = [
                      { key: 'Part I', label: 'Part I Weight', placeholder: 'e.g., 35.4 kg–35.9 kg' },
                      { key: 'Part II', label: 'Part II Weight', placeholder: 'e.g., 45.4 kg' },
                      { key: 'Blank Period', label: 'Blank Period Weight', placeholder: 'e.g., 50 kg' },
                      { key: 'Gaiden', label: 'Gaiden Weight', placeholder: 'e.g., 50 kg' },
                      { key: 'Boruto', label: 'Boruto Weight', placeholder: 'e.g., 55 kg' }
                    ];
                    
                    return eras.map(era => `
                      <div class="col-md-6 col-lg-4" style="margin-bottom: 0.75rem;">
                        <label style="font-size: 0.85rem; color: var(--color-text-dark-2); margin-bottom: 0.25rem; display: block;">${era.label}</label>
                        <input type="text" class="form-control" id="weight-${era.key}" 
                               value="${getWeightValue(era.key)}" 
                               placeholder="${era.placeholder}">
                      </div>
                    `).join('');
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Battle Strategy -->
        <h3 class="mb-3 mt-4">Battle Strategy</h3>
        <div class="form-group">
          <label class="form-label">In a Team</label>
          <textarea class="form-control" id="strategyInTeam" rows="3">${formOC.battleStrategy?.inTeam || ''}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Alone</label>
          <textarea class="form-control" id="strategyAlone" rows="3">${formOC.battleStrategy?.alone || ''}</textarea>
        </div>
        
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Field Position</label>
              <input type="text" class="form-control" id="fieldPosition" value="${formOC.battleStrategy?.fieldPosition || ''}">
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Effective Distance</label>
              <input type="text" class="form-control" id="effectiveDistance" value="${formOC.battleStrategy?.effectiveDistance || ''}">
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Specialty</label>
          <input type="text" class="form-control" id="specialty" value="${formOC.battleStrategy?.specialty || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">Notable Abilities</label>
          <textarea class="form-control" id="notableAbilities" rows="3">${formOC.battleStrategy?.notableAbilities || ''}</textarea>
        </div>
        
        <!-- Personality -->
        <h3 class="mb-3 mt-4">Personality</h3>
        <div class="form-group">
          <label class="form-label">Overview</label>
          <textarea class="form-control" id="personalityOverview" rows="4" placeholder="Overall personality description...">${formOC.personality?.overview || ''}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Positive Traits (one per line)</label>
          <textarea class="form-control" id="positiveTraits" rows="4">${(formOC.personality?.positiveTraits || []).join('\n')}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Negative Traits (one per line)</label>
          <textarea class="form-control" id="negativeTraits" rows="4">${(formOC.personality?.negativeTraits || []).join('\n')}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Neutral Traits (one per line)</label>
          <textarea class="form-control" id="neutralTraits" rows="4">${(formOC.personality?.neutralTraits || []).join('\n')}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Likes (one per line)</label>
          <textarea class="form-control" id="likes" rows="4">${(formOC.personality?.likes || []).join('\n')}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Dislikes (one per line)</label>
          <textarea class="form-control" id="dislikes" rows="4">${(formOC.personality?.dislikes || []).join('\n')}</textarea>
        </div>
        
        <!-- Demeanor / Personality Traits -->
        <h3 class="mb-3 mt-4">Demeanor <i class="japanese-header">態度</i></h3>
        <p style="color: var(--color-text-dark-2); font-size: 0.9rem; margin-bottom: 1rem;">
          Rate each trait from 1 to 10. 1 = very left trait, 10 = very right trait. These traits define where your character falls on each spectrum.
        </p>
        <div class="demeanor-traits-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1rem;">
          ${(() => {
            const demeanor = formOC.personality?.demeanor || {
              friendlyReserved: 5.5,
              politeBlunt: 5.5,
              cleverFoolish: 5.5,
              sensitiveTough: 5.5,
              braveTimid: 5.5,
              carefulReckless: 5.5,
              sincereDeceptive: 5.5,
              diligentLazy: 5.5,
              calmIrritable: 5.5,
              humorousSerious: 5.5
            };
            
            const traitPairs = [
              { key: 'friendlyReserved', left: 'Friendly', right: 'Reserved' },
              { key: 'politeBlunt', left: 'Polite', right: 'Blunt' },
              { key: 'cleverFoolish', left: 'Clever', right: 'Foolish' },
              { key: 'sensitiveTough', left: 'Sensitive', right: 'Tough' },
              { key: 'braveTimid', left: 'Brave', right: 'Timid' },
              { key: 'carefulReckless', left: 'Careful', right: 'Reckless' },
              { key: 'sincereDeceptive', left: 'Sincere', right: 'Deceptive' },
              { key: 'diligentLazy', left: 'Diligent', right: 'Lazy' },
              { key: 'calmIrritable', left: 'Calm', right: 'Irritable' },
              { key: 'humorousSerious', left: 'Humorous', right: 'Serious' }
            ];
            
            return traitPairs.map(trait => {
              const value = demeanor[trait.key] !== undefined ? demeanor[trait.key] : 5.5;
              const percentage = ((value - 1) / 9) * 100; // Convert 1-10 to 0-100%
              
              return `
                <div class="demeanor-trait-item" style="background-color: var(--color-bg-1); border: 1px solid var(--color-border-2); border-radius: 6px; padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
                  <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; font-weight: 600; font-size: 0.95rem; color: var(--color-text-dark-2);">
                    <span style="color: #228B22;">${trait.left}</span>
                    <span style="color: var(--color-text-dark-2);">–</span>
                    <span style="color: var(--color-accent-2);">${trait.right}</span>
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <div class="demeanor-slider-track-form" style="position: relative; height: 20px; background: linear-gradient(to right, rgba(34, 139, 34, 0.15) 0%, rgba(200, 200, 200, 0.3) 50%, rgba(227, 94, 63, 0.15) 100%); border: 2px solid var(--color-border-2); border-radius: 10px;">
                      <div id="demeanor-${trait.key}-fill" style="position: absolute; left: 0; top: 0; height: 100%; width: ${percentage}%; background: linear-gradient(to right, #228B22 0%, rgba(227, 94, 63, 0.6) 100%); border-radius: 8px 0 0 8px; opacity: 0.5; transition: width 0.2s ease;"></div>
                      <div id="demeanor-${trait.key}-marker" style="position: absolute; top: 50%; left: ${percentage}%; transform: translate(-50%, -50%); width: 20px; height: 20px; background: linear-gradient(135deg, var(--color-accent-2) 0%, var(--color-accent-1) 100%); border: 3px solid var(--color-text-light); border-radius: 50%; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5); z-index: 2; transition: left 0.2s ease;"></div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <input type="range" 
                             class="form-control" 
                             id="demeanor-${trait.key}" 
                             min="1" 
                             max="10" 
                             step="0.5"
                             value="${value}"
                             style="flex: 1;"
                             oninput="updateDemeanorDisplay('${trait.key}', parseFloat(this.value))">
                      <span id="demeanor-${trait.key}-value" style="min-width: 35px; text-align: center; font-weight: 700; font-size: 1rem; color: var(--color-accent-2); background-color: rgba(255, 255, 255, 0.9); padding: 0.25rem 0.5rem; border-radius: 4px; border: 1px solid var(--color-border-2);">
                        ${value}
                      </span>
                    </div>
                  </div>
                </div>
              `;
            }).join('');
          })()}
        </div>
        
        <!-- Record History / Story Arcs / Timeline -->
        <h3 class="mb-3 mt-4">Record History <i class="japanese-header">記録履歴</i></h3>
        <div class="form-group">
          <label class="form-label">Childhood</label>
          <textarea class="form-control" id="recordHistoryChildhood" rows="5">${formOC.recordHistory?.childhood || ''}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Adolescence</label>
          <textarea class="form-control" id="recordHistoryAdolescence" rows="5">${formOC.recordHistory?.adolescence || ''}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Adulthood</label>
          <textarea class="form-control" id="recordHistoryAdulthood" rows="5">${formOC.recordHistory?.adulthood || ''}</textarea>
        </div>
        
        <div id="story-arcs-editor" class="mb-4 mt-4">
          <label class="form-label mb-2">Story Arcs / Timeline</label>
          <div class="card-naruto" style="padding: 1rem; margin-bottom: 1rem;">
            <div id="story-arcs-container">
              ${(() => {
                const storyArcs = formOC.storyArcs || [];
                if (storyArcs.length === 0) {
                  return '<p class="text-muted">No story arcs added yet.</p>';
                }
                return storyArcs.map((arc, index) => renderStoryArcEditor(arc, index)).join('');
              })()}
            </div>
            <button type="button" class="btn-naruto btn-naruto-secondary mt-2" onclick="addStoryArc()">+ Add Story Arc</button>
          </div>
        </div>
        
        <!-- Appearance & Gear -->
        <h3 class="mb-3 mt-4">Appearance & Gear <i class="japanese-header">外見と装備</i></h3>
        <div class="form-group">
          <label class="form-label">Appearance Image / Icon</label>
          <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; flex-wrap: wrap;">
            <button type="button" class="btn-naruto btn-naruto-secondary" onclick="showImageUpload()" style="flex: 1; min-width: 120px;">
              <i class="fas fa-upload"></i> Upload Image
            </button>
            <button type="button" class="btn-naruto btn-naruto-secondary" onclick="showIconPicker()" style="flex: 1; min-width: 120px;">
              <i class="fas fa-icons"></i> Pick Icon
            </button>
          </div>
          <input type="file" id="appearanceImageUpload" accept="image/*" style="display: none;" onchange="handleImageUpload(event)">
          <div id="icon-picker-container" style="display: none; margin-bottom: 0.5rem;">
            <div style="margin-bottom: 0.5rem;">
              <input type="text" class="form-control" id="iconSearch" placeholder="Search Font Awesome icons (e.g., sword, ninja, fire, lightning, dragon...)" onkeyup="filterIcons(this.value)" style="font-size: 0.85rem;" autocomplete="off">
              <small style="color: var(--color-text-dark-2); font-size: 0.75rem; display: block; margin-top: 0.25rem;">
                Search by icon name or keywords. Try: weapon, ninja, element, animal, symbol, etc.
              </small>
            </div>
            <div id="icon-picker-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(50px, 1fr)); gap: 0.5rem; max-height: 300px; overflow-y: auto; padding: 0.5rem; background-color: var(--color-bg-1); border: 1px solid var(--color-border-2); border-radius: 4px;">
              ${(() => {
                // This will be populated dynamically when icon picker is shown
                return '<div style="grid-column: 1 / -1; text-align: center; padding: 1rem; color: var(--color-text-dark-2);">Loading icons...</div>';
              })()}
            </div>
          </div>
          <input type="text" class="form-control" id="appearanceImage" value="${formOC.appearance?.image || ''}" placeholder="Image URL or Font Awesome icon class (e.g., fas fa-user-ninja)">
          <div id="appearanceImagePreview" style="margin-top: 0.5rem; text-align: center; min-height: 60px;">
            ${formOC.appearance?.image ? (
              formOC.appearance.image.startsWith('fa-') || formOC.appearance.image.startsWith('fas ') || formOC.appearance.image.startsWith('far ') || formOC.appearance.image.startsWith('fab ') ?
                `<div style="font-size: 3rem; color: var(--color-accent-2);"><i class="${formOC.appearance.image}"></i></div>` :
                `<img src="${convertImageUrl(formOC.appearance.image)}" alt="Preview" style="max-width: 200px; max-height: 200px; border: 1px solid var(--color-border-2); border-radius: 4px;">`
            ) : ''}
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Color Palette <small style="font-weight: normal; color: var(--color-text-dark-2);">(one color per line, hex codes or color names)</small></label>
          <textarea class="form-control" id="appearanceColors" rows="3" placeholder="#FF5733&#10;#33FF57&#10;blue" oninput="updateColorPreview()">${(formOC.appearance?.colors || []).join('\n')}</textarea>
          <div id="colorPreview" style="margin-top: 0.5rem; min-height: 40px; display: flex; gap: 0.25rem; flex-wrap: wrap; padding: 0.5rem; background-color: var(--color-bg-1); border: 1px solid var(--color-border-2); border-radius: 4px;">
            ${(() => {
              const colors = formOC.appearance?.colors || [];
              if (colors.length === 0) {
                return '<small style="color: var(--color-text-dark-2);">Color preview will appear here...</small>';
              }
              return colors.map(color => {
                // Normalize color for display
                const normalizedColor = color.trim();
                const displayColor = normalizedColor.startsWith('#') ? normalizedColor : (normalizedColor.match(/^#?[0-9A-Fa-f]{3,8}$/) ? `#${normalizedColor.replace('#', '')}` : normalizedColor);
                return `<div class="color-swatch" style="width: 40px; height: 40px; background-color: ${displayColor}; border: 1px solid var(--color-border-2); border-radius: 4px; flex-shrink: 0;" title="${displayColor}"></div>`;
              }).join('');
            })()}
          </div>
        </div>
        <div id="gear-editor" class="mt-3 mb-3">
          <label class="form-label mb-2">Gear Items</label>
          <div class="card-naruto" style="padding: 1rem; margin-bottom: 1rem;">
            <div id="gear-container">
              ${(() => {
                const gear = formOC.appearance?.gear || [];
                if (gear.length === 0) {
                  return '<p class="text-muted">No gear items added yet. Click "Add Item" below to add gear.</p>';
                }
                return gear.map((item, index) => {
                  // Handle both string and object formats
                  const gearItem = typeof item === 'string' 
                    ? { name: item, category: 'Item', icon: '', material: '', use: '', info: [] }
                    : { name: item.name || '', category: item.category || 'Item', icon: item.icon || '', material: item.material || '', use: item.use || '', info: item.info || item.information || [] };
                  return renderGearEditor(gearItem, index);
                }).join('');
              })()}
            </div>
            <button type="button" class="btn-naruto btn-naruto-secondary mt-2" onclick="addGearItem()">+ Add Item</button>
          </div>
        </div>
        
        <!-- Appearance by Era -->
        <h3 class="mb-3 mt-4">Appearance by Era</h3>
        <div class="appearance-era-container">
          <div class="appearance-era-tabs" style="display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap;">
            ${['Part I', 'Part II', 'Blank Period', 'Gaiden', 'Boruto'].map((era, index) => `
              <button type="button" class="btn-naruto btn-naruto-secondary appearance-era-tab ${index === 0 ? 'active' : ''}" 
                      onclick="switchAppearanceEraTab('${era}')" 
                      data-era="${era}"
                      style="font-size: 0.85rem; padding: 0.5rem 1rem;">
                ${era}
              </button>
            `).join('')}
          </div>
          <div class="appearance-era-content">
            ${['Part I', 'Part II', 'Blank Period', 'Gaiden', 'Boruto'].map((era, index) => {
              const eraAppearance = formOC.appearanceByEra?.[era] || { description: '', clothing: '', accessories: '', visualMotifs: '' };
              const isActive = index === 0 ? 'active' : '';
              return `
                <div class="appearance-era-panel ${isActive}" id="appearance-era-panel-${era.replace(/\s+/g, '-')}" 
                     style="${index !== 0 ? 'display: none;' : ''}">
                  <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea class="form-control" id="appearanceEra-${era}-description" rows="3" 
                              placeholder="Hair, eyes, build...">${eraAppearance.description || ''}</textarea>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Signature Clothing</label>
                    <textarea class="form-control" id="appearanceEra-${era}-clothing" rows="2" 
                              placeholder="Clothing description for ${era}...">${eraAppearance.clothing || ''}</textarea>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Accessories</label>
                    <textarea class="form-control" id="appearanceEra-${era}-accessories" rows="2" 
                              placeholder="Accessories for ${era}...">${eraAppearance.accessories || ''}</textarea>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Visual Motifs</label>
                    <textarea class="form-control" id="appearanceEra-${era}-visualMotifs" rows="2" 
                              placeholder="Distinctive visual traits for ${era}...">${eraAppearance.visualMotifs || ''}</textarea>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <!-- Background & History -->
        <h3 class="mb-3 mt-4">Background & History <i class="japanese-header">背景と歴史</i></h3>
        <div id="relationships-editor" class="mb-4">
          <label class="form-label mb-2">Relationships</label>
          <div class="card-naruto" style="padding: 1rem; margin-bottom: 1rem;">
            <div id="relationships-container">
              ${(() => {
                const relationships = formOC.relationships || formOC.knownAssociates || [];
                if (relationships.length === 0) {
                  return '<p class="text-muted">No relationships added yet.</p>';
                }
                return relationships.map((rel, index) => renderRelationshipEditor(rel, index)).join('');
              })()}
            </div>
            <button type="button" class="btn-naruto btn-naruto-secondary mt-2" onclick="addRelationship()">+ Add Relationship</button>
          </div>
        </div>
        
        <!-- Other Media -->
        <h3 class="mb-3 mt-4">In Other Media</h3>
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Novel Appearances (one per line)</label>
              <textarea class="form-control" id="otherMediaNovel" rows="3" placeholder="e.g., Novel Title 1&#10;Novel Title 2">${(formOC.otherMedia?.novel || []).join('\n')}</textarea>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Game Appearances (one per line)</label>
              <textarea class="form-control" id="otherMediaGame" rows="3" placeholder="e.g., Game Title 1&#10;Game Title 2">${(formOC.otherMedia?.game || []).join('\n')}</textarea>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">OVA Appearances (one per line)</label>
              <textarea class="form-control" id="otherMediaOVA" rows="3" placeholder="e.g., OVA Title 1">${(formOC.otherMedia?.ova || []).join('\n')}</textarea>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Movie Appearances (one per line)</label>
              <textarea class="form-control" id="otherMediaMovies" rows="3" placeholder="e.g., Movie Title 1">${(formOC.otherMedia?.movies || []).join('\n')}</textarea>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Non-Canon Events (one per line)</label>
          <textarea class="form-control" id="otherMediaNonCanon" rows="3" placeholder="e.g., Filler arc name">${(formOC.otherMedia?.nonCanon || []).join('\n')}</textarea>
        </div>
        
        <!-- Miscellaneous -->
        <h3 class="mb-3 mt-4">Miscellaneous <i class="japanese-header">その他</i></h3>
        <div class="form-group">
          <label class="form-label">Quotes (one per line)</label>
          <textarea class="form-control" id="quotes" rows="4">${(formOC.quotes || []).join('\n')}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Trivia</label>
          <textarea class="form-control" id="trivia" rows="4">${formOC.trivia || ''}</textarea>
        </div>
        
        <div id="gallery-editor" class="mb-4">
          <label class="form-label mb-2">Gallery</label>
          <div class="card-naruto" style="padding: 1rem; margin-bottom: 1rem;">
            <div id="gallery-container">
              ${(() => {
                const gallery = formOC.gallery || [];
                if (gallery.length === 0) {
                  return '<p class="text-muted">No gallery images added yet.</p>';
                }
                return gallery.map((item, index) => renderGalleryItem(item, index)).join('');
              })()}
            </div>
            <button type="button" class="btn-naruto btn-naruto-secondary mt-2" onclick="addGalleryItem()">+ Add Gallery Image</button>
          </div>
        </div>
        
        <!-- Buttons -->
        <div class="mt-4">
          <button type="submit" class="btn-naruto">${isEdit ? 'Update' : 'Create'} OC</button>
          <button type="button" class="btn-naruto btn-naruto-secondary" onclick="window.navigateTo('ocs')" style="margin-left: 0.5rem;">Cancel</button>
        </div>
      </form>
    </div>
  `;
  
  // Store onSave callback and formOC id globally
  window.saveOCForm = () => {
    const ocData = {
      id: formOC.id,
      lastName: document.getElementById('lastName').value,
      firstName: document.getElementById('firstName').value,
      nameJapanese: document.getElementById('nameJapanese').value,
      lastNameMeaning: document.getElementById('lastNameMeaning').value,
      firstNameMeaning: document.getElementById('firstNameMeaning').value,
      nameMeaning: (() => {
        const fullMeaning = document.getElementById('nameMeaning').value;
        const lastNameMeaning = document.getElementById('lastNameMeaning').value;
        const firstNameMeaning = document.getElementById('firstNameMeaning').value;
        // If full meaning is provided, use it; otherwise auto-combine from parts
        if (fullMeaning) {
          return fullMeaning;
        } else if (lastNameMeaning || firstNameMeaning) {
          return [lastNameMeaning, firstNameMeaning].filter(m => m).join(', ');
        }
        return '';
      })(),
      aliases: document.getElementById('aliases').value.split(',').map(a => a.trim()).filter(a => a),
      debut: {
        manga: document.getElementById('debutManga').value,
        anime: document.getElementById('debutAnime').value,
        novel: document.getElementById('debutNovel').value,
        movie: document.getElementById('debutMovie').value,
        game: document.getElementById('debutGame').value
      },
      appearsIn: (() => {
        const checkboxes = document.querySelectorAll('input[id^="appearsIn-"]:checked');
        return Array.from(checkboxes).map(cb => cb.value);
      })(),
      dob: (() => {
        const month = document.getElementById('dobMonth').value;
        const day = document.getElementById('dobDay').value;
        return (month && day) ? `${month}-${day}` : '';
      })(),
      ageByEra: (() => {
        const eras = ['Part I', 'Part II', 'Blank Period', 'Gaiden', 'Boruto'];
        const ageByEra = {};
        eras.forEach(era => {
          const ageInput = document.getElementById(`age-${era}`);
          if (ageInput && ageInput.value.trim()) {
            ageByEra[era] = ageInput.value.trim();
          }
        });
        return Object.keys(ageByEra).length > 0 ? ageByEra : undefined;
      })(),
      bloodType: document.getElementById('bloodType').value,
      gender: document.getElementById('gender').value,
      natureType: (() => {
        const select = document.getElementById('natureType');
        const selected = Array.from(select.selectedOptions).map(option => option.value);
        return selected.length > 0 ? (selected.length === 1 ? selected[0] : selected) : '';
      })(),
      village: (() => {
        const select = document.getElementById('village');
        const selected = Array.from(select.selectedOptions).map(option => option.value);
        return selected.length > 0 ? (selected.length === 1 ? selected[0] : selected) : [];
      })(),
      rank: (() => {
        const select = document.getElementById('rank');
        const selected = Array.from(select.selectedOptions).map(option => option.value);
        return selected.length > 0 ? (selected.length === 1 ? selected[0] : selected) : [];
      })(),
      clanId: (() => {
        const clanSelect = document.getElementById('clanName');
        const selectedNames = Array.from(clanSelect.selectedOptions).map(option => option.value);
        const clanIds = [];
        
        selectedNames.forEach(enteredName => {
          if (!enteredName) return;
          
          // Check if it matches a user-created clan
          const userClan = clans.find(c => c.name === enteredName);
          if (userClan) {
            clanIds.push(userClan.id);
          }
        });
        
        return clanIds.length > 0 ? (clanIds.length === 1 ? clanIds[0] : clanIds) : null;
      })(),
      clanName: (() => {
        const clanSelect = document.getElementById('clanName');
        const selectedNames = Array.from(clanSelect.selectedOptions).map(option => option.value);
        const clanNames = [];
        
        selectedNames.forEach(enteredName => {
          if (!enteredName) return;
          
          // Check if it matches a predefined clan
          if (predefinedClanNames.includes(enteredName)) {
            clanNames.push(enteredName);
            return;
          }
          
          // Check if it matches a user-created clan (we'll use clanId for that, so skip)
          const userClan = clans.find(c => c.name === enteredName);
          if (userClan) {
            return; // Use clanId instead
          }
          
          // If it doesn't match anything, store it as a custom clan name
          clanNames.push(enteredName);
        });
        
        return clanNames.length > 0 ? (clanNames.length === 1 ? clanNames[0] : clanNames) : null;
      })(),
      stats: (() => {
        // Default stats (use Part I if available, otherwise default values)
        const eras = ['Part I', 'Part II', 'Blank Period', 'Gaiden', 'Boruto'];
        const partIStats = {};
        eras.forEach(era => {
          const eraId = era.replace(/\s+/g, '-');
          const eraStats = {};
          ['intelligence', 'stamina', 'strength', 'speed', 'ninjutsu', 'genjutsu', 'taijutsu', 'handSeals', 'fuinjutsu'].forEach(stat => {
            const element = document.getElementById(`${stat}-${era}`);
            if (element) {
              eraStats[stat] = parseFloat(element.value) || 0;
            }
          });
          if (era === 'Part I' && Object.keys(eraStats).length > 0) {
            Object.assign(partIStats, eraStats);
          }
        });
        return Object.keys(partIStats).length > 0 ? partIStats : {
          intelligence: 3,
          stamina: 3,
          strength: 3,
          speed: 3,
          ninjutsu: 3,
          genjutsu: 3,
          taijutsu: 3,
          handSeals: 3,
          fuinjutsu: 0
        };
      })(),
      statsByEra: (() => {
        const eras = ['Part I', 'Part II', 'Blank Period', 'Gaiden', 'Boruto'];
        const statsByEra = {};
        eras.forEach(era => {
          const eraId = era.replace(/\s+/g, '-');
          const eraStats = {};
          ['intelligence', 'stamina', 'strength', 'speed', 'ninjutsu', 'genjutsu', 'taijutsu', 'handSeals', 'fuinjutsu'].forEach(stat => {
            const element = document.getElementById(`${stat}-${era}`);
            if (element) {
              const value = parseFloat(element.value) || 0;
              if (value > 0) {
                eraStats[stat] = value;
              }
            }
          });
          if (Object.keys(eraStats).length > 0) {
            statsByEra[era] = eraStats;
          }
        });
        return Object.keys(statsByEra).length > 0 ? statsByEra : undefined;
      })(),
      heightByEra: (() => {
        const eras = ['Part I', 'Part II', 'Blank Period', 'Gaiden', 'Boruto'];
        const heightByEra = {};
        eras.forEach(era => {
          const heightInput = document.getElementById(`height-${era}`);
          if (heightInput && heightInput.value.trim()) {
            heightByEra[era] = heightInput.value.trim();
          }
        });
        return Object.keys(heightByEra).length > 0 ? heightByEra : undefined;
      })(),
      weightByEra: (() => {
        const eras = ['Part I', 'Part II', 'Blank Period', 'Gaiden', 'Boruto'];
        const weightByEra = {};
        eras.forEach(era => {
          const weightInput = document.getElementById(`weight-${era}`);
          if (weightInput && weightInput.value.trim()) {
            weightByEra[era] = weightInput.value.trim();
          }
        });
        return Object.keys(weightByEra).length > 0 ? weightByEra : undefined;
      })(),
      identifyingInfo: {
        bodyType: document.getElementById('bodyType').value
      },
      eyeColor: document.getElementById('eyeColor').value,
      hairColor: document.getElementById('hairColor').value,
      distinguishingFeatures: document.getElementById('distinguishingFeatures').value.split('\n').filter(f => f.trim()),
      teamNumber: document.getElementById('teamNumber').value,
      teammates: document.getElementById('teammates').value.split(',').map(t => t.trim()).filter(t => t),
      sensei: document.getElementById('sensei').value,
      madeGenin: document.getElementById('madeGenin').value,
      madeChunin: document.getElementById('madeChunin').value,
      battleStrategy: {
        inTeam: document.getElementById('strategyInTeam').value,
        alone: document.getElementById('strategyAlone').value,
        fieldPosition: document.getElementById('fieldPosition').value,
        effectiveDistance: document.getElementById('effectiveDistance').value,
        specialty: document.getElementById('specialty').value,
        notableAbilities: document.getElementById('notableAbilities').value
      },
      personality: {
        overview: document.getElementById('personalityOverview')?.value.trim() || '',
        positiveTraits: document.getElementById('positiveTraits')?.value.split('\n').filter(t => t.trim()) || [],
        negativeTraits: document.getElementById('negativeTraits')?.value.split('\n').filter(t => t.trim()) || [],
        neutralTraits: document.getElementById('neutralTraits')?.value.split('\n').filter(t => t.trim()) || [],
        likes: document.getElementById('likes').value.split('\n').filter(l => l.trim()),
        dislikes: document.getElementById('dislikes').value.split('\n').filter(d => d.trim()),
        demeanor: (() => {
          const traits = [
            'friendlyReserved', 'politeBlunt', 'cleverFoolish', 'sensitiveTough', 'braveTimid',
            'carefulReckless', 'sincereDeceptive', 'diligentLazy', 'calmIrritable', 'humorousSerious'
          ];
          const demeanor = {};
          traits.forEach(trait => {
            const input = document.getElementById(`demeanor-${trait}`);
            if (input) {
              demeanor[trait] = parseFloat(input.value) || 5.5;
            } else {
              demeanor[trait] = formOC.personality?.demeanor?.[trait] || 5.5;
            }
          });
          return demeanor;
        })()
      },
      abilities: (() => {
        const container = document.getElementById('abilities-container');
        if (!container) return {};
        const abilities = {};
        
        // Determine taijutsu-style techniques
        const taijutsuTypes = ['taijutsu', 'kenjutsu', 'bojutsu', 'kayakujutsu', 'kusarigamajutsu', 
                               'kyujutsu', 'shurikenjutsu', 'tessenjutsu', 'bukijutsu', 'nintaijutsu'];
        
        container.querySelectorAll('.ability-editor-item').forEach(item => {
          const type = item.dataset.type;
          const index = item.dataset.index;
          const styleInput = container.querySelector(`[name="ability-style-${type}-${index}"]`);
          const descInput = container.querySelector(`[name="ability-description-${type}-${index}"]`);
          
          if (!styleInput || !descInput) return;
          
          const ability = {
            style: styleInput.value || '',
            description: descInput.value || ''
          };
          
          const isTaijutsu = taijutsuTypes.includes(type.toLowerCase());
          
          if (isTaijutsu) {
            const baseStyleInput = container.querySelector(`[name="ability-baseStyle-${type}-${index}"]`);
            const masteryInput = container.querySelector(`[name="ability-mastery-${type}-${index}"]`);
            ability.baseStyle = baseStyleInput?.value || '';
            ability.mastery = parseInt(masteryInput?.value) || 3;
          } else {
            const rankInput = container.querySelector(`[name="ability-rank-${type}-${index}"]`);
            const difficultyInput = container.querySelector(`[name="ability-difficulty-${type}-${index}"]`);
            const chakraInput = container.querySelector(`[name="ability-chakraIntensity-${type}-${index}"]`);
            ability.rank = rankInput?.value || '';
            ability.difficulty = parseInt(difficultyInput?.value) || 3;
            ability.chakraIntensity = parseInt(chakraInput?.value) || 3;
          }
          
          if (ability.style || ability.description) {
            if (!abilities[type]) abilities[type] = [];
            abilities[type].push(ability);
          }
        });
        return abilities;
      })(),
      relationships: (() => {
        const container = document.getElementById('relationships-container');
        if (!container) return [];
        const relationships = [];
        container.querySelectorAll('.relationship-editor-item').forEach(item => {
          const index = item.dataset.index;
          const nameInput = container.querySelector(`[name="relationship-name-${index}"]`);
          const typeInput = container.querySelector(`[name="relationship-type-${index}"]`);
          const imageInput = container.querySelector(`[name="relationship-image-${index}"]`);
          const heartInput = container.querySelector(`[name="relationship-heartChart-${index}"]`);
          const descInput = container.querySelector(`[name="relationship-description-${index}"]`);
          
          if (!nameInput && !descInput) return;
          
          const rel = {
            name: nameInput?.value || '',
            relationshipType: typeInput?.value || '',
            image: imageInput?.value || '',
            heartChart: heartInput?.value || '',
            description: descInput?.value || ''
          };
          
          if (rel.name || rel.description) {
            relationships.push(rel);
          }
        });
        return relationships;
      })(),
      storyArcs: (() => {
        const container = document.getElementById('story-arcs-container');
        if (!container) return [];
        const storyArcs = [];
        container.querySelectorAll('.story-arc-editor-item').forEach(item => {
          const index = item.dataset.index;
          const nameInput = container.querySelector(`[name="story-arc-name-${index}"]`);
          const summaryInput = container.querySelector(`[name="story-arc-summary-${index}"]`);
          const keyEventsInput = container.querySelector(`[name="story-arc-keyEvents-${index}"]`);
          
          if (!nameInput && !summaryInput) return;
          
          const arc = {
            name: nameInput?.value || '',
            summary: summaryInput?.value || '',
            keyEvents: keyEventsInput?.value.split('\n').filter(e => e.trim()) || []
          };
          
          if (arc.name || arc.summary) {
            storyArcs.push(arc);
          }
        });
        return storyArcs;
      })(),
      recordHistory: {
        childhood: document.getElementById('recordHistoryChildhood').value,
        adolescence: document.getElementById('recordHistoryAdolescence').value,
        adulthood: document.getElementById('recordHistoryAdulthood').value
      },
      appearance: {
        image: document.getElementById('appearanceImage').value,
        colors: (() => {
          const colorsText = document.getElementById('appearanceColors').value;
          // Helper function to validate and normalize color
          const normalizeColor = (color) => {
            if (!color) return null;
            const trimmed = color.trim();
            if (!trimmed) return null;
            
            // If it's a hex code (with or without #)
            if (/^#?[0-9A-Fa-f]{3,8}$/.test(trimmed)) {
              return trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
            }
            
            // If it's a valid CSS color name or rgb/rgba/hsl/hsla, return as-is
            // Create a temporary element to test if the color is valid
            const testEl = document.createElement('div');
            testEl.style.color = trimmed;
            if (testEl.style.color) {
              return trimmed;
            }
            
            // If validation fails, try to fix common issues
            // Remove extra spaces
            const fixed = trimmed.replace(/\s+/g, '');
            testEl.style.color = fixed;
            if (testEl.style.color) {
              return fixed;
            }
            
            return null;
          };
          
          return colorsText
            .split('\n')
            .map(c => normalizeColor(c))
            .filter(c => c !== null);
        })(),
        gear: (() => {
          const container = document.getElementById('gear-container');
          if (!container) return [];
          
          const gear = [];
          container.querySelectorAll('.gear-editor-item').forEach(item => {
            const index = item.dataset.index;
            const nameInput = container.querySelector(`[name="gear-name-${index}"]`);
            const iconInput = container.querySelector(`[name="gear-icon-${index}"]`);
            const infoInput = container.querySelector(`[name="gear-info-${index}"]`);
            
            const name = nameInput?.value || '';
            const icon = iconInput?.value || '';
            const infoText = infoInput?.value || '';
            const info = infoText.split('\n').filter(i => i.trim());
            
            // Only add if name is provided
            if (name.trim()) {
              const gearItem = {
                name: name.trim(),
                ...(icon ? { icon: icon.trim() } : {}),
                ...(info.length > 0 ? { info: info } : {})
              };
              gear.push(gearItem);
            }
          });
          
          return gear;
        })()
      },
      appearanceByEra: (() => {
        const eras = ['Part I', 'Part II', 'Blank Period', 'Gaiden', 'Boruto'];
        const appearanceByEra = {};
        eras.forEach(era => {
          const eraId = era.replace(/\s+/g, '-');
          const descEl = document.getElementById(`appearanceEra-${era}-description`);
          const clothingEl = document.getElementById(`appearanceEra-${era}-clothing`);
          const accessoriesEl = document.getElementById(`appearanceEra-${era}-accessories`);
          const visualMotifsEl = document.getElementById(`appearanceEra-${era}-visualMotifs`);
          
          if (descEl || clothingEl || accessoriesEl || visualMotifsEl) {
            appearanceByEra[era] = {
              description: descEl?.value || '',
              clothing: clothingEl?.value || '',
              accessories: accessoriesEl?.value || '',
              visualMotifs: visualMotifsEl?.value || ''
            };
          }
        });
        return Object.keys(appearanceByEra).length > 0 ? appearanceByEra : undefined;
      })(),
      imagesByEra: (() => {
        const eras = ['Part I', 'Part II', 'Blank Period', 'Gaiden', 'Boruto'];
        const imagesByEra = {};
        eras.forEach(era => {
          const imageEl = document.getElementById(`imageEra-${era}`);
          if (imageEl && imageEl.value && imageEl.value.trim()) {
            imagesByEra[era] = imageEl.value.trim();
          }
        });
        return Object.keys(imagesByEra).length > 0 ? imagesByEra : undefined;
      })(),
      profileImage: document.getElementById('profileImage').value,
      zodiac: document.getElementById('zodiac').value,
      sexualOrientation: document.getElementById('sexualOrientation').value,
      romanticOrientation: document.getElementById('romanticOrientation').value,
      family: {
        father: document.getElementById('familyFather').value,
        mother: document.getElementById('familyMother').value,
        siblings: document.getElementById('familySiblings').value.split('\n').filter(s => s.trim()),
        otherRelatives: document.getElementById('familyOtherRelatives').value.split('\n').filter(r => r.trim())
      },
      ninjaRegistrationNumber: document.getElementById('ninjaRegistrationNumber').value,
      academyGraduationAge: document.getElementById('academyGraduationAge').value,
      classification: document.getElementById('classification').value.split(',').map(c => c.trim()).filter(c => c),
      kekkeiGenkai: document.getElementById('kekkeiGenkai').value,
      chakraPhysicalProwess: {
        chakraReserves: document.getElementById('chakraReserves').value,
        chakraControl: document.getElementById('chakraControl').value,
        strengthFeats: document.getElementById('strengthFeats').value,
        speedFeats: document.getElementById('speedFeats').value,
        taijutsuSkill: document.getElementById('taijutsuSkill').value,
        trainingInfluences: document.getElementById('trainingInfluences').value
      },
      intelligence: {
        academicPerformance: document.getElementById('academicPerformance').value,
        analyticalAbility: document.getElementById('analyticalAbility').value,
        combatStrategy: document.getElementById('combatStrategy').value,
        leadershipSkill: document.getElementById('leadershipSkill').value
      },
      themeSong: document.getElementById('themeSong').value,
      themeSongLink: document.getElementById('themeSongLink').value,
      voiceActors: {
        japanese: document.getElementById('voiceActorJP').value,
        english: document.getElementById('voiceActorEN').value
      },
      otherMedia: {
        novel: document.getElementById('otherMediaNovel').value.split('\n').filter(m => m.trim()),
        game: document.getElementById('otherMediaGame').value.split('\n').filter(m => m.trim()),
        ova: document.getElementById('otherMediaOVA').value.split('\n').filter(m => m.trim()),
        movies: document.getElementById('otherMediaMovies').value.split('\n').filter(m => m.trim()),
        nonCanon: document.getElementById('otherMediaNonCanon').value.split('\n').filter(m => m.trim())
      },
      quotes: document.getElementById('quotes').value.split('\n').filter(q => q.trim()),
      trivia: document.getElementById('trivia').value,
      gallery: (() => {
        const container = document.getElementById('gallery-container');
        if (!container) return [];
        const gallery = [];
        container.querySelectorAll('.gallery-editor-item').forEach(item => {
          const index = item.dataset.index;
          const urlInput = container.querySelector(`[name="gallery-url-${index}"]`);
          const captionInput = container.querySelector(`[name="gallery-caption-${index}"]`);
          
          if (!urlInput) return;
          
          const url = urlInput.value || '';
          const caption = captionInput?.value || '';
          
          if (url) {
            if (caption) {
              gallery.push({ url: url, caption: caption });
            } else {
              gallery.push(url);
            }
          }
        });
        return gallery;
      })(),
      fears: document.getElementById('fears').value.split('\n').filter(f => f.trim()),
      moralAlignment: document.getElementById('moralAlignment').value,
      mbti: document.getElementById('mbti').value,
      enneagram: document.getElementById('enneagram').value,
      missions: {
        s: parseInt(document.getElementById('missionS').value) || 0,
        a: parseInt(document.getElementById('missionA').value) || 0,
        b: parseInt(document.getElementById('missionB').value) || 0,
        c: parseInt(document.getElementById('missionC').value) || 0,
        d: parseInt(document.getElementById('missionD').value) || 0
      }
    };
    
    onSave(ocData);
  };
  
  // Initialize stat slider backgrounds after form is inserted into DOM
  setTimeout(() => {
    const statSliders = form.querySelectorAll('.stat-slider');
    statSliders.forEach(slider => {
      const value = parseInt(slider.value);
      const percentage = (value / 5) * 100;
      slider.style.background = `linear-gradient(to right, 
        var(--color-accent-2) 0%, 
        var(--color-accent-2) ${percentage}%,
        var(--color-border-2) ${percentage}%,
        var(--color-border-2) 100%)`;
    });
    
    // Initialize nature type count display
    const natureTypeSelect = form.querySelector('#natureType');
    const natureTypeCount = form.querySelector('#natureType-count');
    if (natureTypeSelect && natureTypeCount) {
      const updateCount = () => {
        const selectedCount = natureTypeSelect.selectedOptions.length;
        natureTypeCount.textContent = selectedCount;
      };
      updateCount(); // Initial count
      natureTypeSelect.addEventListener('change', updateCount);
    }
  }, 0);
  
  // Appearance image upload and icon picker functions
  window.showImageUpload = function() {
    document.getElementById('appearanceImageUpload').click();
  };
  
  window.handleImageUpload = function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const imageInput = document.getElementById('appearanceImage');
        imageInput.value = e.target.result;
        updateAppearancePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  window.showIconPicker = function() {
    const container = document.getElementById('icon-picker-container');
    const grid = document.getElementById('icon-picker-grid');
    const isVisible = container.style.display !== 'none';
    
    if (!isVisible) {
      // Load icons when showing picker
      if (!grid.dataset.loaded) {
        const allIcons = window.getAllFontAwesomeIcons();
        grid.innerHTML = allIcons.map(icon => `
          <button type="button" class="icon-picker-btn" onclick="selectIcon('${icon.class}')" 
                  data-keywords="${icon.keywords || ''}"
                  style="padding: 0.5rem; border: 1px solid var(--color-border-2); background: var(--color-bg-transparent); cursor: pointer; border-radius: 4px; transition: all 0.2s;" 
                  onmouseover="this.style.background='var(--color-accent-2)'; this.style.color='white';" 
                  onmouseout="this.style.background='var(--color-bg-transparent)'; this.style.color='';"
                  title="${icon.class.replace('fas ', '')}">
            <i class="${icon.class}" style="font-size: 1.5rem;"></i>
          </button>
        `).join('');
        grid.dataset.loaded = 'true';
      }
      container.style.display = 'block';
    } else {
      container.style.display = 'none';
    }
  };
  
  window.selectIcon = function(iconClass) {
    const imageInput = document.getElementById('appearanceImage');
    imageInput.value = iconClass;
    updateAppearancePreview(iconClass);
    document.getElementById('icon-picker-container').style.display = 'none';
  };
  
  window.filterIcons = function(searchTerm) {
    const buttons = document.querySelectorAll('.icon-picker-btn');
    const term = searchTerm.toLowerCase().trim();
    
    if (term === '') {
      buttons.forEach(btn => btn.style.display = 'block');
      return;
    }
    
    // Search through icon classes and keywords
    buttons.forEach(btn => {
      const icon = btn.querySelector('i');
      const iconClass = icon ? icon.className : '';
      const keywords = btn.dataset.keywords || '';
      
      // Extract icon name from class (e.g., "fas fa-user-ninja" -> "user-ninja")
      const iconName = iconClass.replace(/^(fas|far|fab|fal|fad)\s+fa-/, '').replace(/\s+/g, '-');
      
      // Search in icon class, icon name, and keywords
      const searchableText = `${iconClass} ${iconName} ${keywords}`.toLowerCase();
      
      if (searchableText.includes(term)) {
        btn.style.display = 'block';
      } else {
        btn.style.display = 'none';
      }
    });
  };
  
  // Get comprehensive list of Font Awesome icons with keywords
  // Make it available globally
  if (!window.getAllFontAwesomeIcons) {
    window.getAllFontAwesomeIcons = function() {
    return [
      // Weapons & Combat
      { class: 'fas fa-sword', keywords: 'weapon blade katana combat' },
      { class: 'fas fa-knife', keywords: 'weapon blade combat' },
      { class: 'fas fa-shield', keywords: 'defense protection combat' },
      { class: 'fas fa-shield-alt', keywords: 'defense protection' },
      { class: 'fas fa-crosshairs', keywords: 'target aim weapon' },
      { class: 'fas fa-bow-arrow', keywords: 'weapon bow arrow' },
      { class: 'fas fa-hammer', keywords: 'weapon tool' },
      { class: 'fas fa-axe', keywords: 'weapon tool' },
      { class: 'fas fa-mace', keywords: 'weapon combat' },
      
      // Ninja & Stealth
      { class: 'fas fa-user-ninja', keywords: 'ninja shinobi stealth assassin' },
      { class: 'fas fa-user-secret', keywords: 'spy stealth secret ninja' },
      { class: 'fas fa-mask', keywords: 'mask disguise ninja' },
      { class: 'fas fa-eye', keywords: 'eye vision sharingan byakugan' },
      { class: 'fas fa-eye-slash', keywords: 'blind hidden' },
      { class: 'fas fa-low-vision', keywords: 'vision sight' },
      
      // Nature Elements
      { class: 'fas fa-fire', keywords: 'fire flame katon fire release' },
      { class: 'fas fa-water', keywords: 'water suiton water release' },
      { class: 'fas fa-mountain', keywords: 'earth stone doton earth release' },
      { class: 'fas fa-wind', keywords: 'wind fuuton wind release' },
      { class: 'fas fa-bolt', keywords: 'lightning raiton lightning release' },
      { class: 'fas fa-snowflake', keywords: 'ice snow hyoton ice release' },
      { class: 'fas fa-leaf', keywords: 'leaf wood mokuton wood release' },
      { class: 'fas fa-tree', keywords: 'tree wood nature' },
      { class: 'fas fa-seedling', keywords: 'plant growth nature' },
      
      // Celestial
      { class: 'fas fa-sun', keywords: 'sun light day' },
      { class: 'fas fa-moon', keywords: 'moon night lunar' },
      { class: 'fas fa-star', keywords: 'star celestial' },
      { class: 'fas fa-stars', keywords: 'stars constellation' },
      
      // Animals
      { class: 'fas fa-dragon', keywords: 'dragon summon beast' },
      { class: 'fas fa-snake', keywords: 'snake orochimaru summon' },
      { class: 'fas fa-frog', keywords: 'frog toad summon jiraiya' },
      { class: 'fas fa-spider', keywords: 'spider summon' },
      { class: 'fas fa-crow', keywords: 'crow bird summon itachi' },
      { class: 'fas fa-dove', keywords: 'dove bird peace' },
      { class: 'fas fa-wolf', keywords: 'wolf summon kiba' },
      { class: 'fas fa-cat', keywords: 'cat summon' },
      { class: 'fas fa-dog', keywords: 'dog summon kiba' },
      { class: 'fas fa-horse', keywords: 'horse summon' },
      { class: 'fas fa-fish', keywords: 'fish summon' },
      
      // Body & Actions
      { class: 'fas fa-hand-sparkles', keywords: 'hand jutsu seal' },
      { class: 'fas fa-fist-raised', keywords: 'fist punch taijutsu' },
      { class: 'fas fa-hand-rock', keywords: 'hand fist' },
      { class: 'fas fa-running', keywords: 'run speed movement' },
      { class: 'fas fa-walking', keywords: 'walk movement' },
      { class: 'fas fa-dumbbell', keywords: 'strength training' },
      
      // Objects & Tools
      { class: 'fas fa-scroll', keywords: 'scroll jutsu seal technique' },
      { class: 'fas fa-book', keywords: 'book knowledge technique' },
      { class: 'fas fa-gem', keywords: 'gem crystal jewel' },
      { class: 'fas fa-ring', keywords: 'ring jewelry' },
      { class: 'fas fa-crown', keywords: 'crown royalty leader' },
      { class: 'fas fa-hat-wizard', keywords: 'wizard hat magic' },
      { class: 'fas fa-feather-alt', keywords: 'feather light' },
      { class: 'fas fa-key', keywords: 'key unlock' },
      { class: 'fas fa-lock', keywords: 'lock seal security' },
      { class: 'fas fa-unlock', keywords: 'unlock release' },
      
      // Characters & People
      { class: 'fas fa-user', keywords: 'user person character' },
      { class: 'fas fa-user-astronaut', keywords: 'user space unique' },
      { class: 'fas fa-user-shield', keywords: 'user protection guard' },
      { class: 'fas fa-user-graduate', keywords: 'user student academy' },
      { class: 'fas fa-user-injured', keywords: 'user hurt wounded' },
      { class: 'fas fa-user-tie', keywords: 'user formal leader' },
      { class: 'fas fa-user-friends', keywords: 'users team group' },
      { class: 'fas fa-users', keywords: 'users team group' },
      { class: 'fas fa-user-plus', keywords: 'user add new' },
      { class: 'fas fa-user-minus', keywords: 'user remove' },
      
      // Spiritual & Mystical
      { class: 'fas fa-ghost', keywords: 'ghost spirit edo tensei' },
      { class: 'fas fa-skull', keywords: 'skull death' },
      { class: 'fas fa-cross', keywords: 'cross religion' },
      { class: 'fas fa-yin-yang', keywords: 'yin yang balance' },
      { class: 'fas fa-star-and-crescent', keywords: 'moon star symbol' },
      
      // Symbols & Shapes
      { class: 'fas fa-circle', keywords: 'circle round' },
      { class: 'fas fa-square', keywords: 'square' },
      { class: 'fas fa-triangle', keywords: 'triangle' },
      { class: 'fas fa-hexagon', keywords: 'hexagon' },
      { class: 'fas fa-pentagon', keywords: 'pentagon' },
      
      // Medical & Healing
      { class: 'fas fa-heart', keywords: 'heart life health' },
      { class: 'fas fa-heartbeat', keywords: 'heartbeat life' },
      { class: 'fas fa-plus-circle', keywords: 'heal medical' },
      { class: 'fas fa-band-aid', keywords: 'heal medical' },
      
      // Communication
      { class: 'fas fa-comments', keywords: 'talk communication' },
      { class: 'fas fa-comment', keywords: 'talk message' },
      { class: 'fas fa-envelope', keywords: 'message letter' },
      { class: 'fas fa-bell', keywords: 'alert notification' },
      
      // Time & History
      { class: 'fas fa-clock', keywords: 'time clock' },
      { class: 'fas fa-hourglass', keywords: 'time hourglass' },
      { class: 'fas fa-calendar', keywords: 'date calendar' },
      { class: 'fas fa-history', keywords: 'history past' },
      
      // Location & Travel
      { class: 'fas fa-map', keywords: 'map location' },
      { class: 'fas fa-map-marker-alt', keywords: 'location marker' },
      { class: 'fas fa-home', keywords: 'home village' },
      { class: 'fas fa-village', keywords: 'village home' },
      { class: 'fas fa-route', keywords: 'path route journey' },
      
      // Energy & Power
      { class: 'fas fa-battery-full', keywords: 'energy power chakra' },
      { class: 'fas fa-bolt', keywords: 'energy lightning power' },
      { class: 'fas fa-magic', keywords: 'magic jutsu technique' },
      { class: 'fas fa-wand-magic', keywords: 'magic wand jutsu' },
      
      // Status & States
      { class: 'fas fa-check-circle', keywords: 'success complete' },
      { class: 'fas fa-times-circle', keywords: 'fail cancel' },
      { class: 'fas fa-exclamation-circle', keywords: 'warning alert' },
      { class: 'fas fa-question-circle', keywords: 'question unknown' },
      { class: 'fas fa-info-circle', keywords: 'info information' },
      
      // Additional popular icons
      { class: 'fas fa-anchor', keywords: 'anchor stability' },
      { class: 'fas fa-archway', keywords: 'gate entrance' },
      { class: 'fas fa-bahai', keywords: 'symbol peace' },
      { class: 'fas fa-bomb', keywords: 'explosive tag bomb' },
      { class: 'fas fa-campfire', keywords: 'fire camp' },
      { class: 'fas fa-castle', keywords: 'castle building' },
      { class: 'fas fa-compass', keywords: 'direction navigation' },
      { class: 'fas fa-dice', keywords: 'dice game chance' },
      { class: 'fas fa-flag', keywords: 'flag village symbol' },
      { class: 'fas fa-flask', keywords: 'potion medicine' },
      { class: 'fas fa-graduation-cap', keywords: 'academy graduation' },
      { class: 'fas fa-landmark', keywords: 'building important' },
      { class: 'fas fa-medal', keywords: 'achievement rank' },
      { class: 'fas fa-paw', keywords: 'animal summon' },
      { class: 'fas fa-peace', keywords: 'peace harmony' },
      { class: 'fas fa-puzzle-piece', keywords: 'puzzle mystery' },
      { class: 'fas fa-ribbon', keywords: 'ribbon decoration' },
      { class: 'fas fa-rocket', keywords: 'speed fast' },
      { class: 'fas fa-torch', keywords: 'fire light' },
      { class: 'fas fa-trophy', keywords: 'achievement victory' },
      { class: 'fas fa-umbrella', keywords: 'protection shield' },
      { class: 'fas fa-vial', keywords: 'potion medicine' },
      { class: 'fas fa-volcano', keywords: 'fire earth lava' },
      { class: 'fas fa-wind', keywords: 'wind air' },
      { class: 'fas fa-yin-yang', keywords: 'balance harmony' }
    ];
    };
  }
  
  window.updateDemeanorDisplay = function(trait, value) {
    const display = document.getElementById(`demeanor-${trait}-value`);
    if (display) {
      display.textContent = value;
    }
    
    // Update the visual slider
    const percentage = ((parseFloat(value) - 1) / 9) * 100;
    const fillDiv = document.getElementById(`demeanor-${trait}-fill`);
    const markerDiv = document.getElementById(`demeanor-${trait}-marker`);
    
    if (fillDiv) {
      fillDiv.style.width = `${percentage}%`;
    }
    if (markerDiv) {
      markerDiv.style.left = `${percentage}%`;
    }
  };
  
  window.updateColorPreview = function() {
    const colorsText = document.getElementById('appearanceColors').value;
    const preview = document.getElementById('colorPreview');
    if (!preview) return;
    
    // Helper function to normalize color
    const normalizeColor = (color) => {
      if (!color) return null;
      const trimmed = color.trim();
      if (!trimmed) return null;
      
      // If it's a hex code (with or without #)
      if (/^#?[0-9A-Fa-f]{3,8}$/.test(trimmed)) {
        return trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
      }
      
      // Return as-is for color names (browser will validate)
      return trimmed;
    };
    
    const colors = colorsText
      .split('\n')
      .map(c => normalizeColor(c))
      .filter(c => c !== null);
    
    if (colors.length === 0) {
      preview.innerHTML = '<small style="color: var(--color-text-dark-2);">Color preview will appear here...</small>';
      return;
    }
    
    preview.innerHTML = colors.map(color => {
      return `<div class="color-swatch" style="width: 40px; height: 40px; background-color: ${color}; border: 1px solid var(--color-border-2); border-radius: 4px; flex-shrink: 0;" title="${color}"></div>`;
    }).join('');
  };
  
  window.updateAppearancePreview = function(value) {
    const preview = document.getElementById('appearanceImagePreview');
    if (!value) {
      preview.innerHTML = '';
      return;
    }
    
    if (value.startsWith('fa-') || value.startsWith('fas ') || value.startsWith('far ') || value.startsWith('fab ')) {
      preview.innerHTML = `<div style="font-size: 3rem; color: var(--color-accent-2);"><i class="${value}"></i></div>`;
    } else if (value.startsWith('data:') || value.startsWith('http')) {
      const convertedUrl = convertImageUrl(value);
      preview.innerHTML = `<img src="${convertedUrl}" alt="Preview" style="max-width: 200px; max-height: 200px; border: 1px solid var(--color-border-2); border-radius: 4px;">`;
    } else {
      preview.innerHTML = '';
    }
  };
  
  // Update preview when input changes
  setTimeout(() => {
    const imageInput = document.getElementById('appearanceImage');
    if (imageInput) {
      imageInput.addEventListener('input', function() {
        updateAppearancePreview(this.value);
      });
    }
  }, 0);
  
  // Make switchStatsEraTab function available globally
  window.switchStatsEraTab = function(era) {
    // Update tabs
    const tabs = form.querySelectorAll('.stats-form-tab');
    tabs.forEach(tab => {
      if (tab.dataset.era === era) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    
    // Update panels
    const panels = form.querySelectorAll('.stats-form-panel');
    const eraId = era.replace(/\s+/g, '-');
    panels.forEach(panel => {
      if (panel.id === `stats-form-panel-${eraId}`) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
    
    // Copy values from previous era if current era inputs are empty
    const eras = ['Part I', 'Part II', 'Blank Period', 'Gaiden', 'Boruto'];
    const statNames = ['intelligence', 'stamina', 'strength', 'speed', 'ninjutsu', 'genjutsu', 'taijutsu', 'handSeals', 'fuinjutsu'];
    const currentIndex = eras.indexOf(era);
    
    // Check if current era has any values filled in
    let hasValues = false;
    statNames.forEach(statName => {
      const input = document.getElementById(`${statName}-${era}`);
      if (input && input.value && parseFloat(input.value) > 0) {
        hasValues = true;
      }
    });
    
    // If no values and there's a previous era, copy from it
    if (!hasValues && currentIndex > 0) {
      const previousEra = eras[currentIndex - 1];
      statNames.forEach(statName => {
        const prevInput = document.getElementById(`${statName}-${previousEra}`);
        const currentInput = document.getElementById(`${statName}-${era}`);
        if (prevInput && currentInput && prevInput.value) {
          const prevValue = parseFloat(prevInput.value);
          if (prevValue > 0) {
            currentInput.value = prevValue;
            // Trigger input event to update any listeners
            currentInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
      });
    }
  };
  
  return form;
}

function renderStatInput(name, value) {
  // Clamp value to valid range (1-5) and round to nearest 0.5
  const rawValue = value || 3;
  const clampedValue = Math.max(1, Math.min(5, rawValue));
  const roundedValue = Math.round(clampedValue * 2) / 2; // Round to nearest 0.5
  
  // Format display value (show as integer if whole number, otherwise show decimal)
  const formatValue = (val) => {
    const num = parseFloat(val);
    return num % 1 === 0 ? num.toString() : num.toFixed(1);
  };
  
  const displayName = name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1').trim();
  return `
    <div class="stat-input-wrapper">
      <div class="stat-header">
        <label class="stat-label">${displayName}</label>
        <div class="stat-value-display">
          <span class="stat-number" id="${name}-value">${formatValue(roundedValue)}</span>
          <span class="stat-max">/5</span>
        </div>
      </div>
      <div class="stat-control-wrapper">
        <input type="range" class="stat-slider" id="${name}" min="1" max="5" step="0.5" value="${roundedValue}" 
               oninput="const val = parseFloat(this.value); document.getElementById('${name}-value').textContent = val % 1 === 0 ? val.toString() : val.toFixed(1); updateStatVisual('${name}', val)">
        <div class="stat-dots" id="${name}-dots">
          ${Array.from({length: 9}, (_, i) => {
            const dotValue = 1 + (i * 0.5); // Dots represent values 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5
            const isHalf = dotValue % 1 !== 0;
            const isActive = dotValue <= roundedValue;
            return `<span class="stat-dot ${isActive ? 'active' : ''} ${isHalf ? 'half-dot' : ''}" data-value="${dotValue}"></span>`;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

// Ability editor helper functions
function renderAbilityEditor(type, ability = {}, index) {
  // Determine if this is a taijutsu-style technique (body/weapon techniques)
  const taijutsuTypes = ['taijutsu', 'kenjutsu', 'bojutsu', 'kayakujutsu', 'kusarigamajutsu', 
                         'kyujutsu', 'shurikenjutsu', 'tessenjutsu', 'bukijutsu', 'nintaijutsu'];
  const isTaijutsu = taijutsuTypes.includes(type.toLowerCase());
  
  // Get type name from options or use formatted version
  const typeName = getTechniqueTypeLabel(type) || 
                   type.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') ||
                   type.charAt(0).toUpperCase() + type.slice(1);
  return `
    <div class="ability-editor-item mb-3" data-type="${type}" data-index="${index}" style="border: 1px solid var(--color-border-2); padding: 1rem; border-radius: 4px;">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <strong>${typeName}</strong>
        <button type="button" class="btn-naruto btn-naruto-secondary" onclick="removeAbility('${type}', ${index})" style="padding: 0.25rem 0.5rem; font-size: 0.85rem;">Remove</button>
      </div>
      <div class="row">
        <div class="col-12 col-md-6">
          <div class="form-group">
            <label>Style</label>
            <input type="text" class="form-control" name="ability-style-${type}-${index}" value="${ability.style || ''}" placeholder="e.g., Strong Fist">
          </div>
        </div>
        ${!isTaijutsu ? `
        <div class="col-12 col-md-3">
          <div class="form-group">
            <label>Rank</label>
            <input type="text" class="form-control" name="ability-rank-${type}-${index}" value="${ability.rank || ''}" placeholder="e.g., C-Rank">
          </div>
        </div>
        ` : ''}
        ${isTaijutsu ? `
        <div class="col-12 col-md-3">
          <div class="form-group">
            <label>Base Style</label>
            <input type="text" class="form-control" name="ability-baseStyle-${type}-${index}" value="${ability.baseStyle || ''}" placeholder="e.g., Gentle Fist">
          </div>
        </div>
        <div class="col-12 col-md-3">
          <div class="form-group">
            <label>Mastery (1-5)</label>
            <input type="number" class="form-control" name="ability-mastery-${type}-${index}" value="${ability.mastery || 3}" min="1" max="5">
          </div>
        </div>
        ` : `
        <div class="col-12 col-md-3">
          <div class="form-group">
            <label>Difficulty (1-5)</label>
            <input type="number" class="form-control" name="ability-difficulty-${type}-${index}" value="${ability.difficulty || 3}" min="1" max="5">
          </div>
        </div>
        <div class="col-12 col-md-3">
          <div class="form-group">
            <label>Chakra Intensity (1-5)</label>
            <input type="number" class="form-control" name="ability-chakraIntensity-${type}-${index}" value="${ability.chakraIntensity || 3}" min="1" max="5">
          </div>
        </div>
        `}
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea class="form-control" name="ability-description-${type}-${index}" rows="2">${ability.description || ''}</textarea>
      </div>
    </div>
  `;
}

function renderGearEditor(gear = {}, index) {
  const gearIcon = gear.icon || '';
  const gearName = gear.name || '';
  const gearInfo = Array.isArray(gear.info) ? gear.info.join('\n') : (gear.information || []);
  
  return `
    <div class="gear-editor-item mb-3" data-index="${index}" style="border: 1px solid var(--color-border-2); padding: 1rem; border-radius: 4px;">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <strong>Gear Item</strong>
        <button type="button" class="btn-naruto btn-naruto-secondary" onclick="removeGearItem(${index})" style="padding: 0.25rem 0.5rem; font-size: 0.85rem;">Remove</button>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="form-group">
            <label>Name</label>
            <input type="text" class="form-control" name="gear-name-${index}" value="${gearName}" placeholder="e.g., Bone Chain Sickle (Kusarigama)">
          </div>
        </div>
        <div class="col-12">
          <div class="form-group">
            <label>Icon / Image</label>
            <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; flex-wrap: wrap;">
              <button type="button" class="btn-naruto btn-naruto-secondary" onclick="showGearImageUpload(${index})" style="flex: 1; min-width: 120px;">
                <i class="fas fa-upload"></i> Upload Image
              </button>
              <button type="button" class="btn-naruto btn-naruto-secondary" onclick="showGearIconPicker(${index})" style="flex: 1; min-width: 120px;">
                <i class="fas fa-icons"></i> Pick Icon
              </button>
            </div>
            <input type="file" id="gearImageUpload-${index}" accept="image/*" style="display: none;" onchange="handleGearImageUpload(event, ${index})">
            <div id="gear-icon-picker-${index}" style="display: none; margin-bottom: 0.5rem;">
              <div style="margin-bottom: 0.5rem;">
                <input type="text" class="form-control" id="gearIconSearch-${index}" placeholder="Search Font Awesome icons..." onkeyup="filterGearIcons(this.value, ${index})" style="font-size: 0.85rem;" autocomplete="off">
              </div>
              <div id="gear-icon-picker-grid-${index}" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(50px, 1fr)); gap: 0.5rem; max-height: 300px; overflow-y: auto; padding: 0.5rem; background-color: var(--color-bg-1); border: 1px solid var(--color-border-2); border-radius: 4px;">
                <div style="grid-column: 1 / -1; text-align: center; padding: 1rem; color: var(--color-text-dark-2);">Loading icons...</div>
              </div>
            </div>
            <input type="text" class="form-control" name="gear-icon-${index}" id="gear-icon-input-${index}" value="${gearIcon}" placeholder="Image URL or Font Awesome icon class (e.g., fas fa-sword)">
            <div id="gear-icon-preview-${index}" style="margin-top: 0.5rem; text-align: center; min-height: 50px;">
              ${gearIcon ? (
                gearIcon.startsWith('fa-') || gearIcon.startsWith('fas ') || gearIcon.startsWith('far ') || gearIcon.startsWith('fab ') ?
                  `<div style="font-size: 2rem; color: var(--color-accent-2);"><i class="${gearIcon}"></i></div>` :
                  `<img src="${gearIcon}" alt="Preview" style="max-width: 100px; max-height: 100px; border: 1px solid var(--color-border-2); border-radius: 4px;">`
              ) : ''}
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="form-group">
            <label>Additional Information (one per line)</label>
            <textarea class="form-control" name="gear-info-${index}" rows="3" placeholder="Additional details about this gear item...">${gearInfo}</textarea>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderRelationshipEditor(rel = {}, index) {
  return `
    <div class="relationship-editor-item mb-3" data-index="${index}" style="border: 1px solid var(--color-border-2); padding: 1rem; border-radius: 4px;">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <strong>Relationship</strong>
        <button type="button" class="btn-naruto btn-naruto-secondary" onclick="removeRelationship(${index})" style="padding: 0.25rem 0.5rem; font-size: 0.85rem;">Remove</button>
      </div>
      <div class="row">
        <div class="col-12 col-md-6">
          <div class="form-group">
            <label>Name</label>
            <input type="text" class="form-control" name="relationship-name-${index}" value="${rel.name || rel.character || rel.fullName || ''}" placeholder="e.g., Naruto Uzumaki">
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="form-group">
            <label>Relationship Type</label>
            <input type="text" class="form-control" name="relationship-type-${index}" value="${rel.relationshipType || rel.type || ''}" placeholder="e.g., Friend, Rival, Family">
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="form-group">
            <label>Image URL</label>
            <input type="text" class="form-control" name="relationship-image-${index}" value="${rel.image || rel.icon || ''}" placeholder="https://...">
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="form-group">
            <label>Heart Chart (Emoji)</label>
            <input type="text" class="form-control" name="relationship-heartChart-${index}" value="${rel.heartChart || ''}" placeholder="e.g., 💚">
          </div>
        </div>
        <div class="col-12">
          <div class="form-group">
            <label>Description</label>
            <textarea class="form-control" name="relationship-description-${index}" rows="2">${rel.description || ''}</textarea>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderGalleryItem(item = {}, index) {
  const url = typeof item === 'string' ? item : (item.url || item.image || '');
  const caption = typeof item === 'object' ? (item.caption || item.title || '') : '';
  return `
    <div class="gallery-editor-item mb-3" data-index="${index}" style="border: 1px solid var(--color-border-2); padding: 1rem; border-radius: 4px;">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <strong>Gallery Image ${index + 1}</strong>
        <button type="button" class="btn-naruto btn-naruto-secondary" onclick="removeGalleryItem(${index})" style="padding: 0.25rem 0.5rem; font-size: 0.85rem;">Remove</button>
      </div>
      <div class="row">
        <div class="col-12 col-md-8">
          <div class="form-group">
            <label>Image URL</label>
            <input type="text" class="form-control" name="gallery-url-${index}" value="${url}" placeholder="https://...">
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="form-group">
            <label>Caption/Title</label>
            <input type="text" class="form-control" name="gallery-caption-${index}" value="${caption}" placeholder="Optional caption">
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderStoryArcEditor(arc = {}, index) {
  return `
    <div class="story-arc-editor-item mb-3" data-index="${index}" style="border: 1px solid var(--color-border-2); padding: 1rem; border-radius: 4px;">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <strong>Story Arc ${index + 1}</strong>
        <button type="button" class="btn-naruto btn-naruto-secondary" onclick="removeStoryArc(${index})" style="padding: 0.25rem 0.5rem; font-size: 0.85rem;">Remove</button>
      </div>
      <div class="form-group">
        <label>Arc Name</label>
        <input type="text" class="form-control" name="story-arc-name-${index}" value="${arc.name || ''}" placeholder="e.g., Land of Waves Arc">
      </div>
      <div class="form-group">
        <label>Summary</label>
        <textarea class="form-control" name="story-arc-summary-${index}" rows="3" placeholder="Short paragraph explaining what happens to the character...">${arc.summary || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Key Events (one per line)</label>
        <textarea class="form-control" name="story-arc-keyEvents-${index}" rows="4" placeholder="Event 1&#10;Event 2&#10;Event 3">${(arc.keyEvents || []).join('\n')}</textarea>
      </div>
    </div>
  `;
}

// Make helper functions globally available
if (typeof window !== 'undefined') {
  window.addAbility = function(type) {
    const container = document.getElementById('abilities-container');
    const items = container.querySelectorAll(`[data-type="${type}"]`);
    const index = items.length;
    
    // Determine if this is a taijutsu-style technique
    const taijutsuTypes = ['taijutsu', 'kenjutsu', 'bojutsu', 'kayakujutsu', 'kusarigamajutsu', 
                           'kyujutsu', 'shurikenjutsu', 'tessenjutsu', 'bukijutsu', 'nintaijutsu'];
    const isTaijutsu = taijutsuTypes.includes(type.toLowerCase());
    
    const newAbility = isTaijutsu
      ? { style: '', baseStyle: '', mastery: 3, description: '' }
      : { style: '', rank: '', difficulty: 3, chakraIntensity: 3, description: '' };
    container.innerHTML += renderAbilityEditor(type, newAbility, index);
    if (container.querySelector('.text-muted')) {
      container.querySelector('.text-muted').remove();
    }
  };
  
  window.removeAbility = function(type, index) {
    const container = document.getElementById('abilities-container');
    const item = container.querySelector(`[data-type="${type}"][data-index="${index}"]`);
    if (item) item.remove();
    updateAbilityIndices();
  };
  
  window.addGearItem = function() {
    const container = document.getElementById('gear-container');
    const items = container.querySelectorAll('.gear-editor-item');
    const index = items.length;
    
    const newGear = { name: '', icon: '', info: [] };
    container.innerHTML += renderGearEditor(newGear, index);
    if (container.querySelector('.text-muted')) {
      container.querySelector('.text-muted').remove();
    }
  };
  
  window.removeGearItem = function(index) {
    const container = document.getElementById('gear-container');
    const item = container.querySelector(`[data-index="${index}"]`);
    if (item) item.remove();
    updateGearIndices();
  };
  
  function updateGearIndices() {
    const container = document.getElementById('gear-container');
    const items = container.querySelectorAll('.gear-editor-item');
    items.forEach((item, newIndex) => {
      item.dataset.index = newIndex;
      // Update all input names
      item.querySelectorAll('input, textarea, button').forEach(input => {
        if (input.name) {
          input.name = input.name.replace(/-\d+$/, `-${newIndex}`);
        }
        if (input.id && input.id.includes('-')) {
          const parts = input.id.split('-');
          parts[parts.length - 1] = newIndex;
          input.id = parts.join('-');
        }
      });
    });
  }
  
  // Gear-specific image/icon picker functions
  window.showGearImageUpload = function(index) {
    document.getElementById(`gearImageUpload-${index}`).click();
  };
  
  window.handleGearImageUpload = function(event, index) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const iconInput = document.getElementById(`gear-icon-input-${index}`);
        iconInput.value = e.target.result;
        updateGearIconPreview(e.target.result, index);
      };
      reader.readAsDataURL(file);
    }
  };
  
  window.showGearIconPicker = function(index) {
    const container = document.getElementById(`gear-icon-picker-${index}`);
    const grid = document.getElementById(`gear-icon-picker-grid-${index}`);
    const isVisible = container.style.display !== 'none';
    
    if (!isVisible) {
      // Load icons when showing picker
      if (!grid.dataset.loaded) {
        const allIcons = window.getAllFontAwesomeIcons();
        grid.innerHTML = allIcons.map(icon => `
          <button type="button" class="gear-icon-picker-btn" onclick="selectGearIcon('${icon.class}', ${index})" 
                  data-keywords="${icon.keywords || ''}"
                  style="padding: 0.5rem; border: 1px solid var(--color-border-2); background: var(--color-bg-transparent); cursor: pointer; border-radius: 4px; transition: all 0.2s;" 
                  onmouseover="this.style.background='var(--color-accent-2)'; this.style.color='white';" 
                  onmouseout="this.style.background='var(--color-bg-transparent)'; this.style.color='';"
                  title="${icon.class.replace('fas ', '')}">
            <i class="${icon.class}" style="font-size: 1.5rem;"></i>
          </button>
        `).join('');
        grid.dataset.loaded = 'true';
      }
      container.style.display = 'block';
    } else {
      container.style.display = 'none';
    }
  };
  
  window.selectGearIcon = function(iconClass, index) {
    const iconInput = document.getElementById(`gear-icon-input-${index}`);
    iconInput.value = iconClass;
    updateGearIconPreview(iconClass, index);
    document.getElementById(`gear-icon-picker-${index}`).style.display = 'none';
  };
  
  window.filterGearIcons = function(searchTerm, index) {
    const buttons = document.querySelectorAll(`#gear-icon-picker-grid-${index} .gear-icon-picker-btn`);
    const term = searchTerm.toLowerCase().trim();
    
    if (term === '') {
      buttons.forEach(btn => btn.style.display = 'block');
      return;
    }
    
    buttons.forEach(btn => {
      const icon = btn.querySelector('i');
      const iconClass = icon ? icon.className : '';
      const keywords = btn.dataset.keywords || '';
      const iconName = iconClass.replace(/^(fas|far|fab|fal|fad)\s+fa-/, '').replace(/\s+/g, '-');
      const searchableText = `${iconClass} ${iconName} ${keywords}`.toLowerCase();
      
      if (searchableText.includes(term)) {
        btn.style.display = 'block';
      } else {
        btn.style.display = 'none';
      }
    });
  };
  
  window.updateGearIconPreview = function(value, index) {
    const preview = document.getElementById(`gear-icon-preview-${index}`);
    if (!value) {
      preview.innerHTML = '';
      return;
    }
    
    if (value.startsWith('fa-') || value.startsWith('fas ') || value.startsWith('far ') || value.startsWith('fab ')) {
      preview.innerHTML = `<div style="font-size: 2rem; color: var(--color-accent-2);"><i class="${value}"></i></div>`;
    } else if (value.startsWith('data:') || value.startsWith('http')) {
      const convertedUrl = convertImageUrl(value);
      preview.innerHTML = `<img src="${convertedUrl}" alt="Preview" style="max-width: 100px; max-height: 100px; border: 1px solid var(--color-border-2); border-radius: 4px;">`;
    } else {
      preview.innerHTML = '';
    }
  };
  
  // Update gear icon previews when inputs change
  setTimeout(() => {
    const gearContainer = document.getElementById('gear-container');
    if (gearContainer) {
      gearContainer.addEventListener('input', function(e) {
        if (e.target.name && e.target.name.startsWith('gear-icon-')) {
          const index = e.target.name.split('-').pop();
          updateGearIconPreview(e.target.value, index);
        }
      });
    }
  }, 0);
  
  window.addRelationship = function() {
    const container = document.getElementById('relationships-container');
    const items = container.querySelectorAll('.relationship-editor-item');
    const index = items.length;
    container.innerHTML += renderRelationshipEditor({}, index);
    if (container.querySelector('.text-muted')) {
      container.querySelector('.text-muted').remove();
    }
  };
  
  window.removeRelationship = function(index) {
    const container = document.getElementById('relationships-container');
    const item = container.querySelector(`[data-index="${index}"]`);
    if (item) item.remove();
    updateRelationshipIndices();
  };
  
  window.addGalleryItem = function() {
    const container = document.getElementById('gallery-container');
    const items = container.querySelectorAll('.gallery-editor-item');
    const index = items.length;
    container.innerHTML += renderGalleryItem({}, index);
    if (container.querySelector('.text-muted')) {
      container.querySelector('.text-muted').remove();
    }
  };
  
  window.removeGalleryItem = function(index) {
    const container = document.getElementById('gallery-container');
    const item = container.querySelector(`[data-index="${index}"]`);
    if (item) item.remove();
    updateGalleryIndices();
  };
  
  window.addStoryArc = function() {
    const container = document.getElementById('story-arcs-container');
    if (!container) return;
    
    // Remove the "No story arcs" message if it exists
    const emptyMessage = container.querySelector('.text-muted');
    if (emptyMessage) {
      emptyMessage.remove();
    }
    
    // Get all existing items to calculate the correct index
    const items = container.querySelectorAll('.story-arc-editor-item');
    const index = items.length;
    
    // Create a temporary div to hold the new HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = renderStoryArcEditor({}, index);
    
    // Append the first child (the story arc editor item) to the container
    // This preserves existing DOM elements and their values
    const newItem = tempDiv.firstElementChild;
    if (newItem) {
      container.appendChild(newItem);
    }
  };
  
  window.removeStoryArc = function(index) {
    const container = document.getElementById('story-arcs-container');
    const item = container.querySelector(`[data-index="${index}"]`);
    if (item) item.remove();
    updateStoryArcIndices();
  };
  
  window.switchAppearanceEraTab = function(era) {
    const tabs = document.querySelectorAll('.appearance-era-tab');
    tabs.forEach(tab => {
      if (tab.dataset.era === era) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    
    const panels = document.querySelectorAll('.appearance-era-panel');
    const eraId = era.replace(/\s+/g, '-');
    panels.forEach(panel => {
      if (panel.id === `appearance-era-panel-${eraId}`) {
        panel.style.display = '';
      } else {
        panel.style.display = 'none';
      }
    });
  };
  
  window.switchImageEraTab = function(era) {
    const tabs = document.querySelectorAll('.image-era-tab');
    tabs.forEach(tab => {
      if (tab.dataset.era === era) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    
    const panels = document.querySelectorAll('.image-era-panel');
    const eraId = era.replace(/\s+/g, '-');
    panels.forEach(panel => {
      if (panel.id === `image-era-panel-${eraId}`) {
        panel.style.display = '';
      } else {
        panel.style.display = 'none';
      }
    });
  };
  
  // Add event listeners for image preview updates
  setTimeout(() => {
    const eras = ['Part I', 'Part II', 'Blank Period', 'Gaiden', 'Boruto'];
    eras.forEach(era => {
      const input = document.getElementById(`imageEra-${era}`);
      if (input) {
        input.addEventListener('input', function() {
          const panel = document.getElementById(`image-era-panel-${era.replace(/\s+/g, '-')}`);
          if (panel) {
            const preview = panel.querySelector('img');
            const value = this.value.trim();
            if (value && preview) {
              preview.src = convertImageUrl(value);
              preview.style.display = '';
            } else if (preview) {
              preview.style.display = 'none';
            } else if (value) {
              // Create preview if it doesn't exist
              const previewContainer = panel.querySelector('.form-group');
              if (previewContainer) {
                const existingPreview = previewContainer.querySelector('div[style*="margin-top"]');
                if (!existingPreview) {
                  const previewDiv = document.createElement('div');
                  previewDiv.style.marginTop = '0.5rem';
                  const convertedUrl = convertImageUrl(value);
                  previewDiv.innerHTML = `<img src="${convertedUrl}" alt="${era} image" 
                       style="max-width: 200px; max-height: 200px; border: 1px solid var(--color-border-2); border-radius: 4px; object-fit: contain;"
                       onerror="this.style.display='none'">`;
                  previewContainer.appendChild(previewDiv);
                }
              }
            }
          }
        });
      }
    });
  }, 100);
  
  function updateAbilityIndices() {
    const container = document.getElementById('abilities-container');
    container.querySelectorAll('.ability-editor-item').forEach((item, index) => {
      item.setAttribute('data-index', index);
      item.querySelectorAll('input, textarea').forEach(input => {
        input.name = input.name.replace(/-\d+$/, `-${index}`);
      });
      item.querySelector('button').setAttribute('onclick', `removeAbility('${item.dataset.type}', ${index})`);
    });
  }
  
  function updateRelationshipIndices() {
    const container = document.getElementById('relationships-container');
    container.querySelectorAll('.relationship-editor-item').forEach((item, index) => {
      item.setAttribute('data-index', index);
      item.querySelectorAll('input, textarea').forEach(input => {
        input.name = input.name.replace(/-\d+$/, `-${index}`);
      });
      item.querySelector('button').setAttribute('onclick', `removeRelationship(${index})`);
    });
  }
  
  function updateGalleryIndices() {
    const container = document.getElementById('gallery-container');
    container.querySelectorAll('.gallery-editor-item').forEach((item, index) => {
      item.setAttribute('data-index', index);
      item.querySelectorAll('input').forEach(input => {
        input.name = input.name.replace(/-\d+$/, `-${index}`);
      });
      item.querySelector('strong').textContent = `Gallery Image ${index + 1}`;
      item.querySelector('button').setAttribute('onclick', `removeGalleryItem(${index})`);
    });
  }
  
  function updateStoryArcIndices() {
    const container = document.getElementById('story-arcs-container');
    container.querySelectorAll('.story-arc-editor-item').forEach((item, index) => {
      item.setAttribute('data-index', index);
      item.querySelectorAll('input, textarea').forEach(input => {
        input.name = input.name.replace(/-\d+$/, `-${index}`);
      });
      item.querySelector('strong').textContent = `Story Arc ${index + 1}`;
      item.querySelector('button').setAttribute('onclick', `removeStoryArc(${index})`);
    });
  }
  
  window.updateStatVisual = function(name, value) {
    const dots = document.getElementById(`${name}-dots`);
    const slider = document.getElementById(name);
    const numValue = parseFloat(value);
    
    // Update dots (dots represent values 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5)
    if (dots) {
      const dotElements = dots.querySelectorAll('.stat-dot');
      dotElements.forEach((dot) => {
        const dotValue = parseFloat(dot.getAttribute('data-value'));
        if (dotValue <= numValue) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
    
    // Update slider background
    if (slider) {
      const percentage = (numValue / 5) * 100;
      slider.style.background = `linear-gradient(to right, 
        var(--color-accent-2) 0%, 
        var(--color-accent-2) ${percentage}%,
        var(--color-border-2) ${percentage}%,
        var(--color-border-2) 100%)`;
    }
  };
}

