module.exports = {
  process(src, filePath, jestConfig) {
    const iconName = filePath.split(require('path').sep).slice(-1)[0].replace(/\..*$/, '');
    return `var Icon = require('veui/components/Icon');Icon.default.register({'${iconName}': {width: 0, height: 0, raw: '<svg>test</svg>'}})`;
  }
}
