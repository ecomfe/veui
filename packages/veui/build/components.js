let fs = require('fs')
let path = require('path')
let dir = require('node-dir')

const componentDir = path.resolve(__dirname, '../src/components')

function genComponents () {
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
    JSON.stringify(mappings, null, '  '),
    'utf8'
  )
}

function genIndex () {
  const srcDir = path.resolve(__dirname, '../src')

  let res = dir
    .files(componentDir, 'combine', null, {
      sync: true,
      recursive: false,
      shortName: true
    })
    .filter(file => /^[A-Z]/.exec(file))
    .sort()
    .reduce(
      (res, file) => {
        file = file.slice(0, file.length - path.extname(file).length)
        if (res.components.indexOf(file) === -1) {
          res.components.push(file)
          let modulePath = path.relative(srcDir, path.join(componentDir, file))
          res.exports.push(
            `export { default as ${file} } from './${modulePath}'`
          )
        }
        return res
      },
      { components: [], exports: [] }
    )
  fs.writeFileSync(
    path.resolve(srcDir, 'index.js'),
    res.exports.join('\n') + '\n',
    'utf8'
  )
}

if (process.argv.indexOf('index') >= 0) {
  genIndex()
} else {
  genComponents()
}
