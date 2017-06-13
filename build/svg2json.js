const fs = require('fs')
const path = require('path')

const Svgo = require('svgo')
const svgo = new Svgo({
  plugins: ['removeDoctype', 'removeComments']
})

const icons = {}
const svgDir = path.resolve(__dirname, '../assets/svg/')
fs.readdirSync(svgDir).forEach(function (file) {
  svgo.optimize(fs.readFileSync(path.resolve(svgDir, file), 'utf8'), ({ error, data }) => {
    if (error) {
      return console.error(error);
    }

    const svg = data
    const sizeMatch = svg.match(/ viewBox="0 0 (\d+) (\d+)"/)
    const dMatch = svg.match(/ d="([^"]+)"/)
    if (!sizeMatch || !dMatch) {
        return
    }
    const icon = {}
    const name = file.replace(/^fa-/, '').replace(/\.svg$/, '')
    icons[name] = {
      width: parseInt(sizeMatch[1], 10),
      height: parseInt(sizeMatch[2], 10),
      paths: [{
          d: dMatch[1]
      }]
    };
  })
});

fs.writeFileSync(path.resolve(__dirname, '../assets/icons.json'), JSON.stringify(icons, null, '  '));
