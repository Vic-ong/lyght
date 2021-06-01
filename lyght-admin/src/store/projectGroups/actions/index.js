import db from '@/store/firestore';
import ProjectGroup from '@/models/ProjectGroup';
import ProjectGroupDetailed from '@/models/ProjectGroupDetailed';
import { setError } from '@/store/utils';
import insuranceActions from './insurance';
import manufacturerActions from './manufacturer';
import expenseAllocationActions from './expenseAllocation';
import performanceActions from './performance';
import bankAccountActions from './bankAccount';

const PROJECT_GROUPS = 'project_groups';
const PROJECT_GROUPS_DETAILED = 'project_groups_detailed';

const actions = {
  ...insuranceActions,
  ...manufacturerActions,
  ...expenseAllocationActions,
  ...performanceActions,
  ...bankAccountActions,

  createProjectGroup: async (store, params) => {
    try {
      const newProjectGroup = new ProjectGroup(params).setCreateDoc();
      const res = await db.collection(PROJECT_GROUPS).add(newProjectGroup);
      const { id } = res;

      const newProjectGroupDetailed = new ProjectGroupDetailed(params).setCreateDoc();
      await db.collection(PROJECT_GROUPS_DETAILED).doc(id).set(newProjectGroupDetailed);

      return {
        id,
        message: 'Created a project group.',
      };
    } catch (err) {
      setError(err);
      throw err;
    }
  },

  getProjectGroups: (store) => {
    const state = { state: 'projectGroups' };
    store.commit('SET_LOADING', state);

    return db.collection(PROJECT_GROUPS).onSnapshot(
      (projectGroupSnapshot) => {
        const payload = [];
        projectGroupSnapshot.forEach((doc) => {
          payload.push(new ProjectGroup(doc).getData());
        });
        store.commit('SET_DATA_REPLACE', { ...state, payload });
      },
      (err) => {
        store.commit('SET_ERROR', state);
        setError(err);
      },
    );
  },

  getProjectGroup: (store, id) => {
    const state = { state: 'projectGroup' };
    store.commit('SET_LOADING', state);

    return db
      .collection(PROJECT_GROUPS)
      .doc(id)
      .onSnapshot(
        (doc) => {
          const payload = new ProjectGroup(doc).getData();
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

  updateProjectGroup: async (store, params) => {
    try {
      const { id, ...restParams } = params;

      const updatedProjectGroup = new ProjectGroup(restParams).setCreateDoc();
      await db.collection(PROJECT_GROUPS).doc(id).update(updatedProjectGroup);

      return {
        id,
        message: 'Updated project group record.',
      };
    } catch (err) {
      setError(err);
      throw err;
    }
  },

  updateProjectGroupDetailed: async (store, params) => {
    try {
      const { id, ...restParams } = params;

      const updatedProjectGroupDetailed = new ProjectGroupDetailed(restParams).setUpdateDoc();
      await db.collection(PROJECT_GROUPS_DETAILED).doc(id).update(updatedProjectGroupDetailed);

      return {
        id,
        message: 'Updated project group record.',
      };
    } catch (err) {
      setError(err);
      throw err;
    }
  },
};

export default actions;
