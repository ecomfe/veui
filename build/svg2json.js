const fs = require('fs')
const path = require('path')

const Svgo = require('svgo')
const svgo = new Svgo({
  multipass: true,
  floatPrecision: 2
})

const icons = {}
const svgDir = path.resolve(__dirname, '../assets/icons/')

fs.readdirSync(svgDir).forEach(file => {
  if (!/\.svg$/.test(file)) {
    return
  }
  svgo.optimize(fs.readFileSync(path.resolve(svgDir, file), 'utf8'), ({ error, data }) => {
    if (error) {
      return console.error(file, error)
    }

    const svg = data
    const sizeMatch = svg.match(/ viewBox="0 0 (\d+) (\d+)"/)
    const dMatch = svg.match(/ d="([^"]+)"/)
    if (!sizeMatch || !dMatch) {
      console.log(svg)
      console.error(file, 'not match')
      return
    }
    icons[file] = {
      width: parseInt(sizeMatch[1], 10),
      height: parseInt(sizeMatch[2], 10),
      paths: [{
        d: dMatch[1]
      }]
    }
  })
})

fs.writeFileSync(path.resolve(__dirname, '../assets/icons.json'), JSON.stringify(icons, null, '  '))
