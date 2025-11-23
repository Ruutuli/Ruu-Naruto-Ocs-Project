// OC Form Component - Create/Edit OC form

import { defaultOC, generateId } from '../data/default-data.js';
import storage from '../data/storage.js';
import { natureReleases, getAllNatureReleaseNames } from '../data/nature-releases.js';
import { getAllClanNames, getClanSymbol } from '../data/clan-symbols.js';
import { 
  villages, 
  ranks, 
  zodiacSigns, 
  moralAlignments, 
  mbtiTypes, 
  enneagramTypes, 
  months, 
  days,
  generateOptions,
  generateGroupedOptions,
  generateDatalistOptions
} from '../data/options.js';

export function renderOCForm(oc = null, onSave) {
  const isEdit = !!oc;
  const formOC = oc || { ...defaultOC, id: generateId() };
  const clans = storage.getAllClans();
  
  // Get predefined clan names from clan-symbols.js
  const predefinedClanNames = getAllClanNames();
  
  // Get current clan name for display (either from clanId lookup or stored name)
  let currentClanName = '';
  if (formOC.clanId) {
    const clan = clans.find(c => c.id === formOC.clanId);
    if (clan) {
      currentClanName = clan.name;
    } else if (typeof formOC.clanId === 'string' && predefinedClanNames.includes(formOC.clanId)) {
      // If clanId is actually a predefined clan name
      currentClanName = formOC.clanId;
    }
  } else if (formOC.clanName) {
    currentClanName = formOC.clanName;
  }
  
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
        <!-- Basic Info -->
        <h3 class="mb-3">Basic Information</h3>
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label class="form-label">Last Name 名字 <small style="font-weight: normal; color: var(--color-text-dark-2);">(e.g., Chigiri)</small></label>
              <input type="text" class="form-control" id="lastName" value="${formOC.lastName || ''}" required>
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
              <input type="text" class="form-control" id="bloodType" value="${formOC.bloodType || ''}">
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="form-group">
              <label class="form-label">Zodiac Sign</label>
              <input type="text" class="form-control" id="zodiac" list="zodiac-signs" value="${formOC.zodiac || ''}" placeholder="Type or select a zodiac sign" autocomplete="off">
              <datalist id="zodiac-signs">
                ${generateDatalistOptions(zodiacSigns)}
              </datalist>
            </div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-12 col-md-4">
            <div class="form-group">
              <label class="form-label">Gender</label>
              <input type="text" class="form-control" id="gender" value="${formOC.gender || ''}">
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="form-group">
              <label class="form-label">Sexual Orientation</label>
              <input type="text" class="form-control" id="sexualOrientation" value="${formOC.sexualOrientation || ''}">
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="form-group">
              <label class="form-label">Romantic Orientation</label>
              <input type="text" class="form-control" id="romanticOrientation" value="${formOC.romanticOrientation || ''}">
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
              <select class="form-control" id="village" required>
                <option value="">Select Village</option>
                ${generateOptions(villages, formOC.village || '')}
              </select>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="form-group">
              <label class="form-label">Rank</label>
              <select class="form-control" id="rank" required>
                ${generateOptions(ranks, formOC.rank || '')}
              </select>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="form-group">
              <label class="form-label">Clan</label>
              <input type="text" class="form-control" id="clanName" list="clan-list" 
                     value="${currentClanName}" 
                     placeholder="Type or select a clan" autocomplete="off">
              <datalist id="clan-list">
                ${uniqueClans.map(clan => `<option value="${clan.name}">${clan.name}${clan.type === 'predefined' ? ' (Predefined)' : ''}</option>`).join('')}
              </datalist>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Classification (comma-separated)</label>
          <input type="text" class="form-control" id="classification" value="${(formOC.classification || []).join(', ')}" placeholder="e.g., Genin, Fate Reader, Missing-nin">
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
        
        <div id="abilities-editor" class="mt-3 mb-3">
          <label class="form-label mb-2">Abilities & Techniques</label>
          <div class="card-naruto" style="padding: 1rem; margin-bottom: 1rem;">
            <div id="abilities-container">
              ${(() => {
                const abilities = formOC.abilities || { taijutsu: [], ninjutsu: [] };
                let html = '';
                abilities.taijutsu?.forEach((ability, index) => {
                  html += renderAbilityEditor('taijutsu', ability, index);
                });
                abilities.ninjutsu?.forEach((ability, index) => {
                  html += renderAbilityEditor('ninjutsu', ability, index);
                });
                return html || '<p class="text-muted">No abilities added yet. Click "Add Taijutsu" or "Add Ninjutsu" to add abilities.</p>';
              })()}
            </div>
            <div class="mt-2">
              <button type="button" class="btn-naruto btn-naruto-secondary" onclick="addAbility('taijutsu')" style="margin-right: 0.5rem;">+ Add Taijutsu</button>
              <button type="button" class="btn-naruto btn-naruto-secondary" onclick="addAbility('ninjutsu')">+ Add Ninjutsu</button>
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
          <label class="form-label">Gear Items <small style="font-weight: normal; color: var(--color-text-dark-2);">(JSON format - one item per line, or simple text one per line)</small></label>
          <textarea class="form-control" id="appearanceGear" rows="6" placeholder='{"name": "Kunai", "category": "Weapon", "material": "Steel", "use": "Throwing weapon", "info": ["Standard issue", "Can be used for melee"]}&#10;{"name": "Shuriken", "category": "Weapon", "material": "Steel", "use": "Throwing weapon", "info": []}' style="font-family: monospace; font-size: 0.9rem;">${(() => {
            // Format gear for display - handle both array of objects and array of strings
            if (!formOC.appearance?.gear || formOC.appearance.gear.length === 0) {
              return '';
            }
            return formOC.appearance.gear.map(gear => {
              if (typeof gear === 'string') {
                return gear;
              }
              return JSON.stringify(gear, null, 2);
            }).join('\n\n');
          })()}</textarea>
          <small style="color: var(--color-text-dark-2); font-size: 0.85rem; display: block; margin-top: 0.25rem;">
            Tip: You can enter simple text (one item per line) or JSON objects for detailed gear information.
          </small>
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
      village: document.getElementById('village').value,
      rank: document.getElementById('rank').value,
      clanId: (() => {
        const clanNameInput = document.getElementById('clanName');
        const enteredName = clanNameInput ? clanNameInput.value.trim() : '';
        if (!enteredName) return null;
        
        // Check if it matches a user-created clan
        const userClan = clans.find(c => c.name === enteredName);
        if (userClan) {
          return userClan.id;
        }
        
        // Check if it matches a predefined clan
        if (predefinedClanNames.includes(enteredName)) {
          // Store predefined clan name in clanName field, keep clanId as null
          return null;
        }
        
        // If it doesn't match anything, still store it (user might be creating a new clan)
        return null;
      })(),
      clanName: (() => {
        const clanNameInput = document.getElementById('clanName');
        const enteredName = clanNameInput ? clanNameInput.value.trim() : '';
        if (!enteredName) return null;
        
        // Check if it matches a predefined clan
        if (predefinedClanNames.includes(enteredName)) {
          return enteredName;
        }
        
        // Check if it matches a user-created clan (we'll use clanId for that)
        const userClan = clans.find(c => c.name === enteredName);
        if (userClan) {
          return null; // Use clanId instead
        }
        
        // If it doesn't match anything, store it as a custom clan name
        return enteredName;
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
        if (!container) return { taijutsu: [], ninjutsu: [] };
        const abilities = { taijutsu: [], ninjutsu: [] };
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
          
          if (type === 'taijutsu') {
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
          
          // Try to parse as JSON array first
          try {
            const parsed = JSON.parse(gearText);
            if (Array.isArray(parsed)) {
              return parsed;
            }
          } catch (e) {
            // Not a JSON array, continue with line-by-line parsing
          }
          
          // Parse line by line - each line can be JSON or simple text
          const lines = gearText.split('\n');
          const gear = [];
          let currentJson = '';
          let braceCount = 0;
          
          lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed) return;
            
            // Check if this line starts a JSON object
            if (trimmed.startsWith('{')) {
              currentJson = trimmed;
              braceCount = (trimmed.match(/{/g) || []).length - (trimmed.match(/}/g) || []).length;
              
              if (braceCount === 0) {
                // Complete JSON object on one line
                try {
                  gear.push(JSON.parse(currentJson));
                } catch (e) {
                  gear.push(trimmed); // Fallback to string
                }
                currentJson = '';
              }
            } else if (currentJson) {
              // Continue building JSON object
              currentJson += '\n' + trimmed;
              braceCount += (trimmed.match(/{/g) || []).length - (trimmed.match(/}/g) || []).length;
              
              if (braceCount === 0) {
                // Complete JSON object
                try {
                  gear.push(JSON.parse(currentJson));
                } catch (e) {
                  gear.push(currentJson); // Fallback to string
                }
                currentJson = '';
              }
            } else {
              // Simple text line
              gear.push(trimmed);
            }
          });
          
          // Handle any remaining JSON
          if (currentJson) {
            try {
              gear.push(JSON.parse(currentJson));
            } catch (e) {
              gear.push(currentJson);
            }
          }
          
          return gear;
        })()
      },
      profileImage: document.getElementById('profileImage').value,
      zodiac: document.getElementById('zodiac').value,
      sexualOrientation: document.getElementById('sexualOrientation').value,
      romanticOrientation: document.getElementById('romanticOrientation').value,
      ninjaRegistrationNumber: document.getElementById('ninjaRegistrationNumber').value,
      academyGraduationAge: document.getElementById('academyGraduationAge').value,
      classification: document.getElementById('classification').value.split(',').map(c => c.trim()).filter(c => c),
      kekkeiGenkai: document.getElementById('kekkeiGenkai').value,
      themeSong: document.getElementById('themeSong').value,
      themeSongLink: document.getElementById('themeSongLink').value,
      voiceActors: {
        japanese: document.getElementById('voiceActorJP').value,
        english: document.getElementById('voiceActorEN').value
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
  const isTaijutsu = type === 'taijutsu';
  return `
    <div class="ability-editor-item mb-3" data-type="${type}" data-index="${index}" style="border: 1px solid var(--color-border-2); padding: 1rem; border-radius: 4px;">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <strong>${isTaijutsu ? 'Taijutsu' : 'Ninjutsu'}</strong>
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

// Make helper functions globally available
if (typeof window !== 'undefined') {
  window.addAbility = function(type) {
    const container = document.getElementById('abilities-container');
    const items = container.querySelectorAll(`[data-type="${type}"]`);
    const index = items.length;
    const newAbility = type === 'taijutsu' 
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

