let loggerInstance: {
  log: (this: void, ...data: any[]) => void | undefined;
  error: (this: void, ...data: any[]) => void | undefined;
};

const getPackageLogger = function () {
  const packageSettings = {};

  if (!loggerInstance) {
    loggerInstance = {
      log: function () {
        if (packageSettings?.enableLogging) {
          console.log.apply(this, [`Params |`, ...arguments]);
        }
      },

      error: function () {
        console.error.apply(this, [`Params |`, ...arguments]);
      },
    };

    loggerInstance.log('Logger init successful');
  }
  return loggerInstance;
};

export const PackageLogger = () => { console.log('this is the logger') };
