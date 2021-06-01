import { snakeToCamel, camelToSnake } from '@/utils/formats';

export const mutations = {
  SET_LOADING(state, payload) {
    state[payload.state] = {
      error: false,
      loading: true,
    };
  },
  SET_ERROR(state, payload) {
    state[payload.state] = {
      error: true,
      loading: false,
    };
  },
  SET_DATA_REPLACE(state, payload) {
    state[payload.state] = {
      loading: false,
      error: false,
      data: payload.payload,
    };
  },
};

export const setError = (err) => {
  console.error('=== Vuex action error ===\n', err);
};

export const getStatus = (list) => ({
  valid: list.every((item) => !!item.data),
  error: list.some((item) => item.error === true),
  loading: list.some((item) => item.loading === true),
});

export const parseData = (doc) => {
  const { id } = doc;
  return {
    id,
    data: {
      _id: id,
      ...snakeToCamel(doc.data()),
    },
  };
};

export const setUpdateParam = (param, store) => {
  const currentDate = new Date();
  const user = store.rootGetters['users/user'];
  const { _id, displayName: name } = user.data;

  return camelToSnake({
    ...param,
    updatedAt: currentDate,
    updatedBy: { _id, name },
  });
};

export const setCreateParam = (param, store) => {
  const currentDate = new Date();
  const user = store.rootGetters['users/user'];
  const { _id, displayName: name } = user.data;

  return camelToSnake({
    ...param,
    createdAt: currentDate,
    createdBy: { _id, name },
    updatedAt: currentDate,
    updatedBy: { _id, name },
  });
};

export const uploadFile = async (storageRef, { file, path }) => {
  const metadata = { contentType: file.type };
  const uploadTaskSnapshot = await storageRef.child(path).put(file, metadata);

  return uploadTaskSnapshot.ref.getDownloadURL();
};
