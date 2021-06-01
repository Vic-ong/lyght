// const OVERVIEW = {
//   key: 'overview',
//   icon: '$fi-sr-layout-fluid',
//   name: 'Overview',
//   route: { name: 'overview' },
//   active: false,
// };
const USERS = {
  key: 'users',
  icon: '$fi-sr-users',
  name: 'Users',
  route: { name: 'users' },
  active: false,
};
const PROJECTS = {
  key: 'projects',
  icon: '$fi-sr-location-alt',
  name: 'Projects',
  route: { name: 'projects' },
  active: false,
};
const ORDERS = {
  key: 'orders',
  icon: '$fi-sr-document-signed',
  name: 'Orders',
  route: { name: 'orders' },
  active: false,
};
const FINANCE = {
  key: 'finance',
  icon: '$fi-sr-bank',
  name: 'Finance',
  route: { name: 'finance' },
  active: false,
};

const SETTINGS = {
  key: 'settings',
  icon: '$fi-sr-settings-sliders',
  name: 'Settings',
  route: { name: 'settings' },
  active: false,
};
const MISCELLANEOUS = {
  key: 'miscellaneous',
  icon: '$fi-sr-world',
  name: 'Miscellaneous',
  route: { name: 'miscellaneous' },
  active: false,
};

export const navs = [USERS, PROJECTS, ORDERS, FINANCE];

export const secondaryNavs = process.env.NODE_ENV === 'development' ? [SETTINGS, MISCELLANEOUS] : [SETTINGS];

export const logoutNav = {
  icon: '$fi-sr-sign-out',
  name: 'Sign Out',
};
