import fs from 'fs'
import path from 'path'
import pkgDir from 'pkg-dir'
import loaderUtils from 'loader-utils'
import { kebabCase, camelCase, pascalCase, getJSON, normalize } from './utils'
import COMPONENTS from 'veui/components.json'

const COMPONENTS_DIRNAME = 'components'
const EXT_TYPES = {
  SCRIPT: ['js'],
  STYLE: ['css', 'less', 'styl', 'sass', 'scss']
}

let resolveCache = {}

/**
 * webpack loader to load theme modules for VEUI components
 * @param {string} content Raw file content of .vue file
 * @returns {Promise<string>} A promise that resolved with the content of patched .vue file
 */
export default async function (content) {
  let callback = this.async()
  const loaderOptions = loaderUtils.getOptions(this) || {}
  let component = resolveComponent(this.resourcePath)
  if (!component) {
    callback(null, content)
    return
  }

  try {
    let result = await patchComponent(content, component, loaderOptions, path => {
      return new Promise(resolve => {
        try {
          this.resolve(this.rootContext || this.options.context, path, (err, result) => {
            if (err) {
              resolve(false)
              return
            }
            resolve(true)
          })
        } catch (e) {
          resolve(false)
        }
      })
    })
    callback(null, result)
  } catch (e) {
    callback(e)
  }
}

/**
 * Synchronously transform the module with a given resolveSync function.
 *
 * @param {string} content Module content
 * @param {string} file Module file path
 * @param {Object} options veui-loader options
 * @param {Function} resolveSync Resolves module path to file path
 */
export function processSync (content, file, options, resolveSync) {
  let component = resolveComponent(file)
  if (!component) {
    return content
  }

  return patchComponentSync(content, component, options, resolveSync)
}

/**
 * Patch the original .vue file with additional peer modules.
 * @param {string} content .vue file content
 * @param {string} component Component name
 * @param {Object} options veui-loader options
 * @param {function} resolve webpack resolve function to see if target peer exists
 * @returns {Promise<string>} A promise that resolved with the patched content
 */
async function patchComponent (content, component, options, resolve) {
  let parts = getParts(component, options)

  await Promise.all([...parts.script, ...parts.style].map(async module => {
    module.valid = await assurePath(module.path, resolve)
  }))

  return patchContent(content, parts)
}

/**
 * Patch the original .vue file with additional peer modules.
 * @param {string} content .vue file content
 * @param {string} component Component name
 * @param {Object} options veui-loader options
 * @param {function} resolveSync custom synchronous resolve function to see if target peer exists
 * @returns {string} The patched content
 */
function patchComponentSync (content, component, options, resolveSync) {
  let parts = getParts(component, options)
  let modules = [...parts.script, ...parts.style]

  modules.forEach(module => {
    module.valid = assurePathSync(module.path, resolveSync)
  })

  return patchContent(content, parts)
}

/**
 * Extract potentially dependent parts for a component
 *
 * @param {string} component Component name
 * @param {Object} options veui-loader options
 * @returns {Object} Extracted parts metadata
 */
function getParts (component, options) {
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

  return modules.reduce(
    (
      acc,
      {
        package: pack,
        path: packPath = COMPONENTS_DIRNAME,
        transform,
        fileName
      }
    ) => {
      let peerComponent = getPeerFilename(component, {
        transform,
        template: fileName
      })
      let peerPath = path.join(pack, packPath, peerComponent)
      pushPart(acc, { path: peerPath })
      return acc
    },
    {
      script: [],
      style: []
    }
  )
}

/**
 * Patch content with extracted parts metadata
 *
 * @param {string} content Module content
 * @param {Object} parts Extracted parts metadata
 */
function patchContent (content, parts) {
  return Object.keys(parts).reduce((content, type) => {
    return parts[type]
      .filter(({ valid }) => valid)
      .reduce((content, { path }) => {
        return patchType(content, type, path)
      }, content)
  }, content)
}

/**
 * Push peer file dependency into collected parts.
 * @param {Object} parts Collected parts containing scripts and styles
 * @param {Object} file The file to be appended
 */
function pushPart (parts, file) {
  let ext = getExtname(file.path)
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
  return path
    .extname(file)
    .replace(/\./g, '')
    .toLowerCase()
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
  let normalizedPath = normalize(peerPath).replace(/\\/g, '\\\\')
  switch (type) {
    case 'script':
      content = content.replace(RE_SCRIPT, match => {
        return `${match}\nimport '${normalizedPath}'\n`
      })
      break
    case 'style':
      let langStr = ''
      let ext = getExtname(normalizedPath)
      if (ext !== 'css') {
        langStr = `lang="${ext}" `
      }
      content += `\n<style ${langStr}src="${normalizedPath}"></style>\n`
      break
    default:
      break
  }

  return content
}

/**
 * To test the target peer path exists or not.
 * @param {string} modulePath Peer module path
 * @param {function} resolve webpack module resolver
 * @returns {Promise<boolean>} A promise resolved with true if the target peer path exists
 */
async function assurePath (modulePath, resolve) {
  if (resolveCache[modulePath] === false) {
    return
  } else if (!(modulePath in resolveCache)) {
    if (typeof resolve === 'function') {
      try {
        resolveCache[modulePath] = await resolve(modulePath)
      } catch (e) {
        resolveCache[modulePath] = false
      }
    }
  }

  return resolveCache[modulePath]
}

/**
 * To test the target peer path exists or not synchronously.
 * @param {string} modulePath Peer module path
 * @param {function} resolveSync webpack module resolver
 * @returns {boolean} True if the target peer path exists
 */
function assurePathSync (modulePath, resolveSync) {
  if (resolveCache[modulePath] === false) {
    return
  } else if (!(modulePath in resolveCache)) {
    if (typeof resolveSync === 'function') {
      try {
        resolveCache[modulePath] = resolveSync(modulePath)
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
function getPeerFilename (
  name,
  { transform = 'kebab-case', template = '${module}.css' }
) {
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
    path = normalize(path)
    return path === componentPath || path.split('.')[0] === componentPath
  })

  return component ? component.name : null
}
