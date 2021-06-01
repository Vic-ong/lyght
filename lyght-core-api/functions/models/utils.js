const { firebase } = require('@/services/firebase');
const { camelToSnake } = require('@/utils/format');

const compressObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    // eslint-disable-next-line no-param-reassign
    if (obj[key] === undefined || Number.isNaN(obj[key])) delete obj[key];
  });
};

const removeNullData = (obj) =>
  // eslint-disable-next-line no-param-reassign
  Object.keys(obj).forEach((key) => (obj[key] === undefined || obj[key] === null ? delete obj[key] : {}));

const setCreateRequest = (params, user) => {
  removeNullData(params);

  const formattedParams = camelToSnake(params);

  if (user) {
    return {
      ...formattedParams,
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
      updated_at: firebase.firestore.FieldValue.serverTimestamp(),
      created_by: {
        _id: user._id,
        name: user.displayName,
      },
      updated_by: {
        _id: user._id,
        name: user.displayName,
      },
    };
  }

  return {
    ...formattedParams,
    created_at: firebase.firestore.FieldValue.serverTimestamp(),
    updated_at: firebase.firestore.FieldValue.serverTimestamp(),
  };
};

const setUpdateRequest = (params, user) => {
  removeNullData(params);

  const formattedParams = camelToSnake(params);

  if (user) {
    return {
      ...formattedParams,
      updated_at: firebase.firestore.FieldValue.serverTimestamp(),
      updated_by: {
        _id: user._id,
        name: user.displayName,
      },
    };
  }

  return {
    ...formattedParams,
    updated_at: firebase.firestore.FieldValue.serverTimestamp(),
  };
};

module.exports = {
  compressObject,
  setCreateRequest,
  setUpdateRequest,
};
