type PackageLoggerInstance = {
  log: (this: void, ...data: any[]) => void | undefined;
  error: (this: void, ...data: any[]) => void | undefined;
  warn: (this: void, ...data: any[]) => void | undefined;
};

type PackageLogger = ({
  enableLogging,
  logPrefix,
}: {
  enableLogging?: boolean;
  logPrefix?: string;
}) => PackageLoggerInstance;

type CheckUnsupportedParams = ({
  params,
  defaultParams,
  onUnsupportedParams,
  logger,
}: {
  params: object;
  defaultParams: object;
  onUnsupportedParams?: () => {};
  logger: PackageLoggerInstance;
}) => {};
