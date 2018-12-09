module.exports = {
  bail: true,
  verbose: true,
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.{js,vue}'],
  // coverageThreshold: {
  //   'src/**/*.js': {
  //     branches: 90,
  //     functions: 90,
  //     lines: 90,
  //     statements: 90
  //   },
  //   'src/**/*.vue': {
  //     branches: 40,
  //     functions: 50,
  //     lines: 50,
  //     statements: 50
  //   }
  // },
  coverageDirectory: '<rootDir>/test/unit/coverage',
  coverageReporters: ['lcov', 'text-summary'],
  moduleFileExtensions: ['js', 'vue', 'jsx'],
  testMatch: [
    '**/__tests__/**/*.js?(x)',
    '**/?(*.)(spec|test).js?(x)'
  ],
  moduleNameMapper: {
    '^veui$': '<rootDir>/src/index.js',
    '^veui\\/(.*)': '<rootDir>/src/$1',
    '^veui-theme-one-icons\\/(.*)': '<rootDir>/../veui-theme-one-icons/icons/$1',
    '^@\\/(.*)': '<rootDir>/src/$1',
    '^vue$': '<rootDir>/node_modules/vue/dist/vue.common.js'
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!vue-awesome|resize-detector|veui-theme-one)'
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.vue$': '<rootDir>/test/veui-jest',
    '.*\\.svg$': '<rootDir>/build/svg-icon-jest'
  },
  setupFiles: ['./test/unit/env.js'],
  testURL: 'http://localhost' // https://github.com/facebook/jest/issues/6766
}
