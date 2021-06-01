import db from '@/store/firestore';
import ProjectGroupInsurance from '@/models/ProjectGroupDetailed/Insurance';
import { setError } from '@/store/utils';

const PROJECT_GROUPS_DETAILED = 'project_groups_detailed';
const INSURANCES = 'insurances';

const actions = {
  getInsuranceByProjectGroup: (store, projectGroupId) => {
    const state = { state: 'insurances' };
    store.commit('SET_LOADING', state);

    return db
      .collection(PROJECT_GROUPS_DETAILED)
      .doc(projectGroupId)
      .collection(INSURANCES)
      .onSnapshot(
        (querySnapshot) => {
          const items = [];
          querySnapshot.forEach((doc) => {
            items.push(new ProjectGroupInsurance(doc).getData());
          });

          const payload = { projectGroupId, items };
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
