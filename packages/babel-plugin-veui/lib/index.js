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
        var src = (0, _utils.normalize)(node.source.value);

        var resolvedComponentName = null;
        var normalizedPath = (0, _utils.normalize)(COMPONENTS_PATH + '/');
        if (src.indexOf(normalizedPath) === 0) {
          var componentPath = src.slice(normalizedPath.length);
          resolvedComponentName = getComponentName(componentPath);
        } else if (src !== 'veui') {
          if (src.charAt(0) !== '.' || file.opts.filename === 'unknown') {
            return;
          } else {
            resolvedComponentName = resolveComponent(file.opts.filename, src);
          }
        }

        var _opts$modules = opts.modules,
            modules = _opts$modules === undefined ? [] : _opts$modules,
            pack = opts.package,
            _opts$path = opts.path,
            packPath = _opts$path === undefined ? 'components' : _opts$path,
            transform = opts.transform,
            fileName = opts.fileName,
            resolve = opts.resolve;


        if (pack && fileName) {
          modules.push({ package: pack, path: packPath, transform: transform, fileName: fileName });
        }

        modules.forEach(function (_ref2) {
          var pack = _ref2.package,
              _ref2$path = _ref2.path,
              packPath = _ref2$path === undefined ? 'components' : _ref2$path,
              transform = _ref2.transform,
              fileName = _ref2.fileName;

          node.specifiers.map(function (_ref3) {
            var type = _ref3.type,
                imported = _ref3.imported;

            var name = void 0;
            if (imported) {
              name = imported.name === 'default' ? resolvedComponentName : isComponentName(imported.name) ? imported.name : null;
            } else if (type === 'ImportDefaultSpecifier') {
              name = resolvedComponentName;
            }
            return getPeerPath(getModuleName(name, transform), fileName);
          }).filter(function (v) {
            return v;
          }).forEach(function (name) {
            var modulePath = (0, _path.join)(pack, packPath, name);

            if (assurePath(modulePath, resolve)) {
              path.insertAfter(t.importDeclaration([], t.stringLiteral(modulePath)));
            }
          });
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
var COMPONENTS_PATH = (0, _utils.normalize)('veui/' + COMPONENTS_DIRNAME);

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
    case false:
    default:
      return name;
  }
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
    dirPath = _path2.default.join(pkg, 'src', dir);
    if (!_fs2.default.existsSync(dirPath)) {
      return null;
    }
  }

  var absPath = _path2.default.resolve(_path2.default.dirname(file), src);

  if (absPath.indexOf((0, _utils.normalize)(dirPath + '/')) !== 0) {
    return null;
  }
  return _path2.default.relative(dirPath, absPath);
}

function getComponentName(componentPath) {
  if (!componentPath) {
    return null;
  }
  var component = COMPONENTS.find(function (_ref4) {
    var path = _ref4.path;

    return path === componentPath || path.split('.')[0] === componentPath;
  });

  return component ? component.name : null;
}

function isComponentName(componentName) {
  return !!COMPONENTS.find(function (_ref5) {
    var name = _ref5.name;
    return name === componentName;
  });
}
module.exports = exports['default'];