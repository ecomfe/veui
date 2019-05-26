module.exports = {
  presets: ['@vue/app'],
  plugins: ['veui', 'lodash'],
  env: {
    test: {
      plugins: ['istanbul']
    }
  }
}
