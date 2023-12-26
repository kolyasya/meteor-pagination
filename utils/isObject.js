export const isObject = (obj) => {
  if (typeof obj === 'object' && !Array.isArray(obj) && obj !== null) {
    return true;
  }

  return false;
};
