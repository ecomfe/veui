module.exports = function (context, options) {
  return {
    presets: [[require('babel-preset-vue-app'), options]],
    plugins: [
      'babel-plugin-veui',
      'babel-plugin-lodash',
      'babel-plugin-transform-class-properties'
    ]
  }
}
