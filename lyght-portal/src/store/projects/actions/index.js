import dayjs from 'dayjs';
import db from '@/store/firestore';
import Project from '@/models/Project';
import ProjectGroup from '@/models/ProjectGroup';
import { snakeToCamel } from '@/utils/formats';
import { setError } from '@/store/utils';
import yieldRateActions from './yieldRate';
import userAssetActions from './userAsset';

const ENTITIES = 'entities';
const PROJECTS = 'projects';
const YIELD_RATES = 'yield_rates';

const PROJECT_GROUPS = 'project_groups';
const PROJECT_GROUPS_DETAILED = 'project_groups_detailed';
const PERFORMANCE = 'performance';
const INSURANCES = 'insurances';
const MANUFACTURERS = 'manufacturers';

const projectsRef = db.collection(PROJECTS);

const getData = (doc) => snakeToCamel(doc.data());

const actions = {
  ...yieldRateActions,
  ...userAssetActions,

  getActiveProjects: (store) => {
    const state = { state: 'activeProjectList' };
    store.commit('SET_LOADING', state);
    return db
      .collection(PROJECTS)
      .where('status', '==', 'active')
      .onSnapshot(
        (querySnapshot) => {
          const payload = [];
          querySnapshot.forEach(async (doc) => {
            const projectData = new Project(doc).getData();
            const { projectGroupId } = projectData;

            if (projectGroupId) {
              const projectGroupDoc = await db.collection(PROJECT_GROUPS).doc(projectGroupId).get();
              payload.push({
                ...projectData,
                projectGroup: new ProjectGroup(projectGroupDoc).getData(),
              });
            }
          });
          store.commit('SET_DATA_REPLACE', { ...state, payload });
        },
        (err) => {
          store.commit('SET_ERROR', state);
          console.error('Error getting document: ', err);
        },
      );
  },

  getNewProjects: (store) => {
    const state = { state: 'newProjectList' };
    store.commit('SET_LOADING', state);
    return db
      .collection(PROJECTS)
      .where('status', '==', 'new')
      .onSnapshot(
        (querySnapshot) => {
          const payload = [];
          querySnapshot.forEach(async (doc) => {
            const projectData = new Project(doc).getData();
            const { projectGroupId } = projectData;

            if (projectGroupId) {
              const projectGroupDoc = await db.collection(PROJECT_GROUPS).doc(projectGroupId).get();
              payload.push({
                ...projectData,
                projectGroup: new ProjectGroup(projectGroupDoc).getData(),
              });
            }
          });
          store.commit('SET_DATA_REPLACE', { ...state, payload });
        },
        (err) => {
          store.commit('SET_ERROR', state);
          console.error('Error getting document: ', err);
        },
      );
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

  getProjectDetails: (store, id) => {
    const state = { state: 'projectDetails' };
    store.commit('SET_LOADING', state);

    return db
      .collection(PROJECTS)
      .doc(id)
      .onSnapshot(
        async (doc) => {
          const projectData = getData(doc);
          const { projectGroupId } = projectData;

          const yieldRatesQuerySnapshot = await db.collection(PROJECTS).doc(id).collection(YIELD_RATES).get();
          const yieldRates = [];
          yieldRatesQuerySnapshot.forEach((yieldRateDoc) => {
            yieldRates.push(getData(yieldRateDoc));
          });

          const projectGroupDoc = await db.collection(PROJECT_GROUPS).doc(projectGroupId).get();

          const projectGroupData = getData(projectGroupDoc);
          const { entityId } = projectGroupData;

          const entityDoc = await db.collection(ENTITIES).doc(entityId).get();
          const projectGroupDetailedDoc = await db.collection(PROJECT_GROUPS_DETAILED).doc(projectGroupId).get();

          const minDate = dayjs().subtract(24, 'month').startOf('year');
          const maxDate = minDate.add(1, 'year').endOf('year');
          const performanceQuerySnapshot = await db
            .collection(PROJECT_GROUPS_DETAILED)
            .doc(projectGroupId)
            .collection(PERFORMANCE)
            .where('date', '>=', minDate.format('YYYY-MM-DD'))
            .where('date', '<=', maxDate.format('YYYY-MM-DD'))
            .get();

          const performance = [];
          performanceQuerySnapshot.forEach((performanceDoc) => {
            performance.push(getData(performanceDoc));
          });

          const payload = {
            _id: doc.id,
            ...projectData,
            entity: getData(entityDoc),
            yieldRates,
            projectGroup: {
              ...projectGroupData,
              ...getData(projectGroupDetailedDoc),
              performance,
            },
          };
          store.commit('SET_DATA_REPLACE', { ...state, payload });
        },
        (err) => {
          store.commit('SET_ERROR', state);
          console.error('Error getting document: ', err);
        },
      );
  },

  getProjectDetailsPrivate: (store, projectGroupId) => {
    const state = { state: 'projectDetailsPrivate' };
    store.commit('SET_LOADING', state);

    return db
      .collection(PROJECT_GROUPS_DETAILED)
      .doc(projectGroupId)
      .collection(INSURANCES)
      .onSnapshot(
        async (insuranceQuerySnapshot) => {
          const insurances = [];
          insuranceQuerySnapshot.forEach((insuranceDoc) => {
            insurances.push(getData(insuranceDoc));
          });

          const manufacturerQuerySnapshot = await db
            .collection(PROJECT_GROUPS_DETAILED)
            .doc(projectGroupId)
            .collection(MANUFACTURERS)
            .get();

          const manufacturers = [];
          manufacturerQuerySnapshot.forEach((manufacturerDoc) => {
            manufacturers.push(getData(manufacturerDoc));
          });

          const payload = {
            _id: projectGroupId,
            insurances,
            manufacturers,
          };
          store.commit('SET_DATA_REPLACE', { ...state, payload });
        },
        (err) => {
          store.commit('SET_ERROR', state);
          console.error('Error getting document: ', err);
        },
      );
  },

  getProjectOrder: (store, id) => {
    const state = { state: 'projectOrder' };
    store.commit('SET_LOADING', state);
    return projectsRef.doc(id).onSnapshot(
      async (doc) => {
        const data = snakeToCamel(doc.data());
        try {
          const payload = {
            _id: doc.id,
            ...data,
          };
          store.commit('SET_DATA_REPLACE', { ...state, payload });
        } catch (err) {
          store.commit('SET_ERROR', state);
        }
      },
      (err) => {
        store.commit('SET_ERROR', state);
        console.error('Error getting document: ', err);
      },
    );
  },
};

export default actions;
