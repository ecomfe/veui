// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    // to edit target browsers: use "browserlist" field in package.json
    "autoprefixer": {
        browsers: ['ie >= 9', 'last 2 versions']
    },
    "cssnano": {
        autoprefixer: false,
        safe: true
    }
  }
}
