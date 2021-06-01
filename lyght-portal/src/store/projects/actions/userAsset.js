import dayjs from 'dayjs';
import db from '@/store/firestore';
import { snakeToCamel } from '@/utils/formats';

const USERS_ASSETS = 'user_assets';
const ENTITIES = 'entities';
const PROJECTS = 'projects';
const YIELD_RATES = 'yield_rates';

const PROJECT_GROUPS = 'project_groups';
const PROJECT_GROUPS_DETAILED = 'project_groups_detailed';
const PERFORMANCE = 'performance';
const INSURANCES = 'insurances';
const MANUFACTURERS = 'manufacturers';

const getData = (doc) => snakeToCamel(doc.data());

const actions = {
  getUserAssets: (store, id) => {
    const state = { state: 'userAssets' };
    store.commit('SET_LOADING', state);

    const setError = (err) => {
      store.commit('SET_ERROR', state);
      console.error(err);
    };

    return db
      .collection(USERS_ASSETS)
      .where('user_id', '==', id)
      .where('status', '==', 'active')
      .onSnapshot((querySnapshot) => {
        if (querySnapshot.empty) {
          store.commit('SET_DATA_REPLACE', { ...state, payload: [] });
        } else {
          querySnapshot.forEach((userAssetDoc) => {
            const userAssetData = getData(userAssetDoc);
            const _id = userAssetDoc.id;
            const { projectId } = userAssetData;

            const payload = [];
            db.collection(PROJECTS)
              .doc(projectId)
              .onSnapshot(async (projectDoc) => {
                const projectData = getData(projectDoc);
                const { projectGroupId } = projectData;

                if (projectGroupId) {
                  const projectGroupDoc = await db.collection(PROJECT_GROUPS).doc(projectGroupId).get();

                  payload.push({
                    _id,
                    ...userAssetData,
                    project: {
                      _id: projectId,
                      ...projectData,
                      projectGroup: getData(projectGroupDoc),
                    },
                  });
                }
                store.commit('SET_DATA_REPLACE', { ...state, payload });
              });
          });
        }
      }, setError);
  },

  getUserAssetDetails: (store, id) => {
    const state = { state: 'userAsset' };
    store.commit('SET_LOADING', state);

    const setError = (err) => {
      store.commit('SET_ERROR', state);
      console.error(err);
    };

    return db
      .collection(USERS_ASSETS)
      .doc(id)
      .onSnapshot((userAssetDoc) => {
        const _id = userAssetDoc.id;
        const userAssetData = getData(userAssetDoc);
        const { projectId } = userAssetData;

        db.collection(PROJECTS)
          .doc(projectId)
          .onSnapshot(async (projectDoc) => {
            const yieldRatesQuerySnapshot = await db.collection(PROJECTS).doc(projectId).collection(YIELD_RATES).get();
            const yieldRates = [];
            yieldRatesQuerySnapshot.forEach((yieldRateDoc) => {
              yieldRates.push(getData(yieldRateDoc));
            });

            const projectData = getData(projectDoc);
            const { projectGroupId } = projectData;

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

            const insuranceQuerySnapshot = await db
              .collection(PROJECT_GROUPS_DETAILED)
              .doc(projectGroupId)
              .collection(INSURANCES)
              .get();

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
              _id,
              ...userAssetData,
              project: {
                _id: projectId,
                ...projectData,
                entity: getData(entityDoc),
                yieldRates,
                projectGroup: {
                  ...projectGroupData,
                  ...getData(projectGroupDetailedDoc),
                  performance,
                  insurances,
                  manufacturers,
                },
              },
            };
            store.commit('SET_DATA_REPLACE', { ...state, payload });
          });
      }, setError);
  },
};

export default actions;
