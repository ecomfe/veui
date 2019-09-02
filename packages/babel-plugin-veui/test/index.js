import test from 'ava'
import { transformFileSync } from '@babel/core'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import plugin from '../lib'

test('should transform VEUI components correctly', t => {
  let { code } = transformFileSync(resolve(__dirname, './fixtures/source.js'), {
    babelrc: false,
    plugins: [plugin]
  })

  let expect = readFileSync(
    resolve(__dirname, './fixtures/expected.js'),
    'utf8'
  )
  expect = expect.replace(/\r\n/gm, '\n')
  code = code.replace(/\r\n/gm, '\n')
  t.is(code, expect)
})
