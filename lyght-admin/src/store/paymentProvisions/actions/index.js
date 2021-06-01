import firebase from 'firebase/app';
import db from '@/store/firestore';
import PaymentProvision from '@/models/PaymentProvision';
import PaymentDistribution from '@/models/PaymentProvision/PaymentDistribution';
import UserAsset from '@/models/UserAsset';
import Transaction from '@/models/Transaction';
import { parseData } from '@/store/utils';
import { round } from '@/utils';
import paymentDistributionActions from './paymentDistribution';

const PAYMENT_PROVISIONS = 'payment_provisions';
const DISTRIBUTIONS = 'distributions';
const USER_ASSETS = 'user_assets';
const TRANSACTIONS = 'transactions';

const actions = {
  ...paymentDistributionActions,

  getPaymentProvision: (store, id) => {
    const state = { state: 'paymentProvision' };
    store.commit('SET_LOADING', state);

    return db
      .collection(PAYMENT_PROVISIONS)
      .doc(id)
      .onSnapshot(
        (paymentProvision) => {
          const payload = new PaymentProvision(paymentProvision).getData();
          store.commit('SET_DATA_REPLACE', { ...state, payload });
        },
        (err) => {
          store.commit('SET_ERROR', state);
          console.error('Error getting document: ', err);
        },
      );
  },

  getPaymentProvisions: (store) => {
    const state = { state: 'paymentProvisions' };
    store.commit('SET_LOADING', state);

    return db.collection(PAYMENT_PROVISIONS).onSnapshot(
      (querySnapshot) => {
        const payload = [];
        querySnapshot.forEach((doc) => {
          payload.push(new PaymentProvision(doc).getData());
        });
        store.commit('SET_DATA_REPLACE', { ...state, payload });
      },
      (err) => {
        store.commit('SET_ERROR', state);
        console.error('Error getting document: ', err);
      },
    );
  },

  createPaymentProvision: async (store, params) => {
    try {
      const { panelsTotal, ...param } = params;
      const newPaymentProvision = new PaymentProvision(param).setCreateDoc();
      const res = await db.collection(PAYMENT_PROVISIONS).add(newPaymentProvision);

      const { projectId, currency, revenue } = params;
      const userAssetsQuerySnapshot = await db
        .collection(USER_ASSETS)
        .where('project_id', '==', projectId)
        .where('status', '==', 'active')
        .get();

      let outstanding = revenue;
      userAssetsQuerySnapshot.forEach((userAssetDoc) => {
        const { id: userAssetId, data: userAssetData } = parseData(userAssetDoc);
        const { userId, quantity } = userAssetData;
        const partition = quantity / panelsTotal;
        const userRevenue = round(revenue * partition, 2);
        outstanding -= userRevenue;

        const distribution = new PaymentDistribution({
          userId,
          currency,
          partition,
          tax: 0, // TODO: Add tax calculation
          revenue: userRevenue,
          total: userRevenue,
          edited: false,
        }).setCreateDoc();

        db.collection(PAYMENT_PROVISIONS).doc(res.id).collection(DISTRIBUTIONS).doc(userAssetId).set(distribution);
      });

      db.collection(PAYMENT_PROVISIONS).doc(res.id).update({ outstanding });

      return {
        id: res.id,
        message: 'Created a payment provision document.',
      };
    } catch (err) {
      console.error('Error creating document', err);
      throw err;
    }
  },

  updatePaymentProvision: async (store, param) => {
    try {
      const { id, ...params } = param;
      const formattedParams = new PaymentProvision(params).setUpdateDoc();
      await db.collection(PAYMENT_PROVISIONS).doc(id).update(formattedParams);
      return {
        id,
        message: 'Updated payment provision document.',
      };
    } catch (err) {
      console.error('Error updating document', err);
      throw err;
    }
  },

  provisionPayments: (store, param) => {
    const batch = db.batch();
    const { id, transactions, userAssets } = param;

    const updatedPaymentProvision = new PaymentProvision({ status: 'closed' }).setUpdateDoc();
    batch.update(db.collection(PAYMENT_PROVISIONS).doc(id), updatedPaymentProvision);

    userAssets.forEach((userAsset) => {
      const updatedUserAsset = {
        ...new UserAsset({
          revenueLatest: userAsset.revenueLatest,
          revenueLatestDate: firebase.firestore.FieldValue.serverTimestamp(),
        }).setUpdateDoc(),
        'revenue_total.value': firebase.firestore.FieldValue.increment(userAsset.revenueTotal.valueIncrement),
      };
      batch.update(db.collection(USER_ASSETS).doc(userAsset.id), updatedUserAsset);
    });

    transactions.forEach((transaction) => {
      const newTransaction = new Transaction(transaction).setCreateDoc();
      batch.set(db.collection(TRANSACTIONS).doc(), newTransaction);
    });

    return batch
      .commit()
      .then(() => ({
        message: 'provisionPayment batch successfully committed!',
      }))
      .catch((err) => {
        console.error(`Batch failed: ${err}`);
        throw err;
      });
  },
};

export default actions;
