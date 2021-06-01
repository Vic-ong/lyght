import db from '@/store/firestore';
import BankAccount from '@/models/BankAccount';
import { setError } from '@/store/utils';

const PROJECT_GROUPS_DETAILED = 'project_groups_detailed';
const BANK_ACCOUNTS = 'bank_accounts';

const actions = {
  getBankAccountsByProjectGroup: (store, projectGroupId) => {
    const state = { state: 'bankAccounts' };
    store.commit('SET_LOADING', state);

    return db
      .collection(PROJECT_GROUPS_DETAILED)
      .doc(projectGroupId)
      .collection(BANK_ACCOUNTS)
      .onSnapshot(
        (querySnapshot) => {
          const payload = [];
          querySnapshot.forEach((doc) => {
            payload.push(new BankAccount(doc).getData());
          });
          store.commit('SET_DATA_REPLACE', { ...state, payload });
        },
        (err) => {
          store.commit('SET_ERROR', state);
          setError(err);
        },
      );
  },
  createBankAccount: async (store, params) => {
    try {
      const { id, projectGroupId, ...restParams } = params;

      const newBankAccount = new BankAccount({
        ...restParams,
      }).setCreateDoc();

      await db
        .collection(PROJECT_GROUPS_DETAILED)
        .doc(projectGroupId)
        .collection(BANK_ACCOUNTS)
        .doc(id)
        .set(newBankAccount);

      return {
        id,
        message: 'Created a bank account record.',
      };
    } catch (err) {
      setError(err);
      throw err;
    }
  },
  updateBankAccount: async (store, params) => {
    try {
      const { id, projectGroupId, ...restParams } = params;
      const updatedBankAccount = new BankAccount(restParams).setUpdateDoc();
      await db
        .collection(PROJECT_GROUPS_DETAILED)
        .doc(projectGroupId)
        .collection(BANK_ACCOUNTS)
        .doc(id)
        .set(updatedBankAccount);

      return {
        id,
        message: 'Updated bank account record.',
      };
    } catch (err) {
      setError(err);
      throw err;
    }
  },
  deleteBankAccount: async (store, params) => {
    try {
      const { id, projectGroupId } = params;
      await db.collection(PROJECT_GROUPS_DETAILED).doc(projectGroupId).collection(BANK_ACCOUNTS).doc(id).delete();

      return {
        id,
        message: 'Deleted bank account record.',
      };
    } catch (err) {
      setError(err);
      throw err;
    }
  },
};

export default actions;
