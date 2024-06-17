/**
 * Overrides default console log, warn and error messages to insert `prefix`
 * So any message will be printed like: `${logPrefix}` + `message`
 * This is to distinguish package logs easily in terminal
 */
export class PackageLogger {
  /**
   * @param {Object} [options={}]
   * @param {boolean} [options.enableLogging=true] - Whether logging is enabled.
   * @param {string} [options.logPrefix='Package |'] - The prefix for log messages.
   */
  constructor ({ enableLogging = true, logPrefix = 'Package |' } = {}) {
    /**
     * Whether logging is enabled.
     * @type {boolean}
     */
    this.enableLogging = enableLogging;

    /**
     * The prefix for log messages.
     * @type {string}
     */
    this.logPrefix = logPrefix;

    this.log('PackageLogger initiated successfully');
  }

  /**
   * Log a message if logging is enabled.
   * @param {...any} args - The messages or objects to log.
   */
  log (...args) {
    if (this.enableLogging) {
      console.log(this.logPrefix, ...args);
    }
  }

  /**
   * Log an error message.
   * @param {...any} args - The messages or objects to log as an error.
   */
  error (...args) {
    console.error(this.logPrefix, ...args);
  }

  /**
   * Log a warning message.
   * @param {...any} args - The messages or objects to log as a warning.
   */
  warn (...args) {
    console.warn(this.logPrefix, ...args);
  }
}
