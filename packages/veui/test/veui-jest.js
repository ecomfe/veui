const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const process = require('vue-jest').process
const loaderOptions = require('../build/veui-loader.conf')
const processSync = require('veui-loader').processSync

const SRC_PATH = path.join(__dirname, '..', 'src')

function resolveSync (modulePath) {
  modulePath = modulePath.replace(/^veui(?=[\\/])/, SRC_PATH)

  try {
    return require.resolve(modulePath)
  } catch (e) {
    return null
  }
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
