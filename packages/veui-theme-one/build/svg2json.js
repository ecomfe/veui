import fs from 'fs'
import path from 'path'
import svgson, { stringify } from 'svgson'
import Svgo from 'svgo'
const svgo = new Svgo({
  multipass: true,
  floatPrecision: 2
})

const icons = {}
const SVG_DIR = path.resolve(__dirname, '../assets/icons/')
const ICON_PATTERN = /^(.+)\.svg$/

Promise.all(
  fs.readdirSync(SVG_DIR).map(async file => {
    console.log(`Converting ${file}...`)
    if (!ICON_PATTERN.test(file)) {
      return
    }
    let fileData = fs.readFileSync(path.resolve(SVG_DIR, file), 'utf8')
    let { error, data } = await svgo.optimize(fileData)
    if (error) {
      console.error(file, error)
      return
    }

    let { attributes, children } = await svgson(data)
    let { width, height, viewBox } = attributes
    if (!(width && height)) {
      if (!viewBox) {
        console.error(file, `doesn't contain a valid size declaration.`)
      }

      [width, height] = (viewBox.match(/0 0 (\d+) (\d+)/) || []).map(size => parseInt(size, 10))
    }

    if (!(width && height)) {
      console.error(file, `doesn't contain a valid size declaration.`)
    }

    let icon
    let paths
    if (children.every(({ name }) => name === 'path')) {
      paths = children.map(({ name, attributes }) => {
        if (name !== 'path' || attributes.fill === 'none') {
          return false
        }

        let path = { ...attributes }

        if (attributes.fillRule && attributes.fillRule.toLowerCase() !== 'nonzero') {
          path['fill-rule'] = attributes.fillRule
        }

        delete path.fill

        return path
      }).filter(path => path)
      icon = {
        paths
      }
    } else {
      let raw = children.map(child => {
        return stringify(child)
      }).join('')
      icon = {
        raw
      }
    }

    let [match, name] = file.match(ICON_PATTERN) || []
    if (!match) {
      return
    }

    if (icons[name]) {
      console.warn(file, `is duplicated.`)
      return
    }
    icons[name] = {
      ...icon,
      width,
      height
    }
  })
).then(() => {
  fs.writeFileSync(path.resolve(__dirname, '../assets/icons.json'), JSON.stringify(icons, null, '  '))
  console.log(`Generated ${Object.keys(icons).length} icons.`)
})
