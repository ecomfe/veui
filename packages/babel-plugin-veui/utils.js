"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kebabCase = kebabCase;
exports.camelCase = camelCase;
exports.pascalCase = pascalCase;
exports.transformName = transformName;
exports.getJSON = getJSON;
exports.normalize = normalize;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function kebabCase(str) {
  return str.replace(/[-_ ]+|([A-Z])/g, function (whole, ch) {
    return ch ? "-".concat(ch.toLowerCase()) : '-';
  }).replace(/^-/g, '').replace(/-+/g, '-');
}

function camelCase(str) {
  return kebabCase(str).replace(/-([a-z])/g, function (whole, ch) {
    return ch.toUpperCase();
  });
}

function pascalCase(str) {
  return camelCase(str).replace(/^([a-z])/g, function (whole, ch) {
    return ch.toUpperCase();
  });
}

function transformName(name) {
  var transform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (!name) {
    return null;
  }

  switch (transform) {
    case 'kebab-case':
      return kebabCase(name);

    case 'camelCase':
      return camelCase(name);

    case 'PascalCase':
      return pascalCase(name);

    default:
      return name;
  }
}

function getJSON(path) {
  return JSON.parse(_fs["default"].readFileSync(path, 'utf8'));
}

function normalize(filePath) {
  return filePath.replace(/[/\\]/g, _path["default"].sep);
}