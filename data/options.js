// Centralized dropdown options for all forms

// Villages (simple array for OC form)
export const villages = [
    { value: 'Konoha', label: 'Konohagakure (Hidden Leaf Village)' },
    { value: 'Suna', label: 'Sunagakure (Hidden Sand Village)' },
    { value: 'Kiri', label: 'Kirigakure (Hidden Mist Village)' },
    { value: 'Kumo', label: 'Kumogakure (Hidden Cloud Village)' },
    { value: 'Iwa', label: 'Iwagakure (Hidden Stone Village)' },
    { value: 'Ame', label: 'Amegakure (Hidden Rain Village)' },
    { value: 'Oto', label: 'Otogakure (Hidden Sound Village)' },
    { value: 'Taki', label: 'Takigakure (Hidden Waterfall Village)' },
    { value: 'Yuga', label: 'Yugakure (Hidden Hot Water Village)' },
    { value: 'Hoshi', label: 'Hoshigakure (Hidden Star Village)' },
    { value: 'Kusa', label: 'Kusagakure (Hidden Grass Village)' },
    { value: 'Kumo Outpost', label: 'Kumogakure Outpost / Branch' },
    { value: 'Independent', label: 'Independent / Ronin / Missing-nin' },
    { value: 'Civilian', label: 'No Village (Civilian)' },
    { value: 'Other', label: 'Other / Custom Village' }
  ];
  
  // Ranks
  export const ranks = [
    { value: 'Academy Student', label: 'Academy Student' },
    { value: 'Genin', label: 'Genin' },
    { value: 'Chunin', label: 'Chunin' },
    { value: 'Special Jonin', label: 'Special Jōnin' },
    { value: 'Jonin', label: 'Jōnin' },
    { value: 'ANBU', label: 'ANBU' },
    { value: 'Root ANBU', label: 'Root ANBU' },
    { value: 'Kage', label: 'Kage' },
    { value: 'S-Rank', label: 'S-Rank (Nukenin / Elite)' },
    { value: 'Civilian', label: 'Civilian' },
    { value: 'Other', label: 'Other / Custom Rank' }
  ];
  
  // Zodiac Signs
  export const zodiacSigns = [
    { value: '♈ Aries', label: '♈ Aries (March 21 - April 19)' },
    { value: '♉ Taurus', label: '♉ Taurus (April 20 - May 20)' },
    { value: '♊ Gemini', label: '♊ Gemini (May 21 - June 20)' },
    { value: '♋ Cancer', label: '♋ Cancer (June 21 - July 22)' },
    { value: '♌ Leo', label: '♌ Leo (July 23 - August 22)' },
    { value: '♍ Virgo', label: '♍ Virgo (August 23 - September 22)' },
    { value: '♎ Libra', label: '♎ Libra (September 23 - October 22)' },
    { value: '♏ Scorpio', label: '♏ Scorpio (October 23 - November 21)' },
    { value: '♐ Sagittarius', label: '♐ Sagittarius (November 22 - December 21)' },
    { value: '♑ Capricorn', label: '♑ Capricorn (December 22 - January 19)' },
    { value: '♒ Aquarius', label: '♒ Aquarius (January 20 - February 18)' },
    { value: '♓ Pisces', label: '♓ Pisces (February 19 - March 20)' },
    { value: 'Unknown', label: 'Unknown / Not Specified' }
  ];
  
  // Moral Alignments
  export const moralAlignments = [
    { value: 'Lawful Good', label: 'Lawful Good' },
    { value: 'Neutral Good', label: 'Neutral Good' },
    { value: 'Chaotic Good', label: 'Chaotic Good' },
    { value: 'Lawful Neutral', label: 'Lawful Neutral' },
    { value: 'True Neutral', label: 'True Neutral' },
    { value: 'Chaotic Neutral', label: 'Chaotic Neutral' },
    { value: 'Lawful Evil', label: 'Lawful Evil' },
    { value: 'Neutral Evil', label: 'Neutral Evil' },
    { value: 'Chaotic Evil', label: 'Chaotic Evil' },
    { value: 'Unaligned', label: 'Unaligned / Morally Gray' }
  ];
  
  // MBTI Types (organized by groups)
  export const mbtiTypes = [
    {
      group: 'Analysts',
      options: [
        { value: 'INTJ', label: 'INTJ - Architect' },
        { value: 'INTP', label: 'INTP - Thinker' },
        { value: 'ENTJ', label: 'ENTJ - Commander' },
        { value: 'ENTP', label: 'ENTP - Debater' }
      ]
    },
    {
      group: 'Diplomats',
      options: [
        { value: 'INFJ', label: 'INFJ - Advocate' },
        { value: 'INFP', label: 'INFP - Mediator' },
        { value: 'ENFJ', label: 'ENFJ - Protagonist' },
        { value: 'ENFP', label: 'ENFP - Campaigner' }
      ]
    },
    {
      group: 'Sentinels',
      options: [
        { value: 'ISTJ', label: 'ISTJ - Logistician' },
        { value: 'ISFJ', label: 'ISFJ - Protector' },
        { value: 'ESTJ', label: 'ESTJ - Executive' },
        { value: 'ESFJ', label: 'ESFJ - Consul' }
      ]
    },
    {
      group: 'Explorers',
      options: [
        { value: 'ISTP', label: 'ISTP - Virtuoso' },
        { value: 'ISFP', label: 'ISFP - Adventurer' },
        { value: 'ESTP', label: 'ESTP - Entrepreneur' },
        { value: 'ESFP', label: 'ESFP - Entertainer' }
      ]
    },
    {
      group: 'Other / Unclear',
      options: [
        { value: 'Unknown', label: 'Unknown / Not Tested' },
        { value: 'Mixed', label: 'Mixed / Between Types' }
      ]
    }
  ];
  
  // Enneagram Types (organized by type with wings)
  export const enneagramTypes = [
    {
      group: 'Type 1 - The Perfectionist',
      options: [
        { value: 'Type 1', label: 'Type 1' },
        { value: 'Type 1w9', label: 'Type 1 with 9 Wing' },
        { value: 'Type 1w2', label: 'Type 1 with 2 Wing' }
      ]
    },
    {
      group: 'Type 2 - The Helper',
      options: [
        { value: 'Type 2', label: 'Type 2' },
        { value: 'Type 2w1', label: 'Type 2 with 1 Wing' },
        { value: 'Type 2w3', label: 'Type 2 with 3 Wing' }
      ]
    },
    {
      group: 'Type 3 - The Achiever',
      options: [
        { value: 'Type 3', label: 'Type 3' },
        { value: 'Type 3w2', label: 'Type 3 with 2 Wing' },
        { value: 'Type 3w4', label: 'Type 3 with 4 Wing' }
      ]
    },
    {
      group: 'Type 4 - The Individualist',
      options: [
        { value: 'Type 4', label: 'Type 4' },
        { value: 'Type 4w3', label: 'Type 4 with 3 Wing' },
        { value: 'Type 4w5', label: 'Type 4 with 5 Wing' }
      ]
    },
    {
      group: 'Type 5 - The Investigator',
      options: [
        { value: 'Type 5', label: 'Type 5' },
        { value: 'Type 5w4', label: 'Type 5 with 4 Wing' },
        { value: 'Type 5w6', label: 'Type 5 with 6 Wing' }
      ]
    },
    {
      group: 'Type 6 - The Loyalist',
      options: [
        { value: 'Type 6', label: 'Type 6' },
        { value: 'Type 6w5', label: 'Type 6 with 5 Wing' },
        { value: 'Type 6w7', label: 'Type 6 with 7 Wing' }
      ]
    },
    {
      group: 'Type 7 - The Enthusiast',
      options: [
        { value: 'Type 7', label: 'Type 7' },
        { value: 'Type 7w6', label: 'Type 7 with 6 Wing' },
        { value: 'Type 7w8', label: 'Type 7 with 8 Wing' }
      ]
    },
    {
      group: 'Type 8 - The Challenger',
      options: [
        { value: 'Type 8', label: 'Type 8' },
        { value: 'Type 8w7', label: 'Type 8 with 7 Wing' },
        { value: 'Type 8w9', label: 'Type 8 with 9 Wing' }
      ]
    },
    {
      group: 'Type 9 - The Peacemaker',
      options: [
        { value: 'Type 9', label: 'Type 9' },
        { value: 'Type 9w8', label: 'Type 9 with 8 Wing' },
        { value: 'Type 9w1', label: 'Type 9 with 1 Wing' }
      ]
    },
    {
      group: 'Other / Unclear',
      options: [
        { value: 'Unknown', label: 'Unknown / Not Typed' },
        { value: 'Mixed', label: 'Mixed / Between Types' }
      ]
    }
  ];
  
  // Months (1-12)
  export const months = Array.from({ length: 12 }, (_, i) => {
    const month = String(i + 1).padStart(2, '0');
    const monthName = new Date(2000, i).toLocaleString('en-US', { month: 'long' });
    return { value: month, label: monthName };
  });
  
  // Days (1-31)
  export const days = Array.from({ length: 31 }, (_, i) => {
    const day = String(i + 1).padStart(2, '0');
    return { value: day, label: day };
  });
  
  // Blood Types
  export const bloodTypes = [
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'AB', label: 'AB' },
    { value: 'O', label: 'O' },
    { value: 'Unknown', label: 'Unknown / Not Specified' }
  ];
  
  // Genders
  export const genders = [
    { value: 'Female', label: 'Female' },
    { value: 'Male', label: 'Male' },
    { value: 'Non-binary', label: 'Non-binary' },
    { value: 'Transgender', label: 'Transgender' },
    { value: 'Genderfluid', label: 'Genderfluid' },
    { value: 'Agender', label: 'Agender' },
    { value: 'Other', label: 'Other / Custom' },
    { value: 'Unspecified', label: 'Prefer not to say' }
  ];
  
  // Sexual Orientation
  export const sexualOrientations = [
    { value: 'Heterosexual', label: 'Heterosexual' },
    { value: 'Homosexual', label: 'Homosexual / Gay / Lesbian' },
    { value: 'Bisexual', label: 'Bisexual' },
    { value: 'Pansexual', label: 'Pansexual' },
    { value: 'Asexual', label: 'Asexual' },
    { value: 'Demisexual', label: 'Demisexual' },
    { value: 'Queer', label: 'Queer' },
    { value: 'Questioning', label: 'Questioning' },
    { value: 'Other', label: 'Other / Custom' },
    { value: 'Unspecified', label: 'Prefer not to say' }
  ];
  
  // Romantic Orientation
  export const romanticOrientations = [
    { value: 'Heteroromantic', label: 'Heteroromantic' },
    { value: 'Homoromantic', label: 'Homoromantic' },
    { value: 'Biromantic', label: 'Biromantic' },
    { value: 'Panromantic', label: 'Panromantic' },
    { value: 'Aromantic', label: 'Aromantic' },
    { value: 'Demiromantic', label: 'Demiromantic' },
    { value: 'Other', label: 'Other / Custom' },
    { value: 'Unspecified', label: 'Prefer not to say' }
  ];
  
  // Chakra Types / Affinities
  export const chakraTypes = [
    { value: 'Fire', label: 'Fire Release (Katon)' },
    { value: 'Wind', label: 'Wind Release (Fūton)' },
    { value: 'Lightning', label: 'Lightning Release (Raiton)' },
    { value: 'Earth', label: 'Earth Release (Doton)' },
    { value: 'Water', label: 'Water Release (Suiton)' },
    { value: 'Yin', label: 'Yin Release' },
    { value: 'Yang', label: 'Yang Release' },
    { value: 'Yin–Yang', label: 'Yin–Yang Release' },
    { value: 'Non-elemental', label: 'Non-elemental / Chakra Control' },
    { value: 'Mixed', label: 'Mixed / Multiple Affinities' },
    { value: 'Unknown', label: 'Unknown / Not Tested' }
  ];
  
  // Clan Classifications
  export const clanClassifications = [
    { value: 'Shinobi Clan', label: 'Shinobi Clan' },
    { value: 'Noble Clan', label: 'Noble Clan' },
    { value: 'Cursed Clan', label: 'Cursed Clan' },
    { value: 'Dispersed Clan', label: 'Dispersed Clan' },
    { value: 'Kekkei Genkai Clan', label: 'Kekkei Genkai Clan' },
    { value: 'Merchant Clan', label: 'Merchant Clan' },
    { value: 'Samurai-Aligned Clan', label: 'Samurai-Aligned Clan' },
    { value: 'Medical Clan', label: 'Medical / Healer Clan' },
    { value: 'Religious Clan', label: 'Religious / Shrine Clan' },
    { value: 'Criminal Syndicate', label: 'Criminal Syndicate / Underground' },
    { value: 'Monastic Order', label: 'Monastic / Temple Order' },
    { value: 'Other', label: 'Other / Custom Classification' }
  ];
  
  // Clan Status
  export const clanStatus = [
    { value: 'Active', label: 'Active' },
    { value: 'Nearly extinct', label: 'Nearly extinct' },
    { value: 'Scattered', label: 'Scattered' },
    { value: 'Rebuilding', label: 'Rebuilding' },
    { value: 'In decline', label: 'In decline' },
    { value: 'Destroyed', label: 'Destroyed / Wiped Out' },
    { value: 'Unknown', label: 'Unknown / Rumored' }
  ];
  
  // Ninja Classifications (for "Classification (comma-separated)" helper)
  export const ninjaClassifications = [
    // Basic Ranks
    { value: 'Academy Student', label: 'Academy Student' },
    { value: 'Genin', label: 'Genin' },
    { value: 'Chunin', label: 'Chūnin' },
    { value: 'Jonin', label: 'Jōnin' },
    { value: 'Special Jonin', label: 'Special Jōnin' },
    { value: 'Kage', label: 'Kage' },
    { value: 'S-Rank', label: 'S-Rank (Nukenin / Elite)' },
    
    // Specialized Units
    { value: 'ANBU', label: 'ANBU' },
    { value: 'Root ANBU', label: 'Root ANBU' },
    { value: 'Hunter-nin', label: 'Hunter-nin' },
    { value: 'Medical-nin', label: 'Medical-nin (Iryō-nin)' },
    { value: 'Sensor-nin', label: 'Sensor-nin' },
    { value: 'Barrier Corps', label: 'Barrier Corps' },
    { value: 'Intelligence Agent', label: 'Intelligence Agent' },
    { value: 'Torture & Interrogation', label: 'Torture & Interrogation Specialist' },
    
    // Special Titles
    { value: 'Sannin', label: 'Sannin (Legendary Three)' },
    { value: 'Jinchuriki', label: 'Jinchūriki' },
    { value: 'Sage', label: 'Sage (Sage Mode User)' },
    
    // Technique Specializations
    { value: 'Genjutsu Specialist', label: 'Genjutsu Specialist' },
    { value: 'Taijutsu Specialist', label: 'Taijutsu Specialist' },
    { value: 'Kenjutsu Specialist', label: 'Kenjutsu Specialist' },
    { value: 'Puppet Master', label: 'Puppet Master (Kugutsu Specialist)' },
    { value: 'Sealing Master', label: 'Sealing Master (Fūinjutsu Specialist)' },
    { value: 'Barrier Master', label: 'Barrier Master (Kekkai Specialist)' },
    { value: 'Summoner', label: 'Summoner (Kuchiyose Specialist)' },
    { value: 'Shurikenjutsu Specialist', label: 'Shurikenjutsu Specialist' },
    { value: 'Bukijutsu Specialist', label: 'Bukijutsu Specialist' },
    
    // Status Classifications
    { value: 'Missing-nin', label: 'Missing-nin (Nukenin)' },
    { value: 'Ronin', label: 'Ronin (Masterless Ninja)' },
    { value: 'Mercenary', label: 'Mercenary Ninja' },
    { value: 'Spy', label: 'Spy / Infiltrator' },
    { value: 'Assassin', label: 'Assassin' },
    { value: 'Bodyguard', label: 'Bodyguard' },
    
    // Other Roles
    { value: 'Researcher', label: 'Researcher / Scientist' },
    { value: 'Samurai', label: 'Samurai' },
    { value: 'Monk', label: 'Monk / Temple Guardian' },
    { value: 'Civilian', label: 'Civilian' },
    
    // Custom / Niche Classifications
    { value: 'Fate Reader', label: 'Fate Reader' },
    { value: 'Oracle', label: 'Oracle' },
    { value: 'Seer', label: 'Seer' },
    { value: 'Prophet', label: 'Prophet' },
    { value: 'Diviner', label: 'Diviner' },
    { value: 'Cursed Child', label: 'Cursed Child' },
    { value: 'Vessel', label: 'Vessel' },
    { value: 'Host', label: 'Host' },
    { value: 'Experiment', label: 'Experiment' },
    { value: 'Test Subject', label: 'Test Subject' },
    { value: 'Cursed Seal User', label: 'Cursed Seal User' },
    { value: 'Cursed Mark Bearer', label: 'Cursed Mark Bearer' },
    { value: 'Demon Vessel', label: 'Demon Vessel' },
    { value: 'Spirit Medium', label: 'Spirit Medium' },
    { value: 'Exorcist', label: 'Exorcist' },
    { value: 'Priest', label: 'Priest / Priestess' },
    { value: 'Shrine Maiden', label: 'Shrine Maiden' },
    { value: 'Miko', label: 'Miko' },
    { value: 'Onmyoji', label: 'Onmyōji' },
    { value: 'Yin-Yang Master', label: 'Yin-Yang Master' },
    { value: 'Cursed Technique User', label: 'Cursed Technique User' },
    { value: 'Cursed Energy User', label: 'Cursed Energy User' },
    { value: 'Shaman', label: 'Shaman' },
    { value: 'Necromancer', label: 'Necromancer' },
    { value: 'Spirit User', label: 'Spirit User' },
    { value: 'Demon Slayer', label: 'Demon Slayer' },
    { value: 'Demon Hunter', label: 'Demon Hunter' },
    { value: 'Yokai Hunter', label: 'Yōkai Hunter' },
    { value: 'Oni Slayer', label: 'Oni Slayer' },
    { value: 'Cursed Tool User', label: 'Cursed Tool User' },
    { value: 'Cursed Weapon Wielder', label: 'Cursed Weapon Wielder' },
    { value: 'Seal Master', label: 'Seal Master' },
    { value: 'Cursed Seal Master', label: 'Cursed Seal Master' },
    { value: 'Other', label: 'Other / Custom Classification' }
  ];
  
  // Villages/Lands (complex structure for clan form with optgroups)
  export const villagesLands = [
    {
      group: 'Five Great Shinobi Villages',
      options: [
        { value: 'Konoha', label: 'Konohagakure (Hidden Leaf Village)' },
        { value: 'Suna', label: 'Sunagakure (Hidden Sand Village)' },
        { value: 'Kiri', label: 'Kirigakure (Hidden Mist Village)' },
        { value: 'Kumo', label: 'Kumogakure (Hidden Cloud Village)' },
        { value: 'Iwa', label: 'Iwagakure (Hidden Stone Village)' }
      ]
    },
    {
      group: 'Other Shinobi Villages',
      options: [
        { value: 'Ame', label: 'Amegakure (Hidden Rain Village)' },
        { value: 'Oto', label: 'Otogakure (Hidden Sound Village)' },
        { value: 'Taki', label: 'Takigakure (Hidden Waterfall Village)' },
        { value: 'Yuga', label: 'Yugakure (Hidden Hot Water Village)' },
        { value: 'Hoshi', label: 'Hoshigakure (Hidden Star Village)' },
        { value: 'Kusagakure', label: 'Kusagakure (Hidden Grass Village)' },
        { value: 'Shimogakure', label: 'Shimogakure (Hidden Frost Village)' },
        { value: 'Tanigakure', label: 'Tanigakure (Hidden Valley Village)' },
        { value: 'Uzushiogakure', label: 'Uzushiogakure (Hidden Whirlpool Village)' }
      ]
    },
    {
      group: 'Lands',
      options: [
        { value: 'Land of Fire', label: 'Land of Fire (Hi no Kuni)' },
        { value: 'Land of Wind', label: 'Land of Wind (Kaze no Kuni)' },
        { value: 'Land of Water', label: 'Land of Water (Mizu no Kuni)' },
        { value: 'Land of Lightning', label: 'Land of Lightning (Kaminari no Kuni)' },
        { value: 'Land of Earth', label: 'Land of Earth (Tsuchi no Kuni)' },
        { value: 'Land of Rain', label: 'Land of Rain (Ame no Kuni)' },
        { value: 'Land of Sound', label: 'Land of Sound (Oto no Kuni)' },
        { value: 'Land of Waterfalls', label: 'Land of Waterfalls (Taki no Kuni)' },
        { value: 'Land of Hot Water', label: 'Land of Hot Water (Yu no Kuni)' },
        { value: 'Land of Iron', label: 'Land of Iron (Tetsu no Kuni)' },
        { value: 'Land of Snow', label: 'Land of Snow (Yuki no Kuni)' },
        { value: 'Land of Waves', label: 'Land of Waves (Nami no Kuni)' },
        { value: 'Land of Tea', label: 'Land of Tea (Cha no Kuni)' },
        { value: 'Land of Rice Fields', label: 'Land of Rice Fields (Ta no Kuni)' },
        { value: 'Land of Vegetables', label: 'Land of Vegetables (Ya no Kuni)' },
        { value: 'Land of Bears', label: 'Land of Bears (Kuma no Kuni)' },
        { value: 'Land of Forests', label: 'Land of Forests (Mori no Kuni)' },
        { value: 'Land of Birds', label: 'Land of Birds (Tori no Kuni)' },
        { value: 'Land of Demons', label: 'Land of Demons (Oni no Kuni)' },
        { value: 'Land of Valleys', label: 'Land of Valleys (Tani no Kuni)' },
        { value: 'Land of Rivers', label: 'Land of Rivers (Kawa no Kuni)' },
        { value: 'Land of Keys', label: 'Land of Keys (Kagi no Kuni)' },
        { value: 'Land of Sky', label: 'Land of Sky (Sora no Kuni)' },
        { value: 'Land of Whirlpools', label: 'Land of Whirlpools (Uzushio no Kuni)' },
        { value: 'Land of Honey', label: 'Land of Honey (Mitsu no Kuni)' },
        { value: 'Land of Claws', label: 'Land of Claws (Tsume no Kuni)' },
        { value: 'Land of Storms', label: 'Land of Storms (Arashi no Kuni)' },
        { value: 'Land of Moon', label: 'Land of Moon (Tsuki no Kuni)' }
      ]
    },
    {
      group: 'Other Locations',
      options: [
        { value: 'Mount Myoboku', label: 'Mount Myoboku (Toad Sage Territory)' },
        { value: 'Ryuchi Cave', label: 'Ryuchi Cave (Snake Sage Territory)' },
        { value: 'Shikkotsu Forest', label: 'Shikkotsu Forest (Slug Sage Territory)' },
        { value: 'Other', label: 'Other / Custom Location' }
      ]
    }
  ];
  
  // Kekkei Genkai Types
  export const kekkeiGenkaiTypes = [
    { value: 'Dōjutsu', label: 'Dōjutsu' },
    { value: 'Nature Transformation', label: 'Nature Transformation' },
    { value: 'Holy Art', label: 'Holy Art' },
    { value: 'Cursed Technique', label: 'Cursed Technique' },
    { value: 'Sensory Art', label: 'Sensory Art' },
    { value: 'Clan-only Hiden', label: 'Clan-only Hiden' },
    { value: 'Body Modification', label: 'Body Modification / Augmentation' },
    { value: 'Sealing Art', label: 'Sealing Art (Fūinjutsu)' },
    { value: 'Summoning Contract', label: 'Summoning Contract' },
    { value: 'Other', label: 'Other / Hybrid Ability' }
  ];
  
  // Kekkei Genkai Classifications
  export const kekkeiGenkaiClassifications = [
    { value: 'Kekkei Genkai', label: 'Kekkei Genkai' },
    { value: 'Kekkei Tōta', label: 'Kekkei Tōta' },
    { value: 'Hiden', label: 'Hiden' },
    { value: 'Forbidden Technique', label: 'Forbidden Technique' },
    { value: 'Pseudo-Kekkei Genkai', label: 'Pseudo-Kekkei Genkai / Artificial' }
  ];
  
  // OC Creation Allowed
  export const ocCreationAllowed = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
    { value: 'Ask', label: 'Ask First' },
    { value: 'Restricted', label: 'Restricted (Check Notes)' }
  ];
  
  // Lore Categories
  export const loreCategories = [
    { value: 'village', label: 'Village' },
    { value: 'clan', label: 'Clan' },
    { value: 'organization', label: 'Organization / Faction' },
    { value: 'technique', label: 'Technique / Jutsu' },
    { value: 'history', label: 'History / Timeline' },
    { value: 'world', label: 'World / Geography' },
    { value: 'event', label: 'Event / Arc' },
    { value: 'reference', label: 'Reference / Guide' },
    { value: 'other', label: 'Other / Miscellaneous' }
  ];
  
  // Relationship Status
  export const relationshipStatuses = [
    { value: 'Single', label: 'Single' },
    { value: 'Crushing', label: 'Crushing on Someone' },
    { value: 'In a Relationship', label: 'In a Relationship' },
    { value: 'Engaged', label: 'Engaged' },
    { value: 'Married', label: 'Married' },
    { value: 'Complicated', label: 'It’s Complicated' },
    { value: 'Widowed', label: 'Widowed' },
    { value: 'Other', label: 'Other / Custom' }
  ];
  
  // Helper functions to generate HTML option elements
  
  function escapeHtml(str = '') {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
  
  /**
   * Generate HTML options from a simple array of {value, label} objects
   */
  export function generateOptions(options, selectedValue = '') {
    return options
      .map(opt => {
        const value = escapeHtml(opt.value);
        const label = escapeHtml(opt.label);
        const selected = opt.value === selectedValue ? ' selected' : '';
        return `<option value="${value}"${selected}>${label}</option>`;
      })
      .join('');
  }
  
  /**
   * Generate HTML options with a placeholder at the top
   */
  export function generateOptionsWithPlaceholder(
    options,
    selectedValue = '',
    placeholder = '-- Select --'
  ) {
    const placeholderOption = `<option value="" disabled${selectedValue === '' ? ' selected' : ''}>${escapeHtml(
      placeholder
    )}</option>`;
    return placeholderOption + generateOptions(options, selectedValue);
  }
  
  /**
   * Generate HTML options with optgroups from grouped options
   */
  export function generateGroupedOptions(groupedOptions, selectedValue = '') {
    return groupedOptions
      .map(group => {
        const label = escapeHtml(group.group);
        const options = group.options
          .map(opt => {
            const value = escapeHtml(opt.value);
            const optLabel = escapeHtml(opt.label);
            const selected = opt.value === selectedValue ? ' selected' : '';
            return `<option value="${value}"${selected}>${optLabel}</option>`;
          })
          .join('');
        return `<optgroup label="${label}">${options}</optgroup>`;
      })
      .join('');
  }
  
  /**
   * Generate HTML grouped options with a placeholder at the top-level
   */
  export function generateGroupedOptionsWithPlaceholder(
    groupedOptions,
    selectedValue = '',
    placeholder = '-- Select --'
  ) {
    const placeholderOption = `<option value="" disabled${selectedValue === '' ? ' selected' : ''}>${escapeHtml(
      placeholder
    )}</option>`;
    return placeholderOption + generateGroupedOptions(groupedOptions, selectedValue);
  }
  
  /**
   * Generate HTML datalist options
   */
  export function generateDatalistOptions(options) {
    return options
      .map(opt => {
        const value = escapeHtml(opt.value);
        const label = escapeHtml(opt.label);
        return `<option value="${value}">${label}</option>`;
      })
      .join('');
  }
  
  /**
   * Flatten grouped options into a single [{value,label}] array
   */
  export function flattenGroupedOptions(groupedOptions) {
    return groupedOptions.flatMap(group => group.options);
  }
  
  /**
   * Find an option label by value in a simple options array
   */
  export function findOptionLabel(options, value) {
    const found = options.find(opt => opt.value === value);
    return found ? found.label : '';
  }
  
  /**
   * Find an option label by value in grouped options
   */
  export function findGroupedOptionLabel(groupedOptions, value) {
    for (const group of groupedOptions) {
      const found = group.options.find(opt => opt.value === value);
      if (found) return found.label;
    }
    return '';
  }
  
  // ============================================================================
  // Clan Symbols Data - Clan names directly mapped to their symbol image URLs
  // ============================================================================
  
  // Major Konoha Clans
  export const Uchiha = 'https://static.wikia.nocookie.net/naruto/images/9/9d/Uchiha_Symbol.svg';
  export const Senju = 'https://static.wikia.nocookie.net/naruto/images/0/0f/Senju_Symbol.svg';
  export const Hyūga = 'https://static.wikia.nocookie.net/naruto/images/8/8e/Hyuga_Symbol.svg';
  export const Aburame = 'https://static.wikia.nocookie.net/naruto/images/4/4c/Aburame_Symbol.svg';
  export const Akimichi = 'https://static.wikia.nocookie.net/naruto/images/1/1e/Akimichi_Symbol.svg';
  export const Inuzuka = 'https://static.wikia.nocookie.net/naruto/images/8/8f/Inuzuka_Symbol.svg';
  export const Nara = 'https://static.wikia.nocookie.net/naruto/images/0/0a/Nara_Symbol.svg';
  export const Yamanaka = 'https://static.wikia.nocookie.net/naruto/images/4/4b/Yamanaka_Symbol.svg';
  export const Sarutobi = 'https://static.wikia.nocookie.net/naruto/images/8/8a/Sarutobi_Symbol.svg';
  export const Hatake = 'https://static.wikia.nocookie.net/naruto/images/5/5c/Hatake_Symbol.svg';
  export const Shimura = 'https://static.wikia.nocookie.net/naruto/images/9/9a/Shimura_Symbol.svg';
  export const Fūma = 'https://static.wikia.nocookie.net/naruto/images/8/8b/Fuma_Symbol.svg';
  
  // Kiri Clans
  export const Hōzuki = 'https://static.wikia.nocookie.net/naruto/images/4/4d/Hozuki_Symbol.svg';
  export const Kaguya = 'https://static.wikia.nocookie.net/naruto/images/0/0b/Kaguya_Symbol.svg';
  export const Yuki = 'https://static.wikia.nocookie.net/naruto/images/4/40/Yuki_Symbol.svg';
  export const Terumī = 'https://static.wikia.nocookie.net/naruto/images/5/5f/Terumi_Symbol.svg';
  
  // Kumo Clans
  export const Yotsuki = 'https://static.wikia.nocookie.net/naruto/images/9/9c/Yotsuki_Symbol.svg';
  
  // Iwa Clans
  export const Kamizuru = 'https://static.wikia.nocookie.net/naruto/images/8/8d/Kamizuru_Symbol.svg';
  
  // Suna Clans
  export const Kazekage = 'https://static.wikia.nocookie.net/naruto/images/1/1f/Kazekage_Symbol.svg';
  
  // Otsutsuki Clan
  export const Ōtsutsuki = 'https://static.wikia.nocookie.net/naruto/images/c/cb/%C5%8Ctsutsuki_Symbol.svg';
  
  // Other Notable Clans
  export const Ketsuryūgan = 'https://static.wikia.nocookie.net/naruto/images/6/6a/Ketsuryugan_Symbol.svg';
  export const Fūshin = 'https://static.wikia.nocookie.net/naruto/images/7/7f/Fushin_Symbol.svg';
  
  // Clan symbols object - maps clan names to their symbol URLs
  export const clanSymbols = {
    'Uchiha': Uchiha,
    'Senju': Senju,
    'Hyūga': Hyūga,
    'Aburame': Aburame,
    'Akimichi': Akimichi,
    'Inuzuka': Inuzuka,
    'Nara': Nara,
    'Yamanaka': Yamanaka,
    'Sarutobi': Sarutobi,
    'Hatake': Hatake,
    'Shimura': Shimura,
    'Fūma': Fūma,
    'Hōzuki': Hōzuki,
    'Kaguya': Kaguya,
    'Yuki': Yuki,
    'Terumī': Terumī,
    'Yotsuki': Yotsuki,
    'Kamizuru': Kamizuru,
    'Kazekage': Kazekage,
    'Ōtsutsuki': Ōtsutsuki,
    'Ketsuryūgan': Ketsuryūgan,
    'Fūshin': Fūshin
  };
  
  // Helper function to get clan symbol URL by name
  export function getClanSymbol(clanName) {
    const symbolUrl = clanSymbols[clanName];
    return symbolUrl ? { symbolUrl } : null;
  }
  
  // Helper function to get all clan names
  export function getAllClanNames() {
    return Object.keys(clanSymbols);
  }
  
  // Helper function to get symbol URL by clan name
  export function getClanSymbolUrl(clanName) {
    return clanSymbols[clanName] || '';
  }
  
  // ============================================================================
  // Nature Release Data - All nature types with icons, relationships, and metadata
  // ============================================================================
  
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
  
  // ============================================================================
  // Ninja Technique Types - Comprehensive list of all technique categories
  // ============================================================================
  
  // Main Ninjutsu Categories
  export const ninjutsuTypes = [
    { value: 'Ninjutsu', label: 'Ninjutsu – Ninja Techniques' },
    { value: 'Iryō Ninjutsu', label: 'Iryō Ninjutsu – Medical Techniques' },
    { value: 'Jikūkan Ninjutsu', label: 'Jikūkan Ninjutsu – Space–Time Ninja Techniques' },
    { value: 'Kuchiyose No Jutsu', label: 'Kuchiyose No Jutsu – Summoning' },
    { value: 'Fuinjutsu', label: 'Fuinjutsu – Sealing Techniques' },
    { value: 'Juinjutsu', label: 'Juinjutsu – Cursed Seal Techniques' },
    { value: 'Jujutsu', label: 'Jujutsu - Curse Technique' },
    { value: 'Kekkai Ninjutsu', label: 'Kekkai Ninjutsu – Barrier Ninja Techniques' },
    { value: 'Renkei Ninjutsu', label: 'Renkei Ninjutsu - Collaboration Techniques' },
    { value: 'Tensei Ninjutsu', label: 'Tensei Ninjutsu - Reincarnation Ninja Technique' }
  ];
  
  // Bukijutsu (Weapon Techniques)
  export const bukijutsuTypes = [
    { value: 'Bukijutsu', label: 'Bukijutsu – Weapon Techniques' },
    { value: 'Bojutsu', label: 'Bojutsu – Staff Techniques' },
    { value: 'Kayakujutsu', label: 'Kayakujutsu – Gunpowder Technique (Explosive Tags)' },
    { value: 'Kenjutsu', label: 'Kenjutsu – Sword Technique' },
    { value: 'Kugutsu No Jutsu', label: 'Kugutsu No Jutsu – Puppet Technique' },
    { value: 'Kusarigamajutsu', label: 'Kusarigamajutsu – Chain Sickle Technique' },
    { value: 'Kyujutsu', label: 'Kyujutsu – Bow Technique' },
    { value: 'Shurikenjutsu', label: 'Shurikenjutsu – Projectile Weapons Techniques' },
    { value: 'Tessenjutsu', label: 'Tessenjutsu – Iron-fan Technique' }
  ];
  
  // Other Technique Categories
  export const otherTechniqueTypes = [
    { value: 'Bunshinjutsu', label: 'Bunshinjutsu – Clone Techniques' },
    { value: 'Chakra Kyuin Jutsu', label: 'Chakra Kyuin Jutsu - Chakra Absorption Jutsu' },
    { value: 'Chakura Nagashi', label: 'Chakura Nagashi - Chakra Flow' },
    { value: 'Genjutsu', label: 'Genjutsu - Illusionary Techniques' },
    { value: 'Hiden', label: 'Hiden – Secret Technique' },
    { value: 'Kinjutsu', label: 'Kinjutsu – Forbidden Techniques' },
    { value: 'Nintaijutsu', label: 'Nintaijutsu – Ninja Body Techniques (Combo of Nin And Tai)' },
    { value: 'Senjutsu', label: 'Senjutsu – Sage Techniques' },
    { value: 'Taijutsu', label: 'Taijutsu – Body Techniques' },
    { value: 'Tonjutsu', label: 'Tonjutsu – Escape Techniques' }
  ];
  
  // Bloodline and Eye Techniques
  export const bloodlineTypes = [
    { value: 'Kekkei Genkai', label: 'Kekkei Genkai - Bloodline Limit' },
    { value: 'Kekkei Tota', label: 'Kekkei Tota – Bloodline Selection' },
    { value: 'Kekkei Mora', label: 'Kekkei Mora – Bloodline Encompassing' },
    { value: 'Dojutsu', label: 'Dojutsu – Eye Techniques' }
  ];
  
  // Combined list of all technique types (for dropdowns, etc.)
  export const allTechniqueTypes = [
    ...ninjutsuTypes,
    ...bukijutsuTypes,
    ...otherTechniqueTypes,
    ...bloodlineTypes
  ];
  
  // Technique type groups (for organized display)
  export const techniqueTypeGroups = [
    {
      group: 'Ninjutsu Categories',
      options: ninjutsuTypes
    },
    {
      group: 'Weapon Techniques (Bukijutsu)',
      options: bukijutsuTypes
    },
    {
      group: 'Other Techniques',
      options: otherTechniqueTypes
    },
    {
      group: 'Bloodline & Eye Techniques',
      options: bloodlineTypes
    }
  ];
  
  // Helper function to get technique type label by value
  export function getTechniqueTypeLabel(value) {
    const found = allTechniqueTypes.find(t => t.value === value);
    return found ? found.label : value;
  }
  
  // Helper function to get all technique type values
  export function getAllTechniqueTypeValues() {
    return allTechniqueTypes.map(t => t.value);
  }
  