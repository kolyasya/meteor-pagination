let loggerInstance = undefined;

const getPublishPaginatedLogger = function ({
  paginationParams,
  defaultPaginationParams,
} = {}) {
  if (!loggerInstance) {
    loggerInstance = function () {
      if (
        paginationParams?.enableLogging ||
        defaultPaginationParams?.enableLogging
      ) {
        console.log.apply(this, [
          `Publish Paginated | ${paginationParams.name} |`,
          ...arguments,
        ]);
      }
    };
    loggerInstance('Logger init successful');
  }
  return loggerInstance;
};

export default getPublishPaginatedLogger;
