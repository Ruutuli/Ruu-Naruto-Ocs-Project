// Clan Form Component

import { defaultClan, generateId } from '../data/default-data.js';
import storage from '../data/storage.js';
import {
  clanClassifications,
  clanStatus,
  villagesLands,
  kekkeiGenkaiTypes,
  kekkeiGenkaiClassifications,
  ocCreationAllowed,
  generateOptions,
  generateGroupedOptions
} from '../data/options.js';

export function renderClanForm(clan = null, onSave) {
  const isEdit = !!clan;
  const formClan = clan || { ...defaultClan, id: generateId() };
  const ocs = storage.getAllOCs();
  
  // Helper to safely get nested values
  const getValue = (path, defaultValue = '') => {
    const keys = path.split('.');
    let value = formClan;
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined || value === null) return defaultValue;
    }
    return value || defaultValue;
  };
  
  // Helper to get array values
  const getArrayValue = (path, defaultValue = []) => {
    const val = getValue(path, defaultValue);
    return Array.isArray(val) ? val : (val ? [val] : defaultValue);
  };
  
  const form = document.createElement('div');
  form.className = 'card-naruto';
  
  // Helper to get appearsIn array
  const getAppearsIn = () => {
    const appearsIn = getArrayValue('appearsIn', []);
    return Array.isArray(appearsIn) ? appearsIn : [];
  };
  
  const appearsInOptions = ['Anime', 'Manga', 'Novel', 'Game', 'Movie'];
  const currentAppearsIn = getAppearsIn();
  
  form.innerHTML = `
    <div class="card-header-naruto">
      <h2>${isEdit ? 'Edit' : 'Create'} Clan</h2>
    </div>
    <div class="card-body">
      <form id="clan-form" onsubmit="event.preventDefault(); window.saveClanForm();">
        <!-- Save Button at Top -->
        <div class="mb-4" style="display: flex; justify-content: flex-start; gap: 0.5rem; padding-bottom: 1rem; border-bottom: 2px solid var(--color-border-2);">
          <button type="submit" class="btn-naruto">
            <i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Create'} Clan
          </button>
          <button type="button" class="btn-naruto btn-naruto-secondary" onclick="window.navigateTo('clans')">
            <i class="fas fa-times"></i> Cancel
          </button>
        </div>
        
        <!-- Basic Information (Always Expanded) -->
        <div class="mb-4">
          <h3 class="mb-3" style="border-bottom: 2px solid var(--color-accent-2); padding-bottom: 0.5rem;"><i class="fas fa-info-circle"></i> Basic Information <i class="japanese-header">基本情報</i></h3>
          
          <div class="form-group">
            <label class="form-label">Clan Name</label>
            <input type="text" class="form-control" id="name" value="${formClan.name || ''}" required>
          </div>
          
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label">Kanji (漢字) (Optional)</label>
                <input type="text" class="form-control" id="kanji" value="${getValue('kanji')}" placeholder="e.g., 契り">
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label">Meaning (Optional)</label>
                <input type="text" class="form-control" id="meaning" value="${getValue('meaning')}" placeholder="e.g., destiny, fate, karma">
              </div>
            </div>
          </div>
          
          <div class="row">
            <div class="col-md-4">
              <div class="form-group">
                <label class="form-label">Affiliation</label>
                <input type="text" class="form-control" id="affiliation" value="${getValue('affiliation')}" placeholder="Village — or 'Independent/Dispersed'">
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label class="form-label">Classification</label>
                <select class="form-control" id="classification">
                  <option value="">Select Classification</option>
                  ${generateOptions(clanClassifications, getValue('classification'))}
                </select>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label class="form-label">Status</label>
                <select class="form-control" id="status">
                  <option value="">Select Status</option>
                  ${generateOptions(clanStatus, getValue('status'))}
                </select>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Tagline / Theme (Optional)</label>
            <input type="text" class="form-control" id="tagline" value="${getValue('tagline')}" placeholder="e.g., duty, legacy, bloodline">
          </div>
          
          <div class="form-group">
            <label class="form-label">Summary (2-3 sentences)</label>
            <textarea class="form-control" id="summary" rows="3" placeholder="A 2-3 sentence overview capturing the clan's identity in the Naruto world.">${getValue('summary')}</textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">Clan Symbol (Image URL)</label>
            <input type="text" class="form-control" id="symbol" value="${formClan.symbol || ''}" placeholder="Enter image URL">
          </div>
          
          <div class="form-group">
            <label class="form-label">Village/Land</label>
            <select class="form-control" id="village" required>
              <option value="">Select Village/Land</option>
              ${generateGroupedOptions(villagesLands, formClan.village || '')}
            </select>
          </div>
          
          <!-- Debut Information -->
          <div class="form-group mt-4">
            <label class="form-label" style="font-weight: 600; margin-bottom: 0.75rem;"><i class="fas fa-book-open" style="margin-right: 0.5rem;"></i> Debut Information</label>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-label">Debut (Manga)</label>
                  <input type="text" class="form-control" id="debutManga" value="${getValue('debut.manga')}" placeholder="e.g., Chapter 1">
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-label">Debut (Anime)</label>
                  <input type="text" class="form-control" id="debutAnime" value="${getValue('debut.anime')}" placeholder="e.g., Episode 1">
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <label class="form-label">Debut (Novel)</label>
                  <input type="text" class="form-control" id="debutNovel" value="${getValue('debut.novel')}" placeholder="e.g., Novel Name">
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label class="form-label">Debut (Movie)</label>
                  <input type="text" class="form-control" id="debutMovie" value="${getValue('debut.movie')}" placeholder="e.g., Movie Name">
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label class="form-label">Debut (Game)</label>
                  <input type="text" class="form-control" id="debutGame" value="${getValue('debut.game')}" placeholder="e.g., Game Name">
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Appears In</label>
              <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 0.5rem;">
                ${appearsInOptions.map(option => `
                  <label style="display: flex; align-items: center; cursor: pointer; font-weight: normal;">
                    <input type="checkbox" value="${option}" id="appearsIn-${option}" ${currentAppearsIn.includes(option) ? 'checked' : ''} style="margin-right: 0.5rem;">
                    ${option}
                  </label>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Overview (Collapsible) -->
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleFormCollapse('overview-content')">
            <i class="fas fa-book-open" style="margin-right: 0.5rem;"></i> Overview <i class="japanese-header">概要</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="overview-content" class="collapsible-content">
            <div class="form-group">
              <label class="form-label">Origins</label>
              <textarea class="form-control" id="overview-origins" rows="3" placeholder="What are the clan's origins?">${getValue('overview.origins')}</textarea>
            </div>
            
            <div class="form-group">
              <label class="form-label">What They Are Known For</label>
              <textarea class="form-control" id="overview-knownFor" rows="3" placeholder="What are they known for?">${getValue('overview.knownFor')}</textarea>
            </div>
            
            <div class="form-group">
              <label class="form-label">Their Purpose in the World</label>
              <textarea class="form-control" id="overview-purpose" rows="3" placeholder="What is their purpose?">${getValue('overview.purpose')}</textarea>
            </div>
            
            <div class="form-group">
              <label class="form-label">How They Fit Into the Universe</label>
              <textarea class="form-control" id="overview-fitInUniverse" rows="3" placeholder="How do they fit into the Naruto universe (or your universe)?">${getValue('overview.fitInUniverse')}</textarea>
            </div>
          </div>
        </div>
        
        <!-- Kekkei Genkai (Collapsible) -->
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleFormCollapse('kekkei-genkai-content')">
            <i class="fas fa-eye" style="margin-right: 0.5rem;"></i> Kekkei Genkai <i class="japanese-header">血継限界</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="kekkei-genkai-content" class="collapsible-content">
        
        <div class="form-group">
          <label class="form-label">Name</label>
          <input type="text" class="form-control" id="kekkeiGenkai-name" value="${getValue('kekkeiGenkai.name')}" placeholder="Name of the Kekkei Genkai">
        </div>
        
        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label class="form-label">Type</label>
              <select class="form-control" id="kekkeiGenkai-type">
                <option value="">Select Type</option>
                ${generateOptions(kekkeiGenkaiTypes, getValue('kekkeiGenkai.type'))}
              </select>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label class="form-label">Classification</label>
              <select class="form-control" id="kekkeiGenkai-classification">
                <option value="">Select Classification</option>
                ${generateOptions(kekkeiGenkaiClassifications, getValue('kekkeiGenkai.classification'))}
              </select>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label class="form-label">Chakra Nature</label>
              <input type="text" class="form-control" id="kekkeiGenkai-chakraNature" value="${getValue('kekkeiGenkai.chakraNature')}" placeholder="Yin, Yang, Yin–Yang, Fire, Wind, etc.">
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="form-control" id="kekkeiGenkai-description" rows="6" placeholder="Detailed explanation of the ability's 'fantasy logic.' Include: sensory/mind/body impacts, range, activation conditions, weaknesses, side effects, inherited markers (eyes, blood patterns, markings).">${getValue('kekkeiGenkai.description')}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Activation</label>
          <textarea class="form-control" id="kekkeiGenkai-activation" rows="3" placeholder="How is it triggered? Chakra type? Eye activation? Ritual?">${getValue('kekkeiGenkai.activation')}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Mechanics (one per line)</label>
          <textarea class="form-control" id="kekkeiGenkai-mechanics" rows="4" placeholder="List the mechanics of the ability, one per line.">${getArrayValue('kekkeiGenkai.mechanics').join('\n')}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Strengths (one per line)</label>
          <textarea class="form-control" id="kekkeiGenkai-strengths" rows="3" placeholder="List the strengths, one per line.">${getArrayValue('kekkeiGenkai.strengths').join('\n')}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Weaknesses / Costs (one per line)</label>
          <textarea class="form-control" id="kekkeiGenkai-weaknesses" rows="3" placeholder="List the weaknesses/costs, one per line (exhaustion, blindness, lifespan cost, chakra drain, curse seal behavior, etc.).">${getArrayValue('kekkeiGenkai.weaknesses').join('\n')}</textarea>
        </div>
            <div class="form-group">
              <label class="form-label">Notable Bloodline Jutsu (one per line, format: Jutsu Name — Rank, Type, Description)</label>
              <textarea class="form-control" id="kekkeiGenkai-notableJutsu" rows="4" placeholder="Jutsu Name — Rank, Type, Description&#10;Jutsu Name — Rank, Type, Description">${getArrayValue('kekkeiGenkai.notableJutsu').join('\n')}</textarea>
              <small class="form-text text-muted">These are jutsu exclusive to the bloodline ability, not shared clan techniques.</small>
            </div>
          </div>
        </div>
        
        <!-- Hiden Techniques (Collapsible) -->
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleFormCollapse('hiden-content')">
            <i class="fas fa-scroll" style="margin-right: 0.5rem;"></i> Hiden Techniques <i class="japanese-header">秘伝</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="hiden-content" class="collapsible-content">
        
        <div class="form-group">
          <label class="form-label">Name</label>
          <input type="text" class="form-control" id="hiden-name" value="${getValue('hiden.name')}" placeholder="Name of the Hiden Technique">
        </div>
        
        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label class="form-label">Type</label>
              <select class="form-control" id="hiden-type">
                <option value="">Select Type</option>
                ${generateOptions(kekkeiGenkaiTypes, getValue('hiden.type'))}
              </select>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label class="form-label">Classification</label>
              <select class="form-control" id="hiden-classification">
                <option value="">Select Classification</option>
                ${generateOptions(kekkeiGenkaiClassifications, getValue('hiden.classification'))}
              </select>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label class="form-label">Chakra Nature</label>
              <input type="text" class="form-control" id="hiden-chakraNature" value="${getValue('hiden.chakraNature')}" placeholder="Yin, Yang, Yin–Yang, Fire, Wind, etc.">
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="form-control" id="hiden-description" rows="6" placeholder="Detailed explanation of the technique's 'fantasy logic.' Include: sensory/mind/body impacts, range, activation conditions, weaknesses, side effects, training requirements.">${getValue('hiden.description')}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Activation</label>
          <textarea class="form-control" id="hiden-activation" rows="3" placeholder="How is it triggered? Chakra type? Hand seals? Ritual? Training required?">${getValue('hiden.activation')}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Mechanics (one per line)</label>
          <textarea class="form-control" id="hiden-mechanics" rows="4" placeholder="List the mechanics of the technique, one per line.">${getArrayValue('hiden.mechanics').join('\n')}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Strengths (one per line)</label>
          <textarea class="form-control" id="hiden-strengths" rows="3" placeholder="List the strengths, one per line.">${getArrayValue('hiden.strengths').join('\n')}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Weaknesses / Costs (one per line)</label>
          <textarea class="form-control" id="hiden-weaknesses" rows="3" placeholder="List the weaknesses/costs, one per line (exhaustion, chakra drain, training requirements, etc.).">${getArrayValue('hiden.weaknesses').join('\n')}</textarea>
        </div>
            <div class="form-group">
              <label class="form-label">Notable Hiden Jutsu (one per line, format: Jutsu Name — Rank, Type, Description)</label>
              <textarea class="form-control" id="hiden-notableJutsu" rows="4" placeholder="Jutsu Name — Rank, Type, Description&#10;Jutsu Name — Rank, Type, Description">${getArrayValue('hiden.notableJutsu').join('\n')}</textarea>
              <small class="form-text text-muted">These are jutsu exclusive to the hiden technique, not shared clan techniques.</small>
            </div>
          </div>
        </div>
        
        <!-- Clan Structure & Governance (Collapsible) -->
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleFormCollapse('clan-structure-content')">
            <i class="fas fa-sitemap" style="margin-right: 0.5rem;"></i> Clan Structure & Governance <i class="japanese-header">一族の構造と統治</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="clan-structure-content" class="collapsible-content">
        
        <div class="form-group">
          <label class="form-label">Clan Head</label>
          <textarea class="form-control" id="clanStructure-clanHead" rows="3" placeholder="Name, role, responsibilities, expectations, special privileges.">${getValue('clanStructure.clanHead')}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Council / Elders</label>
          <textarea class="form-control" id="clanStructure-councilElders" rows="4" placeholder="Number of elders, how they are chosen, what authority they hold.">${getValue('clanStructure.councilElders')}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Branch System</label>
          <textarea class="form-control" id="clanStructure-branchSystem" rows="4" placeholder="Main Family: Purpose, privileges. Branch Families: Purpose, limitations.">${getValue('clanStructure.branchSystem')}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Crests / Seals</label>
          <textarea class="form-control" id="clanStructure-crestsSeals" rows="3" placeholder="Any markings or curse seals?">${getValue('clanStructure.crestsSeals')}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Political Tensions</label>
          <textarea class="form-control" id="clanStructure-politicalTensions" rows="3" placeholder="Rivalries, inheritance issues.">${getValue('clanStructure.politicalTensions')}</textarea>
        </div>
            <div class="form-group">
              <label class="form-label">Laws & Rules</label>
              <textarea class="form-control" id="clanStructure-lawsRules" rows="6" placeholder="Common Naruto clan regulations: marriage rules, fate/destiny rules, secrecy oaths, expectations for heirs, combat restrictions, forbidden jutsu use, punishment structure, betrayal consequences.">${getValue('clanStructure.lawsRules')}</textarea>
            </div>
          </div>
        </div>
        
        <!-- Culture & Traditions (Collapsible) -->
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleFormCollapse('culture-traditions-content')">
            <i class="fas fa-torii-gate" style="margin-right: 0.5rem;"></i> Culture & Traditions <i class="japanese-header">文化と伝統</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="culture-traditions-content" class="collapsible-content">
        
        <div class="form-group">
          <label class="form-label">Values (comma-separated)</label>
          <input type="text" class="form-control" id="cultureTraditions-values" value="${getArrayValue('cultureTraditions.values').join(', ')}" placeholder="e.g., duty, sacrifice, secrecy, loyalty, knowledge, purity">
        </div>
        
        <div class="form-group">
          <label class="form-label">Long-held Traditions</label>
          <textarea class="form-control" id="cultureTraditions-longHeldTraditions" rows="6" placeholder="Coming-of-age rites, funeral customs, seasonal rituals, bloodline awakening ceremonies, marriage practices, child rearing, education expectations, iconic festivals or rites.">${getValue('cultureTraditions.longHeldTraditions')}</textarea>
        </div>
            <div class="form-group">
              <label class="form-label">Clan Sayings or Proverbs (one per line)</label>
              <textarea class="form-control" id="cultureTraditions-clanSayings" rows="3" placeholder="Example: 'Shadow endures so the Fire may burn bright.'">${getArrayValue('cultureTraditions.clanSayings').join('\n')}</textarea>
            </div>
          </div>
        </div>
        
        <!-- Village & Politics (Collapsible) -->
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleFormCollapse('village-politics-content')">
            <i class="fas fa-map-marked-alt" style="margin-right: 0.5rem;"></i> Village & Politics <i class="japanese-header">村と政治</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="village-politics-content" class="collapsible-content">
        
        <div class="form-group">
          <label class="form-label">Primary Village</label>
          <textarea class="form-control" id="villagePlacement-primaryVillage" rows="3" placeholder="State why they joined this village and how long they've been part of it.">${getValue('villagePlacement.primaryVillage')}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Village Duties</label>
          <textarea class="form-control" id="villagePlacement-dutiesAssigned" rows="5" placeholder="What they are formally responsible for: Intelligence division, Barrier corps, Police force, ANBU support, Medical corps, Sensory division, Summoning contract guardians, Record keepers, Diplomats.">${getValue('villagePlacement.dutiesAssigned')}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Relations with Other Clans</label>
          <textarea class="form-control" id="villagePlacement-relationsWithClans" rows="4" placeholder="Allies, Rivals, Historic blood feuds, Marital alliances.">${getValue('villagePlacement.relationsWithClans')}</textarea>
        </div>
            <div class="form-group">
              <label class="form-label">Role in Major Conflicts</label>
              <textarea class="form-control" id="villagePlacement-roleInConflicts" rows="5" placeholder="List contributions to: First Shinobi World War, Second, Third, Fourth, Any inter-clan wars.">${getValue('villagePlacement.roleInConflicts')}</textarea>
            </div>
          </div>
        </div>
        
        <!-- Geography (Collapsible) -->
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleFormCollapse('geography-content')">
            <i class="fas fa-map" style="margin-right: 0.5rem;"></i> Geography <i class="japanese-header">地理</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="geography-content" class="collapsible-content">
            <div class="form-group">
              <label class="form-label">Primary Location</label>
              <textarea class="form-control" id="geography-primaryLocation" rows="3" placeholder="Describe the clan's primary geographical location or homeland.">${getValue('geography.primaryLocation') || getValue('villagesLands.primaryLocation')}</textarea>
            </div>
            
            <div class="form-group">
              <label class="form-label">Branches in Other Villages (one per line, format: Branch Name — specialization)</label>
              <textarea class="form-control" id="geography-branches" rows="4" placeholder="Branch A — (specialization)&#10;Branch B — (specialization)&#10;Branch C — (specialization)">${(() => {
                const geoBranches = getArrayValue('geography.branches');
                const villagesBranches = getArrayValue('villagesLands.branches');
                return geoBranches.length > 0 ? geoBranches.join('\n') : villagesBranches.join('\n');
              })()}</textarea>
              <small class="form-text text-muted">Geographical dispersion - branches located in other villages.</small>
            </div>
            
            <div class="form-group">
              <label class="form-label">Territory & Influence</label>
              <textarea class="form-control" id="geography-territory" rows="3" placeholder="Describe political influence, neutrality, alliances, or territorial history.">${getValue('geography.territory') || getValue('villagesLands.territory')}</textarea>
            </div>
            
            <div class="form-group">
              <label class="form-label">Reputation</label>
              <textarea class="form-control" id="geography-reputation" rows="3" placeholder="How other clans/villages perceive them.">${getValue('geography.reputation') || getValue('villagesLands.reputation')}</textarea>
            </div>
          </div>
        </div>
        
        <!-- Appearance / Physical Traits (Collapsible) -->
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleFormCollapse('appearance-content')">
            <i class="fas fa-user" style="margin-right: 0.5rem;"></i> Appearance / Physical Traits <i class="japanese-header">外見・身体的特徴</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="appearance-content" class="collapsible-content">
            <div class="form-group">
              <label class="form-label">Appearance / Physical Traits</label>
              <textarea class="form-control" id="appearancePhysicalTraits" rows="8" placeholder="Insert shared traits: Hair colors, eye colors, skin tones, height/build, distinctive markings or features, clan symbols or patterns, official color palette, clothing style. Include hairstyle norms, accessories, or features that hint at lineage.">${getValue('appearancePhysicalTraits')}</textarea>
            </div>
          </div>
        </div>
        
        <!-- Abilities (Collapsible) -->
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleFormCollapse('abilities-content')">
            <i class="fas fa-magic" style="margin-right: 0.5rem;"></i> Clan Jutsu & Abilities <i class="japanese-header">一族の術と能力</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="abilities-content" class="collapsible-content">
        
        <div class="form-group">
          <label class="form-label">Signature Jutsu (one per line, format: Jutsu Name — description)</label>
          <textarea class="form-control" id="abilities-signatureJutsu" rows="5" placeholder="Jutsu 1 — description&#10;Jutsu 2 — description&#10;Jutsu 3 — description">${(() => {
            if (formClan.abilities && typeof formClan.abilities === 'object' && !Array.isArray(formClan.abilities) && Array.isArray(formClan.abilities.signatureJutsu)) {
              return formClan.abilities.signatureJutsu.join('\n');
            }
            if (Array.isArray(formClan.abilities)) {
              return formClan.abilities.join('\n');
            }
            return '';
          })()}</textarea>
          <small class="form-text text-muted">Shared clan techniques, not tied to bloodline ability.</small>
        </div>
        
        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label class="form-label">Primary Chakra Nature</label>
              <input type="text" class="form-control" id="abilities-chakraNatures-primary" value="${getValue('abilities.chakraNatures.primary')}" placeholder="e.g., Fire">
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label class="form-label">Secondary Chakra Nature</label>
              <input type="text" class="form-control" id="abilities-chakraNatures-secondary" value="${getValue('abilities.chakraNatures.secondary')}" placeholder="e.g., Wind">
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label class="form-label">Rare Chakra Nature</label>
              <input type="text" class="form-control" id="abilities-chakraNatures-rare" value="${getValue('abilities.chakraNatures.rare')}" placeholder="e.g., Lightning">
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Combat Style</label>
          <textarea class="form-control" id="abilities-combatStyle" rows="4" placeholder="Describe how they fight: Weapon preference, close vs. long range, support vs. assault roles, signature tactics.">${getValue('abilities.combatStyle')}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Role in Their Village</label>
          <textarea class="form-control" id="abilities-roleInVillage" rows="4" placeholder="Intelligence, Assault force, Medics, Seals, Summoners, Diplomats, Crafting/artisans, Anything unique.">${getValue('abilities.roleInVillage')}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Clan-wide Strengths (one per line)</label>
          <textarea class="form-control" id="abilities-strengths" rows="3" placeholder="Clan-wide advantages — physical or mental">${getArrayValue('abilities.strengths').join('\n')}</textarea>
        </div>
            <div class="form-group">
              <label class="form-label">Clan-wide Weaknesses (one per line)</label>
              <textarea class="form-control" id="abilities-weaknesses" rows="3" placeholder="Clan-wide drawbacks, genetic issues, chakra fragility, etc.">${getArrayValue('abilities.weaknesses').join('\n')}</textarea>
            </div>
          </div>
        </div>
        
        <!-- Combat Information (Collapsible) -->
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleFormCollapse('combat-info-content')">
            <i class="fas fa-sword" style="margin-right: 0.5rem;"></i> Combat Information <i class="japanese-header">戦闘情報</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="combat-info-content" class="collapsible-content">
        
        <div class="form-group">
          <label class="form-label">Signature Weaponry</label>
          <textarea class="form-control" id="combatInfo-signatureWeaponry" rows="4" placeholder="Describe the clan's signature weapons, tools, or combat equipment.">${getValue('combatInfo.signatureWeaponry')}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Battle Strengths (one per line)</label>
          <textarea class="form-control" id="combatInfo-battleStrengths" rows="3" placeholder="List combat-specific strengths, one per line.">${getArrayValue('combatInfo.battleStrengths').join('\n')}</textarea>
        </div>
            <div class="form-group">
              <label class="form-label">Battle Weaknesses (one per line)</label>
              <textarea class="form-control" id="combatInfo-battleWeaknesses" rows="3" placeholder="List combat-specific weaknesses, one per line.">${getArrayValue('combatInfo.battleWeaknesses').join('\n')}</textarea>
            </div>
          </div>
        </div>
        
        <!-- Leaders (Collapsible) -->
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleFormCollapse('leaders-content')">
            <i class="fas fa-crown" style="margin-right: 0.5rem;"></i> Leaders <i class="japanese-header">リーダー</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="leaders-content" class="collapsible-content">
        
        <div class="form-group">
          <label class="form-label">Current Leader</label>
          <textarea class="form-control" id="leaders-currentLeader" rows="3" placeholder="Name — role, personality notes, leadership style.">${getValue('leaders.currentLeader')}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Past Leaders (Notable) (one per line, format: Name — contributions)</label>
          <textarea class="form-control" id="leaders-pastLeaders" rows="5" placeholder="Name — contributions&#10;Name — era or achievements&#10;Name — scandals, wars, historical relevance">${getArrayValue('leaders.pastLeaders').join('\n')}</textarea>
        </div>
            <div class="form-group">
              <label class="form-label">Heirs</label>
              <textarea class="form-control" id="leaders-heirs" rows="3" placeholder="Legacy, expectations, chosen successors, bloodline purity rules, etc.">${getValue('leaders.heirs')}</textarea>
            </div>
          </div>
        </div>
        
        <!-- Notable Clan Members (Collapsible) -->
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleFormCollapse('notable-members-content')">
            <i class="fas fa-users" style="margin-right: 0.5rem;"></i> Notable Clan Members <i class="japanese-header">著名な一族のメンバー</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="notable-members-content" class="collapsible-content">
            <div class="form-group">
              <label class="form-label">Notable Clan Members (one per line)</label>
              <textarea class="form-control" id="notableMembers" rows="4" placeholder="List important NPCs, historical figures, or descriptions, one per line. Add small blurbs later if needed.">${getArrayValue('notableMembers').join('\n')}</textarea>
              <small class="form-text text-muted">For OC members, use the "Clan Members" section below.</small>
            </div>
          </div>
        </div>
        
        <!-- Clan History (Collapsible) -->
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleFormCollapse('clan-history-content')">
            <i class="fas fa-scroll" style="margin-right: 0.5rem;"></i> Clan History <i class="japanese-header">一族の歴史</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="clan-history-content" class="collapsible-content">
        
        <div class="form-group">
          <label class="form-label">Part I: Ancient Era</label>
          <textarea class="form-control" id="clanHistory-ancientEra" rows="5" placeholder="Describe the clan's origins, early ancestors, first incidents, mythic battles, curses, migrations.">${getValue('clanHistory.ancientEra')}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Part II: Feudal Era / Warring States Period</label>
          <textarea class="form-control" id="clanHistory-feudalEra" rows="5" placeholder="Explain their role before the establishment of villages. Include: alliances, feuds, signature weapons developed, first major tragedies.">${getValue('clanHistory.feudalEra')}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Part III: Founding of the Hidden Villages</label>
          <textarea class="form-control" id="clanHistory-foundingOfVillages" rows="5" placeholder="Why they chose their village (or why they refused). Political involvement: did they sign early treaties? did they oppose the Hokage system? did their abilities make them valuable? feared?">${getValue('clanHistory.foundingOfVillages')}</textarea>
        </div>
            <div class="form-group">
              <label class="form-label">Part IV: Modern Era</label>
              <textarea class="form-control" id="clanHistory-modernEra" rows="5" placeholder="The clan's current state: thriving, deteriorating, cursed, politically fractured, integrated, in hiding.">${getValue('clanHistory.modernEra')}</textarea>
            </div>
          </div>
        </div>
        
        <!-- Symbols, Artifacts & Secrets (Collapsible) -->
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleFormCollapse('symbols-artifacts-content')">
            <i class="fas fa-scroll" style="margin-right: 0.5rem;"></i> Symbols, Artifacts & Secrets <i class="japanese-header">シンボル、遺物、秘密</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="symbols-artifacts-content" class="collapsible-content">
        
        <div class="form-group">
          <label class="form-label">Clan Crest</label>
          <textarea class="form-control" id="clanSymbols-clanCrest" rows="3" placeholder="Describe or insert image URL. (Note: Basic symbol image is set in Basic Information section above.)">${getValue('clanSymbols.clanCrest')}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Artifacts / Relics (one per line, format: Named object — origin & purpose)</label>
          <textarea class="form-control" id="clanSymbols-artifacts" rows="4" placeholder="Named object — origin & purpose&#10;Named object — who may wield it&#10;Named object — taboo surrounding it">${getArrayValue('clanSymbols.artifacts').join('\n')}</textarea>
        </div>
            <div class="form-group">
              <label class="form-label">Secret Knowledge</label>
              <textarea class="form-control" id="clanSymbols-secretKnowledge" rows="5" placeholder="Forbidden jutsu, Lost techniques, Locked scrolls, Curses or oaths, Ancient treaties, Catastrophic lineage secrets.">${getValue('clanSymbols.secretKnowledge')}</textarea>
            </div>
          </div>
        </div>
        
        <!-- Optional Extras (Collapsible) -->
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleFormCollapse('optional-extras-content')">
            <i class="fas fa-puzzle-piece" style="margin-right: 0.5rem;"></i> Optional Extra Sections <i class="japanese-header">オプション追加セクション</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="optional-extras-content" class="collapsible-content">
        
        <div class="form-group">
          <label class="form-label">Bloodline Mutations</label>
          <textarea class="form-control" id="optionalExtras-bloodlineMutations" rows="3" placeholder="Describe any bloodline mutations.">${getValue('optionalExtras.bloodlineMutations')}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Branch Family Specialties</label>
          <textarea class="form-control" id="optionalExtras-branchFamilySpecialties" rows="3" placeholder="Describe branch family specialties.">${getValue('optionalExtras.branchFamilySpecialties')}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Clan Weakness Disease / Genetic Flaw</label>
          <textarea class="form-control" id="optionalExtras-clanWeaknessDisease" rows="3" placeholder="Describe any clan weakness disease or genetic flaw.">${getValue('optionalExtras.clanWeaknessDisease')}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Summoning Contract History</label>
          <textarea class="form-control" id="optionalExtras-summoningContractHistory" rows="3" placeholder="Describe summoning contract history.">${getValue('optionalExtras.summoningContractHistory')}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Restricted Techniques List (Kinjutsu) (one per line)</label>
          <textarea class="form-control" id="optionalExtras-restrictedTechniques" rows="4" placeholder="List restricted techniques, one per line.">${getArrayValue('optionalExtras.restrictedTechniques').join('\n')}</textarea>
          <small class="form-text text-muted">Note: This will also appear in the Symbols, Artifacts & Secrets section.</small>
        </div>
        
        <div class="form-group">
          <label class="form-label">Clan Motto</label>
          <input type="text" class="form-control" id="optionalExtras-clanMotto" value="${getValue('optionalExtras.clanMotto')}" placeholder="e.g., 'Shadow endures so the Fire may burn bright.'">
        </div>
        
        <div class="form-group">
          <label class="form-label">Clan Ranking System</label>
          <textarea class="form-control" id="optionalExtras-clanRankingSystem" rows="3" placeholder="Clan Ranking System (Genin → Elite Clan Shinobi)">${getValue('optionalExtras.clanRankingSystem')}</textarea>
        </div>
            <div class="form-group">
              <label class="form-label">Clan Architecture</label>
              <textarea class="form-control" id="optionalExtras-clanArchitecture" rows="3" placeholder="Compound layout, architectural style, etc.">${getValue('optionalExtras.clanArchitecture')}</textarea>
            </div>
          </div>
        </div>
        
        <!-- Additional Information (Collapsible) -->
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleFormCollapse('additional-info-content')">
            <i class="fas fa-info-circle" style="margin-right: 0.5rem;"></i> Additional Information <i class="japanese-header">追加情報</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="additional-info-content" class="collapsible-content">
            <div class="form-group">
              <label class="form-label">Are Others Allowed to Make OCs from This Clan?</label>
              <select class="form-control" id="ocCreationAllowed">
                ${generateOptions(ocCreationAllowed, formClan.ocCreationAllowed || 'Ask')}
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label">Trivia</label>
              <textarea class="form-control" id="trivia" rows="4" placeholder="Include fun facts about the clan.">${getValue('trivia')}</textarea>
            </div>
            
            <div class="form-group">
              <label class="form-label">References</label>
              <textarea class="form-control" id="references" rows="3" placeholder="List any sources of inspiration or references to Naruto canon or other media.">${getValue('references')}</textarea>
            </div>
          </div>
        </div>
        
        <!-- Clan Members (Collapsible) -->
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleFormCollapse('clan-members-content')">
            <i class="fas fa-users" style="margin-right: 0.5rem;"></i> Clan Members (OC IDs) <i class="japanese-header">一族のメンバー</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="clan-members-content" class="collapsible-content">
            <div class="form-group">
              <label class="form-label">Clan Members (OC IDs)</label>
              <select class="form-control" id="members" multiple size="8">
                ${ocs.map(oc => `
                  <option value="${oc.id}" ${(formClan.members || []).includes(oc.id) || (formClan.knownMembers || []).includes(oc.id) ? 'selected' : ''}>
                    ${oc.firstName} ${oc.lastName} - ${oc.rank}
                  </option>
                `).join('')}
              </select>
              <small>Hold Ctrl/Cmd to select multiple members</small>
            </div>
          </div>
        </div>
        
        <!-- Aesthetic Mood Board (Collapsible) -->
        <div class="collapsible-section">
          <div class="collapsible-header" onclick="toggleFormCollapse('mood-board-content')">
            <i class="fas fa-images" style="margin-right: 0.5rem;"></i> Aesthetic Mood Board <i class="japanese-header">美的ムードボード</i>
            <i class="fas fa-chevron-down bounce-arrow"></i>
          </div>
          <div id="mood-board-content" class="collapsible-content">
            <div class="form-group">
              <label class="form-label">Mood Board Images (one URL per line)</label>
              <textarea class="form-control" id="moodBoardImages" rows="6" placeholder="Enter image URLs, one per line. These will be displayed in an aesthetic mood board layout on the clan detail page.&#10;Example:&#10;https://example.com/image1.jpg&#10;https://example.com/image2.jpg">${getArrayValue('moodBoardImages').join('\n')}</textarea>
              <small class="form-text text-muted">Add image URLs to create a visual mood board for the clan's aesthetic. Images will be displayed in a Pinterest-style grid layout.</small>
            </div>
          </div>
        </div>
        
        <div class="mt-4">
          <button type="submit" class="btn-naruto">${isEdit ? 'Update' : 'Create'} Clan</button>
          <button type="button" class="btn-naruto btn-naruto-secondary" onclick="window.navigateTo('clans')" style="margin-left: 0.5rem;">Cancel</button>
        </div>
      </form>
    </div>
  `;
  
  // Add toggleFormCollapse function if it doesn't exist
  if (!window.toggleFormCollapse) {
    window.toggleFormCollapse = function(contentId) {
      const content = document.getElementById(contentId);
      if (content) {
        const isActive = content.classList.contains('active');
        content.classList.toggle('active');
        
        // Find the associated arrow and rotate it
        const header = content.previousElementSibling;
        if (header) {
          const arrow = header.querySelector('.bounce-arrow');
          if (arrow) {
            if (isActive) {
              arrow.style.transform = 'rotate(0deg)';
            } else {
              arrow.style.transform = 'rotate(180deg)';
            }
          }
        }
      }
    };
  }
  
  window.saveClanForm = () => {
    // Helper function to safely get element value
    const getElementValue = (id, defaultValue = '') => {
      const element = document.getElementById(id);
      return element ? element.value : defaultValue;
    };
    
    // Parse array fields
    const signatureJutsuText = getElementValue('abilities-signatureJutsu');
    const signatureJutsu = signatureJutsuText ? signatureJutsuText.split('\n').filter(a => a.trim()) : [];
    
    const mechanicsText = getElementValue('kekkeiGenkai-mechanics');
    const mechanics = mechanicsText ? mechanicsText.split('\n').filter(m => m.trim()) : [];
    
    const kekkeiStrengthsText = getElementValue('kekkeiGenkai-strengths');
    const kekkeiStrengths = kekkeiStrengthsText ? kekkeiStrengthsText.split('\n').filter(s => s.trim()) : [];
    
    const kekkeiWeaknessesText = getElementValue('kekkeiGenkai-weaknesses');
    const kekkeiWeaknesses = kekkeiWeaknessesText ? kekkeiWeaknessesText.split('\n').filter(w => w.trim()) : [];
    
    const notableJutsuText = getElementValue('kekkeiGenkai-notableJutsu');
    const notableJutsu = notableJutsuText ? notableJutsuText.split('\n').filter(j => j.trim()) : [];
    
    // Parse hiden fields
    const hidenMechanicsText = getElementValue('hiden-mechanics');
    const hidenMechanics = hidenMechanicsText ? hidenMechanicsText.split('\n').filter(m => m.trim()) : [];
    
    const hidenStrengthsText = getElementValue('hiden-strengths');
    const hidenStrengths = hidenStrengthsText ? hidenStrengthsText.split('\n').filter(s => s.trim()) : [];
    
    const hidenWeaknessesText = getElementValue('hiden-weaknesses');
    const hidenWeaknesses = hidenWeaknessesText ? hidenWeaknessesText.split('\n').filter(w => w.trim()) : [];
    
    const hidenNotableJutsuText = getElementValue('hiden-notableJutsu');
    const hidenNotableJutsu = hidenNotableJutsuText ? hidenNotableJutsuText.split('\n').filter(j => j.trim()) : [];
    
    const branchesText = getElementValue('villagesLands-branches');
    const branches = branchesText ? branchesText.split('\n').filter(b => b.trim()) : [];
    
    const pastLeadersText = getElementValue('leaders-pastLeaders');
    const pastLeaders = pastLeadersText ? pastLeadersText.split('\n').filter(p => p.trim()) : [];
    
    const notableMembersText = getElementValue('notableMembers');
    const notableMembers = notableMembersText ? notableMembersText.split('\n').filter(n => n.trim()) : [];
    
    const abilitiesStrengthsText = getElementValue('abilities-strengths');
    const abilitiesStrengths = abilitiesStrengthsText ? abilitiesStrengthsText.split('\n').filter(s => s.trim()) : [];
    
    const abilitiesWeaknessesText = getElementValue('abilities-weaknesses');
    const abilitiesWeaknesses = abilitiesWeaknessesText ? abilitiesWeaknessesText.split('\n').filter(w => w.trim()) : [];
    
    const valuesText = getElementValue('cultureTraditions-values');
    const values = valuesText ? valuesText.split(',').map(v => v.trim()).filter(v => v) : [];
    
    const clanSayingsText = getElementValue('cultureTraditions-clanSayings');
    const clanSayings = clanSayingsText ? clanSayingsText.split('\n').filter(s => s.trim()) : [];
    
    const battleStrengthsText = getElementValue('combatInfo-battleStrengths');
    const battleStrengths = battleStrengthsText ? battleStrengthsText.split('\n').filter(s => s.trim()) : [];
    
    const battleWeaknessesText = getElementValue('combatInfo-battleWeaknesses');
    const battleWeaknesses = battleWeaknessesText ? battleWeaknessesText.split('\n').filter(w => w.trim()) : [];
    
    const artifactsText = getElementValue('clanSymbols-artifacts');
    const artifacts = artifactsText ? artifactsText.split('\n').filter(a => a.trim()) : [];
    
    const restrictedTechniquesText = getElementValue('optionalExtras-restrictedTechniques');
    const restrictedTechniques = restrictedTechniquesText ? restrictedTechniquesText.split('\n').filter(t => t.trim()) : [];
    
    const moodBoardImagesText = getElementValue('moodBoardImages');
    const moodBoardImages = moodBoardImagesText ? moodBoardImagesText.split('\n').filter(img => img.trim()) : [];
    
    // Get appearsIn checkboxes
    const appearsIn = [];
    appearsInOptions.forEach(option => {
      const checkbox = document.getElementById(`appearsIn-${option}`);
      if (checkbox && checkbox.checked) {
        appearsIn.push(option);
      }
    });
    
    // Get geography branches
    const geographyBranchesText = getElementValue('geography-branches');
    const geographyBranches = geographyBranchesText ? geographyBranchesText.split('\n').filter(b => b.trim()) : [];
    
    const clanData = {
      id: formClan.id,
      name: getElementValue('name'),
      kanji: getElementValue('kanji'),
      meaning: getElementValue('meaning'),
      tagline: getElementValue('tagline'),
      summary: getElementValue('summary'),
      affiliation: getElementValue('affiliation'),
      classification: getElementValue('classification'),
      status: getElementValue('status'),
      village: getElementValue('village'),
      symbol: getElementValue('symbol'),
      debut: {
        manga: getElementValue('debutManga'),
        anime: getElementValue('debutAnime'),
        novel: getElementValue('debutNovel'),
        movie: getElementValue('debutMovie'),
        game: getElementValue('debutGame')
      },
      appearsIn: appearsIn,
      overview: {
        origins: getElementValue('overview-origins'),
        knownFor: getElementValue('overview-knownFor'),
        purpose: getElementValue('overview-purpose'),
        fitInUniverse: getElementValue('overview-fitInUniverse')
      },
      kekkeiGenkai: {
        name: getElementValue('kekkeiGenkai-name'),
        type: getElementValue('kekkeiGenkai-type'),
        classification: getElementValue('kekkeiGenkai-classification'),
        chakraNature: getElementValue('kekkeiGenkai-chakraNature'),
        description: getElementValue('kekkeiGenkai-description'),
        activation: getElementValue('kekkeiGenkai-activation'),
        mechanics: mechanics,
        strengths: kekkeiStrengths,
        weaknesses: kekkeiWeaknesses,
        notableJutsu: notableJutsu
      },
      hiden: {
        name: getElementValue('hiden-name'),
        type: getElementValue('hiden-type'),
        classification: getElementValue('hiden-classification'),
        chakraNature: getElementValue('hiden-chakraNature'),
        description: getElementValue('hiden-description'),
        activation: getElementValue('hiden-activation'),
        mechanics: hidenMechanics,
        strengths: hidenStrengths,
        weaknesses: hidenWeaknesses,
        notableJutsu: hidenNotableJutsu
      },
      clanStructure: {
        clanHead: getElementValue('clanStructure-clanHead'),
        councilElders: getElementValue('clanStructure-councilElders'),
        branchSystem: getElementValue('clanStructure-branchSystem'),
        crestsSeals: getElementValue('clanStructure-crestsSeals'),
        politicalTensions: getElementValue('clanStructure-politicalTensions'),
        lawsRules: getElementValue('clanStructure-lawsRules')
      },
      cultureTraditions: {
        values: values,
        longHeldTraditions: getElementValue('cultureTraditions-longHeldTraditions'),
        clanSayings: clanSayings
      },
      villagePlacement: {
        primaryVillage: getElementValue('villagePlacement-primaryVillage'),
        dutiesAssigned: getElementValue('villagePlacement-dutiesAssigned'),
        relationsWithClans: getElementValue('villagePlacement-relationsWithClans'),
        roleInConflicts: getElementValue('villagePlacement-roleInConflicts')
      },
      combatInfo: {
        signatureWeaponry: getElementValue('combatInfo-signatureWeaponry'),
        battleStrengths: battleStrengths,
        battleWeaknesses: battleWeaknesses
      },
      villagesLands: {
        primaryLocation: getElementValue('villagesLands-primaryLocation') || getElementValue('geography-primaryLocation'),
        branches: branches,
        territory: getElementValue('villagesLands-territory') || getElementValue('geography-territory'),
        reputation: getElementValue('villagesLands-reputation') || getElementValue('geography-reputation')
      },
      geography: {
        primaryLocation: getElementValue('geography-primaryLocation') || getElementValue('villagesLands-primaryLocation'),
        branches: geographyBranches.length > 0 ? geographyBranches : branches,
        territory: getElementValue('geography-territory') || getElementValue('villagesLands-territory'),
        reputation: getElementValue('geography-reputation') || getElementValue('villagesLands-reputation')
      },
      appearancePhysicalTraits: getElementValue('appearancePhysicalTraits'),
      abilities: {
        signatureJutsu: signatureJutsu,
        chakraNatures: {
          primary: getElementValue('abilities-chakraNatures-primary'),
          secondary: getElementValue('abilities-chakraNatures-secondary'),
          rare: getElementValue('abilities-chakraNatures-rare')
        },
        combatStyle: getElementValue('abilities-combatStyle'),
        roleInVillage: getElementValue('abilities-roleInVillage'),
        strengths: abilitiesStrengths,
        weaknesses: abilitiesWeaknesses
      },
      leaders: {
        currentLeader: getElementValue('leaders-currentLeader'),
        pastLeaders: pastLeaders,
        heirs: getElementValue('leaders-heirs')
      },
      notableMembers: notableMembers,
      knownMembers: (() => {
        const membersElement = document.getElementById('members');
        return membersElement ? Array.from(membersElement.selectedOptions).map(opt => opt.value) : [];
      })(),
      ocCreationAllowed: getElementValue('ocCreationAllowed'),
      clanHistory: {
        ancientEra: getElementValue('clanHistory-ancientEra'),
        feudalEra: getElementValue('clanHistory-feudalEra'),
        foundingOfVillages: getElementValue('clanHistory-foundingOfVillages'),
        modernEra: getElementValue('clanHistory-modernEra')
      },
      clanSymbols: {
        clanCrest: getElementValue('clanSymbols-clanCrest'),
        artifacts: artifacts,
        secretKnowledge: getElementValue('clanSymbols-secretKnowledge')
      },
      optionalExtras: {
        bloodlineMutations: getElementValue('optionalExtras-bloodlineMutations'),
        branchFamilySpecialties: getElementValue('optionalExtras-branchFamilySpecialties'),
        clanWeaknessDisease: getElementValue('optionalExtras-clanWeaknessDisease'),
        summoningContractHistory: getElementValue('optionalExtras-summoningContractHistory'),
        restrictedTechniques: restrictedTechniques,
        clanMotto: getElementValue('optionalExtras-clanMotto'),
        clanRankingSystem: getElementValue('optionalExtras-clanRankingSystem'),
        clanArchitecture: getElementValue('optionalExtras-clanArchitecture')
      },
      trivia: getElementValue('trivia'),
      references: getElementValue('references'),
      members: (() => {
        const membersElement = document.getElementById('members');
        return membersElement ? Array.from(membersElement.selectedOptions).map(opt => opt.value) : [];
      })(),
      moodBoardImages: moodBoardImages
    };
    
    onSave(clanData);
  };
  
  return form;
}
