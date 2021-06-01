import db from '@/store/firestore';
import { snakeToCamel } from '@/utils/formats';

const ENTITIES = 'entities';
const entitiesRef = db.collection(ENTITIES);

const actions = {
  /**
   * Fetch and subscribe to projects
   */
  getEntities: (store) => {
    const state = { state: 'entities' };
    store.commit('SET_LOADING', state);
    return entitiesRef.onSnapshot(
      (querySnapshot) => {
        const payload = [];
        querySnapshot.forEach((doc) => {
          payload.push({
            _id: doc.id,
            ...snakeToCamel(doc.data()),
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
};

export default actions;
