import firebase from 'firebase/app';
import { camelToSnake, snakeToCamel } from '@/utils/formats';

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

export const setError = (err, { store, state } = {}) => {
  console.error('=== state error ===\n', err);

  if (store && state) {
    store.commit('SET_ERROR', state);
  }
};

export const parseDoc = (doc) => ({
  _id: doc.id,
  ...snakeToCamel(doc.data()),
});

export const getStatus = (list) => ({
  valid: list.every((item) => !!item.data),
  error: list.some((item) => item.error === true),
  loading: list.some((item) => item.loading === true),
});

export const setUpdateParam = (param, store) => {
  const timestamp = firebase.firestore.FieldValue.serverTimestamp;
  const user = store.rootGetters['users/user'];
  const { _id, displayName: name = '' } = user.data;

  return {
    ...camelToSnake(param),
    updated_at: timestamp,
    updated_by: { _id, name },
  };
};

export const setCreateParam = (param, store) => {
  const timestamp = firebase.firestore.FieldValue.serverTimestamp();
  const user = store.rootGetters['users/user'];
  const { _id, displayName: name = '' } = user.data;

  return {
    ...camelToSnake(param),
    updated_at: timestamp,
    updated_by: { _id, name },
    created_at: timestamp,
    created_by: { _id, name },
  };
};
