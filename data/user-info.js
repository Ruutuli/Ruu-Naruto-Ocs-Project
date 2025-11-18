// User/Author Information - Ruu's Personal Info

export const userInfo = {
  name: 'Ruu',
  pronouns: 'She/Her',
  age: '30+',
  sign: 'Virgo',
  timezone: 'EST'
};

// Function to update user info (for future use)
export function updateUserInfo(info) {
  Object.assign(userInfo, info);
  // Could save to localStorage if needed
}

