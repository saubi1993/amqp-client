// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    babelOptions: {
      plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-private-methods']
    }
  },
  env: {
    node: true
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  // add your custom rules here
  rules: {
    'no-unused-vars': [1, { argsIgnorePattern: '^_' }],
    'no-multiple-empty-lines': 2,
    'class-methods-use-this': 0,
    'comma-dangle': ['error', 'never'],
    'no-console': ['error', { allow: ['warn', 'log'] }],
    'prettier/prettier': ['error', { singleQuote: true }],
    'import/prefer-default-export': 'off',
    'func-names': 0,
    'consistent-return': 0,
    'import/extensions': 0,
    'import/no-cycle': [2, { maxDepth: 20 }],
    // allow paren-less arrow functions
    'arrow-parens': process.env.NODE_ENV === 'production' ? 2 : 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'import/no-unresolved': 'off',
    'no-param-reassign': ['error', { props: false }],
    'no-underscore-dangle': 'off',
    eqeqeq: ['error', 'smart'],
    'no-use-before-define': 0,
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
        ignoreReadBeforeAssign: true
      }
    ]
  },
  globals: {
    gConfig: 'writable'
  }
};
