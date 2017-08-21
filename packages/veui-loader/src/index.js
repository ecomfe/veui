const fs = require('fs')
const path = require('path')
const babel = require('babel-core')
const loaderUtils = require('loader-utils')
const resolveRc = require('babel-loader/lib/resolve-rc')
const read = require('babel-loader/lib/utils/read')
const resolve = require('enhanced-resolve/lib/node')

// See https://github.com/webpack/enhanced-resolve/issues/46
function makeSyncResolver (options) {
  return resolve.create.sync(options.resolve)
}

module.exports = function (content) {
  const loaderOptions = loaderUtils.getOptions(this) || {}
  const fileSystem = this.fs ? this.fs : fs

  let babelrcPath = resolveRc(fileSystem, path.dirname(this.resourcePath))
  let babelrc = babelrcPath ? JSON.parse(read(fileSystem, babelrcPath)) : null

  let options = {}
  if (babelrc) {
    let plugins = (babelrc.plugins || [])
    let index = -1
    for (let i = 0; i < plugins.length; i++) {
      let plugin = plugins[i]
      if (plugin === 'veui' || Array.isArray(plugin) && plugin[0] === 'veui') {
        index = i
        if (plugin !== 'veui') {
          options = plugin[1] || {}
        }
        break
      }
    }

    if (index === -1) {
      // veui not configured, skip
      return content
    }

    const resolveSync = makeSyncResolver(this.options)
    babelrc.plugins = babelrc.plugins || []
    babelrc.plugins[index] = [
      'veui',
      Object.assign({}, options, {
        request: this.request,
        resolve: resolveSync
      })
    ]

    let result = babel.transform(content, Object.assign(babelrc, {
      babelrc: false,
      filename: this.resourcePath
    }))

    this.callback(null, result.code, result.map, result.ast)
  }
  return content
}
