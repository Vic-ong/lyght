import db from '@/store/firestore';
import ProjectGroupExpenseAllocation from '@/models/ProjectGroupDetailed/ExpenseAllocation';
import { setError } from '@/store/utils';

const PROJECT_GROUPS_DETAILED = 'project_groups_detailed';
const EXPENSE_ALLOCATIONS = 'expense_allocations';

const actions = {
  getExpenseAllocationsByProjectGroup: (store, projectGroupId) => {
    const state = { state: 'expenseAllocations' };
    store.commit('SET_LOADING', state);

    return db
      .collection(PROJECT_GROUPS_DETAILED)
      .doc(projectGroupId)
      .collection(EXPENSE_ALLOCATIONS)
      .onSnapshot(
        (querySnapshot) => {
          const payload = [];
          querySnapshot.forEach((doc) => {
            payload.push(new ProjectGroupExpenseAllocation(doc).getData());
          });
          store.commit('SET_DATA_REPLACE', { ...state, payload });
        },
        (err) => {
          store.commit('SET_ERROR', state);
          setError(err);
        },
      );
  },
  createExpenseAllocation: async (store, params) => {
    try {
      const { projectGroupId, ...restParams } = params;

      const newExpenseAllocation = new ProjectGroupExpenseAllocation({
        ...restParams,
      }).setCreateDoc();

      const res = await db
        .collection(PROJECT_GROUPS_DETAILED)
        .doc(projectGroupId)
        .collection(EXPENSE_ALLOCATIONS)
        .add(newExpenseAllocation);

      return {
        id: res.id,
        message: 'Created an expense allocation record.',
      };
    } catch (err) {
      setError(err);
      throw err;
    }
  },
  updateExpenseAllocation: async (store, params) => {
    try {
      const { id, projectGroupId, ...restParams } = params;
      const updatedExpenseAllocation = new ProjectGroupExpenseAllocation(restParams).setUpdateDoc();
      await db
        .collection(PROJECT_GROUPS_DETAILED)
        .doc(projectGroupId)
        .collection(EXPENSE_ALLOCATIONS)
        .doc(id)
        .update(updatedExpenseAllocation);

      return {
        id,
        message: 'Updated expense allocation record.',
      };
    } catch (err) {
      setError(err);
      throw err;
    }
  },
  deleteExpenseAllocation: async (store, params) => {
    try {
      const { id, projectGroupId } = params;
      await db.collection(PROJECT_GROUPS_DETAILED).doc(projectGroupId).collection(EXPENSE_ALLOCATIONS).doc(id).delete();

      return {
        id,
        message: 'Deleted expense allocation record.',
      };
    } catch (err) {
      setError(err);
      throw err;
    }
  },
};

export default actions;
