module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
  moduleNameMapper: {
    '^@\\/(.*)': '<rootDir>/src/$1',
    '^veui$': '<rootDir>/src/index.js',
    '^veui\\/(.*)': '<rootDir>/src/$1',
    '^veui-theme-one-icons\\/(.*)':
      '<rootDir>/../veui-theme-one-icons/icons/$1',
    '^vue$': '<rootDir>/node_modules/vue/dist/vue.common.prod.js'
  },
  setupFiles: ['./test/unit/env.js'],
  snapshotSerializers: ['jest-serializer-vue'],
  testMatch: [
    '**/test/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'
  ],
  testURL: 'http://localhost/',
  transform: {
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.vue$': '<rootDir>/test/veui-jest'
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!vue-awesome|resize-detector|veui-theme-one)'
  ]
}
