'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
              var componentSrc = getComponentPath(imported.name);
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

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var COMPONENTS = (0, _utils.getJSON)(_path2.default.resolve(__dirname, '../components.json'));
var COMPONENTS_DIRNAME = 'components';

function getComponentPath(componentName) {
  var entry = COMPONENTS.find(function (_ref2) {
    var name = _ref2.name;
    return name === componentName;
  });
  if (!entry) {
    return null;
  }
  return 'veui/' + COMPONENTS_DIRNAME + '/' + entry.path;
}
module.exports = exports['default'];