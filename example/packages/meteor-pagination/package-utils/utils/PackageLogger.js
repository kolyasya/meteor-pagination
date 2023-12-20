/** @type {PackageLoggerInstance} */
let loggerInstance;

/**
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
    };

    loggerInstance.log('PackageLogger inited successfully');
  }
  
  return loggerInstance;
};
