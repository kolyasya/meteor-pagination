import pullall from "lodash.pullall";
import getPublishPaginatedLogger from "./getPublishPaginatedLogger";

const checkUnsupportedParams = ({
  params,
  defaultParams,
  onUnsupportedParams,
}) => {
  const logger = getPublishPaginatedLogger();

  logger("Checking unsupported params...");

  const unsupportedParams = pullall(
    Object.keys(params),
    Object.keys(defaultParams)
  );

  if (unsupportedParams?.length) {
    if (typeof onUnsupportedParams === "function") {
      onUnsupportedParams({ unsupportedParams });
    } else {
      console.warning(`Unsupported params: ${unsupportedParams}`);
    }
  }

  logger("Checked unsupported params!");
};

export default checkUnsupportedParams;
