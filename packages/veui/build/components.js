let fs = require('fs')
let path = require('path')
let dir = require('node-dir')

const componentDir = path.resolve(__dirname, '../src/components')

let mappings = dir
  .files(componentDir, { sync: true })
  .reduce((mappings, file) => {
    let modulePath = path.relative(componentDir, file)
    let segments = modulePath.split('/')
    let last = segments[segments.length - 1].split('.')[0]
    let name
    if (last === 'index' && segments.length > 1) {
      name = segments[segments.length - 2]
      mappings.push({ name, path: segments.slice(0, segments.length - 1).join('/') })
    } else {
      name = last
    }
    mappings.push({ name, path: modulePath })

    return mappings
  }, [])
  .filter(({ name }) => name !== 'index' && name.charAt(0) !== '_')

fs.writeFileSync(path.resolve(__dirname, '../../babel-plugin-veui/components.json'), JSON.stringify(mappings, null, '  '), 'utf8')
fs.writeFileSync(path.resolve(__dirname, '../../veui-loader/components.json'), JSON.stringify(mappings, null, '  '), 'utf8')
