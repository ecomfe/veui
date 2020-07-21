import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import rimraf from 'rimraf'
import * as icons from 'dls-icons-vue'

const MODULE_TPL = fs.readFileSync(
  path.resolve(__dirname, './icon.tpl'),
  'utf8'
)
const ICON_PATH = path.resolve(__dirname, '../icons')
rimraf.sync(ICON_PATH)

let indexModule = ''
let bindings = Object.keys(icons).filter(b => b.startsWith('Icon'))
let slugs = []
bindings.forEach(function (binding) {
  let slug = kebabCase(binding).replace(/^icon-/, '')
  slugs.push(slug)
  let filePath = path.join(ICON_PATH, `${slug}.js`)
  let dirname = path.dirname(filePath)

  if (!fs.existsSync(dirname)) {
    mkdirp.sync(dirname)
  }
  fs.writeFileSync(
    filePath,
    MODULE_TPL.replace(/\$\{icon\}/g, binding).replace(/\$\{name\}/g, `'${slug}'`)
  )
  indexModule += `import './${slug}'\n`
})

fs.writeFileSync(path.join(ICON_PATH, 'index.js'), indexModule)
console.log(bindings.length + ' icon modules generated.')

fs.writeFileSync(path.join(ICON_PATH, 'icon-names.json'), JSON.stringify(slugs, null, '  '))

function kebabCase (str) {
  return str.replace(/([A-Z])/g, (_, ch) => `-${ch.toLowerCase()}`).replace(/^-/, '')
}
