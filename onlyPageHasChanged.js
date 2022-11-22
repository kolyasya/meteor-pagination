let previousPage = 1;
let previousParams = {};

const onlyPageHasChanged = ({ params }) => {
  if (!params) return false;

  let result = false;
  const paramsToCompare = JSON.parse(JSON.stringify(params));
  delete paramsToCompare.skip;
  delete paramsToCompare.page;
  delete paramsToCompare.limit;

  // console.log(previousPage, parseInt(params.page));

  if (
    parseInt(params.page) === previousPage + 1 &&
    JSON.stringify(previousParams) === JSON.stringify(paramsToCompare)
  ) {
    // console.log('Only page has changed');
    result = true;
  } else {
    // console.log('NOT only page has changed');
    // console.log({
    //   pp: JSON.stringify(previousParams),
    //   cp: JSON.stringify(paramsToCompare),
    // })
    previousParams = JSON.parse(JSON.stringify(paramsToCompare));
  }

  previousPage = parseInt(params.page);

  return result;
};

export default onlyPageHasChanged;
