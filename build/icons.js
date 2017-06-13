var fs = require('fs');
var path = require('path');
var icons = require('../assets/icons.json');

var ICON_PATH = path.resolve(__dirname, '../src/icons.js');

var indexModule = '';
var names = Object.keys(icons);
var iconContent = ['/* eslint-disable */', 'import Icon from \'vue-awesome/components/Icon\''];
names.forEach(function (name) {
    var icon = {};
    icon[name] = icons[name];
    iconContent.push(`Icon.register(${JSON.stringify(icon)})`);
    indexModule += 'import \'./' + name + '\'\n';
})

fs.writeFileSync(ICON_PATH, iconContent.join('\n') + '\n');
console.log(names.length + ' icon modules generated.');
