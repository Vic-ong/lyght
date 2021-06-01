import Login from '@/ui/views/Auth/Login.vue';
import AppSettings from '@/ui/views/Settings/AppSettings.vue';
import MiscellaneousView from '@/ui/views/Miscellaneous/MiscellaneousView.vue';
import Overview from '@/ui/views/Overview.vue';

import ManageUsers from '@/ui/views/Users/ManageUsers.vue';
import EditUser from '@/ui/views/Users/EditUser.vue';

import ManageProjects from '@/ui/views/Projects/ManageProjects.vue';
import ProjectGroupView from '@/ui/views/Projects/ProjectGroupView.vue';
import ProjectView from '@/ui/views/Projects/ProjectView.vue';

import ManageOrders from '@/ui/views/Orders/ManageOrders.vue';
import OrderView from '@/ui/views/Orders/OrderView.vue';

import FinanceDashboard from '@/ui/views/Finance/Dashboard.vue';
import ManageTransactions from '@/ui/views/Finance/Transactions/ManageTransactions.vue';
import EditTransaction from '@/ui/views/Finance/Transactions/EditTransaction.vue';
import ManageExpenses from '@/ui/views/Finance/Expenses/ManageExpenses.vue';
import ExpenseView from '@/ui/views/Finance/Expenses/ExpenseView.vue';
import ManagePaymentProvisions from '@/ui/views/Finance/PaymentProvisions/ManagePaymentProvisions.vue';
import PaymentProvisionView from '@/ui/views/Finance/PaymentProvisions/PaymentProvisionView.vue';

const routes = [
  {
    path: '/',
    redirect: { name: 'login' },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: 'Login',
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: AppSettings,
    meta: {
      title: 'App Settings',
      requiresAuth: true,
    },
  },
  {
    path: '/misc',
    name: 'miscellaneous',
    component: MiscellaneousView,
    meta: {
      title: 'Thought Catalog',
      requiresAuth: true,
    },
  },
  {
    path: '/overview',
    name: 'overview',
    component: Overview,
    meta: {
      title: 'Overview',
      requiresAuth: true,
    },
  },
  {
    path: '/users',
    name: 'users',
    component: ManageUsers,
    meta: {
      title: 'Manage Users',
      requiresAuth: true,
    },
  },
  {
    path: '/users/:id',
    name: 'users/:id',
    component: EditUser,
    meta: {
      title: 'Edit User',
      requiresAuth: true,
    },
  },
  {
    path: '/projects',
    name: 'projects',
    component: ManageProjects,
    meta: {
      title: 'Manage Projects',
      requiresAuth: true,
    },
  },
  {
    path: '/projects/groups/:id',
    name: 'projects/groups/:id',
    component: ProjectGroupView,
    meta: {
      title: 'Edit Project Group',
      requiresAuth: true,
    },
  },
  {
    path: '/projects/:id',
    name: 'projects/:id',
    component: ProjectView,
    meta: {
      title: 'Edit Project',
      requiresAuth: true,
    },
  },
  {
    path: '/orders',
    name: 'orders',
    component: ManageOrders,
    meta: {
      title: 'Manage Orders',
      requiresAuth: true,
    },
  },
  {
    path: '/orders/:id',
    name: 'orders/:id',
    component: OrderView,
    meta: {
      title: 'Edit Order',
      requiresAuth: true,
    },
  },
  {
    path: '/finance',
    name: 'finance',
    component: FinanceDashboard,
    meta: {
      title: 'Finance',
      requiresAuth: true,
    },
  },
  {
    path: '/finance/transactions',
    name: 'finance/transactions',
    component: ManageTransactions,
    meta: {
      title: 'Transactions',
      requiresAuth: true,
    },
  },
  {
    path: '/finance/transactions/:id',
    name: 'finance/transactions/:id',
    component: EditTransaction,
    meta: {
      title: 'Edit Transaction',
      requiresAuth: true,
    },
  },
  {
    path: '/finance/expenses',
    name: 'finance/expenses',
    component: ManageExpenses,
    meta: {
      title: 'Expenses',
      requiresAuth: true,
    },
  },
  {
    path: '/finance/expenses/:id',
    name: 'finance/expenses/:id',
    component: ExpenseView,
    meta: {
      title: 'Edit Expense',
      requiresAuth: true,
    },
  },
  {
    path: '/finance/payment-provisions',
    name: 'finance/payment-provisions',
    component: ManagePaymentProvisions,
    meta: {
      title: 'Payment Provisions',
      requiresAuth: true,
    },
  },
  {
    path: '/finance/payment-provisions/:id',
    name: 'finance/payment-provisions/:id',
    component: PaymentProvisionView,
    meta: {
      title: 'Edit Payment Provision',
      requiresAuth: true,
    },
  },
];

export default routes;
