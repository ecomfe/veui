'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (babel) {
  var t = babel.types;


  return {
    name: 'veui',
    visitor: {
      ImportDeclaration: function ImportDeclaration(path, _ref) {
        var opts = _ref.opts,
            file = _ref.file;

        var node = path.node;
        var src = node.source.value;

        var resolvedComponentName = null;
        var resolvedIcon = null;

        if (src.indexOf(COMPONENTS_PATH + '/') === 0) {
          var componentPath = src.slice(COMPONENTS_PATH.length + 1);
          resolvedComponentName = getComponentName(componentPath);
        } else if (src === ICONS_PATH || src.indexOf(ICONS_PATH + '/') === 0) {
          resolvedIcon = src === ICONS_PATH ? 'index' : src.replace(ICONS_PATH + '/', '');
        } else if (src !== 'veui') {
          if (src.charAt(0) !== '.' || file.opts.filename === 'unknown') {
            return;
          } else {
              resolvedIcon = resolveIcon(file.opts.filename, src);
              resolvedComponentName = resolveComponent(file.opts.filename, src);
            }
        }

        var pack = opts.package,
            _opts$path = opts.path,
            packPath = _opts$path === undefined ? 'components' : _opts$path,
            _opts$icons = opts.icons,
            icons = _opts$icons === undefined ? 'icons' : _opts$icons,
            resolve = opts.resolve;

        if (resolvedIcon != null) {
          var iconPath = (0, _path.join)(pack, icons, resolvedIcon);
          if (assurePath(iconPath, resolve)) {
            node.source.value = iconPath;
          } else {
            path.remove();
            (0, _utils.warn)('no icon found for path [' + iconPath + '], from module [' + file.opts.filename + ']');
          }

          return;
        }

        node.specifiers.map(function (_ref2) {
          var type = _ref2.type,
              imported = _ref2.imported;

          var name = void 0;
          if (imported) {
            name = imported.name === 'default' ? resolvedComponentName : isComponentName(imported.name) ? imported.name : null;
          } else if (type === 'ImportDefaultSpecifier') {
            name = resolvedComponentName;
          }
          return getPeerPath(getModuleName(name, opts.transform), opts.fileName);
        }).filter(function (v) {
          return v;
        }).forEach(function (name) {
          var modulePath = (0, _path.join)(pack, packPath, name);

          if (assurePath(modulePath, resolve)) {
            path.insertAfter(t.importDeclaration([], t.stringLiteral(modulePath)));
          }
        });
      }
    }
  };
};

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _pkgDir = require('pkg-dir');

var _pkgDir2 = _interopRequireDefault(_pkgDir);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var COMPONENTS = (0, _utils.getJSON)(_path2.default.resolve(__dirname, '../components.json'));
var COMPONENTS_DIRNAME = 'components';
var COMPONENTS_PATH = 'veui/' + COMPONENTS_DIRNAME;
var ICONS_DIRNAME = 'icons';
var ICONS_PATH = 'veui/' + ICONS_DIRNAME;

var resolveCache = {};

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

function getPeerPath(name) {
  var template = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '${module}.css';

  if (!name) {
    return null;
  }
  return template.replace(/\$\{module\}/g, name);
}

function getModuleName(name) {
  var transform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'kebab-case';

  if (!name) {
    return false;
  }
  switch (transform) {
    case 'kebab-case':
      return (0, _utils.kebabCase)(name);
    case 'camelCase':
      return (0, _utils.camelCase)(name);
    case 'PascalCase':
      return (0, _utils.pascalCase)(name);
    default:
      return name;
  }
}

function resolveIcon(file, src) {
  var icon = resolveRelative(file, src, ICONS_DIRNAME);
  if (icon === '') {
    icon = 'index';
  }
  return icon;
}

function resolveComponent(file, src) {
  return getComponentName(resolveRelative(file, src, COMPONENTS_DIRNAME));
}

function resolveRelative(file, src, dir) {
  var pkg = _pkgDir2.default.sync(file);
  if (!pkg || (0, _utils.getJSON)(_path2.default.join(pkg, 'package.json')).name !== 'veui') {
    return null;
  }

  var dirPath = _path2.default.join(pkg, dir);
  if (!_fs2.default.existsSync(dirPath)) {
    dirPath = _path2.default.join(pkg, 'src/' + dir);
    if (!_fs2.default.existsSync(dirPath)) {
      return null;
    }
  }

  var absPath = _path2.default.resolve(_path2.default.dirname(file), src);

  if (absPath.indexOf(dirPath + '/') !== 0) {
    return null;
  }
  return _path2.default.relative(dirPath, absPath);
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

function isComponentName(componentName) {
  return !!COMPONENTS.find(function (_ref4) {
    var name = _ref4.name;
    return name === componentName;
  });
}
module.exports = exports['default'];