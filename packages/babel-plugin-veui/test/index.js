import test from 'ava'
import { transformFileSync } from '@babel/core'
import { readFileSync, symlink, unlink } from 'fs'
import { resolve as r } from 'path'
import prettier from 'prettier'
import plugin from '../lib'

test('should transform VEUI components correctly', t => {
  return prepare()
    .then(() => {
      let { code } = transformFileSync(r(__dirname, './fixtures/source.js'), {
        babelrc: false,
        plugins: [plugin, [plugin, { alias: 'veui-next' }, 'veui-next']]
      })

      let expect = readFileSync(r(__dirname, './fixtures/expected.js'), 'utf8')
      expect = expect.replace(/\r\n/gm, '\n')
      code = code.replace(/\r\n/gm, '\n')

      t.is(format(code), format(expect))
    })
    .then(tearDown)
})

function format (source) {
  return prettier.format(source, { parser: 'babel' })
}

function prepare () {
  return new Promise(resolve => {
    symlink(
      r(__dirname, '../node_modules/veui'),
      r(__dirname, '../node_modules/veui-next'),
      resolve
    )
  })
}

function tearDown () {
  return new Promise(resolve => {
    unlink(r(__dirname, '../node_modules/veui-next'), resolve)
  })
}
