import firebase from '@/services/firebase';
import db from '@/store/firestore';
import { parseData, setUpdateParam } from '@/store/utils';
import { snakeToCamel } from '@/utils/formats';
import bankAccountActions from './bankAccount';
import accessActions from './access';
import settingsActions from './settings';

const USER_COLLECTION = 'users';
const APP_SETTINGS = 'app_settings';

const userRef = db.collection(USER_COLLECTION);

const actions = {
  ...bankAccountActions,
  ...accessActions,
  ...settingsActions,

  getMyUserData: (store) => {
    const state = { state: 'user' };
    store.commit('SET_LOADING', state);

    const user = firebase.auth().currentUser;
    const setError = (err) => {
      store.commit('SET_ERROR', state);
      console.error(err);
      throw err;
    };

    if (!user || !user.uid) setError('No user state');

    return userRef.doc(user.uid).onSnapshot((userDoc) => {
      if (userDoc.exists) {
        const { data: userData } = parseData(userDoc);

        userRef
          .doc(user.uid)
          .collection(APP_SETTINGS)
          .doc('lyght-admin-arctic')
          .onSnapshot((settingsDoc) => {
            if (settingsDoc.exists) {
              const { data: settingsData } = parseData(settingsDoc);

              store.commit('SET_DATA_REPLACE', {
                ...state,
                payload: { ...userData, settings: settingsData },
              });
            } else {
              store.commit('SET_DATA_REPLACE', {
                ...state,
                payload: { ...userData, settings: {} },
              });
            }
          }, setError);
      } else {
        store.commit('SET_ERROR', state);
      }
    }, setError);
  },

  getUserData: (store, param) => {
    const state = { state: 'userData' };
    store.commit('SET_LOADING', state);
    return userRef.doc(param).onSnapshot(
      (docSnapshot) => {
        if (docSnapshot.exists) {
          const payload = docSnapshot.data() || {};
          store.commit('SET_DATA_REPLACE', { ...state, payload: snakeToCamel(payload) });
        } else {
          store.commit('SET_ERROR', state);
          console.error('Unable to find document!');
        }
      },
      (err) => {
        store.commit('SET_ERROR', state);
        console.error('Error getting document: ', err);
        throw err;
      },
    );
  },

  getUsers: (store) => {
    const state = { state: 'users' };
    store.commit('SET_LOADING', state);
    return userRef.where('active', '==', true).onSnapshot(
      (querySnapshot) => {
        const payload = [];
        querySnapshot.forEach((doc) => {
          payload.push(snakeToCamel(doc.data()));
        });
        store.commit('SET_DATA_REPLACE', { ...state, payload });
      },
      (err) => {
        store.commit('SET_ERROR', state);
        console.error('Error getting document: ', err);
      },
    );
  },

  updateUser: async (store, param) => {
    try {
      const { id, ...updateParam } = param;
      const formattedParam = setUpdateParam(updateParam, store);
      await userRef.doc(id).update(formattedParam);
    } catch (err) {
      console.error('Error updating document', err);
      throw err;
    }
  },
};

export default actions;
