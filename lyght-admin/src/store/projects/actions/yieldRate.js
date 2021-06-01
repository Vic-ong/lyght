import db from '@/store/firestore';
import ProjectYieldRate from '@/models/Project/YieldRate';
import { setError } from '@/store/utils';

const PROJECTS = 'projects';
const YIELD_RATES = 'yield_rates';

const actions = {
  getYieldRatesByProject: (store, projectId) => {
    const state = { state: 'projectYieldRates' };
    store.commit('SET_LOADING', state);

    return db
      .collection(PROJECTS)
      .doc(projectId)
      .collection(YIELD_RATES)
      .orderBy('year')
      .onSnapshot(
        (querySnapshot) => {
          const payload = [];
          querySnapshot.forEach((doc) => {
            payload.push(new ProjectYieldRate(doc).getData());
          });
          store.commit('SET_DATA_REPLACE', { ...state, payload });
        },
        (err) => {
          store.commit('SET_ERROR', state);
          setError(err);
        },
      );
  },
  createYieldRate: async (store, params) => {
    try {
      const { id, projectId, ...restParams } = params;

      const newYieldRate = new ProjectYieldRate({
        ...restParams,
      }).setCreateDoc();

      await db.collection(PROJECTS).doc(projectId).collection(YIELD_RATES).doc(id).set(newYieldRate);

      return {
        id,
        message: 'Created a yield rate record.',
      };
    } catch (err) {
      setError(err);
      throw err;
    }
  },
  updateYieldRate: async (store, params) => {
    try {
      const { id, projectId, ...restParams } = params;
      const updatedYieldRate = new ProjectYieldRate(restParams).setUpdateDoc();
      await db.collection(PROJECTS).doc(projectId).collection(YIELD_RATES).doc(id).update(updatedYieldRate);

      return {
        id,
        message: 'Updated yield rate record.',
      };
    } catch (err) {
      setError(err);
      throw err;
    }
  },
  deleteYieldRate: async (store, params) => {
    try {
      const { id, projectId } = params;
      await db.collection(PROJECTS).doc(projectId).collection(YIELD_RATES).doc(id).delete();

      return {
        id,
        message: 'Deleted yield rate record.',
      };
    } catch (err) {
      setError(err);
      throw err;
    }
  },
};

export default actions;
