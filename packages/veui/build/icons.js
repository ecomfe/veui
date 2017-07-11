const fs = require('fs');
const path = require('path');
const icons = require('../assets/icons.json');

const ICON_PATH = path.resolve(__dirname, '../src/icons.js');
fs.writeFileSync(ICON_PATH, `/* eslint-disable */\nimport Icon from './components/Icon'\nIcon.register(${JSON.stringify(icons)})\n`);
console.log(Object.keys(icons).length + ' icon modules generated.');
