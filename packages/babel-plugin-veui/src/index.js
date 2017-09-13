import fs from 'fs'
import { default as path, join } from 'path'
import pkgDir from 'pkg-dir'
import { kebabCase, camelCase, pascalCase, getJSON, normalize } from './utils'

const COMPONENTS = getJSON(path.resolve(__dirname, '../components.json'))
const COMPONENTS_DIRNAME = 'components'
const COMPONENTS_PATH = normalize(`veui/${COMPONENTS_DIRNAME}`)

let resolveCache = {}

export default function (babel) {
  const { types: t } = babel

  return {
    name: 'veui',
    visitor: {
      ImportDeclaration (path, { opts, file }) {
        let node = path.node
        let src = normalize(node.source.value)

        let resolvedComponentName = null
        let normalizedPath = normalize(`${COMPONENTS_PATH}/`)
        if (src.indexOf(normalizedPath) === 0) {
          // import Button from 'veui/components/Button'
          let componentPath = src.slice(normalizedPath.length)
          resolvedComponentName = getComponentName(componentPath)
        } else if (src !== 'veui') {
          if (src.charAt(0) !== '.' || file.opts.filename === 'unknown') {
            // cannot resolve when absolute path or current file path isn't available
            return
          } else {
            // relative path like './Select/Select'
            resolvedComponentName = resolveComponent(file.opts.filename, src)
          }
        }

        let {
          modules = [], package: pack, path: packPath = 'components',
          transform, fileName, resolve
        } = opts

        if (pack && fileName) {
          modules.push({ package: pack, path: packPath, transform, fileName })
        }

        modules.forEach(({
          package: pack, path: packPath = 'components',
          transform, fileName
        }) => {
          // no icon found, start to resolve components
          node.specifiers
            .map(({ type, imported }) => {
              let name
              if (imported) {
                name = imported.name === 'default'
                  // import { default as Whatever } from './Select' → Select
                  // import { default as Whatever } from 'veui/components/Select' → Select
                  ? resolvedComponentName
                  : isComponentName(imported.name)
                    // import { Select } from 'veui' → Select
                    ? imported.name
                    // import { Whatever } from 'veui' → null
                    : null
              } else if (type === 'ImportDefaultSpecifier') {
                // import Select from './Select' → null
                // import Select from 'veui/components/Select' → null
                // import Select from 'veui' → null
                name = resolvedComponentName
              }
              return getPeerPath(getModuleName(name, transform), fileName)
            })
            .filter(v => v)
            .forEach(name => {
              let modulePath = join(pack, packPath, name)

              if (assurePath(modulePath, resolve)) {
                path.insertAfter(t.importDeclaration([], t.stringLiteral(modulePath)))
              }
            })
        })
      }
    }
  }
}

function assurePath (modulePath, resolve) {
  if (resolveCache[modulePath] === false) {
    return
  } else if (!(modulePath in resolveCache)) {
    if (typeof resolve === 'function') {
      try {
        resolve({}, process.cwd(), modulePath)
        resolveCache[modulePath] = true
      } catch (e) {
        resolveCache[modulePath] = false
      }
    }
  }

  return resolveCache[modulePath]
}

/* eslint-disable no-template-curly-in-string */
function getPeerPath (name, template = '${module}.css') {
  if (!name) {
    return null
  }
  return template.replace(/\$\{module\}/g, name)
}
/* eslint-enable no-template-curly-in-string */

function getModuleName (name, transform = 'kebab-case') {
  if (!name) {
    return false
  }
  switch (transform) {
    case 'kebab-case':
      return kebabCase(name)
    case 'camelCase':
      return camelCase(name)
    case 'PascalCase':
      return pascalCase(name)
    case false:
    default:
      return name
  }
}

// 'veui/src/components/Option.vue', '../Icon.vue' → 'Icon'
function resolveComponent (file, src) {
  return getComponentName(resolveRelative(file, src, COMPONENTS_DIRNAME))
}

// 'veui/src/components/Select/Option.vue', '../Icon.vue', 'components' → 'Icon.vue'
function resolveRelative (file, src, dir) {
  // make sure relative paths resolved to somewhere inside veui
  let pkg = pkgDir.sync(file)
  if (!pkg || getJSON(path.join(pkg, 'package.json')).name !== 'veui') {
    return null
  }

  // veui/${dir} or veui/src/${dir}
  let dirPath = path.join(pkg, dir) // runtime
  if (!fs.existsSync(dirPath)) {
    dirPath = path.join(pkg, 'src', dir) // dev
    if (!fs.existsSync(dirPath)) {
      return null
    }
  }

  let absPath = path.resolve(path.dirname(file), src)

  if (absPath.indexOf(normalize(`${dirPath}/`)) !== 0) {
    return null
  }
  return path.relative(dirPath, absPath)
}

// 'Icon.vue' → 'Icon'
function getComponentName (componentPath) {
  if (!componentPath) {
    return null
  }
  let component = COMPONENTS.find(({ path }) => {
    return path === componentPath || path.split('.')[0] === componentPath
  })

  return component ? component.name : null
}

function isComponentName (componentName) {
  return !!COMPONENTS.find(({ name }) => name === componentName)
}
