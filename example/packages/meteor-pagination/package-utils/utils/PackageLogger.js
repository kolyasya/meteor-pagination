/** @type {import('../types').PackageLoggerInstance} */
let loggerInstance;

/**
 * Overrides default console log, warn and error messages to insert `prefix`
 * So any message will be printed like: `${logPrefix}` + `message`
 * This is to distinguish package logs easily in terminal
 * @type {import('../types').PackageLogger}
 * @return {import('../types').PackageLoggerInstance}
 * */
export const PackageLogger = ({
  enableLogging = true,
  logPrefix = 'Package |'
} = {}) => {
  if (!loggerInstance) {
    loggerInstance = {
      log: function () {
        if (enableLogging) {
          console.log.apply(this, [
            logPrefix,
            ...Array.prototype.slice.call(arguments)
          ]);
        }
      },

      error: function () {
        console.error.apply(this, [
          logPrefix,
          ...Array.prototype.slice.call(arguments)
        ]);
      },

      warn: function () {
        console.warn.apply(this, [
          logPrefix,
          ...Array.prototype.slice.call(arguments)
        ]);
      }
    };

    loggerInstance.log('PackageLogger initiated successfully');
  }

  return loggerInstance;
};
