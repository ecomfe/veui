const webpackConfig = require('@vue/cli-service/webpack.config.js')
const devServer = require('./build/dev-server')
const { devDependencies } = require('./package')

let files = ['test/global.js']
if (process.env.TEST_FILES) {
  files = files.concat(
    process.env.TEST_FILES.split(',')
      .map((v) => v.trim())
      .map((name) => `test/unit/**/${name}.spec.js`)
  )
} else {
  files.push('test/unit/**/*.spec.js')
}

let browsers = []
if (process.env.TEST_UI) {
  browsers.push('Chrome')
} else {
  browsers.push('ChromeHeadless')
}

module.exports = function (config) {
  config.set({
    // Make Karma work with pnpm.
    // See: https://github.com/pnpm/pnpm/issues/720#issuecomment-954120387
    plugins: Object.keys(devDependencies)
      .map((name) => (name.startsWith('karma-') ? require(name) : null))
      .filter(Boolean),

    frameworks: ['mocha', 'chai', 'expressServer'],

    files,

    browserNoActivityTimeout: 60000,

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
      reports: ['html', 'json', 'text-summary'],
      combineBrowserReports: true,
      fixWebpackSourcePaths: true,
      skipFilesWithNoCoverage: false,
      'report-config': {
        html: {
          subdir: 'html'
        },
        json: {
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
