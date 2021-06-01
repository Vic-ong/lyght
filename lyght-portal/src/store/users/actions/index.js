import axios from 'axios';
import baseUrl from '@/services/functions/config';
import firebase from '@/services/firebase';
import db from '@/store/firestore';
import User from '@/models/User';
import { setError, parseError } from '@/utils/errors';
import { camelToSnake } from '@/utils/formats';
import bankAccountActions from './bankAccount';

const USERS_COLLECTION = 'users';
const docRef = db.collection(USERS_COLLECTION);

const actions = {
  ...bankAccountActions,

  createAuth: async (store, param) => {
    try {
      const idToken = await firebase.auth().currentUser.getIdToken();
      await axios.post(`${baseUrl}/auth/create`, { ...param, idToken });
    } catch (err) {
      console.error(err);
      const error = parseError(err);
      throw new Error(error.message);
    }
  },

  createUser: async (store, param) => {
    try {
      const formattedParam = camelToSnake(param);
      await docRef.doc(formattedParam._id).set(formattedParam);
    } catch (err) {
      console.error(err);
      const error = parseError(err);
      throw new Error(error.message);
    }
  },

  createUserSocial: async (store, param) => {
    try {
      const formattedParam = camelToSnake(param);
      const doc = await docRef.doc(formattedParam._id).get();
      if (!doc.exists) {
        await docRef.doc(formattedParam._id).set(formattedParam);
      }
    } catch (err) {
      console.error(err);
      const error = parseError(err);
      throw new Error(error.message);
    }
  },

  updateUser: async (store, param) => {
    try {
      const { id, ...restParam } = param;
      const updatedUser = new User(restParam, store).setUpdateDoc();
      await docRef.doc(id).update(updatedUser);
    } catch (err) {
      setError(err);
      const error = parseError(err);
      throw new Error(error.message);
    }
  },

  getUser: (store, userId) => {
    const state = { state: 'user' };
    store.commit('SET_LOADING', state);

    return docRef.doc(userId).onSnapshot(
      (doc) => {
        if (doc.exists) {
          const payload = new User(doc, store).getData();
          store.commit('SET_DATA_REPLACE', { ...state, payload });
        } else {
          store.commit('SET_ERROR', state);
          console.error('Unable to find document!');
        }
      },
      (err) => {
        setError(err);
        store.commit('SET_ERROR', state);
      },
    );
  },
};

export default actions;
