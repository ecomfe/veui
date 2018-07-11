const fs = require('fs')
const crypto = require('crypto')
const process = require('vue-jest').process
const loaderOptions = require('../build/veui-loader-options')
const processSync = require('veui-loader').processSync

function resolveSync (modulePath) {
  return require.resolve(modulePath)
}

module.exports = {
  process (src, file, ...rest) {
    return process(processSync(src, file, loaderOptions, resolveSync), file, ...rest)
  },
  getCacheKey (src, file, configString, options) {
    return crypto
      .createHash('md5')
      .update(fs.readFileSync(__filename, 'utf8'))
      .update(src + file + configString)
      .update(options && options.instrument ? 'instrument' : '')
      .digest('hex')
  }
}
