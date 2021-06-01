module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/airbnb', 'prettier'],
  plugins: ['prettier'],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'max-len': ['error', { code: 120, ignoreUrls: true, ignoreStrings: true }],
    'no-underscore-dangle': [2, { allow: ['_id'] }],
    'no-plusplus': 'off',
    'class-methods-use-this': 'off',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'lines-between-class-members': 'off',
    'no-unused-expressions': ['error', { allowShortCircuit: true }],
    'import/prefer-default-export': 'off',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        printWidth: 120,
        trailingComma: 'all',
      },
    ],
  },
};
