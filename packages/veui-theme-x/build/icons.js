const fs = require('fs');
const path = require('path');
const icons = require('../assets/icons.json');

Object.keys(icons).forEach(name => {
  let code = icons[name];
  fs.writeFileSync(
    path.resolve(__dirname, `../icons/${name}.js`),
    `import { Icon } from 'veui'\nexport default ${JSON.stringify(code)}\n`
  );
});

console.log(Object.keys(icons).length + ' icon modules generated.');
