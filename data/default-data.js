// ============================================================================
// ------------------- Default Template Structures -------------------
// ============================================================================

// ------------------- Default OC Template ------------------
// Template structure for Original Character data
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
  
  // Debut Information
  debut: {
    manga: '',
    anime: '',
    novel: '',
    movie: '',
    game: ''
  },
  appearsIn: [], // Array of strings: 'Anime', 'Manga', 'Novel', 'Game', 'Movie'
  
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
  
  // Family Information
  family: {
    father: '',
    mother: '',
    siblings: [],
    otherRelatives: []
  },
  
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
  appearanceByEra: {
    'Part I': {
      description: '',
      clothing: '',
      accessories: '',
      visualMotifs: ''
    },
    'Part II': {
      description: '',
      clothing: '',
      accessories: '',
      visualMotifs: ''
    },
    'Blank Period': {
      description: '',
      clothing: '',
      accessories: '',
      visualMotifs: ''
    },
    'Gaiden': {
      description: '',
      clothing: '',
      accessories: '',
      visualMotifs: ''
    },
    'Boruto': {
      description: '',
      clothing: '',
      accessories: '',
      visualMotifs: ''
    }
  },
  
  // Affiliations
  village: [], // Can be string (backward compatibility) or array
  clanId: null, // Can be string, array, or null
  clanName: null, // Can be string, array, or null
  rank: [], // Can be string (backward compatibility) or array
  classification: [],
  ninjaRegistrationNumber: '',
  teamNumber: '',
  teammates: [],
  sensei: '',
  academyGraduationAge: '',
  madeGenin: '',
  madeChunin: '',
  
  // Abilities & Powers
  natureType: '', // Can be string or array for multiple natures
  kekkeiGenkai: '',
  abilities: {
    taijutsu: [],
    ninjutsu: [],
    genjutsu: [],
    fuinjutsu: []
  },
  chakraPhysicalProwess: {
    chakraReserves: '',
    chakraControl: '',
    strengthFeats: '',
    speedFeats: '',
    taijutsuSkill: '',
    trainingInfluences: ''
  },
  dojutsu: {
    name: '',
    type: '',
    development: '',
    stages: [],
    specialAbilities: []
  },
  intelligence: {
    academicPerformance: '',
    analyticalAbility: '',
    combatStrategy: '',
    leadershipSkill: ''
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
  storyArcs: [], // Array of { name: '', summary: '', keyEvents: [] }
  
  // Other Media
  otherMedia: {
    novel: [],
    game: [],
    ova: [],
    movies: [],
    nonCanon: []
  },
  
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

// ------------------- Default Clan Template ------------------
// Template structure for Clan data
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

// ------------------- Default Story Template ------------------
// Template structure for Story data
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

// ------------------- Default Lore Template ------------------
// Template structure for Lore data
export const defaultLore = {
  id: '',
  title: '',
  category: '',
  content: '',
  relatedOCs: [],
  relatedClans: []
};

// ============================================================================
// ------------------- Helper Functions -------------------
// ============================================================================

// ------------------- Generate ID ------------------
// Generates unique IDs with prefix (e.g., "clanChigiri", "ocAkene", "storyName")
export function generateId(prefix = '', name = '') {
  if (prefix && name) {
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, ''); // Remove special characters
    return prefix + cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  }
  // Fallback: temporary ID for forms (will be replaced when saved)
  return 'temp' + Date.now().toString(36) + Math.random().toString(36).substr(2);
}