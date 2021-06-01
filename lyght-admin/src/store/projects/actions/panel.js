import db from '@/store/firestore';
import ProjectPanel from '@/models/Project/Panel';
import { setError } from '@/store/utils';
import { snakeToCamel } from '@/utils/formats';

const PROJECTS = 'projects';
const PANELS = 'panels';
const USERS = 'users';

const actions = {
  getPanelsByProject: ({ dispatch, commit, rootGetters }, projectId) => {
    const state = { state: 'panels' };
    commit('SET_LOADING', state);

    return db
      .collection(PROJECTS)
      .doc(projectId)
      .collection(PANELS)
      .orderBy('suffix_id')
      .onSnapshot(
        (querySnapshot) => {
          const { userMap } = rootGetters;
          const payload = [];

          querySnapshot.forEach(async (doc) => {
            const panelData = new ProjectPanel(doc).getData();
            const { userId } = panelData;

            let user = {};
            if (userId) {
              if (userMap.has(userId)) {
                user = userMap.get(userId);
              } else {
                const userDoc = await db.collection(USERS).doc(userId).get();
                const userData = { _id: userId, data: snakeToCamel(userDoc.data()) };
                dispatch('setMap', { stateKey: 'userMap', payload: userData }, { root: true });
                user = userData.data;
              }
            }

            payload.push({ ...panelData, userName: user.displayName });
          });
          commit('SET_DATA_REPLACE', { ...state, payload });
        },
        (err) => {
          commit('SET_ERROR', state);
          setError(err);
        },
      );
  },
  getAvailablePanelsByProject: (store, params) => {
    const { projectId } = params;
    const state = { state: 'availablePanels' };
    store.commit('SET_LOADING', state);

    return db
      .collection(PROJECTS)
      .doc(projectId)
      .collection(PANELS)
      .where('order_id', '==', null)
      .orderBy('suffix_id')
      .onSnapshot(
        (querySnapshot) => {
          const items = [];
          querySnapshot.forEach((panelDoc) => {
            items.push(new ProjectPanel(panelDoc).getData());
          });

          const payload = { projectId, items };
          store.commit('SET_DATA_REPLACE', { ...state, payload });
        },
        (err) => {
          store.commit('SET_ERROR', state);
          setError(err);
        },
      );
  },
  getPanelsByOrder: (store, params) => {
    const { orderId, projectId } = params;
    const state = { state: 'panelsByOrder' };
    store.commit('SET_LOADING', state);

    return db
      .collection(PROJECTS)
      .doc(projectId)
      .collection(PANELS)
      .where('order_id', '==', orderId)
      .orderBy('suffix_id')
      .onSnapshot(
        (querySnapshot) => {
          const items = [];
          querySnapshot.forEach((panelDoc) => {
            items.push(new ProjectPanel(panelDoc).getData());
          });

          const payload = { projectId, orderId, items };
          store.commit('SET_DATA_REPLACE', { ...state, payload });
        },
        (err) => {
          store.commit('SET_ERROR', state);
          setError(err);
        },
      );
  },

  createAndUpdatePanel: async (store, params) => {
    try {
      const { id, projectId, ...restParams } = params;
      const updatedPanel = new ProjectPanel(restParams, { allowNull: true }).setUpdateDoc();
      await db.collection(PROJECTS).doc(projectId).collection(PANELS).doc(id).set(updatedPanel, { merge: true });

      return {
        id,
        message: 'Updated panel record.',
      };
    } catch (err) {
      setError(err);
      throw err;
    }
  },
};

export default actions;
