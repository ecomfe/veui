import test from 'ava'
import { transformFileSync } from 'babel-core'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import plugin from '../dist'

test(t => {
  let { code } = transformFileSync(resolve(__dirname, './fixtures/veui/components/source.js'), {
    babelrc: false,
    plugins: [
      [
        plugin,
        {
          package: 'veui-theme-dux',
          path: 'components',
          fileName: '${module}.less',
          transform: 'kebab-case'
        }
      ]
    ]
  })

  t.is(code, readFileSync(resolve(__dirname, './fixtures/veui/expected.js'), 'utf8'))
})
