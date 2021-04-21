// observe callback function

const observer = function({
  self,
  customCollectionName, 
  getAdditionalFields,
  page
}) {
  return {
    added: (_id, fields) => {
      let finalFields = { ...fields };
      if (getAdditionalFields) {
        finalFields = getAdditionalFields({
          _id,
          fields,
          eventType: 'added',
        });

        if (!finalFields?.hasOwnProperty('pagination')) {
          finalFields.pagination = {
            page
          };
        }
      }
      self.added(customCollectionName, _id, finalFields);
    },
    changed: (_id, fields) => {
      let finalFields = { ...fields };
      if (getAdditionalFields) {
        finalFields = getAdditionalFields({
          _id,
          fields,
          eventType: 'changed',
        });
      }
      self.changed(customCollectionName, _id, finalFields);
    },
    removed: _id => {
      self.removed(customCollectionName, _id);
    },
  };
};

export default observer;