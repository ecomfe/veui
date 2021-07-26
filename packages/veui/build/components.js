let fs = require('fs')
let path = require('path')
let dir = require('node-dir')

const componentDir = path.resolve(__dirname, '../src/components')

function genComponentJson () {
  let mappings = dir
    .files(componentDir, { sync: true })
    .reduce((mappings, file) => {
      let modulePath = path.relative(componentDir, file)
      let segments = modulePath.split('/')
      let last = segments[segments.length - 1].split('.')[0]
      let name
      if (last === 'index' && segments.length > 1) {
        name = segments[segments.length - 2]
        mappings.push({
          name,
          path: segments.slice(0, segments.length - 1).join('/')
        })
      } else {
        name = last
      }
      mappings.push({ name, path: modulePath })

      return mappings
    }, [])
    .filter(({ name }) => name && name !== 'index' && name.charAt(0) !== '_')

  fs.writeFileSync(
    path.resolve(__dirname, '../components.json'),
    JSON.stringify(mappings, null, '  ') + '\n',
    'utf8'
  )
}

function genComponentIndex () {
  let res = dir
    .files(componentDir, 'combine', null, {
      sync: true,
      recursive: false,
      shortName: true
    })
    .filter(file => {
      let match = /^[A-Z]/.exec(file)
      // 没有 index.js 的目录不要
      if (match) {
        let abs = path.join(componentDir, file)
        if (fs.statSync(abs).isDirectory()) {
          return fs.existsSync(path.join(abs, 'index.js'))
        }
      }
      return !!match
    })
    .sort()
    .reduce(
      (res, file) => {
        file = file.slice(0, file.length - path.extname(file).length)
        if (res.components.indexOf(file) === -1) {
          res.components.push(file)
          res.exports.push(`export { default as ${file} } from './${file}'`)
        }
        return res
      },
      { components: [], exports: [] }
    )

  let content =
    '// This file is generated automatically by `npm run components index`.\n' +
    res.exports.join('\n') +
    '\n'
  fs.writeFileSync(path.resolve(componentDir, 'index.js'), content, 'utf8')
}

if (process.argv.indexOf('index') >= 0) {
  genComponentIndex()
} else {
  genComponentJson()
}
