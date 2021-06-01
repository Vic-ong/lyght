import db from '@/store/firestore';
import firebase from '@/services/firebase';
import ProjectGroupInsurance from '@/models/ProjectGroupDetailed/Insurance';
import { setError, uploadFile } from '@/store/utils';

const PROJECT_GROUPS_DETAILED = 'project_groups_detailed';
const INSURANCES = 'insurances';

const actions = {
  getInsuranceByProjectGroup: (store, projectGroupId) => {
    const state = { state: 'insurance' };
    store.commit('SET_LOADING', state);

    return db
      .collection(PROJECT_GROUPS_DETAILED)
      .doc(projectGroupId)
      .collection(INSURANCES)
      .onSnapshot(
        (querySnapshot) => {
          const payload = [];
          querySnapshot.forEach((doc) => {
            payload.push(new ProjectGroupInsurance(doc).getData());
          });
          store.commit('SET_DATA_REPLACE', { ...state, payload });
        },
        (err) => {
          store.commit('SET_ERROR', state);
          setError(err);
        },
      );
  },
  createInsurance: async (store, params) => {
    try {
      const { projectGroupId, fileUpload = {}, ...restParams } = params;
      const { storagePath, items } = fileUpload;

      const storageRef = firebase.storage().ref(storagePath);
      const [item] = items;
      const url = await uploadFile(storageRef, { file: item.file, path: item.path });

      const newInsurance = new ProjectGroupInsurance({
        ...restParams,
        file: { path: item.path, url },
      }).setCreateDoc();

      const res = await db
        .collection(PROJECT_GROUPS_DETAILED)
        .doc(projectGroupId)
        .collection(INSURANCES)
        .add(newInsurance);

      return {
        id: res.id,
        message: 'Created an insurance record.',
      };
    } catch (err) {
      setError(err);
      throw err;
    }
  },
  updateInsurance: async (store, params) => {
    try {
      const { id, projectGroupId, ...restParams } = params;
      const updatedInsurance = new ProjectGroupInsurance(restParams).setUpdateDoc();
      await db
        .collection(PROJECT_GROUPS_DETAILED)
        .doc(projectGroupId)
        .collection(INSURANCES)
        .doc(id)
        .update(updatedInsurance);

      return {
        id,
        message: 'Updated insurance record.',
      };
    } catch (err) {
      setError(err);
      throw err;
    }
  },
  deleteInsurance: async (store, params) => {
    try {
      const { id, projectGroupId, fileDelete } = params;
      const { storagePath, items } = fileDelete;

      const storageRef = firebase.storage().ref(storagePath);
      const [item] = items;
      await storageRef.child(item.file.path).delete();

      await db.collection(PROJECT_GROUPS_DETAILED).doc(projectGroupId).collection(INSURANCES).doc(id).delete();

      return {
        id,
        message: 'Deleted insurance record.',
      };
    } catch (err) {
      setError(err);
      throw err;
    }
  },
};

export default actions;
