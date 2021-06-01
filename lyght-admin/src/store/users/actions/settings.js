import db from '@/store/firestore';
import { setUpdateParam, setCreateParam } from '@/store/utils';

const USER_COLLECTION = 'users';
const APP_SETTINGS = 'app_settings';

const userRef = db.collection(USER_COLLECTION);

const actions = {
  updateSettings: async (store, param) => {
    try {
      const { userId, ...updateParam } = param;
      const formattedParam = setUpdateParam(updateParam, store);
      await userRef.doc(userId).collection(APP_SETTINGS).doc('lyght-admin-arctic').update(formattedParam);
    } catch (err) {
      if (err.code === 'not-found') {
        const { userId, ...createParam } = param;
        const formattedParam = setCreateParam(createParam, store);
        await userRef.doc(userId).collection(APP_SETTINGS).doc('lyght-admin-arctic').set(formattedParam);
      } else {
        console.error('Error updating document', err);
        throw err;
      }
    }
  },
};

export default actions;
