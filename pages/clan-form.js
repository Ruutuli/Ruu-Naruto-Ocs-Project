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
        <h3 class="mb-3" style="border-bottom: 2px solid var(--color-accent-2); padding-bottom: 0.5rem;"><i class="fas fa-info-circle"></i> Basic Information</h3>
        
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
        
        <h3 class="mb-3 mt-4" style="border-bottom: 2px solid var(--color-accent-2); padding-bottom: 0.5rem;"><i class="fas fa-book-open"></i> Overview</h3>
        
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
        
        <h3 class="mb-3 mt-4" style="border-bottom: 2px solid var(--color-accent-2); padding-bottom: 0.5rem;"><i class="fas fa-eye"></i> Kekkei Genkai / Hiden Techniques</h3>
        
        <div class="form-group">
          <label class="form-label">Name</label>
          <input type="text" class="form-control" id="kekkeiGenkai-name" value="${getValue('kekkeiGenkai.name')}" placeholder="Name of the Kekkei Genkai or Hiden">
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
        
        <h3 class="mb-3 mt-4" style="border-bottom: 2px solid var(--color-accent-2); padding-bottom: 0.5rem;"><i class="fas fa-sitemap"></i> Clan Structure & Governance</h3>
        
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
        
        <h3 class="mb-3 mt-4" style="border-bottom: 2px solid var(--color-accent-2); padding-bottom: 0.5rem;"><i class="fas fa-torii-gate"></i> Culture & Traditions</h3>
        
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
        
        <h3 class="mb-3 mt-4" style="border-bottom: 2px solid var(--color-accent-2); padding-bottom: 0.5rem;"><i class="fas fa-map-marked-alt"></i> Village & Politics</h3>
        
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
        
        <div class="form-group">
          <label class="form-label">Primary Location</label>
          <textarea class="form-control" id="villagesLands-primaryLocation" rows="3" placeholder="Describe the clan's primary geographical location or homeland.">${getValue('villagesLands.primaryLocation')}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Branches in Other Villages (one per line, format: Branch Name — specialization)</label>
          <textarea class="form-control" id="villagesLands-branches" rows="4" placeholder="Branch A — (specialization)&#10;Branch B — (specialization)&#10;Branch C — (specialization)">${getArrayValue('villagesLands.branches').join('\n')}</textarea>
          <small class="form-text text-muted">Geographical dispersion - branches located in other villages.</small>
        </div>
        
        <div class="form-group">
          <label class="form-label">Territory & Influence</label>
          <textarea class="form-control" id="villagesLands-territory" rows="3" placeholder="Describe political influence, neutrality, alliances, or territorial history.">${getValue('villagesLands.territory')}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Reputation</label>
          <textarea class="form-control" id="villagesLands-reputation" rows="3" placeholder="How other clans/villages perceive them.">${getValue('villagesLands.reputation')}</textarea>
        </div>
        
        <h3 class="mb-3 mt-4" style="border-bottom: 2px solid var(--color-accent-2); padding-bottom: 0.5rem;"><i class="fas fa-user"></i> Appearance / Physical Traits</h3>
        
        <div class="form-group">
          <label class="form-label">Appearance / Physical Traits</label>
          <textarea class="form-control" id="appearancePhysicalTraits" rows="8" placeholder="Insert shared traits: Hair colors, eye colors, skin tones, height/build, distinctive markings or features, clan symbols or patterns, official color palette, clothing style. Include hairstyle norms, accessories, or features that hint at lineage.">${getValue('appearancePhysicalTraits')}</textarea>
        </div>
        
        <h3 class="mb-3 mt-4" style="border-bottom: 2px solid var(--color-accent-2); padding-bottom: 0.5rem;"><i class="fas fa-magic"></i> Clan Jutsu & Abilities</h3>
        
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
        
        <h3 class="mb-3 mt-4" style="border-bottom: 2px solid var(--color-accent-2); padding-bottom: 0.5rem;"><i class="fas fa-sword"></i> Combat Information</h3>
        
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
        
        <h3 class="mb-3 mt-4" style="border-bottom: 2px solid var(--color-accent-2); padding-bottom: 0.5rem;"><i class="fas fa-crown"></i> Leaders</h3>
        
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
        
        <h3 class="mb-3 mt-4" style="border-bottom: 2px solid var(--color-accent-2); padding-bottom: 0.5rem;"><i class="fas fa-users"></i> Notable Clan Members</h3>
        
        <div class="form-group">
          <label class="form-label">Notable Clan Members (one per line)</label>
          <textarea class="form-control" id="notableMembers" rows="4" placeholder="List important OCs/NPCs, one per line. Add small blurbs later if needed.">${getArrayValue('notableMembers').join('\n')}</textarea>
        </div>
        
        <h3 class="mb-3 mt-4" style="border-bottom: 2px solid var(--color-accent-2); padding-bottom: 0.5rem;"><i class="fas fa-scroll"></i> Clan History</h3>
        
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
        
        
        <h3 class="mb-3 mt-4" style="border-bottom: 2px solid var(--color-accent-2); padding-bottom: 0.5rem;">🏺 Symbols, Artifacts & Secrets</h3>
        
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
        
        <h3 class="mb-3 mt-4" style="border-bottom: 2px solid var(--color-accent-2); padding-bottom: 0.5rem;"><i class="fas fa-puzzle-piece"></i> Optional Extra Sections</h3>
        
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
        
        <h3 class="mb-3 mt-4" style="border-bottom: 2px solid var(--color-accent-2); padding-bottom: 0.5rem;">Additional Information</h3>
        
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
        
        <div class="form-group">
          <label class="form-label">Clan Members (OC IDs)</label>
          <select class="form-control" id="members" multiple size="8">
            ${ocs.map(oc => `
              <option value="${oc.id}" ${(formClan.members || []).includes(oc.id) ? 'selected' : ''}>
                ${oc.firstName} ${oc.lastName} - ${oc.rank}
              </option>
            `).join('')}
          </select>
          <small>Hold Ctrl/Cmd to select multiple members</small>
        </div>
        
        <h3 class="mb-3 mt-4" style="border-bottom: 2px solid var(--color-accent-2); padding-bottom: 0.5rem;"><i class="fas fa-images"></i> Aesthetic Mood Board</h3>
        
        <div class="form-group">
          <label class="form-label">Mood Board Images (one URL per line)</label>
          <textarea class="form-control" id="moodBoardImages" rows="6" placeholder="Enter image URLs, one per line. These will be displayed in an aesthetic mood board layout on the clan detail page.&#10;Example:&#10;https://example.com/image1.jpg&#10;https://example.com/image2.jpg">${getArrayValue('moodBoardImages').join('\n')}</textarea>
          <small class="form-text text-muted">Add image URLs to create a visual mood board for the clan's aesthetic. Images will be displayed in a Pinterest-style grid layout.</small>
        </div>
        
        <div class="mt-4">
          <button type="submit" class="btn-naruto">${isEdit ? 'Update' : 'Create'} Clan</button>
          <button type="button" class="btn-naruto btn-naruto-secondary" onclick="window.navigateTo('clans')" style="margin-left: 0.5rem;">Cancel</button>
        </div>
      </form>
    </div>
  `;
  
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
        primaryLocation: getElementValue('villagesLands-primaryLocation'),
        branches: branches,
        territory: getElementValue('villagesLands-territory'),
        reputation: getElementValue('villagesLands-reputation')
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
