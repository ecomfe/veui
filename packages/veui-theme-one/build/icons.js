const fs = require('fs')
const path = require('path')
const icons = require('../assets/icons.json')

Object.keys(icons).forEach(name => {
  let code = { [name]: icons[name] }
  fs.writeFileSync(
    path.resolve(__dirname, `../icons/${name}.js`),
    `import Icon from 'veui/components/Icon'\nIcon.register(${JSON.stringify(code, null, '  ')})\n`
  )
})

fs.writeFileSync(
  path.resolve(__dirname, `../icons/index.js`),
  Object.keys(icons).map(name => `import './${name}'`).join('\n')
)

console.log(Object.keys(icons).length + ' icon modules generated.')
