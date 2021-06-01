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
          const payload = [];
          querySnapshot.forEach((doc) => {
            payload.push(new ProjectGroupManufacturer(doc).getData());
          });
          store.commit('SET_DATA_REPLACE', { ...state, payload });
        },
        (err) => {
          store.commit('SET_ERROR', state);
          setError(err);
        },
      );
  },
  createManufacturer: async (store, params) => {
    try {
      const { projectGroupId, ...restParams } = params;

      const newManufacturer = new ProjectGroupManufacturer({
        ...restParams,
      }).setCreateDoc();

      const res = await db
        .collection(PROJECT_GROUPS_DETAILED)
        .doc(projectGroupId)
        .collection(MANUFACTURERS)
        .add(newManufacturer);

      return {
        id: res.id,
        message: 'Created an manufacturer record.',
      };
    } catch (err) {
      setError(err);
      throw err;
    }
  },
  updateManufacturer: async (store, params) => {
    try {
      const { id, projectGroupId, ...restParams } = params;
      const updatedManufacturer = new ProjectGroupManufacturer(restParams).setUpdateDoc();
      await db
        .collection(PROJECT_GROUPS_DETAILED)
        .doc(projectGroupId)
        .collection(MANUFACTURERS)
        .doc(id)
        .update(updatedManufacturer);

      return {
        id,
        message: 'Updated manufacturer record.',
      };
    } catch (err) {
      setError(err);
      throw err;
    }
  },
  deleteManufacturer: async (store, params) => {
    try {
      const { id, projectGroupId } = params;
      await db.collection(PROJECT_GROUPS_DETAILED).doc(projectGroupId).collection(MANUFACTURERS).doc(id).delete();

      return {
        id,
        message: 'Deleted manufacturer record.',
      };
    } catch (err) {
      setError(err);
      throw err;
    }
  },
};

export default actions;
