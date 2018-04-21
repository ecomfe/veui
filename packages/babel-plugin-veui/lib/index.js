'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = function (babel) {
  var t = babel.types;


  return {
    name: 'veui',
    visitor: {
      ImportDeclaration: function ImportDeclaration(path) {
        var node = path.node;

        var src = (0, _utils.normalize)(node.source.value);

        if (src === 'veui') {
          if (node.specifiers.length === 1 && (node.specifiers[0].type === 'ImportDefaultSpecifier' || node.specifiers[0].type === 'ImportNamespaceSpecifier')) {
            return;
          }

          node.specifiers.forEach(function (_ref) {
            var type = _ref.type,
                imported = _ref.imported,
                local = _ref.local;

            if (imported.name === 'default') {
              path.insertBefore(t.importDeclaration([t.importDefaultSpecifier(t.identifier(local.name))], t.stringLiteral(src)));
              path.getSibling(path.key - 1).stop();
            } else {
              var realName = getComponentName(imported.name);

              var componentSrc = getComponentPath(realName);
              if (!componentSrc) {
                throw new Error('[' + realName + '] is not a valid component in VEUI.');
              }
              var name = local.name || imported.name;
              path.insertBefore(t.importDeclaration([t.importDefaultSpecifier(t.identifier(name))], t.stringLiteral(componentSrc)));
              path.getSibling(path.key - 1).stop();
            }
          });

          path.remove();
        }
      }
    }
  };
};

var _utils = require('./utils');

var _components = require('veui/components.json');

var _components2 = _interopRequireDefault(_components);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var COMPONENTS_DIRNAME = 'components';

var VAR_PATTERN = /(?:V(?:eui)?)?([A-Z][a-zA-Z]*)/;

function getComponentName(importedName) {
  var _importedName$match = importedName.match(VAR_PATTERN),
      _importedName$match2 = _slicedToArray(_importedName$match, 2),
      name = _importedName$match2[1];

  return name || null;
}

function getComponentPath(componentName) {
  var entry = _components2.default.find(function (_ref2) {
    var name = _ref2.name;
    return name === componentName;
  });
  if (!entry) {
    return null;
  }
  return 'veui/' + COMPONENTS_DIRNAME + '/' + entry.path;
}
module.exports = exports['default'];