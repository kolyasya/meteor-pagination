/**
 * Adds a delay. Useful when need to pause some async operations exectution
 */
export const asyncDelay = (delayMillis) => {
  console.log(`Waiting for ${delayMillis} ms...`);
  return new Promise(resolve => {
    setTimeout(resolve, delayMillis);
  });
};
