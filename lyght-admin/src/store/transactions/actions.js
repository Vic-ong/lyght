import db from '@/store/firestore';
import Transaction from '@/models/Transaction';

const TRANSACTIONS = 'transactions';
const transactionsRef = db.collection(TRANSACTIONS);

const actions = {
  /**
   * Fetch and subscribe to transactions
   */
  getTransaction: (store, param) => {
    const state = { state: 'transaction' };
    store.commit('SET_LOADING', state);
    return transactionsRef.doc(param).onSnapshot(
      (doc) => {
        const payload = new Transaction(doc).getData();
        store.commit('SET_DATA_REPLACE', { ...state, payload });
      },
      (err) => {
        store.commit('SET_ERROR', state);
        console.error('Error getting document: ', err);
      },
    );
  },
  /**
   * Fetch and subscribe to transactions
   */
  getTransactions: (store, param = {}) => {
    const state = { state: 'transactions' };
    store.commit('SET_LOADING', state);

    const { dateRange = {} } = param;
    const { current } = dateRange;

    const dataRef = current
      ? transactionsRef.where('created_at', '>', current.start).where('created_at', '<', current.end)
      : transactionsRef;

    return dataRef.onSnapshot(
      (querySnapshot) => {
        const payload = [];
        querySnapshot.forEach((doc) => {
          payload.push(new Transaction(doc).getData());
        });
        store.commit('SET_DATA_REPLACE', { ...state, payload });
      },
      (err) => {
        store.commit('SET_ERROR', state);
        console.error('Error getting document: ', err);
      },
    );
  },

  /**
   * Create a transaction doc
   */
  createTransaction: async (store, params) => {
    try {
      const formattedParams = new Transaction(params).setCreateDoc();
      const res = await transactionsRef.add(formattedParams);
      return {
        id: res.id,
        message: 'Created a transaction document.',
      };
    } catch (err) {
      console.error('Error creating document', err);
      throw err;
    }
  },

  /**
   * Update a transaction doc
   */
  updateTransaction: async (store, data) => {
    try {
      const { id, ...params } = data;
      const formattedParams = new Transaction(params).setUpdateDoc();
      await transactionsRef.doc(id).update(formattedParams);
      return {
        id,
        message: 'Updated transaction document.',
      };
    } catch (err) {
      console.error('Error updating document', err);
      throw err;
    }
  },
};

export default actions;
