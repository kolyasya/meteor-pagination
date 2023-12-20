/** @type {PackageLoggerInstance} */
let loggerInstance;

/**
 * Overrides default console .log and .error messages to insert `prefix`
 * So any message will be printed like: `${logPrefix}` + `message`
 * @type {PackageLogger}
 * @return {PackageLoggerInstance}
 * */
export const PackageLogger = ({
  enableLogging = true,
  logPrefix = 'Package |',
}) => {
  if (!loggerInstance) {
    loggerInstance = {
      log: function () {
        if (enableLogging) {
          console.log.apply(this, [logPrefix, ...arguments]);
        }
      },

      error: function () {
        console.error.apply(this, [logPrefix, ...arguments]);
      },

      warn: function () {
        console.warn.apply(this, [logPrefix, ...arguments]);
      },
    };

    loggerInstance.log('PackageLogger inited successfully');
  }
  
  return loggerInstance;
};
