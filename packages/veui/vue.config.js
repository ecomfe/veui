var path = require('path')
var veuiLoaderOptions = require('./build/veui-loader.conf')
var webpack = require('webpack')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const VEUI_PREFIX = process.env.VEUI_PREFIX || process.env.VUE_APP_VEUI_PREFIX

module.exports = {
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
        ...(VEUI_PREFIX
          ? {
            modifyVars: {
              'veui-prefix': VEUI_PREFIX
            }
          }
          : {})
      }
    }
  },
  outputDir: '../../components',
  transpileDependencies: [
    /[/\\]node_modules[/\\]veui[/\\]/,
    /[/\\]node_modules[/\\]veui-theme-dls[/\\]/,
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

    // config.devtool('source-map')

    config.resolve.alias
      .set(
        'vue$',
        process.env.NODE_ENV === 'test'
          ? 'vue/dist/vue.esm.js'
          : 'vue/dist/vue.runtime.esm.js'
      )
      .set('veui', resolve('src'))
      .set('veui-theme-one-icons', resolve('../veui-theme-one-icons/icons'))
      .set('veui-theme-dls-icons', resolve('../veui-theme-dls-icons/icons'))

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

    config
      .plugin('context-replacement')
      .use(webpack.ContextReplacementPlugin, [/moment[\\/]locale$/, /^$/])
  }
}
