"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _utils = require("./utils");

var VEUI_PACKAGE_NAME = 'veui';
var PATTERN = new RegExp("^".concat(VEUI_PACKAGE_NAME, "(?=[/$])"));

function _default() {
  return {
    name: 'veui-rewrite',
    visitor: {
      ImportDeclaration: function ImportDeclaration(path, _ref) {
        var _ref$opts = _ref.opts,
            opts = _ref$opts === void 0 ? {} : _ref$opts;
        var node = path.node;
        var alias = opts.alias;
        var src = (0, _utils.normalize)(node.source.value);

        if (src.match(PATTERN)) {
          node.source.value = src.replace(PATTERN, alias);
        }
      }
    }
  };
}