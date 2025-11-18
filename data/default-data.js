// Default template structures for Naruto OC Website

export const defaultOC = {
  id: '',
  lastName: '',
  firstName: '',
  aliases: [],
  dob: '',
  age: 0,
  bloodType: '',
  gender: '',
  chakraType: '',
  village: '',
  rank: '',
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
  identifyingInfo: {
    bodyType: '',
    height: '',
    weight: '',
    madeGenin: '',
    madeChunin: ''
  },
  battleStrategy: {
    inTeam: '',
    alone: '',
    fieldPosition: '',
    effectiveDistance: '',
    specialty: '',
    notableAbilities: ''
  },
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
  abilities: {
    taijutsu: [],
    ninjutsu: []
  },
  knownAssociates: [],
  relationships: [],
  recordHistory: {
    childhood: '',
    adolescence: '',
    adulthood: ''
  },
  appearance: {
    image: '',
    colors: [],
    gear: []
  },
  profileImage: '',
  clanId: null,
  zodiac: '',
  sexualOrientation: '',
  romanticOrientation: '',
  ninjaRegistrationNumber: '',
  academyGraduationAge: '',
  classification: [],
  kekkeiGenkai: '',
  themeSong: '',
  voiceActors: {
    japanese: '',
    english: ''
  },
  fears: [],
  moralAlignment: '',
  mbti: '',
  enneagram: '',
  missions: {
    s: 0,
    a: 0,
    b: 0,
    c: 0,
    d: 0
  },
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

// Helper to generate unique IDs
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

