const fs = require('fs');
const path = require('path');
const icons = require('../assets/icons.json');

const ICON_PATH = path.resolve(__dirname, '../assets/icons.js');
fs.writeFileSync(ICON_PATH, `/* eslint-disable */\nexport default ${JSON.stringify(icons)}\n`);
console.log(Object.keys(icons).length + ' icon modules generated.');
