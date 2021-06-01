import db from '@/store/firestore';
import PaymentDistribution from '@/models/PaymentProvision/PaymentDistribution';
import { parseData, setError } from '@/store/utils';

const PAYMENT_PROVISIONS = 'payment_provisions';
const DISTRIBUTIONS = 'distributions';
const USERS = 'users';

const actions = {
  getPaymentDistributions: (store, paymentProvisionId) => {
    const state = { state: 'paymentDistributions' };
    store.commit('SET_LOADING', state);

    return db
      .collection(PAYMENT_PROVISIONS)
      .doc(paymentProvisionId)
      .collection(DISTRIBUTIONS)
      .onSnapshot(
        (distributions) => {
          const distributionsData = [];

          distributions.forEach(async (distribution) => {
            const distributionData = new PaymentDistribution(distribution).getData();
            const user = await db.collection(USERS).doc(distributionData.userId).get();
            const { data: userData } = parseData(user);

            distributionData.user = userData.displayName;
            distributionsData.push(distributionData);
          });

          const payload = distributionsData.sort((a, b) => a.total.toString().localeCompare(b.total.toString()));
          store.commit('SET_DATA_REPLACE', { ...state, payload });
        },
        (err) => {
          store.commit('SET_ERROR', state);
          setError(err);
        },
      );
  },
  createDistribution: async (store, param) => {
    try {
      const { paymentProvisionId, ...params } = param;
      const formattedParams = new PaymentDistribution(params).setCreateDoc();
      const res = await db
        .collection(PAYMENT_PROVISIONS)
        .doc(paymentProvisionId)
        .collection(DISTRIBUTIONS)
        .add(formattedParams);
      return {
        id: res.id,
        message: 'Created a distribution document.',
      };
    } catch (err) {
      console.error('Error creating document', err);
      throw err;
    }
  },
  updateDistribution: async (store, param) => {
    try {
      const { id, paymentProvisionId, ...params } = param;
      const formattedParams = new PaymentDistribution(params).setUpdateDoc();
      await db
        .collection(PAYMENT_PROVISIONS)
        .doc(paymentProvisionId)
        .collection(DISTRIBUTIONS)
        .doc(id)
        .update(formattedParams);
      return {
        id,
        message: 'Updated distribution document.',
      };
    } catch (err) {
      console.error('Error updating document', err);
      throw err;
    }
  },
};

export default actions;
