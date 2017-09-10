var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var webpack = require('webpack')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': 'veui/src',
      'veui': 'veui/src'
    },
    symlinks: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'veui-loader',
        enforce: 'pre',
        include: [
          resolve('node_modules/veui'),
          resolve('node_modules/veui-theme-x'),
          resolve('src'),
          resolve('test')
        ]
      },
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [
          resolve('src'),
          resolve('node_modules/veui'),
          resolve('node_modules/veui-theme-x'),
          resolve('test')
        ],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        include: [
          resolve('src'),
          resolve('node_modules/veui'),
          resolve('node_modules/vue-awesome')
        ],
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          resolve('src'),
          resolve('node_modules/veui'),
          resolve('node_modules/veui-theme-x'),
          resolve('node_modules/vue-awesome')
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\\/]locale$/, /^$/)
  ]
}
