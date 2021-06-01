const { resolve } = require('path');

module.exports = {
  root: true,
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prefer-const': 1,
    semi: 1,
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'max-len': ['error', { code: 120, ignoreUrls: true, ignoreStrings: true }],
    'no-underscore-dangle': [2, { allow: ['_id'] }],
    'no-plusplus': 'off',
    'class-methods-use-this': 'off',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'lines-between-class-members': 'off',
    'no-unused-expressions': ['error', { allowShortCircuit: true }],
    "import/prefer-default-export": "off",
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        printWidth: 120,
        trailingComma: 'all',
      },
    ],
  },
  settings: {
    'import/resolver': {
      alias: [
        ['@', resolve(__dirname)],
      ],
    },
  },
}
