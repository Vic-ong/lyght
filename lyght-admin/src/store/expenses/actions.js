import db from '@/store/firestore';
import Expense from '@/models/Expense';
import ProjectGroupExpenseAllocation from '@/models/ProjectGroupDetailed/ExpenseAllocation';
import { round } from '@/utils';
import { setError } from '@/store/utils';

const EXPENSES = 'expenses';
const PROJECT_GROUPS_DETAILED = 'project_groups_detailed';
const EXPENSE_ALLOCATIONS = 'expense_allocations';

const actions = {
  getExpense: (store, param) => {
    const state = { state: 'expense' };
    store.commit('SET_LOADING', state);
    return db
      .collection(EXPENSES)
      .doc(param)
      .onSnapshot(
        (doc) => {
          const payload = new Expense(doc).getData();
          payload.expenses = payload.expenses.sort((a, b) => a.account.localeCompare(b.account));
          store.commit('SET_DATA_REPLACE', { ...state, payload });
        },
        (err) => {
          setError(err);
          store.commit('SET_ERROR', state);
        },
      );
  },

  getExpenses: (store) => {
    const state = { state: 'expenses' };
    store.commit('SET_LOADING', state);

    return db.collection(EXPENSES).onSnapshot(
      (querySnapshot) => {
        const payload = [];
        querySnapshot.forEach((doc) => {
          payload.push(new Expense(doc).getData());
        });
        store.commit('SET_DATA_REPLACE', { ...state, payload });
      },
      (err) => {
        setError(err);
        store.commit('SET_ERROR', state);
      },
    );
  },

  getClosedExpenses: async (store) => {
    const state = { state: 'closedExpenses' };
    store.commit('SET_LOADING', state);

    return db
      .collection(EXPENSES)
      .where('status', '==', 'closed')
      .onSnapshot(
        (querySnapshot) => {
          const payload = [];
          querySnapshot.forEach((doc) => {
            payload.push(new Expense(doc).getData());
          });
          store.commit('SET_DATA_REPLACE', { ...state, payload });
        },
        (err) => {
          setError(err);
          store.commit('SET_ERROR', state);
        },
      );
  },

  createExpense: async (store, params) => {
    try {
      const { revenue, projectGroupId } = params;

      const expenseAllocationDocs = await db
        .collection(PROJECT_GROUPS_DETAILED)
        .doc(projectGroupId)
        .collection(EXPENSE_ALLOCATIONS)
        .get();

      const expenseAllocations = [];
      expenseAllocationDocs.forEach((doc) => {
        expenseAllocations.push(new ProjectGroupExpenseAllocation(doc).getData());
      });

      let outstanding = revenue;
      const expenses = expenseAllocations.map(({ account, amount }) => {
        const value = amount.type === 'percentage' ? round(amount.value * revenue, 2) : round(amount.value, 2);
        outstanding -= value;
        return { account, value };
      });

      const newExpense = new Expense({ expenses, outstanding, ...params }).setCreateDoc();
      const res = await db.collection(EXPENSES).add(newExpense);

      return {
        id: res.id,
        message: 'Created an expense document.',
      };
    } catch (err) {
      setError(err);
      throw err;
    }
  },

  updateExpense: async (store, data) => {
    try {
      const { id, ...params } = data;
      const updatedExpense = new Expense(params).setUpdateDoc();
      await db.collection(EXPENSES).doc(id).update(updatedExpense);
      return {
        id,
        message: 'Updated an expense document.',
      };
    } catch (err) {
      setError(err);
      throw err;
    }
  },
};

export default actions;
