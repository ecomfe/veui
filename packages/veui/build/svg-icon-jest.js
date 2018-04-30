module.exports = {
  process (src, filePath, jestConfig) {
    const iconName = require('path').basename(filePath, '.svg')
    return `import Icon from '@/components/Icon';Icon.register({'${iconName}': {width: 0, height: 0, raw: '<svg>test</svg>'}})`
  }
}
