import fs from 'fs'
import { default as path, join } from 'path'
import pkgDir from 'pkg-dir'
import { kebabCase, camelCase, pascalCase, getJSON, warn } from './utils'

const COMPONENTS = getJSON(path.resolve(__dirname, '../components.json'))
const COMPONENTS_DIRNAME = 'components'
const COMPONENTS_PATH = `veui/${COMPONENTS_DIRNAME}`
const ICONS_DIRNAME = 'icons'
const ICONS_PATH = `veui/${ICONS_DIRNAME}`

let resolveCache = {}

export default function (babel) {
  const { types: t } = babel

  return {
    name: 'veui',
    visitor: {
      ImportDeclaration (path, { opts, file }) {
        let node = path.node
        let src = node.source.value

        let resolvedComponentName = null
        let resolvedIcon = null

        if (src.indexOf(`${COMPONENTS_PATH}/`) === 0) {
          // import Button from 'veui/components/Button'
          let componentPath = src.slice(COMPONENTS_PATH.length + 1)
          resolvedComponentName = getComponentName(componentPath)
        } else if (src === ICONS_PATH || src.indexOf(`${ICONS_PATH}/` === 0)) {
          // import 'veui/icons' → import 'veui-theme-x/icons'
          // import 'veui/icons/loading' →  import 'veui-theme-x/icons/loading'
          resolvedIcon = src === ICONS_PATH ? 'index' : src.replace(`${ICONS_PATH}/`, '')
        } else if (src !== 'veui') {
          // cannot resolve when absolute path or current file path isn't available
          if (src.charAt(0) !== '.' || file.opts.filename === 'unknown') {
            return
          }

          // relative path like './Select/Select' or '../icons/loading'
          else {
            resolvedIcon = resolveIcon(file.opts.filename, src)
            resolvedComponentName = resolveComponent(file.opts.filename, src)
          }
        }

        let { package: pack, path: packPath = 'components', icons = 'icons', resolve } = opts

        // try to find an icon
        if (resolvedIcon != null) {
          let iconPath = join(pack, icons, resolvedIcon)
          if (assurePath(iconPath, resolve)) {
            node.source.value = iconPath
          } else {
            path.remove()
            warn(`no icon found for path [${iconPath}]`)
          }

          return
        }

        // no icon found, start to resolve components
        node.specifiers
          .map(({ type, imported }) => {
            let name
            if (imported) {
              name = imported.name === 'default'
                ? resolvedComponentName          // import { default as Whatever } from './Select' → Select
                                                 // import { default as Whatever } from 'veui/components/Select' → Select
                : isComponentName(imported.name)
                  ? imported.name                // import { Select } from 'veui' → Select
                  : null                         // import { Whatever } from 'veui' → null
            } else if (type === 'ImportDefaultSpecifier') {
              name = resolvedComponentName       // import Select from './Select' → null
                                                 // import Select from 'veui/components/Select' → null
                                                 // import Select from 'veui' → null
            }
            return getPeerPath(getModuleName(name, opts.transform), opts.fileName)
          })
          .filter(v => v)
          .forEach(name => {
            let modulePath = join(pack, packPath, name);

            if (assurePath(modulePath, resolve)) {
              path.insertAfter(t.importDeclaration([], t.stringLiteral(modulePath)))
            }
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

function getPeerPath (name, template = '${module}.css') {
  if (!name) {
    return null
  }
  return template.replace(/\$\{module\}/g, name)
}

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
    default:
      return name
  }
}

// 'src/components/Select/Option.vue', '../icons/check' → 'check'
// 'src/components/Select/Option.vue', '../icons' → 'index'
function resolveIcon (file, src) {
  let icon = resolveRelative(file, src, ICONS_DIRNAME)
  if (icon === '') {
    icon = 'index'
  }
  return icon
}

// 'src/components/Option.vue', '../Icon.vue' → 'Icon'
function resolveComponent (file, src) {
  return getComponentName(resolveRelative(file, src, COMPONENTS_DIRNAME))
}

// 'src/components/Select/Option.vue', '../Icon.vue', 'components' → 'Icon.vue'
function resolveRelative (file, src, dir) {
  // make sure relative paths resolved to somewhere inside veui
  let pkg = pkgDir.sync(file)
  if (!pkg || getJSON(path.join(pkg, 'package.json')).name !== 'veui') {
    return null
  }

  let dirPath = path.join(pkg, dir) // runtime
  if (!fs.existsSync(dirPath)) {
    dirPath = path.join(pkg, `src/${dir}`) // dev
    if (!fs.existsSync(dirPath)) {
      return
    }
  }

  return path.relative(dirPath, path.resolve(path.dirname(file), src))
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
