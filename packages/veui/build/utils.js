const { build } = require('esbuild')
const { resolve, dirname } = require('path')
const { readFileSync, existsSync } = require('fs')
const { uniq } = require('lodash')

const componentsDir = resolve(__dirname, '../src/components')
const indexPath = resolve(componentsDir, './index.js')
const scriptRE = /<script\b(?:\s[^>]*>|>)(.*?)<\/script>/ims

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
    // deps array
    // 用 index 文件中的引入顺序来保证相对顺序的稳定，避免两次运行而顺序不一致导致的 diff。
    return depMap[indexPath].map(key => ({
      name: getComponentName(key),
      deps: depMap[key] ? resolveDirectDeps(depMap[key], depMap) : []
    }))
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
          } else if (existsSync(`${realPath}.js`)) {
            realPath = `${realPath}.js`
          } else if (existsSync(`${realPath}/index.js`)) {
            realPath = `${realPath}/index.js`
          } else {
            throw new Error(`Can't resolve: ${path} in ${importer}`)
          }
          store[importer].push(realPath)
          return { path: realPath }
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

function getSortedComponents (componentDeps) {
  let result = []
  componentDeps.forEach(({ name, deps }) => {
    deps.push(name)
    deps.forEach(name => {
      if (!result.includes(name)) {
        result.push(name)
      }
    })
  })
  return result
}

module.exports = {
  getSortedComponents () {
    return getComponentDeps().then(deps => getSortedComponents(deps))
  }
}
