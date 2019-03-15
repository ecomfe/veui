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
    let [match, name] = file.match(ICON_PATTERN) || []
    if (!match) {
      return
    }

    if (!ICON_PATTERN.test(file)) {
      return
    }
    let fileData = fs.readFileSync(path.resolve(SVG_DIR, file), 'utf8')
    let { error, data } = await svgo.optimize(fileData)
    if (error) {
      console.error(file, error)
      return
    }

    let el = await svgson(data)
    console.log(`Converting ${file}...`)
    let { attributes, children } = el
    let { width, height, viewBox } = attributes
    if (!(width && height)) {
      if (!viewBox) {
        console.error(file, `doesn't contain a valid size declaration.`)
        console.error(width, height, viewBox)
      }

      ;[, width, height] = (viewBox.match(/0 0 (\d+) (\d+)/) || []).map(size =>
        parseInt(size, 10)
      )
    }

    if (!(width && height)) {
      console.error(file, `doesn't contain a valid size declaration.`)
      console.error(width, height, viewBox)
    }

    walkElement(el, {
      enter (node) {
        let { attributes } = node

        delete attributes.class

        let ctxFill = (getContextAttr(node, 'fill') || '').toLowerCase()
        let ctxStroke = (getContextAttr(node, 'stroke') || '').toLowerCase()
        let attrFill = (attributes.fill || '').toLowerCase()
        let attrStroke = (attributes.stroke || '').toLowerCase()

        if (attrFill) {
          if (!ctxFill) {
            if (attrFill !== 'none') {
              attributes.fill = 'currentColor'
              console.log(`  fill: ${attrFill} -> currentColor`)
            }
          } else {
            if (attrFill === ctxFill) {
              delete attributes.fill
              console.log(`  fill: ${attrFill} -> / (same as context)`)
            } else if (attrFill !== 'none') {
              attributes.fill = 'currentColor'
              console.log(
                `  fill: ${attrFill} -> currentColor (different from context)`
              )
            }
          }
        }

        if (attrStroke) {
          if (!ctxStroke) {
            if (attrStroke !== 'none') {
              attributes.stroke = 'currentColor'
              console.log(`  stroke: ${attrStroke} -> currentColor`)
            } else {
              delete attributes.stroke
              console.log(`  stroke: ${attrStroke} -> / (same as default)`)
            }
          } else {
            if (attrStroke && attrStroke === ctxStroke) {
              delete attributes.stroke
              console.log(`  stroke: ${attrStroke} -> / (same as context)`)
            } else if (attrStroke !== 'none') {
              attributes.stroke = 'currentColor'
              console.log(
                `  stroke: ${attrStroke} -> currentColor (different from context)`
              )
            }
          }
        }
      }
    })

    let icon
    if (children.every(({ name }) => name === 'path')) {
      icon = {
        paths: children.map(({ attributes }) => attributes)
      }
    } else {
      icon = {
        raw: children
          .map(child => {
            return stringify(child)
          })
          .join('')
      }
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
  fs.writeFileSync(
    path.resolve(__dirname, '../assets/icons.json'),
    JSON.stringify(icons, null, '  ')
  )
  console.log(`Generated ${Object.keys(icons).length} icons.`)
})

function walkElement (el, { enter, leave }) {
  if (typeof enter === 'function') {
    enter(el)
  }
  if (el.children && el.children.length) {
    el.children.forEach(child => {
      child.parentNode = el
      walkElement(child, { enter, leave })
      delete child.parentNode
    })
  }
  if (typeof leave === 'function') {
    leave(el)
  }
}

function getContextAttr (el, attr) {
  let node = el.parentNode
  while (node) {
    if (node.attributes && node.attributes[attr]) {
      return node.attributes[attr]
    }

    node = node.parentNode
  }
  return null
}
