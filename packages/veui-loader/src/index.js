import fs from 'fs'
import path from 'path'
import pkgDir from 'pkg-dir'
import loaderUtils from 'loader-utils'
import { kebabCase, camelCase, pascalCase, getJSON } from './utils'
import resolve from 'enhanced-resolve/lib/node'

const COMPONENTS = getJSON(path.resolve(__dirname, '../components.json'))
const COMPONENTS_DIRNAME = 'components'
const EXT_TYPES = {
  SCRIPT: ['js'],
  STYLE: ['css', 'less', 'styl', 'sass', 'scss']
}

let resolveCache = {}

/**
 * webpack loader to load theme modules for VEUI components
 * @param {string} content Raw file content of .vue file
 * @returns {string} Content of patched .vue file
 */
export default function (content) {
  const loaderOptions = loaderUtils.getOptions(this) || {}
  let component = resolveComponent(this.resourcePath)
  if (!component) {
    return content
  }

  const resolve = makeSyncResolver(this.options)
  return patchComponent(content, component, loaderOptions, resolve)
}

/**
 * Patch the original .vue file with additional peer modules.
 * @param {string} content .vue file content
 * @param {string} component Component name
 * @param {Object} options veui-theme-loader options
 * @param {Object} resolve webpack resolve function to see if target peer exists
 * @returns {string} The patched content
 */
function patchComponent (content, component, options, resolve) {
  let {
    modules = [],
    package: pack,
    path: packPath = COMPONENTS_DIRNAME,
    transform,
    fileName
  } = options

  if (pack && fileName) {
    modules.push({ package: pack, path: packPath, transform, fileName })
  }

  if (!modules.length) {
    return content
  }

  let parts = modules.reduce((acc, {
    package: pack,
    path: packPath = COMPONENTS_DIRNAME,
    transform,
    fileName
  }) => {
    let peerComponent = getPeerFilename(component, {
      transform,
      template: fileName
    })
    let peerPath = path.join(pack, packPath, peerComponent)
    if (assurePath(peerPath, resolve)) {
      pushPart(acc, peerPath)
    }
    return acc
  }, {
    script: [],
    style: []
  })

  return Object.keys(parts).reduce((content, type) => {
    return parts[type].reduce((content, peerPath) => {
      return patchType(content, type, peerPath)
    }, content)
  }, content)
}

/**
 * Push peer file dependency into collected parts.
 * @param {Object} parts Collected parts containing scripts and styles
 * @param {string} file The file to be appended
 */
function pushPart (parts, file) {
  let ext = getExtname(file)
  let type = Object.keys(EXT_TYPES).find(key => {
    return EXT_TYPES[key].includes(ext)
  })
  parts[type.toLowerCase()].push(file)
}

/**
 * Get extension name of a file
 * @param {string} file File path
 * @returns {string} File extension
 */
function getExtname (file) {
  return path.extname(file).replace(/\./g, '').toLowerCase()
}

const RE_SCRIPT = /<script(?:\s+[^>]*)?>/i

/**
 * Patch file content according to a given type.
 * @param {string} content Original content
 * @param {string} type Peer type, can be `script` or `style`
 * @param {string} peerPath Peer module path
 * @returns {string} The patched content
 */
function patchType (content, type, peerPath) {
  switch (type) {
    case 'script':
      content = content.replace(RE_SCRIPT, match => {
        return `${match}\nimport '${peerPath}'\n`
      })
      break
    case 'style':
      let langStr = ''
      let ext = getExtname(peerPath)
      if (ext !== 'css') {
        langStr = `lang="${ext}" `
      }
      content += `\n<style ${langStr}src="${peerPath}"></style>\n`
      break
    default:
      break
  }

  return content
}

/**
 * Create a synchronous resolver.
 * See https://github.com/webpack/enhanced-resolve/issues/46
 * @param {Object} options webpack loader options
 * @returns {Object} The synchronous resolver
 */
function makeSyncResolver (options) {
  return resolve.create.sync(options.resolve)
}

/**
 * To test the target peer path exists or not.
 * @param {string} modulePath Peer module path
 * @param {Object} resolve webpack module resolver
 * @returns {boolean} If the target peer path exists
 */
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

/**
 * Convert a component name according to file name template.
 * @param {string} name Peer module file
 * @param {Object} options Transform options
 * @param {string} options.transform Transform type for base name
 * @param {string} options.template File name template
 * @returns {string} Peer module file name
 */
function getPeerFilename (name, {
  transform = 'kebab-case',
  template = '${module}.css'
}) {
  if (!name) {
    return null
  }

  switch (transform) {
    case 'kebab-case':
      name = kebabCase(name)
      break
    case 'camelCase':
      name = camelCase(name)
      break
    case 'PascalCase':
      name = pascalCase(name)
      break
    case false:
    default:
      break
  }

  return template.replace(/\$\{module\}/g, name)
}

/**
 * Resolve the underlying component for a given file path.
 * '/dev/veui/src/components/Button.vue' → 'Button'
 * @param {string} file Absolute file path
 * @returns {?string} The resolved component name (`null` if not a VEUI component)
 */
function resolveComponent (file) {
  // make sure relative paths resolved to somewhere inside veui
  let pkg = pkgDir.sync(file)
  if (!pkg || getJSON(path.join(pkg, 'package.json')).name !== 'veui') {
    return null
  }

  // veui/${dir} or veui/src/${dir}
  let dirPath = path.join(pkg, COMPONENTS_DIRNAME) // runtime
  if (!fs.existsSync(dirPath)) {
    dirPath = path.join(pkg, 'src', COMPONENTS_DIRNAME) // dev
    if (!fs.existsSync(dirPath)) {
      return null
    }
  }

  // is VEUI component
  return getComponentName(path.relative(dirPath, file))
}

/**
 * Convert a component relative path to a component name according to
 * VEUI's component list.
 * 'Icon.vue' → 'Icon'
 * @param {string} componentPath Component path
 * @returns {?string} Component name (`null` if not a VEUI component)
 */
function getComponentName (componentPath) {
  if (!componentPath) {
    return null
  }
  let component = COMPONENTS.find(({ path }) => {
    return path === componentPath || path.split('.')[0] === componentPath
  })

  return component ? component.name : null
}
