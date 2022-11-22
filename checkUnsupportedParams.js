import pullall from "lodash.pullall";

const checkUnsupportedParams = ({
  params,
  defaultParams,
  onUnsupportedParams
}) => {
  const unsupportedParams = pullall(
    Object.keys(params),
    Object.keys(defaultParams)
  );

  if (unsupportedParams?.length) {
    if (typeof onUnsupportedParams === 'function') {
      onUnsupportedParams({ unsupportedParams });
    } else {
      console.warning(`Unsupported params: ${unsupportedParams}`)
    }
  }
}

export default checkUnsupportedParams;