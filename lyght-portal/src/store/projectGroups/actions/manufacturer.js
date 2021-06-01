import db from '@/store/firestore';
import ProjectGroupManufacturer from '@/models/ProjectGroupDetailed/Manufacturer';
import { setError } from '@/store/utils';

const PROJECT_GROUPS_DETAILED = 'project_groups_detailed';
const MANUFACTURERS = 'manufacturers';

const actions = {
  getManufacturersByProjectGroup: (store, projectGroupId) => {
    const state = { state: 'manufacturers' };
    store.commit('SET_LOADING', state);

    return db
      .collection(PROJECT_GROUPS_DETAILED)
      .doc(projectGroupId)
      .collection(MANUFACTURERS)
      .onSnapshot(
        (querySnapshot) => {
          const items = [];
          querySnapshot.forEach((doc) => {
            items.push(new ProjectGroupManufacturer(doc).getData());
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
