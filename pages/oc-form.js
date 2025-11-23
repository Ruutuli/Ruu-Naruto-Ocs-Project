// OC Form Component - Create/Edit OC form

import { defaultOC, generateId } from '../data/default-data.js';
import storage from '../data/storage.js';
import { natureReleases, getAllNatureReleaseNames, getAllClanNames, getClanSymbol } from '../data/options.js';
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
            ${['Part I', 'Part II', 'Blank Period', 'Gaiden', 'Boruto'].map((era, index) => {
              const eraStats = formOC.statsByEra?.[era] || formOC.stats || {};
              const isActive = index === 0 ? 'active' : '';
              return `
                <div class="stats-form-panel ${isActive}" id="stats-form-panel-${era.replace(/\s+/g, '-')}">
                  <div class="stats-container">
                    <div class="stats-grid">
                      ${renderStatInput(`intelligence-${era}`, eraStats.intelligence || formOC.stats?.intelligence || 3)}
                      ${renderStatInput(`stamina-${era}`, eraStats.stamina || formOC.stats?.stamina || 3)}
                      ${renderStatInput(`strength-${era}`, eraStats.strength || formOC.stats?.strength || 3)}
                      ${renderStatInput(`speed-${era}`, eraStats.speed || formOC.stats?.speed || 3)}
                      ${renderStatInput(`ninjutsu-${era}`, eraStats.ninjutsu || formOC.stats?.ninjutsu || 3)}
                      ${renderStatInput(`genjutsu-${era}`, eraStats.genjutsu || formOC.stats?.genjutsu || 3)}
                      ${renderStatInput(`taijutsu-${era}`, eraStats.taijutsu || formOC.stats?.taijutsu || 3)}
                      ${renderStatInput(`handSeals-${era}`, eraStats.handSeals || formOC.stats?.handSeals || 3)}
                      ${renderStatInput(`fuinjutsu-${era}`, eraStats.fuinjutsu || formOC.stats?.fuinjutsu || 0)}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
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
          <label class="form-label">Likes (one per line)</label>
          <textarea class="form-control" id="likes" rows="4">${(formOC.personality?.likes || []).join('\n')}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Dislikes (one per line)</label>
          <textarea class="form-control" id="dislikes" rows="4">${(formOC.personality?.dislikes || []).join('\n')}</textarea>
        </div>
        
        <!-- Record History -->
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
        
        <!-- Appearance & Gear -->
        <h3 class="mb-3 mt-4">Appearance & Gear <i class="japanese-header">外見と装備</i></h3>
        <div class="form-group">
          <label class="form-label">Appearance Image URL</label>
          <input type="url" class="form-control" id="appearanceImage" value="${formOC.appearance?.image || ''}" placeholder="https://...">
        </div>
        <div class="form-group">
          <label class="form-label">Color Palette <small style="font-weight: normal; color: var(--color-text-dark-2);">(one color per line, hex codes or color names)</small></label>
          <textarea class="form-control" id="appearanceColors" rows="3" placeholder="#FF5733&#10;#33FF57&#10;blue">${(formOC.appearance?.colors || []).join('\n')}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Gear Items <small style="font-weight: normal; color: var(--color-text-dark-2);">(one item per line)</small></label>
          <textarea class="form-control" id="appearanceGear" rows="6" placeholder="Kunai&#10;Shuriken&#10;Ninja Wire&#10;Explosive Tags">${(() => {
            // Format gear for display - handle both array of objects and array of strings
            if (!formOC.appearance?.gear || formOC.appearance.gear.length === 0) {
              return '';
            }
            return formOC.appearance.gear.map(gear => {
              if (typeof gear === 'string') {
                return gear;
              }
              // If it's an object, extract the name or format it nicely
              if (gear && typeof gear === 'object') {
                const parts = [];
                if (gear.name) parts.push(gear.name);
                if (gear.category) parts.push(`(${gear.category})`);
                if (gear.material) parts.push(`- ${gear.material}`);
                if (gear.use) parts.push(`- ${gear.use}`);
                if (gear.info && Array.isArray(gear.info) && gear.info.length > 0) {
                  parts.push(`- ${gear.info.join(', ')}`);
                }
                return parts.join(' ');
              }
              return String(gear);
            }).join('\n');
          })()}</textarea>
          <small style="color: var(--color-text-dark-2); font-size: 0.85rem; display: block; margin-top: 0.25rem;">
            Enter one gear item per line. Examples: "Kunai", "Shuriken", "Ninja Wire", "Explosive Tags"
          </small>
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
        
        <!-- Story Arcs / Timeline -->
        <h3 class="mb-3 mt-4">Story Arcs / Timeline</h3>
        <div id="story-arcs-editor" class="mb-4">
          <label class="form-label mb-2">Story Arcs</label>
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
              eraStats[stat] = parseInt(element.value) || 0;
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
              const value = parseInt(element.value) || 0;
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
        likes: document.getElementById('likes').value.split('\n').filter(l => l.trim()),
        dislikes: document.getElementById('dislikes').value.split('\n').filter(d => d.trim()),
        demeanor: formOC.personality?.demeanor || {
          charisma: 3, extraversion: 3, energy: 3, empathy: 3,
          impulsivity: 3, neuroticism: 3, intuition: 3, observation: 3,
          sensitivity: 3, generosity: 3, respectForAuthority: 3
        }
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
          return colorsText.split('\n').map(c => c.trim()).filter(c => c);
        })(),
        gear: (() => {
          const gearText = document.getElementById('appearanceGear').value.trim();
          if (!gearText) return [];
          
          // Simple line-by-line parsing - one item per line
          const lines = gearText.split('\n');
          const gear = [];
          
          lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed) {
              // Just store as simple string - no JSON parsing needed
              gear.push(trimmed);
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
  };
  
  return form;
}

function renderStatInput(name, value) {
  const displayName = name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1').trim();
  return `
    <div class="stat-input-wrapper">
      <div class="stat-header">
        <label class="stat-label">${displayName}</label>
        <div class="stat-value-display">
          <span class="stat-number" id="${name}-value">${value}</span>
          <span class="stat-max">/5</span>
        </div>
      </div>
      <div class="stat-control-wrapper">
        <input type="range" class="stat-slider" id="${name}" min="1" max="5" value="${value}" 
               oninput="document.getElementById('${name}-value').textContent = this.value; updateStatVisual('${name}', this.value)">
        <div class="stat-dots" id="${name}-dots">
          ${Array.from({length: 5}, (_, i) => 
            `<span class="stat-dot ${i < value ? 'active' : ''}" data-value="${i + 1}"></span>`
          ).join('')}
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
    const items = container.querySelectorAll('.story-arc-editor-item');
    const index = items.length;
    container.innerHTML += renderStoryArcEditor({}, index);
    if (container.querySelector('.text-muted')) {
      container.querySelector('.text-muted').remove();
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
    
    // Update dots
    if (dots) {
      const dotElements = dots.querySelectorAll('.stat-dot');
      dotElements.forEach((dot, index) => {
        if (index < value) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
    
    // Update slider background
    if (slider) {
      const percentage = (value / 5) * 100;
      slider.style.background = `linear-gradient(to right, 
        var(--color-accent-2) 0%, 
        var(--color-accent-2) ${percentage}%,
        var(--color-border-2) ${percentage}%,
        var(--color-border-2) 100%)`;
    }
  };
}

