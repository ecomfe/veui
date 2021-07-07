import less from 'less'

// `[drive_letter]:\` + `\\[server]\[sharename]\`
const IS_NATIVE_WIN32_PATH = /^[a-z]:[/\\]|^\\\\/i

export default class LessTildeFileManager extends less.FileManager {
  supports (filename) {
    if (filename[0] === '/' || IS_NATIVE_WIN32_PATH.test(filename)) {
      return true
    }

    return !this.isPathAbsolute(filename)
  }

  loadFile (filename, ...args) {
    if (filename.startsWith('~')) {
      filename = filename.slice(1)
    }
    return super.loadFile(filename, ...args)
  }
}
