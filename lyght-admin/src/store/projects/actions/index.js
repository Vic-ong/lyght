import firebase from 'firebase/app';
import db from '@/store/firestore';
import Project from '@/models/Project';
import { setError } from '@/store/utils';
import { snakeToCamel } from '@/utils/formats';
import yieldRateActions from './yieldRate';
import panelActions from './panel';

const PROJECTS = 'projects';

const actions = {
  ...yieldRateActions,
  ...panelActions,

  createProject: async (store, params) => {
    try {
      const newProject = new Project(params).setCreateDoc();
      const res = await db.collection(PROJECTS).add(newProject);

      return {
        id: res.id,
        message: 'Created a project document.',
      };
    } catch (err) {
      console.error('Error adding document', err);
      throw err;
    }
  },

  getProject: (store, id) => {
    const state = { state: 'project' };
    store.commit('SET_LOADING', state);
    return db
      .collection(PROJECTS)
      .doc(id)
      .onSnapshot(
        (doc) => {
          const payload = new Project(doc).getData();
          store.commit('SET_DATA_REPLACE', { ...state, payload });
        },
        (err) => {
          store.commit('SET_ERROR', state);
          setError(err);
        },
      );
  },

  getProjects: (store) => {
    const state = { state: 'projects' };
    store.commit('SET_LOADING', state);
    return db.collection(PROJECTS).onSnapshot(
      (querySnapshot) => {
        const payload = [];
        querySnapshot.forEach((doc) => {
          payload.push({
            _id: doc.id,
            ...snakeToCamel(doc.data()),
          });
        });
        store.commit('SET_DATA_REPLACE', { ...state, payload });
      },
      (err) => {
        store.commit('SET_ERROR', state);
        console.error('Error getting document: ', err);
      },
    );
  },

  updateProject: async (store, param) => {
    try {
      const { id, panelsReservedIncrement, panelsSoldIncrement, ...restParam } = param;
      const payload = restParam;
      if (panelsReservedIncrement && typeof panelsReservedIncrement === 'number') {
        payload.panelsReserved = firebase.firestore.FieldValue.increment(panelsReservedIncrement);
      }
      if (panelsSoldIncrement && typeof panelsSoldIncrement === 'number') {
        payload.panelsSold = firebase.firestore.FieldValue.increment(panelsSoldIncrement);
      }

      const updatedProject = new Project(payload).setUpdateDoc();
      await db.collection(PROJECTS).doc(id).update(updatedProject);

      return {
        id,
        message: 'Updated project record',
      };
    } catch (err) {
      console.error('Error updating document', err);
      throw err;
    }
  },
};

export default actions;
