import db from '@/store/firestore';
import ProjectGroupPerformance from '@/models/ProjectGroupDetailed/Performance';
import { setError } from '@/store/utils';

const PROJECT_GROUPS_DETAILED = 'project_groups_detailed';
const PERFORMANCE = 'performance';

const actions = {
  getPerformanceByProjectGroup: (store, projectGroupId) => {
    const state = { state: 'performance' };
    store.commit('SET_LOADING', state);

    return db
      .collection(PROJECT_GROUPS_DETAILED)
      .doc(projectGroupId)
      .collection(PERFORMANCE)
      .orderBy('date')
      .onSnapshot(
        (querySnapshot) => {
          const payload = [];
          querySnapshot.forEach((doc) => {
            payload.push(new ProjectGroupPerformance(doc).getData());
          });
          store.commit('SET_DATA_REPLACE', { ...state, payload });
        },
        (err) => {
          store.commit('SET_ERROR', state);
          setError(err);
        },
      );
  },
  setPerformance: async (store, params) => {
    try {
      const { id, projectGroupId, ...restParams } = params;

      const newPerformance = new ProjectGroupPerformance({
        ...restParams,
      }).setCreateDoc();

      await db
        .collection(PROJECT_GROUPS_DETAILED)
        .doc(projectGroupId)
        .collection(PERFORMANCE)
        .doc(id)
        .set(newPerformance);

      return {
        id,
        message: 'Updated a performance record.',
      };
    } catch (err) {
      setError(err);
      throw err;
    }
  },
  deletePerformance: async (store, params) => {
    try {
      const { id, projectGroupId } = params;
      await db.collection(PROJECT_GROUPS_DETAILED).doc(projectGroupId).collection(PERFORMANCE).doc(id).delete();

      return {
        id,
        message: 'Deleted performance record.',
      };
    } catch (err) {
      setError(err);
      throw err;
    }
  },
};

export default actions;
