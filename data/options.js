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
    { value: 'Genin', label: 'Genin' },
    { value: 'Chunin', label: 'Chunin' },
    { value: 'Jonin', label: 'Jōnin' },
    { value: 'Special Jonin', label: 'Special Jōnin' },
    { value: 'Kage', label: 'Kage' },
    { value: 'ANBU', label: 'ANBU' },
    { value: 'Root ANBU', label: 'Root ANBU' },
    { value: 'Medical-nin', label: 'Medical-nin' },
    { value: 'Sensor-nin', label: 'Sensor-nin' },
    { value: 'Hunter-nin', label: 'Hunter-nin' },
    { value: 'Missing-nin', label: 'Missing-nin' },
    { value: 'Jinchuriki', label: 'Jinchūriki' },
    { value: 'Samurai', label: 'Samurai' },
    { value: 'Monk', label: 'Monk / Temple Guardian' },
    { value: 'Mercenary', label: 'Mercenary Ninja' },
    { value: 'Spy', label: 'Spy / Infiltrator' },
    { value: 'Researcher', label: 'Researcher / Scientist' },
    { value: 'Civilian', label: 'Civilian' },
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
  