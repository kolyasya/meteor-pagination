import onlyPageHasChanged from './onlyPageHasChanged';

let previousParams = {};
let previousSkip = 0;
let previousLimit = 0;

const handleKeepPreloaded = ({ options, params }) => {
  let result = { ...options };

  const paramsAreTheSame =
    JSON.stringify(previousParams) === JSON.stringify(params);

  // console.log('Keeping...');
  // console.log({
  //   pfp: JSON.stringify(previousParams),
  //   cfp: JSON.stringify(params),
  // })

  // If params are the same we need to keep the same limit and skip
  if (paramsAreTheSame) {
    // console.log('Params are the same');
    result.skip = previousSkip;
    result.limit = previousLimit;
  } else if (onlyPageHasChanged({ params })) {
    // In this case we just extend the limit to keep already preloaded pages
    result.skip = previousSkip;
    result.limit = previousLimit + params.limit;
    previousLimit = result.limit;
  } else {
    previousSkip = params.skip;
    previousLimit = params.limit;
  }

  // console.log('Saving previous params');
  // console.log(JSON.parse(JSON.stringify(params)));
  previousParams = JSON.parse(JSON.stringify(params));

  return result;
};

export default handleKeepPreloaded;
