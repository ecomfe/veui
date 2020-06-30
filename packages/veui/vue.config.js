const path = require('path')
const veuiLoaderOptions = require('./build/veui-loader.conf')
const webpack = require('webpack')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const VEUI_PREFIX = process.env.VEUI_PREFIX || process.env.VUE_APP_VEUI_PREFIX
const vars = {}

module.exports = {
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          ...vars,
          ...(VEUI_PREFIX
            ? {
              'veui-prefix': VEUI_PREFIX
            }
            : {})
        }
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
      .tap(options => ({
        ...options,
        compilerOptions: {
          ...options.compilerOptions,
          whitespace: 'condense'
        }
      }))

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
  },
  devServer: {
    before (app) {
      app.post('/upload', (req, res) => {
        res.json({
          success: Math.random() > 0.5,
          src: 'https://webpack.js.org/e0b5805d423a4ec9473ee315250968b2.svg',
          message: 'image too large'
        })
      })

      app.post('/uploadiframe', (req, res) => {
        res.send(
          '<script>window.parent.postMessage({code: 0, result: {src: "https://webpack.js.org/e0b5805d423a4ec9473ee315250968b2.svg"}})</script>'
        )
      })
    }
  }
}
