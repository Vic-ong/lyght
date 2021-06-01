import db from '@/store/firestore';
import { setUpdateParam, setCreateParam, setError, parseDoc } from '@/store/utils';

const USERS = 'users';
const BANK_ACCOUNTS = 'bank_accounts';

const actions = {
  getBankAccountsByUser: (store, userId) => {
    const state = { state: 'userBankAccounts' };
    store.commit('SET_LOADING', state);

    return db
      .collection(USERS)
      .doc(userId)
      .collection(BANK_ACCOUNTS)
      .onSnapshot(
        (querySnapshot) => {
          const items = [];
          querySnapshot.forEach((doc) => {
            items.push(parseDoc(doc));
          });

          const payload = { userId, items };
          store.commit('SET_DATA_REPLACE', { ...state, payload });
        },
        (err) => {
          store.commit('SET_ERROR', state);
          setError(err);
        },
      );
  },

  createUserBankAccount: async (store, param) => {
    try {
      const { userId, ...createParam } = param;
      const formattedParam = setCreateParam(createParam, store);
      const res = await db.collection(USERS).doc(userId).collection(BANK_ACCOUNTS).add(formattedParam);
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  updateUserBankAccount: async (store, param) => {
    try {
      const { userId, bankId, ...updateParam } = param;
      const formattedParam = setUpdateParam(updateParam, store);
      await db.collection(USERS).doc(userId).collection(BANK_ACCOUNTS).doc(bankId).update(formattedParam);
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
};

export default actions;
