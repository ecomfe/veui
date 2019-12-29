module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: ['veui', 'lodash'],
  env: {
    test: {
      plugins: ['istanbul']
    }
  }
}
