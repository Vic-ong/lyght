import db from '@/store/firestore';
import { setUpdateParam } from '@/store/utils';
import { snakeToCamel } from '@/utils/formats';

const ORDERS = 'orders';
const USERS = 'users';
const PROJECTS = 'projects';

const actions = {
  getOrder: (store, param) => {
    const state = { state: 'order' };
    store.commit('SET_LOADING', state);
    return db
      .collection(ORDERS)
      .doc(param)
      .onSnapshot(
        (doc) => {
          const payload = {
            _id: doc.id,
            ...snakeToCamel(doc.data()),
          };
          store.commit('SET_DATA_REPLACE', { ...state, payload });
        },
        (err) => {
          store.commit('SET_ERROR', state);
          console.error('Error getting document: ', err);
        },
      );
  },

  getOrders: ({ dispatch, commit, rootGetters }) => {
    const state = { state: 'orders' };
    commit('SET_LOADING', state);

    return db.collection(ORDERS).onSnapshot(
      (querySnapshot) => {
        const { userMap, projectMap } = rootGetters;
        const payload = [];

        querySnapshot.forEach(async (doc) => {
          const orderData = { _id: doc.id, ...snakeToCamel(doc.data()) };
          const { userId, projectId } = orderData;

          let user;
          if (userMap.has(userId)) {
            user = userMap.get(userId);
          } else {
            const userDoc = await db.collection(USERS).doc(userId).get();
            const userData = { _id: userId, data: snakeToCamel(userDoc.data()) };
            dispatch('setMap', { stateKey: 'userMap', payload: userData }, { root: true });
            user = userData.data;
          }

          let project;
          if (projectMap.has(userId)) {
            project = projectMap.get(userId);
          } else {
            const projectDoc = await db.collection(PROJECTS).doc(projectId).get();
            const projectData = { _id: projectId, data: snakeToCamel(projectDoc.data()) };
            dispatch('setMap', { stateKey: 'projectMap', payload: projectData }, { root: true });
            project = projectData.data;
          }

          payload.push({
            ...orderData,
            userName: user.displayName,
            projectName: project.nameTrans.en,
          });
        });
        commit('SET_DATA_REPLACE', { ...state, payload });
      },
      (err) => {
        commit('SET_ERROR', state);
        console.error('Error getting document: ', err);
      },
    );
  },

  updateOrder: async (store, param) => {
    try {
      const { id, ...updateParam } = param;
      const formattedParam = setUpdateParam(updateParam, store);
      await db.collection(ORDERS).doc(id).update(formattedParam);
    } catch (err) {
      console.error('Error updating document', err);
    }
  },
};

export default actions;
