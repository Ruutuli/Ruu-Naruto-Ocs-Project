// OC Form Component - Create/Edit OC form

import { defaultOC, generateId } from '../data/default-data.js';
import storage from '../data/storage.js';

export function renderOCForm(oc = null, onSave) {
  const isEdit = !!oc;
  const formOC = oc || { ...defaultOC, id: generateId() };
  const clans = storage.getAllClans();
  
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
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label">Last Name 名字 <small style="font-weight: normal; color: var(--color-text-dark-2);">(e.g., Chigiri)</small></label>
              <input type="text" class="form-control" id="lastName" value="${formOC.lastName || ''}" required>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label">First Name 名前 <small style="font-weight: normal; color: var(--color-text-dark-2);">(e.g., Akene)</small></label>
              <input type="text" class="form-control" id="firstName" value="${formOC.firstName || ''}" required>
            </div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label">Name in Kanji/Hiragana/Katakana</label>
              <input type="text" class="form-control" id="nameJapanese" value="${formOC.nameJapanese || ''}" placeholder="e.g., 千切 明音">
            </div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label">Last Name Meaning</label>
              <input type="text" class="form-control" id="lastNameMeaning" value="${formOC.lastNameMeaning || ''}" placeholder="e.g., Thousand cuts">
            </div>
          </div>
          <div class="col-md-6">
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
        
        <div class="row">
          <div class="col-md-4">
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
                      return Array.from({length: 12}, (_, i) => {
                        const month = String(i + 1).padStart(2, '0');
                        const monthName = new Date(2000, i).toLocaleString('en-US', { month: 'long' });
                        const selected = existingMonth === month ? 'selected' : '';
                        return `<option value="${month}" ${selected}>${monthName}</option>`;
                      }).join('');
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
                      return Array.from({length: 31}, (_, i) => {
                        const day = String(i + 1).padStart(2, '0');
                        const selected = existingDay === day ? 'selected' : '';
                        return `<option value="${day}" ${selected}>${day}</option>`;
                      }).join('');
                    })()}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label class="form-label">Age (Era)</label>
              <select class="form-control" id="age">
                <option value="">Select Era</option>
                <option value="Part I: 12–13" ${(() => {
                  const ageStr = typeof formOC.age === 'string' ? formOC.age : String(formOC.age || '');
                  return ageStr === 'Part I: 12–13' || ageStr.includes('Part I: 12–13') ? 'selected' : '';
                })()}>Part I: 12–13</option>
                <option value="Part II: 15–17" ${(() => {
                  const ageStr = typeof formOC.age === 'string' ? formOC.age : String(formOC.age || '');
                  return ageStr === 'Part II: 15–17' || ageStr.includes('Part II: 15–17') ? 'selected' : '';
                })()}>Part II: 15–17</option>
                <option value="Blank Period: 17–19" ${(() => {
                  const ageStr = typeof formOC.age === 'string' ? formOC.age : String(formOC.age || '');
                  return ageStr === 'Blank Period: 17–19' || ageStr.includes('Blank Period: 17–19') ? 'selected' : '';
                })()}>Blank Period: 17–19</option>
                <option value="Gaiden: 20" ${(() => {
                  const ageStr = typeof formOC.age === 'string' ? formOC.age : String(formOC.age || '');
                  return ageStr === 'Gaiden: 20' || ageStr.includes('Gaiden: 20') ? 'selected' : '';
                })()}>Gaiden: 20</option>
                <option value="Boruto: 32" ${(() => {
                  const ageStr = typeof formOC.age === 'string' ? formOC.age : String(formOC.age || '');
                  return ageStr === 'Boruto: 32' || ageStr.includes('Boruto: 32') ? 'selected' : '';
                })()}>Boruto: 32</option>
              </select>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label class="form-label">Blood Type</label>
              <input type="text" class="form-control" id="bloodType" value="${formOC.bloodType || ''}">
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label class="form-label">Zodiac Sign</label>
              <input type="text" class="form-control" id="zodiac" value="${formOC.zodiac || ''}" placeholder="e.g., ♉ Taurus">
            </div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label class="form-label">Gender</label>
              <input type="text" class="form-control" id="gender" value="${formOC.gender || ''}">
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label class="form-label">Chakra Type</label>
              <input type="text" class="form-control" id="chakraType" value="${formOC.chakraType || ''}">
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label class="form-label">Kekkei Genkai</label>
              <input type="text" class="form-control" id="kekkeiGenkai" value="${formOC.kekkeiGenkai || ''}">
            </div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label">Sexual Orientation</label>
              <input type="text" class="form-control" id="sexualOrientation" value="${formOC.sexualOrientation || ''}">
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label">Romantic Orientation</label>
              <input type="text" class="form-control" id="romanticOrientation" value="${formOC.romanticOrientation || ''}">
            </div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label">Ninja Registration Number</label>
              <input type="text" class="form-control" id="ninjaRegistrationNumber" value="${formOC.ninjaRegistrationNumber || ''}">
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label">Academy Graduation Age</label>
              <input type="number" class="form-control" id="academyGraduationAge" value="${formOC.academyGraduationAge || ''}" min="0">
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Classification (comma-separated)</label>
          <input type="text" class="form-control" id="classification" value="${(formOC.classification || []).join(', ')}" placeholder="e.g., Genin, Fate Reader, Missing-nin">
        </div>
        
        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label class="form-label">Village</label>
              <select class="form-control" id="village" required>
                <option value="">Select Village</option>
                <option value="Konoha" ${formOC.village === 'Konoha' ? 'selected' : ''}>Konohagakure</option>
                <option value="Suna" ${formOC.village === 'Suna' ? 'selected' : ''}>Sunagakure</option>
                <option value="Kiri" ${formOC.village === 'Kiri' ? 'selected' : ''}>Kirigakure</option>
                <option value="Kumo" ${formOC.village === 'Kumo' ? 'selected' : ''}>Kumogakure</option>
                <option value="Iwa" ${formOC.village === 'Iwa' ? 'selected' : ''}>Iwagakure</option>
                <option value="Ame" ${formOC.village === 'Ame' ? 'selected' : ''}>Amegakure</option>
                <option value="Oto" ${formOC.village === 'Oto' ? 'selected' : ''}>Otogakure</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label">Rank</label>
              <select class="form-control" id="rank" required>
                <option value="Genin" ${formOC.rank === 'Genin' ? 'selected' : ''}>Genin</option>
                <option value="Chunin" ${formOC.rank === 'Chunin' ? 'selected' : ''}>Chunin</option>
                <option value="Jonin" ${formOC.rank === 'Jonin' ? 'selected' : ''}>Jonin</option>
                <option value="S-Rank" ${formOC.rank === 'S-Rank' ? 'selected' : ''}>S-Rank</option>
              </select>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label">Clan</label>
              <select class="form-control" id="clanId">
                <option value="">None</option>
                ${clans.map(clan => `<option value="${clan.id}" ${formOC.clanId === clan.id ? 'selected' : ''}>${clan.name}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>
        
        <!-- Additional Info -->
        <h3 class="mb-3 mt-4">Additional Information</h3>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label">Theme Song</label>
              <input type="text" class="form-control" id="themeSong" value="${formOC.themeSong || ''}">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label">Voice Actor (Japanese)</label>
              <input type="text" class="form-control" id="voiceActorJP" value="${formOC.voiceActors?.japanese || ''}">
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label">Voice Actor (English)</label>
              <input type="text" class="form-control" id="voiceActorEN" value="${formOC.voiceActors?.english || ''}">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label class="form-label">Moral Alignment</label>
              <input type="text" class="form-control" id="moralAlignment" value="${formOC.moralAlignment || ''}" placeholder="e.g., Lawful Neutral">
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label class="form-label">MBTI</label>
              <input type="text" class="form-control" id="mbti" value="${formOC.mbti || ''}" placeholder="e.g., ESTJ">
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label class="form-label">Enneagram</label>
              <input type="text" class="form-control" id="enneagram" value="${formOC.enneagram || ''}" placeholder="e.g., Type 1 with 5 Wing">
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
          <div class="col-md-2">
            <div class="form-group">
              <label class="form-label">S-Rank</label>
              <input type="number" class="form-control" id="missionS" value="${formOC.missions?.s || 0}" min="0">
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <label class="form-label">A-Rank</label>
              <input type="number" class="form-control" id="missionA" value="${formOC.missions?.a || 0}" min="0">
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <label class="form-label">B-Rank</label>
              <input type="number" class="form-control" id="missionB" value="${formOC.missions?.b || 0}" min="0">
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <label class="form-label">C-Rank</label>
              <input type="number" class="form-control" id="missionC" value="${formOC.missions?.c || 0}" min="0">
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <label class="form-label">D-Rank</label>
              <input type="number" class="form-control" id="missionD" value="${formOC.missions?.d || 0}" min="0">
            </div>
          </div>
        </div>
        
        <!-- Stats -->
        <h3 class="mb-3 mt-4">Stats (1-5)</h3>
        <div class="stats-container">
          <div class="stats-grid">
            ${renderStatInput('intelligence', formOC.stats?.intelligence || 3)}
            ${renderStatInput('stamina', formOC.stats?.stamina || 3)}
            ${renderStatInput('strength', formOC.stats?.strength || 3)}
            ${renderStatInput('speed', formOC.stats?.speed || 3)}
            ${renderStatInput('ninjutsu', formOC.stats?.ninjutsu || 3)}
            ${renderStatInput('genjutsu', formOC.stats?.genjutsu || 3)}
            ${renderStatInput('taijutsu', formOC.stats?.taijutsu || 3)}
            ${renderStatInput('handSeals', formOC.stats?.handSeals || 3)}
          </div>
        </div>
        
        <!-- Identifying Info -->
        <h3 class="mb-3 mt-4">Identifying Information</h3>
        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label class="form-label">Body Type</label>
              <input type="text" class="form-control" id="bodyType" value="${formOC.identifyingInfo?.bodyType || ''}">
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label class="form-label">Height</label>
              <input type="text" class="form-control" id="height" value="${formOC.identifyingInfo?.height || ''}">
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label class="form-label">Weight</label>
              <input type="text" class="form-control" id="weight" value="${formOC.identifyingInfo?.weight || ''}">
            </div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label">Made Genin</label>
              <input type="text" class="form-control" id="madeGenin" value="${formOC.identifyingInfo?.madeGenin || ''}">
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label">Made Chunin</label>
              <input type="text" class="form-control" id="madeChunin" value="${formOC.identifyingInfo?.madeChunin || ''}">
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
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label">Field Position</label>
              <input type="text" class="form-control" id="fieldPosition" value="${formOC.battleStrategy?.fieldPosition || ''}">
            </div>
          </div>
          <div class="col-md-6">
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
        
        <!-- Profile Image -->
        <h3 class="mb-3 mt-4">Profile Image</h3>
        <div class="form-group">
          <label class="form-label">Image URL</label>
          <input type="text" class="form-control" id="profileImage" value="${formOC.profileImage || ''}" placeholder="Enter image URL">
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
      age: document.getElementById('age').value || '',
      bloodType: document.getElementById('bloodType').value,
      gender: document.getElementById('gender').value,
      chakraType: document.getElementById('chakraType').value,
      village: document.getElementById('village').value,
      rank: document.getElementById('rank').value,
      clanId: document.getElementById('clanId').value || null,
      stats: {
        intelligence: parseInt(document.getElementById('intelligence').value) || 3,
        stamina: parseInt(document.getElementById('stamina').value) || 3,
        strength: parseInt(document.getElementById('strength').value) || 3,
        speed: parseInt(document.getElementById('speed').value) || 3,
        ninjutsu: parseInt(document.getElementById('ninjutsu').value) || 3,
        genjutsu: parseInt(document.getElementById('genjutsu').value) || 3,
        taijutsu: parseInt(document.getElementById('taijutsu').value) || 3,
        handSeals: parseInt(document.getElementById('handSeals').value) || 3
      },
      identifyingInfo: {
        bodyType: document.getElementById('bodyType').value,
        height: document.getElementById('height').value,
        weight: document.getElementById('weight').value,
        madeGenin: document.getElementById('madeGenin').value,
        madeChunin: document.getElementById('madeChunin').value
      },
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
      abilities: formOC.abilities || { taijutsu: [], ninjutsu: [] },
      knownAssociates: formOC.knownAssociates || [],
      recordHistory: formOC.recordHistory || { childhood: '', adolescence: '', adulthood: '' },
      appearance: formOC.appearance || { image: '', colors: [], gear: [] },
      profileImage: document.getElementById('profileImage').value,
      zodiac: document.getElementById('zodiac').value,
      sexualOrientation: document.getElementById('sexualOrientation').value,
      romanticOrientation: document.getElementById('romanticOrientation').value,
      ninjaRegistrationNumber: document.getElementById('ninjaRegistrationNumber').value,
      academyGraduationAge: document.getElementById('academyGraduationAge').value,
      classification: document.getElementById('classification').value.split(',').map(c => c.trim()).filter(c => c),
      kekkeiGenkai: document.getElementById('kekkeiGenkai').value,
      themeSong: document.getElementById('themeSong').value,
      voiceActors: {
        japanese: document.getElementById('voiceActorJP').value,
        english: document.getElementById('voiceActorEN').value
      },
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

// Make updateStatVisual function globally available
if (typeof window !== 'undefined') {
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
  
  // Initialize slider backgrounds on page load
  window.addEventListener('DOMContentLoaded', function() {
    const statSliders = document.querySelectorAll('.stat-slider');
    statSliders.forEach(slider => {
      const value = slider.value;
      const percentage = (value / 5) * 100;
      slider.style.background = `linear-gradient(to right, 
        var(--color-accent-2) 0%, 
        var(--color-accent-2) ${percentage}%,
        var(--color-border-2) ${percentage}%,
        var(--color-border-2) 100%)`;
    });
  });
}

