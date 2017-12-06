import test from 'ava'
import { transformFileSync } from 'babel-core'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import plugin from '../lib'

test(t => {
  let { code } = transformFileSync(resolve(__dirname, './fixtures/source.js'), {
    babelrc: false,
    plugins: [
      plugin
    ]
  })

  t.is(code, readFileSync(resolve(__dirname, './fixtures/expected.js'), 'utf8'))
})
