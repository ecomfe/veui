const webpackConfig = require('@vue/cli-service/webpack.config.js')
const devServer = require('./build/dev-server')

let files = ['test/global.js']
if (process.env.KARMA_TEST_FILES_ONLY) {
  files = files.concat(
    process.env.KARMA_TEST_FILES_ONLY.split(',').map(v => v.trim())
  )
} else {
  files.push('test/unit/**/*.spec.js')
}

let browsers = []
if (process.env.KARMA_TEST_WITH_UI) {
  browsers.push('Chrome')
} else {
  browsers.push('ChromeHeadless')
}

module.exports = function (config) {
  config.set({
    frameworks: ['mocha', 'chai', 'expressServer'],

    files,

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

    browsers,

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
