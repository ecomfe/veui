import test from 'ava'
import { transformFileSync } from 'babel-core'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import preset from '../index'

test(t => {
  let { code } = transformFileSync(resolve(__dirname, './fixtures/source.js'), {
    babelrc: false,
    presets: [
      preset
    ]
  })

  t.true(code.includes('import Input from \'veui/components/Input.vue\';'))
  t.true(code.includes('export var a = _extends({ a: 1 });'))
  t.true(code.includes(`export var A = function A() {
  _classCallCheck(this, A);

  this.a = 42;
};`))
  t.true(code.includes(`export default {
  render: function render() {
    var h = arguments[0];

    return h('div', ['A']);
  }
};`))
})
