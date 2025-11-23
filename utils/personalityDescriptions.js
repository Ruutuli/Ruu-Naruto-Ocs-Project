// Personality Type Descriptions - Helper functions to get descriptions for personality types

/**
 * Get description for Moral Alignment
 * @param {string} alignment - The moral alignment value
 * @returns {string} - Description of the alignment
 */
export function getMoralAlignmentDescription(alignment) {
  const descriptions = {
    'Lawful Good': 'Acts as a good person is expected or required to act. Combines a commitment to oppose evil with the discipline to fight relentlessly.',
    'Neutral Good': 'Does the best that a good person can do. They\'re devoted to helping others but prefer not to be bound by laws or conventions.',
    'Chaotic Good': 'Acts as their conscience directs with little regard for what others expect. They value their own liberty but also the good of others.',
    'Lawful Neutral': 'Acts according to law, tradition, or personal codes. They believe in order, organization, and tradition, but may not have strong moral convictions.',
    'True Neutral': 'Neutral on both axes, tending to avoid moral questions entirely or do whatever seems best at the time. They value balance above all.',
    'Chaotic Neutral': 'Follows their whims, valuing their own liberty but not bound by any commitment to others. They are unpredictable and independent.',
    'Lawful Evil': 'Cunningly and methodically takes what they want within the limits of their code of conduct without regard for others. They value order but use it for their own ends.',
    'Neutral Evil': 'Does whatever they can get away with. They\'re committed to advancing their own interests without regard for law or morality.',
    'Chaotic Evil': 'Does whatever their greed, hatred, and lust for destruction drive them to do. They are violently destructive and unpredictable.',
    'Unaligned': 'Does not fit into standard moral categories or rejects the alignment system entirely. Often morally complex or gray in nature.'
  };
  
  return descriptions[alignment] || '';
}

/**
 * Get description for MBTI Type
 * @param {string} mbti - The MBTI type (e.g., 'ESFP', 'INTJ')
 * @returns {string} - Description of the MBTI type
 */
export function getMBTIDescription(mbti) {
  const descriptions = {
    'INTJ': 'The Architect - Imaginative and strategic thinkers, with a plan for everything. Independent and decisive.',
    'INTP': 'The Thinker - Innovative inventors with an unquenchable thirst for knowledge. Logical and curious.',
    'ENTJ': 'The Commander - Bold, imaginative, and strong-willed leaders. Always finding a way forward.',
    'ENTP': 'The Debater - Smart and curious thinkers who cannot resist an intellectual challenge. Quick-witted and bold.',
    'INFJ': 'The Advocate - Creative and insightful, inspired and independent. Idealistic and principled.',
    'INFP': 'The Mediator - Poetic, kind, and altruistic people. Always eager to help a good cause.',
    'ENFJ': 'The Protagonist - Charismatic and inspiring leaders. Natural-born leaders with a passion for helping others.',
    'ENFP': 'The Campaigner - Enthusiastic, creative, and sociable free spirits. Always finding reasons to smile.',
    'ISTJ': 'The Logistician - Practical and fact-minded, reliable and responsible. Organized and detail-oriented.',
    'ISFJ': 'The Protector - Very dedicated and warm protectors. Always ready to defend their loved ones.',
    'ESTJ': 'The Executive - Excellent administrators, unsurpassed at managing things or people. Organized and practical.',
    'ESFJ': 'The Consul - Extraordinarily caring, social, and popular people. Always eager to help others.',
    'ISTP': 'The Virtuoso - Bold and practical experimenters, masters of all kinds of tools. Logical and practical.',
    'ISFP': 'The Adventurer - Flexible and charming, always ready to explore new possibilities. Creative and spontaneous.',
    'ESTP': 'The Entrepreneur - Smart, energetic, and very perceptive people. Bold and practical.',
    'ESFP': 'The Entertainer - Spontaneous, energetic, and enthusiastic people. Life is never boring around them.',
    'Unknown': 'Not tested or unclear type.',
    'Mixed': 'Does not clearly fit into a single type or falls between types.'
  };
  
  return descriptions[mbti] || '';
}

/**
 * Get description for Enneagram Type
 * @param {string} enneagram - The enneagram type (e.g., 'Type 6', 'Type 6w5')
 * @returns {string} - Description of the enneagram type
 */
export function getEnneagramDescription(enneagram) {
  // Extract base type from wing variants (e.g., "Type 6w5" -> "Type 6")
  const baseType = enneagram.match(/Type (\d+)/)?.[0] || enneagram;
  
  const descriptions = {
    'Type 1': 'The Perfectionist - Principled, purposeful, self-controlled, and perfectionistic. Strive to improve themselves and the world around them.',
    'Type 2': 'The Helper - Caring, interpersonal, demonstrative, generous, and manipulative. Desire to be loved and appreciated.',
    'Type 3': 'The Achiever - Adaptive, excelling, driven, and image-conscious. Motivated by the need to succeed and be admired.',
    'Type 4': 'The Individualist - Introspective, romantic, expressive, dramatic, and self-absorbed. Long to be unique and authentic.',
    'Type 5': 'The Investigator - Intense, cerebral, perceptive, innovative, secretive, and isolated. Seek understanding and knowledge.',
    'Type 6': 'The Loyalist - Engaging, responsible, anxious, and suspicious. Seek security and support from others or systems.',
    'Type 7': 'The Enthusiast - Spontaneous, versatile, acquisitive, and scattered. Seek to maintain their happiness and satisfaction.',
    'Type 8': 'The Challenger - Self-confident, decisive, willful, and confrontational. Seek to be self-reliant and in control.',
    'Type 9': 'The Peacemaker - Receptive, reassuring, complacent, and resigned. Seek to create harmony and avoid conflict.',
    'Unknown': 'Not typed or unclear type.',
    'Mixed': 'Does not clearly fit into a single type or falls between types.'
  };
  
  let description = descriptions[baseType] || '';
  
  // Add wing information if present
  const wingMatch = enneagram.match(/w(\d+)/);
  if (wingMatch && description) {
    const wingNum = wingMatch[1];
    description += ` Has a ${wingNum} wing, blending characteristics of both types.`;
  }
  
  return description;
}

