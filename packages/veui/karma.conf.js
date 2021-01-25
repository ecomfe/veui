const webpackConfig = require('@vue/cli-service/webpack.config.js')
const devServer = require('./build/dev-server')

module.exports = function (config) {
  config.set({
    frameworks: ['mocha', 'chai', 'expressServer'],

    files: ['test/global.js', 'test/unit/**/*.spec.js'],

    preprocessors: {
      'test/global.js': ['webpack'],
      '**/*.spec.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      logLevel: 'warn',
      stats: 'errors-only'
    },

    reporters: ['spec', 'coverage-istanbul'],

    browsers: ['ChromeHeadless'],

    coverageIstanbulReporter: {
      dir: './test/coverage',
      reports: ['html', 'lcov', 'text-summary'],
      combineBrowserReports: true,
      fixWebpackSourcePaths: true,
      skipFilesWithNoCoverage: false,
      'report-config': {
        html: {
          subdir: 'html'
        },
        lcov: {
          subdir: '.'
        }
      }
    },

    proxies: {
      '/upload/': 'http://localhost:9877/upload/'
    },

    expressServer: {
      port: 9877, // different than karma's port
      extensions: [
        function (
          app, // express app
          logger // karma logger
        ) {
          devServer.before(app)
        }
      ]
    }
  })
}
