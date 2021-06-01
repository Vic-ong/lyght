import firebase from 'firebase/app';
import db from '@/store/firestore';
import UserAsset from '@/models/UserAsset';
import { snakeToCamel } from '@/utils/formats';

const USER_ASSETS = 'user_assets';
const USERS = 'users';
const BANK_ACCOUNTS = 'bank_accounts';
const userAssetsRef = db.collection(USER_ASSETS);

const actions = {
  getUserAsset: (store, param) => {
    const state = { state: 'userAsset' };
    store.commit('SET_LOADING', state);
    return userAssetsRef.doc(param).onSnapshot(
      (doc) => {
        const payload = new UserAsset(doc).getData();
        store.commit('SET_DATA_REPLACE', { ...state, payload });
      },
      (err) => {
        store.commit('SET_ERROR', state);
        console.error('Error getting document: ', err);
      },
    );
  },

  getUserAssetsByProject: (store, projectId) => {
    const state = { state: 'userAssets' };
    store.commit('SET_LOADING', state);

    return userAssetsRef
      .where('project_id', '==', projectId)
      .where('status', '==', 'active')
      .onSnapshot(
        (querySnapshot) => {
          const payload = [];
          querySnapshot.forEach(async (doc) => {
            const userAssetData = new UserAsset(doc).getData();
            const { userId, bankAccountId } = userAssetData;
            let bankAccount;

            if (bankAccountId) {
              const bankAccountDoc = await db
                .collection(USERS)
                .doc(userId)
                .collection(BANK_ACCOUNTS)
                .doc(bankAccountId)
                .get();
              if (bankAccountDoc.exists) {
                bankAccount = snakeToCamel(bankAccountDoc.data());
              }
            }

            payload.push({
              _id: doc.id,
              ...userAssetData,
              ...(bankAccount ? { bankAccount } : null),
            });
          });
          store.commit('SET_DATA_REPLACE', { ...state, payload });
        },
        (err) => {
          store.commit('SET_ERROR', state);
          console.error('Error getting document: ', err);
        },
      );
  },

  createUserAsset: async (store, param) => {
    try {
      const { userId, projectId } = param;
      const ref = db.collection(USER_ASSETS);
      let id;

      const snapshot = await ref.where('user_id', '==', userId).where('project_id', '==', projectId).get();

      if (snapshot.empty) {
        const newUserAsset = new UserAsset(param, { allowNull: true }).setCreateDoc();
        const res = await ref.add(newUserAsset);
        id = res.id;
      } else {
        const docs = [];
        snapshot.forEach((doc) => {
          docs.push(doc.id);
        });

        [id] = docs;
        const updatedUserAsset = new UserAsset(
          {
            ...param,
            quantity: firebase.firestore.FieldValue.increment(param.quantity),
          },
          { allowNull: true },
        ).setUpdateDoc();

        await ref.doc(id).update(updatedUserAsset);
      }

      return {
        id,
        message: 'Created a user asset document.',
      };
    } catch (err) {
      console.error('Error creating document', err);
      throw err;
    }
  },

  updateUserAsset: async (store, param) => {
    try {
      const { id, ...restParams } = param;
      const updatedUserAsset = new UserAsset(restParams).setUpdateDoc();
      await userAssetsRef.doc(id).update(updatedUserAsset);
      return {
        id,
        message: 'Updated user asset document.',
      };
    } catch (err) {
      console.error('Error updating document', err);
      throw err;
    }
  },
};

export default actions;
