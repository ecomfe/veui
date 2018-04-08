// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#bulb-rules
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: ['vue', 'prettier'],
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // fix unused var error for JSX custom tags
    'vue/jsx-uses-vars': 2,
    'no-multi-spaces': ['error', { ignoreEOLComments: true }],
    'no-template-curly-in-string': 0,
    // to many false positives
    'vue/no-side-effects-in-computed-properties': 0
  }
}
