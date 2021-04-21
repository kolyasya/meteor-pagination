let previousParams = '';
let previousPage = 1;

const onlyPageHasChanged = params => {
  if (!params) return false;
  const paramsToCompare = { ...params };
  delete paramsToCompare.skip;
  delete paramsToCompare.page;
  delete paramsToCompare.limit;

  console.log('');
  console.log(parseInt(params.page), previousPage + 1);

  if (
    parseInt(params.page) === previousPage + 1 &&
    JSON.stringify(previousParams) === JSON.stringify(paramsToCompare)
  ) {
    previousPage = parseInt(params.page);
    return true;
  } else {
    previousParams = { ...paramsToCompare };
    previousSkip = params.skip;
    previousLimit = params.limit;
    previousPage = parseInt(params.page);
    return false;
  }
};

export default onlyPageHasChanged;