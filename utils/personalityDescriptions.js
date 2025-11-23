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
 * Get a general explanation of what Enneagram wings mean
 * @returns {string} - Explanation of wings
 */
export function getEnneagramWingExplanation() {
  return 'Wings are the adjacent types on the Enneagram circle that influence your core type. ' +
         'Each type can be influenced by one of its two neighboring types, creating unique variations. ' +
         'For example, a Type 6 with a 5 wing (6w5) combines loyalty with analytical thinking, ' +
         'while a Type 6 with a 7 wing (6w7) combines loyalty with enthusiasm and spontaneity. ' +
         'Wings add depth and nuance to the core type, showing how individuals express their type differently.';
}

/**
 * Get description for Enneagram Type
 * @param {string} enneagram - The enneagram type (e.g., 'Type 6', 'Type 6w5')
 * @returns {string} - Description of the enneagram type
 */
export function getEnneagramDescription(enneagram) {
  // Check for wing types first (specific descriptions)
  const wingDescriptions = {
    // Type 1 wings
    'Type 1w9': 'The Idealist - A perfectionist with a 9 wing. More relaxed and less critical than typical Type 1s. Values harmony and avoids confrontation while maintaining high standards. Idealistic and principled but also peace-loving.',
    'Type 1w2': 'The Advocate - A perfectionist with a 2 wing. More people-oriented and helpful. Combines high moral standards with a desire to serve others. Can be critical but also caring and empathetic.',
    
    // Type 2 wings
    'Type 2w1': 'The Servant - A helper with a 1 wing. More principled and self-controlled. Combines helpfulness with perfectionistic tendencies. Can be critical of themselves and others while being supportive.',
    'Type 2w3': 'The Host - A helper with a 3 wing. More ambitious and image-conscious. Combines helpfulness with achievement orientation. Charismatic and energetic in serving others.',
    
    // Type 3 wings
    'Type 3w2': 'The Charmer - An achiever with a 2 wing. More people-oriented and empathetic. Combines ambition with a desire to help others. Charismatic and relationship-focused in their pursuit of success.',
    'Type 3w4': 'The Professional - An achiever with a 4 wing. More individualistic and authentic. Combines ambition with a desire for uniqueness. More introspective and creative in their achievements.',
    
    // Type 4 wings
    'Type 4w3': 'The Aristocrat - An individualist with a 3 wing. More competitive and image-conscious. Combines authenticity with achievement orientation. More social and expressive while maintaining uniqueness.',
    'Type 4w5': 'The Bohemian - An individualist with a 5 wing. More withdrawn and intellectual. Combines emotional depth with analytical thinking. More private and introspective, less dramatic.',
    
    // Type 5 wings
    'Type 5w4': 'The Iconoclast - An investigator with a 4 wing. More creative and individualistic. Combines intellectualism with emotional depth and artistic expression. More expressive and moody.',
    'Type 5w6': 'The Problem Solver - An investigator with a 6 wing. More practical and security-focused. Combines intellectualism with loyalty and responsibility. More social and collaborative, less isolated.',
    
    // Type 6 wings
    'Type 6w5': 'The Defender - A loyalist with a 5 wing. More intellectual and withdrawn. Combines loyalty and responsibility with analytical thinking. More independent and less anxious, values expertise and knowledge.',
    'Type 6w7': 'The Buddy - A loyalist with a 7 wing. More outgoing and optimistic. Combines loyalty with enthusiasm and adventure-seeking. More social and fun-loving, less anxious and more spontaneous.',
    
    // Type 7 wings
    'Type 7w6': 'The Entertainer - An enthusiast with a 6 wing. More responsible and security-focused. Combines spontaneity with loyalty and commitment. More anxious but also more reliable and relationship-oriented.',
    'Type 7w8': 'The Realist - An enthusiast with an 8 wing. More assertive and direct. Combines spontaneity with power and control. More confrontational and intense, less scattered and more focused.',
    
    // Type 8 wings
    'Type 8w7': 'The Maverick - A challenger with a 7 wing. More spontaneous and fun-loving. Combines assertiveness with enthusiasm and adventure-seeking. More energetic and less serious, quick-tempered but quick to recover.',
    'Type 8w9': 'The Bear - A challenger with a 9 wing. More calm and receptive. Combines assertiveness with peace-making tendencies. More patient and less confrontational, protective and steady.',
    
    // Type 9 wings
    'Type 9w8': 'The Referee - A peacemaker with an 8 wing. More assertive and energetic. Combines peace-making with occasional assertiveness. More direct and action-oriented, less passive.',
    'Type 9w1': 'The Dreamer - A peacemaker with a 1 wing. More principled and idealistic. Combines peace-making with perfectionistic tendencies. More critical and purposeful, less complacent.'
  };
  
  // Check if it's a specific wing type
  if (wingDescriptions[enneagram]) {
    return wingDescriptions[enneagram];
  }
  
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
  
  return descriptions[baseType] || '';
}

