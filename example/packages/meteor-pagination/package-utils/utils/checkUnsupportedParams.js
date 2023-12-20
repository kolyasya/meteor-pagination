import pullall from 'lodash.pullall';

/**
 * Checks if some params passed to a package is not supported
 * Works by comparison with set of default params
 * @type {CheckUnsupportedParams}
 * */
export const checkUnsupportedParams = ({
  params,
  defaultParams,
  onUnsupportedParams,
  logger,
}) => {
  if (!logger) {
    logger = console;
  }

  logger.log('Checking unsupported params...');

  const unsupportedParams = pullall(
    Object.keys(params),
    Object.keys(defaultParams)
  );

  if (unsupportedParams?.length) {
    if (typeof onUnsupportedParams === 'function') {
      onUnsupportedParams({ unsupportedParams });
    } else {
      logger.warn(`Unsupported params: ${unsupportedParams}`);
    }
  }

  logger.log('Checked unsupported params!');
};
