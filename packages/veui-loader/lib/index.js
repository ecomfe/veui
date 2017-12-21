'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (content) {
  var loaderOptions = _loaderUtils2.default.getOptions(this) || {};
  var component = resolveComponent(this.resourcePath);
  if (!component) {
    return content;
  }

  var resolve = makeSyncResolver(this.options);
  return patchComponent(content, component, loaderOptions, resolve);
};

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _pkgDir = require('pkg-dir');

var _pkgDir2 = _interopRequireDefault(_pkgDir);

var _loaderUtils = require('loader-utils');

var _loaderUtils2 = _interopRequireDefault(_loaderUtils);

var _utils = require('./utils');

var _node = require('enhanced-resolve/lib/node');

var _node2 = _interopRequireDefault(_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var COMPONENTS = (0, _utils.getJSON)(_path2.default.resolve(__dirname, '../components.json'));
var COMPONENTS_DIRNAME = 'components';
var EXT_TYPES = {
  SCRIPT: ['js'],
  STYLE: ['css', 'less', 'styl', 'sass', 'scss']
};

var resolveCache = {};

function patchComponent(content, component, options, resolve) {
  var _options$modules = options.modules,
      modules = _options$modules === undefined ? [] : _options$modules,
      pack = options.package,
      _options$path = options.path,
      packPath = _options$path === undefined ? COMPONENTS_DIRNAME : _options$path,
      transform = options.transform,
      fileName = options.fileName;


  if (pack && fileName) {
    modules.push({ package: pack, path: packPath, transform: transform, fileName: fileName });
  }

  if (!modules.length) {
    return content;
  }

  var parts = modules.reduce(function (acc, _ref) {
    var pack = _ref.package,
        _ref$path = _ref.path,
        packPath = _ref$path === undefined ? COMPONENTS_DIRNAME : _ref$path,
        transform = _ref.transform,
        fileName = _ref.fileName;

    var peerComponent = getPeerFilename(component, {
      transform: transform,
      template: fileName
    });
    var peerPath = _path2.default.join(pack, packPath, peerComponent);
    if (assurePath(peerPath, resolve)) {
      pushPart(acc, peerPath);
    }
    return acc;
  }, {
    script: [],
    style: []
  });

  return Object.keys(parts).reduce(function (content, type) {
    return parts[type].reduce(function (content, peerPath) {
      return patchType(content, type, peerPath);
    }, content);
  }, content);
}

function pushPart(parts, file) {
  var ext = getExtname(file);
  var type = Object.keys(EXT_TYPES).find(function (key) {
    return EXT_TYPES[key].includes(ext);
  });
  parts[type.toLowerCase()].push(file);
}

function getExtname(file) {
  return _path2.default.extname(file).replace(/\./g, '').toLowerCase();
}

var RE_SCRIPT = /<script(?:\s+[^>]*)?>/i;

function patchType(content, type, peerPath) {
  var normalizedPath = (0, _utils.normalize)(peerPath).replace(/\\/g, '\\\\');
  switch (type) {
    case 'script':
      content = content.replace(RE_SCRIPT, function (match) {
        return match + '\nimport \'' + normalizedPath + '\'\n';
      });
      break;
    case 'style':
      var langStr = '';
      var ext = getExtname(normalizedPath);
      if (ext !== 'css') {
        langStr = 'lang="' + ext + '" ';
      }
      content += '\n<style ' + langStr + 'src="' + normalizedPath + '"></style>\n';
      break;
    default:
      break;
  }

  return content;
}

function makeSyncResolver(options) {
  return _node2.default.create.sync(options.resolve);
}

function assurePath(modulePath, resolve) {
  if (resolveCache[modulePath] === false) {
    return;
  } else if (!(modulePath in resolveCache)) {
    if (typeof resolve === 'function') {
      try {
        resolve({}, process.cwd(), modulePath);
        resolveCache[modulePath] = true;
      } catch (e) {
        resolveCache[modulePath] = false;
      }
    }
  }

  return resolveCache[modulePath];
}

function getPeerFilename(name, _ref2) {
  var _ref2$transform = _ref2.transform,
      transform = _ref2$transform === undefined ? 'kebab-case' : _ref2$transform,
      _ref2$template = _ref2.template,
      template = _ref2$template === undefined ? '${module}.css' : _ref2$template;

  if (!name) {
    return null;
  }

  switch (transform) {
    case 'kebab-case':
      name = (0, _utils.kebabCase)(name);
      break;
    case 'camelCase':
      name = (0, _utils.camelCase)(name);
      break;
    case 'PascalCase':
      name = (0, _utils.pascalCase)(name);
      break;
    case false:
    default:
      break;
  }

  return template.replace(/\$\{module\}/g, name);
}

function resolveComponent(file) {
  var pkg = _pkgDir2.default.sync(file);
  if (!pkg || (0, _utils.getJSON)(_path2.default.join(pkg, 'package.json')).name !== 'veui') {
    return null;
  }

  var dirPath = _path2.default.join(pkg, COMPONENTS_DIRNAME);
  if (!_fs2.default.existsSync(dirPath)) {
    dirPath = _path2.default.join(pkg, 'src', COMPONENTS_DIRNAME);
    if (!_fs2.default.existsSync(dirPath)) {
      return null;
    }
  }

  return getComponentName(_path2.default.relative(dirPath, file));
}

function getComponentName(componentPath) {
  if (!componentPath) {
    return null;
  }
  var component = COMPONENTS.find(function (_ref3) {
    var path = _ref3.path;

    return path === componentPath || path.split('.')[0] === componentPath;
  });

  return component ? component.name : null;
}
module.exports = exports['default'];