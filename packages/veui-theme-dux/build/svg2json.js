const fs = require('fs')
const path = require('path')
const svgson = require('svgson')
const Svgo = require('svgo')
const svgo = new Svgo({
  multipass: true,
  floatPrecision: 2
})

const icons = {}
const svgDir = path.resolve(__dirname, '../assets/icons/')
const EXT_PATTERN = /\.svg$/

fs.readdirSync(svgDir).forEach(file => {
  if (!EXT_PATTERN.test(file)) {
    return
  }
  svgo.optimize(fs.readFileSync(path.resolve(svgDir, file), 'utf8'), ({ error, data }) => {
    if (error) {
      return console.error(file, error)
    }

    svgson(data, {
      svgo: false
    }, ({ attrs, childs }) => {
      let { width, height, viewBox } = attrs
      if (!(width && height)) {
        if (!viewBox) {
          console.error(svg)
          console.error(file, `doesn't contain a valid size declaration.`)
        }

        [width, height] = (viewBox.match(/0 0 (\d+) (\d+)/) || []).map(size => parseInt(size, 10))
      }

      if (!(width && height)) {
        console.error(svg)
        console.error(file, `doesn't contain a valid size declaration.`)
      }

      let paths = childs.map(({ name, attrs }) => {
        if (name !== 'path') {
          return false
        }

        let path = {
          d: attrs.d,
        }

        if (attrs.fillRule && attrs.fillRule.toLowerCase() !== 'nonzero') {
          path['fill-rule'] = attrs.fillRule
        }

        return path
      }).filter(path => path)

      icons[file.replace(EXT_PATTERN, '')] = {
        width, height, paths
      }
    })
  })
})

fs.writeFileSync(path.resolve(__dirname, '../assets/icons.json'), JSON.stringify(icons, null, '  '))
