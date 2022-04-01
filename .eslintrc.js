module.exports = {
  parser: '@babel/eslint-parser',
  plugins: ['prettier'],
  extends: ['prettier'],
  rules: {
    'prettier/prettier': ['error', require('./.prettierrc')],
  },
  env: {
    node: true,
  },
};
