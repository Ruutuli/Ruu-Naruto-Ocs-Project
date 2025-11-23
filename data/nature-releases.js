// Nature Release Data - All nature types with icons, relationships, and metadata

export const natureReleases = {
  // Basic Five Nature Releases
  'Fire Release': {
    name: 'Fire Release',
    kanji: '火',
    romaji: 'Hi',
    iconUrl: 'https://static.wikia.nocookie.net/naruto/images/8/8e/Nature_Icon_Fire.svg/',
    strongAgainst: 'Wind',
    weakAgainst: 'Water',
    type: 'basic',
    description: 'Strong against Wind but weak against Water.'
  },
  'Wind Release': {
    name: 'Wind Release',
    kanji: '風',
    romaji: 'Kaze',
    iconUrl: 'https://static.wikia.nocookie.net/naruto/images/6/6a/Nature_Icon_Wind.svg/',
    strongAgainst: 'Lightning',
    weakAgainst: 'Fire',
    type: 'basic',
    description: 'Strong against Lightning but weak against Fire.'
  },
  'Lightning Release': {
    name: 'Lightning Release',
    kanji: '雷',
    romaji: 'Kaminari',
    iconUrl: 'https://static.wikia.nocookie.net/naruto/images/7/7a/Nature_Icon_Lightning.svg/',
    strongAgainst: 'Earth',
    weakAgainst: 'Wind',
    type: 'basic',
    description: 'Strong against Earth but weak against Wind.'
  },
  'Earth Release': {
    name: 'Earth Release',
    kanji: '土',
    romaji: 'Tsuchi',
    iconUrl: 'https://static.wikia.nocookie.net/naruto/images/5/52/Nature_Icon_Earth.svg/',
    strongAgainst: 'Water',
    weakAgainst: 'Lightning',
    type: 'basic',
    description: 'Strong against Water but weak against Lightning.'
  },
  'Water Release': {
    name: 'Water Release',
    kanji: '水',
    romaji: 'Mizu',
    iconUrl: 'https://static.wikia.nocookie.net/naruto/images/4/4a/Nature_Icon_Water.svg/',
    strongAgainst: 'Fire',
    weakAgainst: 'Earth',
    type: 'basic',
    description: 'Strong against Fire but weak against Earth.'
  },
  
  // Advanced Nature Releases
  'Yin Release': {
    name: 'Yin Release',
    kanji: '陰',
    romaji: 'In',
    iconUrl: 'https://static.wikia.nocookie.net/naruto/images/0/0f/Nature_Icon_Yin.svg/',
    strongAgainst: null,
    weakAgainst: null,
    type: 'advanced',
    description: 'Spiritual energy that creates form from nothingness.'
  },
  'Yang Release': {
    name: 'Yang Release',
    kanji: '陽',
    romaji: 'Yō',
    iconUrl: 'https://static.wikia.nocookie.net/naruto/images/9/9a/Nature_Icon_Yang.svg/',
    strongAgainst: null,
    weakAgainst: null,
    type: 'advanced',
    description: 'Physical energy that gives life to form.'
  },
  
  // Kekkei Genkai - Combination Nature Releases
  'Ice Release': {
    name: 'Ice Release',
    kanji: '氷遁',
    romaji: 'Hyōton',
    iconUrl: 'https://static.wikia.nocookie.net/naruto/images/4/40/Yuki_Symbol.svg',
    components: ['Water', 'Wind'],
    type: 'kekkei-genkai',
    description: 'Combination of Water and Wind Release.'
  },
  'Wood Release': {
    name: 'Wood Release',
    kanji: '木遁',
    romaji: 'Mokuton',
    iconUrl: 'https://static.wikia.nocookie.net/naruto/images/1/1e/Mokuton_Symbol.svg/',
    components: ['Earth', 'Water'],
    type: 'kekkei-genkai',
    description: 'Combination of Earth and Water Release.'
  },
  'Lava Release': {
    name: 'Lava Release',
    kanji: '熔遁',
    romaji: 'Yōton',
    iconUrl: 'https://static.wikia.nocookie.net/naruto/images/9/9c/Lava_Release_Symbol.svg/',
    components: ['Earth', 'Fire'],
    type: 'kekkei-genkai',
    description: 'Combination of Earth and Fire Release.'
  },
  'Boil Release': {
    name: 'Boil Release',
    kanji: '沸遁',
    romaji: 'Futton',
    iconUrl: 'https://static.wikia.nocookie.net/naruto/images/0/0a/Boil_Release_Symbol.svg/',
    components: ['Water', 'Fire'],
    type: 'kekkei-genkai',
    description: 'Combination of Water and Fire Release.'
  },
  'Scorch Release': {
    name: 'Scorch Release',
    kanji: '灼遁',
    romaji: 'Shakuton',
    iconUrl: 'https://static.wikia.nocookie.net/naruto/images/8/8c/Scorch_Release_Symbol.svg/',
    components: ['Fire', 'Wind'],
    type: 'kekkei-genkai',
    description: 'Combination of Fire and Wind Release.'
  },
  'Explosion Release': {
    name: 'Explosion Release',
    kanji: '爆遁',
    romaji: 'Bakuton',
    iconUrl: 'https://static.wikia.nocookie.net/naruto/images/9/9f/Explosion_Release_Symbol.svg/',
    components: ['Earth', 'Lightning'],
    type: 'kekkei-genkai',
    description: 'Combination of Earth and Lightning Release.'
  },
  'Magnet Release': {
    name: 'Magnet Release',
    kanji: '磁遁',
    romaji: 'Jiton',
    iconUrl: 'https://static.wikia.nocookie.net/naruto/images/0/0b/Magnet_Release_Symbol.svg/',
    components: ['Earth', 'Wind'],
    type: 'kekkei-genkai',
    description: 'Combination of Earth and Wind Release.'
  },
  'Swift Release': {
    name: 'Swift Release',
    kanji: '迅遁',
    romaji: 'Jinton',
    iconUrl: 'https://static.wikia.nocookie.net/naruto/images/4/4e/Swift_Release_Symbol.svg/',
    components: ['Wind', 'Lightning'],
    type: 'kekkei-genkai',
    description: 'Combination of Wind and Lightning Release.'
  },
  'Crystal Release': {
    name: 'Crystal Release',
    kanji: '晶遁',
    romaji: 'Shōton',
    iconUrl: 'https://static.wikia.nocookie.net/naruto/images/5/5c/Crystal_Release_Symbol.svg/',
    components: ['Earth', 'Water'],
    type: 'kekkei-genkai',
    description: 'Combination of Earth and Water Release.'
  },
  'Storm Release': {
    name: 'Storm Release',
    kanji: '嵐遁',
    romaji: 'Ranton',
    iconUrl: 'https://static.wikia.nocookie.net/naruto/images/0/0c/Storm_Release_Symbol.svg/',
    components: ['Water', 'Lightning'],
    type: 'kekkei-genkai',
    description: 'Combination of Water and Lightning Release.'
  },
  'Dust Release': {
    name: 'Dust Release',
    kanji: '塵遁',
    romaji: 'Jinton',
    iconUrl: 'https://static.wikia.nocookie.net/naruto/images/8/8d/Dust_Release_Symbol.svg/',
    components: ['Earth', 'Fire', 'Wind'],
    type: 'kekkei-tōta',
    description: 'Combination of Earth, Fire, and Wind Release.'
  },
  'Steel Release': {
    name: 'Steel Release',
    kanji: '鋼遁',
    romaji: 'Kōton',
    iconUrl: 'https://static.wikia.nocookie.net/naruto/images/9/9d/Steel_Release_Symbol.svg/',
    components: ['Earth', 'Lightning'],
    type: 'kekkei-genkai',
    description: 'Combination of Earth and Lightning Release.'
  },
  'Blaze Release': {
    name: 'Blaze Release',
    kanji: '炎遁',
    romaji: 'Enton',
    iconUrl: 'https://static.wikia.nocookie.net/naruto/images/2/2a/Blaze_Release_Symbol.svg/',
    components: ['Fire', 'Yin'],
    type: 'kekkei-genkai',
    description: 'Combination of Fire and Yin Release.'
  },
  'Particle Release': {
    name: 'Particle Release',
    kanji: '粒子遁',
    romaji: 'Ryūshiton',
    iconUrl: 'https://static.wikia.nocookie.net/naruto/images/7/7f/Particle_Release_Symbol.svg/',
    components: ['Earth', 'Wind'],
    type: 'kekkei-genkai',
    description: 'Combination of Earth and Wind Release.'
  }
};

// Helper function to get nature release by name
export function getNatureRelease(name) {
  return natureReleases[name] || null;
}

// Helper function to get all nature release names
export function getAllNatureReleaseNames() {
  return Object.keys(natureReleases);
}

// Helper function to get nature releases by type
export function getNatureReleasesByType(type) {
  return Object.values(natureReleases).filter(nr => nr.type === type);
}

// Note: Clan symbols and other asset URLs are now in data/clan-symbols.js

