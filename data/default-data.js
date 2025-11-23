// Default template structures for Naruto OC Website

export const defaultOC = {
  // Basic Information
  id: '',
  lastName: '',
  firstName: '',
  nameJapanese: '',
  lastNameMeaning: '',
  firstNameMeaning: '',
  nameMeaning: '',
  aliases: [],
  profileImage: '',
  
  // Personal Information
  dob: '',
  ageByEra: {
    'Part I': '',
    'Part II': '',
    'Blank Period': '',
    'Gaiden': '',
    'Boruto': ''
  },
  bloodType: '',
  gender: '',
  sexualOrientation: '',
  romanticOrientation: '',
  zodiac: '',
  
  // Physical Appearance
  identifyingInfo: {
    bodyType: ''
  },
  heightByEra: {
    'Part I': '',
    'Part II': '',
    'Blank Period': '',
    'Gaiden': '',
    'Boruto': ''
  },
  weightByEra: {
    'Part I': '',
    'Part II': '',
    'Blank Period': '',
    'Gaiden': '',
    'Boruto': ''
  },
  eyeColor: '',
  hairColor: '',
  distinguishingFeatures: [],
  appearance: {
    image: '',
    colors: [],
    gear: []
  },
  
  // Affiliations
  village: '',
  clanId: null,
  rank: '',
  classification: [],
  ninjaRegistrationNumber: '',
  teamNumber: '',
  teammates: [],
  sensei: '',
  academyGraduationAge: '',
  madeGenin: '',
  madeChunin: '',
  
  // Abilities & Powers
  natureType: '',
  kekkeiGenkai: '',
  abilities: {
    taijutsu: [],
    ninjutsu: []
  },
  stats: {
    intelligence: 0,
    stamina: 0,
    strength: 0,
    speed: 0,
    ninjutsu: 0,
    genjutsu: 0,
    taijutsu: 0,
    handSeals: 0,
    fuinjutsu: 0
  },
  statsByEra: {
    'Part I': {
      intelligence: 0,
      stamina: 0,
      strength: 0,
      speed: 0,
      ninjutsu: 0,
      genjutsu: 0,
      taijutsu: 0,
      handSeals: 0,
      fuinjutsu: 0
    },
    'Part II': {
      intelligence: 0,
      stamina: 0,
      strength: 0,
      speed: 0,
      ninjutsu: 0,
      genjutsu: 0,
      taijutsu: 0,
      handSeals: 0,
      fuinjutsu: 0
    },
    'Blank Period': {
      intelligence: 0,
      stamina: 0,
      strength: 0,
      speed: 0,
      ninjutsu: 0,
      genjutsu: 0,
      taijutsu: 0,
      handSeals: 0,
      fuinjutsu: 0
    },
    'Gaiden': {
      intelligence: 0,
      stamina: 0,
      strength: 0,
      speed: 0,
      ninjutsu: 0,
      genjutsu: 0,
      taijutsu: 0,
      handSeals: 0,
      fuinjutsu: 0
    },
    'Boruto': {
      intelligence: 0,
      stamina: 0,
      strength: 0,
      speed: 0,
      ninjutsu: 0,
      genjutsu: 0,
      taijutsu: 0,
      handSeals: 0,
      fuinjutsu: 0
    }
  },
  
  // Combat Information
  battleStrategy: {
    inTeam: '',
    alone: '',
    fieldPosition: '',
    effectiveDistance: '',
    specialty: '',
    notableAbilities: ''
  },
  missions: {
    s: 0,
    a: 0,
    b: 0,
    c: 0,
    d: 0
  },
  
  // Personality
  personality: {
    likes: [],
    dislikes: [],
    demeanor: {
      charisma: 0,
      extraversion: 0,
      energy: 0,
      empathy: 0,
      impulsivity: 0,
      neuroticism: 0,
      intuition: 0,
      observation: 0,
      sensitivity: 0,
      generosity: 0,
      respectForAuthority: 0
    }
  },
  fears: [],
  moralAlignment: '',
  mbti: '',
  enneagram: '',
  
  // Background & History
  recordHistory: {
    childhood: '',
    adolescence: '',
    adulthood: ''
  },
  relationships: [],
  
  // Miscellaneous
  themeSong: '',
  themeSongLink: '',
  voiceActors: {
    japanese: '',
    english: ''
  },
  quotes: [],
  trivia: '',
  gallery: []
};

export const defaultClan = {
  id: '',
  name: '',
  kanji: '',
  meaning: '',
  symbol: '',
  tagline: '',
  summary: '',
  affiliation: '',
  classification: '',
  status: '',
  village: '',
  overview: {
    origins: '',
    knownFor: '',
    purpose: '',
    fitInUniverse: ''
  },
  kekkeiGenkai: {
    name: '',
    type: '',
    classification: '',
    chakraNature: '',
    description: '',
    activation: '',
    mechanics: [],
    strengths: [],
    weaknesses: [],
    notableJutsu: []
  },
  clanStructure: {
    clanHead: '',
    councilElders: '',
    branchSystem: '',
    crestsSeals: '',
    politicalTensions: '',
    lawsRules: ''
  },
  cultureTraditions: {
    values: [],
    longHeldTraditions: '',
    clanSayings: []
  },
  villagePlacement: {
    primaryVillage: '',
    dutiesAssigned: '',
    relationsWithClans: '',
    roleInConflicts: ''
  },
  combatInfo: {
    signatureWeaponry: '',
    battleStrengths: [],
    battleWeaknesses: []
  },
  villagesLands: {
    primaryLocation: '',
    branches: [],
    territory: '',
    reputation: ''
  },
  appearancePhysicalTraits: '',
  abilities: {
    signatureJutsu: [],
    chakraNatures: {
      primary: '',
      secondary: '',
      rare: ''
    },
    combatStyle: '',
    roleInVillage: '',
    strengths: [],
    weaknesses: []
  },
  leaders: {
    currentLeader: '',
    pastLeaders: [],
    heirs: ''
  },
  notableMembers: [],
  ocCreationAllowed: 'Ask',
  clanHistory: {
    ancientEra: '',
    feudalEra: '',
    foundingOfVillages: '',
    modernEra: ''
  },
  clanSymbols: {
    artifacts: [],
    secretKnowledge: ''
  },
  optionalExtras: {
    bloodlineMutations: '',
    branchFamilySpecialties: '',
    clanWeaknessDisease: '',
    summoningContractHistory: '',
    restrictedTechniques: [],
    clanMotto: '',
    clanRankingSystem: '',
    clanArchitecture: ''
  },
  trivia: '',
  references: '',
  members: [],
  moodBoardImages: []
};

export const defaultStory = {
  id: '',
  title: '',
  summary: '',
  content: '',
  author: '',
  characters: [],
  tags: [],
  createdAt: '',
  updatedAt: ''
};

export const defaultLore = {
  id: '',
  title: '',
  category: '',
  content: '',
  relatedOCs: [],
  relatedClans: []
};

// Helper to generate unique IDs with prefix
// New format: prefix + Name (e.g., "clanChigiri", "ocAkene", "storyName")
export function generateId(prefix = '', name = '') {
  if (prefix && name) {
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, ''); // Remove special characters
    return prefix + cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  }
  // Fallback: temporary ID for forms (will be replaced when saved)
  return 'temp' + Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Migration helper to convert old OC data format to new format
export function migrateOCData(oldOC) {
  if (!oldOC) return oldOC;
  
  const migrated = { ...oldOC };
  
  // Migrate age: convert string format to ageByEra object
  if (typeof migrated.age === 'string' && migrated.age && (!migrated.ageByEra || Object.keys(migrated.ageByEra).length === 0)) {
    const eras = ['Part I', 'Part II', 'Blank Period', 'Gaiden', 'Boruto'];
    migrated.ageByEra = migrated.ageByEra || {};
    
    // Try to parse age string like "Part I: 12-13, Part II: 15-17"
    eras.forEach(era => {
      const escapedEra = era.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const match = migrated.age.match(new RegExp(`${escapedEra}:\\s*([^,]+)`));
      if (match && match[1]) {
        migrated.ageByEra[era] = match[1].trim();
      }
    });
    
    // If ageByEra is still empty, try to parse common formats
    if (Object.keys(migrated.ageByEra).length === 0 && migrated.age) {
      // Simple fallback - store as Part I age if single value
      migrated.ageByEra['Part I'] = migrated.age.toString();
    }
  }
  
  // Migrate height/weight: convert from identifyingInfo.height/weight strings to heightByEra/weightByEra
  if (migrated.identifyingInfo) {
    // Migrate height
    if (typeof migrated.identifyingInfo.height === 'string' && migrated.identifyingInfo.height && 
        (!migrated.heightByEra || Object.keys(migrated.heightByEra).length === 0)) {
      const eras = ['Part I', 'Part II', 'Blank Period', 'Gaiden', 'Boruto'];
      migrated.heightByEra = migrated.heightByEra || {};
      
      eras.forEach(era => {
        const escapedEra = era.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Try format: "148.5 cm (Part I), 161 cm (Part II)"
        const match1 = migrated.identifyingInfo.height.match(new RegExp(`([^,]+)\\s*\\(${escapedEra}\\)`));
        // Try format: "Part I: 148.5 cm, Part II: 161 cm"
        const match2 = migrated.identifyingInfo.height.match(new RegExp(`${escapedEra}:\\s*([^,]+)`));
        
        if (match1 && match1[1]) {
          migrated.heightByEra[era] = match1[1].trim();
        } else if (match2 && match2[1]) {
          migrated.heightByEra[era] = match2[1].trim();
        }
      });
    }
    
    // Migrate weight
    if (typeof migrated.identifyingInfo.weight === 'string' && migrated.identifyingInfo.weight &&
        (!migrated.weightByEra || Object.keys(migrated.weightByEra).length === 0)) {
      const eras = ['Part I', 'Part II', 'Blank Period', 'Gaiden', 'Boruto'];
      migrated.weightByEra = migrated.weightByEra || {};
      
      eras.forEach(era => {
        const escapedEra = era.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const match1 = migrated.identifyingInfo.weight.match(new RegExp(`([^,]+)\\s*\\(${escapedEra}\\)`));
        const match2 = migrated.identifyingInfo.weight.match(new RegExp(`${escapedEra}:\\s*([^,]+)`));
        
        if (match1 && match1[1]) {
          migrated.weightByEra[era] = match1[1].trim();
        } else if (match2 && match2[1]) {
          migrated.weightByEra[era] = match2[1].trim();
        }
      });
    }
    
    // Migrate madeGenin/madeChunin from identifyingInfo to top level
    if (migrated.identifyingInfo.madeGenin && !migrated.madeGenin) {
      migrated.madeGenin = migrated.identifyingInfo.madeGenin;
    }
    if (migrated.identifyingInfo.madeChunin && !migrated.madeChunin) {
      migrated.madeChunin = migrated.identifyingInfo.madeChunin;
    }
    
    // Clean up identifyingInfo - remove old height/weight strings if they've been migrated
    if (migrated.heightByEra && Object.keys(migrated.heightByEra).length > 0) {
      delete migrated.identifyingInfo.height;
    }
    if (migrated.weightByEra && Object.keys(migrated.weightByEra).length > 0) {
      delete migrated.identifyingInfo.weight;
    }
    if (migrated.madeGenin) {
      delete migrated.identifyingInfo.madeGenin;
    }
    if (migrated.madeChunin) {
      delete migrated.identifyingInfo.madeChunin;
    }
  }
  
  // Migrate knownAssociates to relationships
  if (migrated.knownAssociates && migrated.knownAssociates.length > 0) {
    if (!migrated.relationships) {
      migrated.relationships = [];
    }
    
    // Merge knownAssociates into relationships if they don't already exist
    migrated.knownAssociates.forEach(assoc => {
      const exists = migrated.relationships.some(rel => 
        (rel.name || rel.character || rel.fullName) === (assoc.name || assoc.character || assoc.fullName)
      );
      
      if (!exists) {
        // Convert knownAssociate format to relationship format
        migrated.relationships.push({
          name: assoc.name || assoc.character || assoc.fullName || '',
          relationshipType: assoc.relationshipType || assoc.type || 'Associate',
          image: assoc.image || assoc.icon || '',
          heartChart: assoc.heartChart || '',
          description: assoc.description || ''
        });
      }
    });
    
    // Remove knownAssociates after migration
    delete migrated.knownAssociates;
  }
  
  // Migrate chakraType to natureType
  if (migrated.chakraType && !migrated.natureType) {
    migrated.natureType = migrated.chakraType;
    delete migrated.chakraType;
  }
  
  // Ensure new fields exist with defaults
  if (!migrated.eyeColor) migrated.eyeColor = '';
  if (!migrated.hairColor) migrated.hairColor = '';
  if (!migrated.distinguishingFeatures) migrated.distinguishingFeatures = [];
  if (!migrated.teamNumber) migrated.teamNumber = '';
  if (!migrated.teammates) migrated.teammates = [];
  if (!migrated.sensei) migrated.sensei = '';
  if (!migrated.quotes) migrated.quotes = [];
  if (!migrated.trivia) migrated.trivia = '';
  if (!migrated.relationships) migrated.relationships = [];
  
  return migrated;
}

