export type PackageLoggerInstance = {
  log: (this: void, ...data: any[]) => void | undefined;
  error: (this: void, ...data: any[]) => void | undefined;
  warn: (this: void, ...data: any[]) => void | undefined;
};

export type PackageLogger = ({
  enableLogging,
  logPrefix,
}: {
  enableLogging?: boolean;
  logPrefix?: string;
}) => PackageLoggerInstance;

export type CheckUnsupportedParams = ({
  params,
  defaultParams,
  onUnsupportedParams,
  logger,
}: {
  params: object;
  defaultParams: object;
  onUnsupportedParams?: ({ unsupportedParams }: {
    unsupportedParams: object
  }) => {};
  logger: PackageLoggerInstance;
}) => {};
