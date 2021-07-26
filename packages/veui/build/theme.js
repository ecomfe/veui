const { build } = require('esbuild')
const { resolve, dirname } = require('path')
const { readFileSync, writeFileSync, existsSync } = require('fs')
const { uniq, kebabCase } = require('lodash')

const componentsDir = resolve(__dirname, '../src/components')
const scriptRE = /<script\b(?:\s[^>]*>|>)(.*?)<\/script>/ims
const themeDir = resolve(__dirname, '../../veui-theme-dls')

function getComponentDeps () {
  let depMap = {}
  return build({
    entryPoints: ['./src/components/index.js'],
    write: false,
    bundle: true,
    format: 'esm',
    logLevel: 'error',
    plugins: [scanDepsPlugin(depMap)]
  }).then(() => {
    const componentDeps = {}
    Object.keys(depMap).forEach(key => {
      const name = getComponentName(key)
      if (name) {
        componentDeps[name] = resolveDirectDeps(depMap[key], depMap)
      }
    })
    return componentDeps
  })
}

function scanDepsPlugin (store) {
  return {
    name: 'scanVeuiDepPlugin',
    setup (build) {
      // 非相对引用直接忽略
      build.onResolve({ filter: /^[^.]/ }, ({ path }) => {
        return { path, external: true }
      })

      // 1. 补上 .vue
      // 2. 收集模块依赖关系
      build.onResolve({ filter: /^\.\/|^\.\.\// }, ({ path, importer }) => {
        if (importer) {
          let realPath = resolve(dirname(importer), path)
          store[importer] = store[importer] || []
          if (existsSync(`${realPath}.vue`)) {
            realPath = `${realPath}.vue`
            store[importer].push(realPath)
            return { path: realPath }
          } else {
            store[importer].push(realPath + '.js')
          }
        }
      })

      // 1. vue 文件直接抽取 script 内容
      // 2. components 下文件都过下 jsx
      build.onLoad({ filter: /.*/ }, ({ path }) => {
        if (path.startsWith(componentsDir)) {
          let contents = readFileSync(path, { encoding: 'utf-8' })
          if (path.endsWith('.vue')) {
            // extract script
            scriptRE.lastIndex = 0
            let match = scriptRE.exec(contents)
            if (match) {
              contents = match[1]
            }
          }
          return {
            contents,
            loader: 'jsx'
          }
        }
      })
    }
  }
}

function getComponentName (path) {
  // components/(Button) or components/(Button)/index
  let match = path.match(/\/components\/([A-Z]\w*)(?:\/index)?\.(?:vue|js)$/)
  if (!match) {
    // components/Menu/(Menu) or components/Menu/(Nav)
    match = path.match(/\/components\/(?:[A-Z]\w*)\/([A-Z]\w*)\.(?:vue|js)$/)
  }
  return match ? match[1] : null
}

function resolveDirectDeps (directDeps, depMap) {
  return directDeps.reduce((acc, dep) => {
    if (depMap[dep]) {
      // 深度优先: 保证越是下层依赖越在前面
      let chDeps = resolveDirectDeps(depMap[dep], depMap)
      if (chDeps.length) {
        acc.push(...chDeps)
      }
    }
    let name = getComponentName(dep)
    if (name) {
      acc.push(name)
    }
    acc = uniq(acc)
    return acc
  }, [])
}

function getSortedComponents (components) {
  let result = []
  Object.keys(components).forEach(name => {
    components[name].push(name)
    components[name].forEach(name => {
      if (!result.includes(name)) {
        result.push(name)
      }
    })
  })
  return result
}

function genThemeIndex (sortedComponents) {
  const theme = sortedComponents.reduce(
    (acc, name) => {
      if (existsSync(`${themeDir}/components/${name}.js`)) {
        acc.js.push(`import './components/${name}'`)
      }
      if (existsSync(`${themeDir}/components/${kebabCase(name)}.less`)) {
        acc.less.push(`import './components/${kebabCase(name)}.less'`)
      }
      return acc
    },
    { js: [], less: [] }
  )

  const content =
    '// This file is generated automatically by `npm run theme`\n' +
    theme.js.join('\n') +
    '\n\n' +
    `import './common.less'\n` +
    theme.less.join('\n') +
    '\n'

  writeFileSync(`${themeDir}/index.js`, content, { encoding: 'utf-8' })
}

getComponentDeps()
  .then(deps => {
    const sorted = getSortedComponents(deps)
    genThemeIndex(sorted)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
