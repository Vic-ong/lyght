import axios from 'axios';
import baseUrl from '@/services/functions/config';
import firebase from '@/services/firebase';
import db from '@/store/firestore';
import Order from '@/models/Order';
import { parseError } from '@/utils/errors';

const ORDERS = 'orders';

const actions = {
  createOrder: async (store, param) => {
    try {
      const idToken = await firebase.auth().currentUser.getIdToken();
      await axios.post(`${baseUrl}/order/create`, { ...param, idToken });
    } catch (err) {
      const error = parseError(err);
      throw new Error(error.message);
    }
  },

  cancelOrder: async (store, param) => {
    try {
      const idToken = await firebase.auth().currentUser.getIdToken();
      await axios.post(`${baseUrl}/order/cancel`, { ...param, idToken });
    } catch (err) {
      const error = parseError(err);
      throw new Error(error.message);
    }
  },

  getOrder: (store, param) => {
    const state = { state: 'order' };
    store.commit('SET_LOADING', state);
    return db
      .collection(ORDERS)
      .doc(param)
      .onSnapshot(
        (doc) => {
          if (doc.exists) {
            const payload = new Order(doc).getData();
            store.commit('SET_DATA_REPLACE', { ...state, payload });
          } else {
            store.commit('SET_ERROR', state);
            console.error('Unable to find document!');
          }
        },
        (err) => {
          store.commit('SET_ERROR', state);
          console.error('Error getting document: ', err);
        },
      );
  },

  getOrdersByUser: (store, userId) => {
    const state = { state: 'userOrders' };
    store.commit('SET_LOADING', state);
    return db
      .collection(ORDERS)
      .where('user_id', '==', userId)
      .orderBy('created_at')
      .onSnapshot(
        (querySnapshot) => {
          const payload = [];
          querySnapshot.forEach((doc) => {
            payload.push(new Order(doc).getData());
          });
          store.commit('SET_DATA_REPLACE', { ...state, payload });
        },
        (err) => {
          store.commit('SET_ERROR', state);
          console.error('Error getting document: ', err);
        },
      );
  },

  getOrdersByUserAndProject: (store, param) => {
    const { userId, projectId } = param;
    const state = { state: 'userProjectOrders' };
    store.commit('SET_LOADING', state);
    return db
      .collection(ORDERS)
      .where('user_id', '==', userId)
      .where('project_id', '==', projectId)
      .onSnapshot(
        (querySnapshot) => {
          const payload = [];
          querySnapshot.forEach((doc) => {
            payload.push(new Order(doc).getData());
          });
          store.commit('SET_DATA_REPLACE', { ...state, payload });
        },
        (err) => {
          store.commit('SET_ERROR', state);
          console.error('Error getting document: ', err);
        },
      );
  },
};

export default actions;
