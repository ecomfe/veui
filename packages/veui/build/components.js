const { writeFileSync, statSync, existsSync, readdirSync } = require('fs')
const { resolve, relative, join, extname } = require('path')
const recursive = require('recursive-readdir')
const { getSortedComponents } = require('./utils')

const componentDir = resolve(__dirname, '../src/components')

async function genComponentJson () {
  let files = await recursive(componentDir)
  let mappings = files
    .reduce((mappings, file) => {
      let modulePath = relative(componentDir, file)
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

  // components.json 里组件声明的顺序要确保遵循了依赖关系，样式打包时可参照此顺序输出
  const sorted = await getSortedComponents()
  mappings.sort((a, b) => sorted.indexOf(a.name) - sorted.indexOf(b.name))

  writeFileSync(
    resolve(__dirname, '../components.json'),
    JSON.stringify(mappings, null, '  ') + '\n',
    'utf8'
  )
}

/**
 * 用 components/[A-Z]xxx(.js|.vue|/index.js) 生成 components/index.js
 */
function genComponentIndex () {
  let files = readdirSync(componentDir, { encoding: 'utf8' })
  let res = files
    .filter((file) => {
      let match = /^[A-Z]/.test(file)
      // 没有 index.js 的目录不要
      if (match) {
        let abs = join(componentDir, file)
        if (statSync(abs).isDirectory()) {
          return existsSync(join(abs, 'index.js'))
        }
      }
      return !!match && /\.(?:js|vue)$/.test(file)
    })
    .sort()
    .reduce(
      (res, file) => {
        file = file.slice(0, file.length - extname(file).length)
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
  writeFileSync(resolve(componentDir, 'index.js'), content, 'utf8')
}

genComponentIndex()
genComponentJson().catch((err) => {
  console.error(err)
  process.exit(1)
})
