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
          const items = [];
          querySnapshot.forEach((doc) => {
            items.push(new ProjectYieldRate(doc).getData());
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
};

export default actions;
