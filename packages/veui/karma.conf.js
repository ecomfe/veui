const webpackConfig = require('@vue/cli-service/webpack.config.js')

module.exports = function (config) {
  config.set({
    frameworks: ['mocha', 'chai'],

    files: [
      'node_modules/focus-visible/dist/focus-visible.js',
      'test/unit/**/*.spec.js'
    ],

    preprocessors: {
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
    }
  })
}
