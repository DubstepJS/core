module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    node: true,
  },
  rules: {
    'prettier/prettier': ['error', require('./.prettierrc')],
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/ban-ts-comment': 1,
  },
  overrides: [
    {
      files: ['**/*.test.*'],
      env: {
        jest: true,
      },
    },
  ],
};
