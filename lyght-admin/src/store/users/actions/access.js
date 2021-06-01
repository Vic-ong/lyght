import db from '@/store/firestore';
import { setUpdateParam } from '@/store/utils';

const ACCESS_COLLECTION = 'access';
const accessRef = db.collection(ACCESS_COLLECTION);

const actions = {
  updateAccess: async (store, param) => {
    try {
      const { id, ...updateParam } = param;
      const formattedParam = setUpdateParam(updateParam, store);
      await accessRef.doc(id).update(formattedParam);
    } catch (err) {
      console.error('Error updating document', err);
      throw err;
    }
  },
};

export default actions;
