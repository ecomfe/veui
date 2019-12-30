"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _utils = require("./utils");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var VEUI_PACKAGE_NAME = 'veui';
var COMPONENTS_DIRNAME = 'components';

function _default(_ref) {
  var t = _ref.types;
  return {
    name: 'veui',
    visitor: {
      ImportDeclaration: function ImportDeclaration(path, _ref2) {
        var _ref2$opts = _ref2.opts,
            opts = _ref2$opts === void 0 ? {} : _ref2$opts;
        var node = path.node;
        var _opts$alias = opts.alias,
            alias = _opts$alias === void 0 ? VEUI_PACKAGE_NAME : _opts$alias;
        var src = (0, _utils.normalize)(node.source.value);

        if (src === alias) {
          if (node.specifiers.length === 1 && (node.specifiers[0].type === 'ImportDefaultSpecifier' || node.specifiers[0].type === 'ImportNamespaceSpecifier')) {
            return;
          }

          node.specifiers.forEach(function (_ref3) {
            var imported = _ref3.imported,
                local = _ref3.local;

            if (imported.name === 'default') {
              path.insertBefore(t.importDeclaration([t.importDefaultSpecifier(t.identifier(local.name))], t.stringLiteral(src)));
              path.getSibling(path.key - 1).skip();
            } else {
              var realName = getComponentName(imported.name);
              var componentSrc = getComponentPath(realName, alias);

              if (!componentSrc) {
                throw new Error("[".concat(realName, "] is not a valid component in VEUI."));
              }

              var name = local.name || imported.name;
              path.insertBefore(t.importDeclaration([t.importDefaultSpecifier(t.identifier(name))], t.stringLiteral(componentSrc)));
              path.getSibling(path.key - 1).skip();
            }
          });
          path.remove();
        }
      }
    }
  };
}

var VAR_PATTERN = /(?:V(?:eui)?)?([A-Z][a-zA-Z]*)/;

function getComponentName(importedName) {
  var _importedName$match = importedName.match(VAR_PATTERN),
      _importedName$match2 = _slicedToArray(_importedName$match, 2),
      name = _importedName$match2[1];

  return name || null;
}

function getComponentPath(componentName, alias) {
  var components = require("".concat(alias, "/components.json"));

  var entry = components.find(function (_ref4) {
    var name = _ref4.name;
    return name === componentName;
  });

  if (!entry) {
    return null;
  }

  return "".concat(alias, "/").concat(COMPONENTS_DIRNAME, "/").concat(entry.path);
}