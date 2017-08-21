'use strict';

var fs = require('fs');
var path = require('path');
var babel = require('babel-core');
var loaderUtils = require('loader-utils');
var resolveRc = require('babel-loader/lib/resolve-rc');
var read = require('babel-loader/lib/utils/read');
var resolve = require('enhanced-resolve/lib/node');

function makeSyncResolver(options) {
  return resolve.create.sync(options.resolve);
}

module.exports = function (content) {
  var loaderOptions = loaderUtils.getOptions(this) || {};
  var fileSystem = this.fs ? this.fs : fs;

  var babelrcPath = resolveRc(fileSystem, path.dirname(this.resourcePath));
  var babelrc = babelrcPath ? JSON.parse(read(fileSystem, babelrcPath)) : null;

  var options = {};
  if (babelrc) {
    var plugins = babelrc.plugins || [];
    var index = -1;
    for (var i = 0; i < plugins.length; i++) {
      var plugin = plugins[i];
      if (plugin === 'veui' || Array.isArray(plugin) && plugin[0] === 'veui') {
        index = i;
        if (plugin !== 'veui') {
          options = plugin[1] || {};
        }
        break;
      }
    }

    if (index === -1) {
      return content;
    }

    var resolveSync = makeSyncResolver(this.options);
    babelrc.plugins = babelrc.plugins || [];
    babelrc.plugins[index] = ['veui', Object.assign({}, options, {
      request: this.request,
      resolve: resolveSync
    })];

    var result = babel.transform(content, Object.assign(babelrc, {
      babelrc: false,
      filename: this.resourcePath
    }));

    this.callback(null, result.code, result.map, result.ast);
  }
  return content;
};