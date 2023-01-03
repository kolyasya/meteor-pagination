import pullall from "lodash.pullall";

const checkUnsupportedParams = ({
  params,
  defaultParams,
  onUnsupportedParams,
}) => {
  publishPaginatedLogger('Checking unsupported params...');

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

  publishPaginatedLogger('Checked unsupported params!');
};

export default checkUnsupportedParams;
