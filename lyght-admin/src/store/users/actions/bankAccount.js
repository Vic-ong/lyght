import db from '@/store/firestore';
import { snakeToCamel } from '@/utils/formats';

const USER_COLLECTION = 'users';
const BANK_ACCOUNTS_COLLECTION = 'bank_accounts';

const actions = {
  getUserBankAccounts: async (store, param) => {
    const state = { state: 'userBankAccounts' };
    store.commit('SET_LOADING', state);
    try {
      const docs = await db.collection(USER_COLLECTION).doc(param).collection(BANK_ACCOUNTS_COLLECTION).get();
      if (docs.empty) {
        store.commit('SET_DATA_REPLACE', { ...state, payload: [] });
      } else {
        const payload = [];
        docs.forEach((doc) => {
          payload.push({
            _id: doc.id,
            ...snakeToCamel(doc.data()),
          });
        });
        store.commit('SET_DATA_REPLACE', { ...state, payload });
      }
    } catch (err) {
      store.commit('SET_ERROR', state);
      console.error('Error getting document: ', err);
      throw err;
    }
  },
};

export default actions;
