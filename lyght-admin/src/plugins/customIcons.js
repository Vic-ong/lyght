const fiIcons = [
  'fi-sr-home',
  'fi-sr-users',
  'fi-sr-label',
  'fi-sr-info',
  'fi-sr-shopping-cart',
  'fi-sr-sign-out',
  'fi-sr-lock',
  'fi-sr-megaphone',
  'fi-sr-menu-burger',
  'fi-sr-mode-portrait',
  'fi-sr-mode-landscape',
  'fi-sr-picture',
  'fi-sr-pencil',
  'fi-sr-layout-fluid',
  'fi-sr-trash',
  'fi-sr-settings-sliders',
  'fi-sr-upload',
  'fi-sr-location-alt',
  'fi-sr-caret-up',
  'fi-sr-caret-down',
  'fi-sr-caret-right',
  'fi-sr-caret-left',
  'fi-sr-cross',
  'fi-sr-exclamation',
  'fi-sr-file-add',
  'fi-sr-interrogation',
  'fi-sr-opacity',
  'fi-sr-comment-alt',
  'fi-sr-cloud-upload',
  'fi-sr-user',
  'fi-sr-bank',
  'fi-sr-zoom-in',
  'fi-sr-grid',
  'fi-sr-dollar',
  'fi-sr-document-signed',
  'fi-sr-world',
];

const icons = fiIcons.reduce((acc, curr) => {
  acc[curr] = `fi ${curr}`;
  return acc;
}, {});

module.exports = icons;
