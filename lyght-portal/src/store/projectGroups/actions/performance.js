import dayjs from 'dayjs';
import db from '@/store/firestore';
import ProjectGroupPerformance from '@/models/ProjectGroupDetailed/Performance';
import { setError } from '@/store/utils';

const PROJECT_GROUPS_DETAILED = 'project_groups_detailed';
const PERFORMANCE = 'performance';

const actions = {
  getPerformanceByProjectGroup: (store, projectGroupId) => {
    const state = { state: 'performance' };
    store.commit('SET_LOADING', state);

    const minDate = dayjs().subtract(24, 'month').startOf('year');
    const maxDate = minDate.add(1, 'year').endOf('year');

    return db
      .collection(PROJECT_GROUPS_DETAILED)
      .doc(projectGroupId)
      .collection(PERFORMANCE)
      .where('date', '>=', minDate.format('YYYY-MM-DD'))
      .where('date', '<=', maxDate.format('YYYY-MM-DD'))
      .orderBy('date')
      .onSnapshot(
        (querySnapshot) => {
          const items = [];
          querySnapshot.forEach((doc) => {
            items.push(new ProjectGroupPerformance(doc).getData());
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
