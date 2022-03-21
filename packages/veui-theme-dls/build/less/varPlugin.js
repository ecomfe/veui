import { resolve, dirname } from 'path'
import { readFileSync, writeFileSync, appendFileSync } from 'fs'

const SEPARATOR = '### Auto Generated ###'

const filePath = import.meta.url.replace(/^file:\/\//, '')
const dirPath = dirname(filePath)
const srcDir = resolve(dirPath, '../..')
const ignoreFile = resolve(dirPath, '../../.dlsignore')

const ignored = readFileSync(ignoreFile, { encoding: 'utf-8' })
writeFileSync(
  ignoreFile,
  ignored.substring(0, ignored.indexOf(SEPARATOR) + SEPARATOR.length) + '\n',
  { encoding: 'utf-8' }
)

const seen = new Set()

export default () => ({
  install (less) {
    const { Variable } = less.tree
    const original = Variable.prototype.eval

    const patched = function (context) {
      const { name } = this
      const { filename } = this.fileInfo()

      if (filename.indexOf(srcDir) === 0 && name.indexOf('@@') === 0) {
        const interpolated = new Variable(
          this.name.slice(1),
          this.getIndex(),
          this.fileInfo()
        ).eval(context).value
        acceptName(interpolated)
      }

      return original.call(this, context)
    }

    Variable.prototype.eval = patched
  },
  minVersion: [3, 0, 0]
})

function acceptName (name) {
  if (name.indexOf('dls-') === 0) {
    if (!seen.has(name)) {
      logName(name)
      seen.add(name)
    }
  }
}

function logName (name) {
  appendFileSync(ignoreFile, `@${name}\n`, { encoding: 'utf-8' })
}
