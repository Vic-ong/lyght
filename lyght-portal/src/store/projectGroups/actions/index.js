import db from '@/store/firestore';
import ProjectGroup from '@/models/ProjectGroup';
import ProjectGroupDetailed from '@/models/ProjectGroupDetailed';
import { setError } from '@/store/utils';
import insuranceActions from './insurance';
import manufacturerActions from './manufacturer';
import performanceActions from './performance';

const ENTITIES = 'entities';
const PROJECT_GROUPS = 'project_groups';
const PROJECT_GROUPS_DETAILED = 'project_groups_detailed';

const actions = {
  ...insuranceActions,
  ...manufacturerActions,
  ...performanceActions,

  getProjectGroup: (store, id) => {
    const state = { state: 'projectGroup' };
    store.commit('SET_LOADING', state);

    return db
      .collection(PROJECT_GROUPS)
      .doc(id)
      .onSnapshot(
        async (doc) => {
          const projectGroupData = new ProjectGroup(doc).getData();
          const { entityId } = projectGroupData;

          const entityDoc = await db.collection(ENTITIES).doc(entityId).get();

          const payload = {
            ...projectGroupData,
            entity: entityDoc.data(),
          };
          store.commit('SET_DATA_REPLACE', { ...state, payload });
        },
        (err) => {
          store.commit('SET_ERROR', state);
          setError(err);
        },
      );
  },

  getProjectGroupDetails: (store, id) => {
    const state = { state: 'projectGroupDetails' };
    store.commit('SET_LOADING', state);

    return db
      .collection(PROJECT_GROUPS_DETAILED)
      .doc(id)
      .onSnapshot(
        (doc) => {
          const payload = new ProjectGroupDetailed(doc).getData();
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
