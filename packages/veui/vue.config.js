var path = require('path')
var veuiLoaderOptions = require('./build/veui-loader.conf')
var webpack = require('webpack')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const lessOptions = {
  javascriptEnabled: true
}

module.exports = {
  outputDir: 'components',
  transpileDependencies: [
    /[/\\]node_modules[/\\]veui[/\\]/,
    /[/\\]node_modules[/\\]veui-theme-one[/\\]/,
    /[/\\]node_modules[/\\]vue-awesome[/\\]/,
    /[/\\]node_modules[/\\]resize-detector[/\\]/
  ],
  chainWebpack: config => {
    config
      .entry('app')
      .clear()
      .add('./demo/main.js')

    config.plugin('html').tap(args => {
      args[0].template = './demo/index.html'
      return args
    })

    config.resolve.alias
      .set('veui', resolve('src'))
      .set('veui-theme-one-icons', resolve('../veui-theme-one-icons/icons'))

    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options =>
        Object.assign({}, options, {
          compilerOptions: {
            whitespace: 'condense'
          }
        })
      )

    config.module
      .rule('veui')
      .test(/\.vue$/)
      .pre()
      .use('veui-loader')
      .loader('veui-loader')
      .tap(() => veuiLoaderOptions)

    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => {
      config.module
        .rule('less')
        .oneOf(type)
        .use('less-loader')
        .tap(options => Object.assign({}, options, lessOptions))
    })

    config
      .plugin('context-replacement')
      .use(webpack.ContextReplacementPlugin, [/moment[\\/]locale$/, /^$/])
  }
}
