/**
 * Simple check that provided object is a real object
 */
export const isObject = (obj) => {
  if (typeof obj === 'object' && !Array.isArray(obj) && obj !== null) {
    return true;
  }

  return false;
};
