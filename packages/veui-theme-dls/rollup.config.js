import postcss from 'rollup-plugin-postcss'
import less from 'less'
import resolve from 'enhanced-resolve'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'

const trailingSlash = /[/\\]$/

// This somewhat changed in Less 3.x. Now the file name comes without the
// automatically added extension whereas the extension is passed in as `options.ext`.
// So, if the file name matches this regexp, we simply ignore the proposed extension.
const IS_SPECIAL_MODULE_IMPORT = /^~[^/]+$/

// `[drive_letter]:\` + `\\[server]\[sharename]\`
const IS_NATIVE_WIN32_PATH = /^[a-z]:[/\\]|^\\\\/i

// Examples:
// - ~package
// - ~package/
// - ~@org
// - ~@org/
// - ~@org/package
// - ~@org/package/
const IS_MODULE_IMPORT = /^~([^/]+|[^/]+\/|@[^/]+[/][^/]+|@[^/]+\/?|@[^/]+[/][^/]+\/)$/
const MODULE_REQUEST_REGEX = /^[^?]*~/

const lessResolve = resolve.create({
  extensions: ['less', 'css', 'js']
})

function asyncLessResolve (context, path) {
  return new Promise((resolve, reject) => {
    lessResolve(context, path, (err, result) => {
      if (err) {
        reject(err)
      }

      resolve(result)
    })
  })
}

class ViteFileManager extends less.FileManager {
  supports (filename) {
    if (filename[0] === '/' || IS_NATIVE_WIN32_PATH.test(filename)) {
      return true
    }

    if (this.isPathAbsolute(filename)) {
      return false
    }

    return true
  }

  // Sync resolving is used at least by the `data-uri` function.
  // This file manager doesn't know how to do it, so let's delegate it
  // to the default file manager of Less.
  // We could probably use loaderContext.resolveSync, but it's deprecated,
  // see https://webpack.js.org/api/loaders/#this-resolvesync
  supportsSync () {
    return false
  }

  async resolveFilename (filename, currentDirectory) {
    // Less is giving us trailing slashes, but the context should have no trailing slash
    const context = currentDirectory.replace(trailingSlash, '')

    let request = filename

    // A `~` makes the url an module
    if (MODULE_REQUEST_REGEX.test(filename)) {
      request = request.replace(MODULE_REQUEST_REGEX, '')
    }

    if (IS_MODULE_IMPORT.test(filename)) {
      request = request[request.length - 1] === '/' ? request : `${request}/`
    }

    return this.resolveRequests(context, [...new Set([request, filename])])
  }

  async resolveRequests (context, possibleRequests) {
    if (possibleRequests.length === 0) {
      return Promise.reject(new Error('No requests.'))
    }

    let result

    try {
      result = await asyncLessResolve(context, possibleRequests[0])
    } catch (error) {
      const [, ...tailPossibleRequests] = possibleRequests

      if (tailPossibleRequests.length === 0) {
        throw error
      }

      result = await this.resolveRequests(context, tailPossibleRequests)
    }

    return result
  }

  async loadFile (filename, ...args) {
    let result

    try {
      if (IS_SPECIAL_MODULE_IMPORT.test(filename)) {
        const error = new Error()

        error.type = 'Next'

        throw error
      }

      result = await super.loadFile(filename, ...args)
    } catch (error) {
      if (error.type !== 'File' && error.type !== 'Next') {
        return Promise.reject(error)
      }

      try {
        result = await this.resolveFilename(filename, ...args)
      } catch (e) {
        error.message =
          `Less resolver error:\n${error.message}\n\n` +
          `Vite resolver error details:\n${e.details}\n\n` +
          `Vite resolver error missing:\n${e.missing}\n\n`

        return Promise.reject(error)
      }

      return super.loadFile(result, ...args)
    }

    return result
  }
}

export default [
  {
    input: 'index.js',
    output: {
      file: 'dist/theme.js',
      format: 'iife',
      globals: {
        veui: 'veui'
      }
    },
    plugins: [
      replace({
        'process.env.NODE_ENV': '"production"'
      }),
      {
        name: 'transform-veui-config',
        resolveId (source) {
          if (source === 'veui/managers/config') {
            return '\0virtual-config'
          }
          return null
        },
        load (id) {
          return id === '\0virtual-config'
            ? 'import { configManager } from "veui";\n export default configManager;'
            : null
        }
      },
      nodeResolve(),
      commonjs(),
      postcss({
        minimize: true,
        use: {
          less: {
            plugins: [
              {
                install (less, pluginManager) {
                  pluginManager.addFileManager(new ViteFileManager())
                },
                minVersion: [3, 0, 0]
              }
            ],
            javascriptEnabled: true,
            math: 'always'
          }
        }
      })
    ],
    external: id => id === 'veui'
  }
]
