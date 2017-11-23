import test from 'ava'
import { transformFileSync } from 'babel-core'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import plugin from '../lib'

test(t => {
  let { code } = transformFileSync(resolve(__dirname, './fixtures/veui/components/source.js'), {
    babelrc: false,
    plugins: [
      [
        plugin,
        {
          modules: [
            {
              package: 'veui-theme-one',
              fileName: '${module}.less'
            },
            {
              package: 'veui-theme-one',
              fileName: '${module}.js',
              transform: false
            }
          ],
          resolve () {
            return true
          }
        }
      ]
    ]
  })

  t.is(code, readFileSync(resolve(__dirname, './fixtures/veui/expected.js'), 'utf8'))
})
