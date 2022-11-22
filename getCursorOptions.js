import handleKeepPreloaded from "./handleKeepPreloaded";

const getCursorOptions = ({ paginationParams, subscriptionParams }) => {
  let options =
    typeof paginationParams.transformCursorOptions === "function"
      ? paginationParams.transformCursorOptions({
          paginationParams,
          subscriptionParams,
        })
      : {};

  if (subscriptionParams.limit >= 0) {
    options.limit = subscriptionParams.limit;
  }

  if (subscriptionParams.skip >= 0) {
    options.skip = subscriptionParams.skip;
  }

  if (subscriptionParams.sort) {
    options.sort = subscriptionParams.sort;
  }

  if (subscriptionParams.fields) {
    options.fields = subscriptionParams.fields;
  }

  if (subscriptionParams.keepPreloaded) {
    options = handleKeepPreloaded({
      options,
      params: subscriptionParams,
    });
  }

  if (subscriptionParams.transform) {
    options.transform = subscriptionParams.transform;
  }

  if (typeof subscriptionParams.reactive !== "undefined") {
    options.reactive = subscriptionParams.reactive;
  }

  return options;
};

export default getCursorOptions;
