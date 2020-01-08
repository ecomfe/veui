import test from 'ava'
import { transformFileSync } from '@babel/core'
import { readFileSync, symlink, unlink } from 'fs'
import { resolve as r } from 'path'
import prettier from 'prettier'
import treeshake from '../treeshake'
import rewrite from '../rewrite'

const SPECS = [
  {
    title: 'should transform VEUI components to help treeshaking',
    name: 'treeshake',
    plugins: [treeshake, [treeshake, { alias: 'veui-next' }, 'veui-next']]
  },
  {
    title: 'should rewrite package name to given alias',
    name: 'rewrite',
    plugins: [[rewrite, { alias: 'veui-next' }]]
  }
]

SPECS.forEach(({ title, name, plugins }) => {
  test(title, t => {
    return prepare()
      .then(() => {
        let { code } = transformFileSync(
          r(__dirname, `./fixtures/${name}/source.js`),
          {
            babelrc: false,
            plugins
          }
        )

        let expect = readFileSync(
          r(__dirname, `./fixtures/${name}/expected.js`),
          'utf8'
        )
        expect = expect.replace(/\r\n/gm, '\n')
        code = code.replace(/\r\n/gm, '\n')

        t.is(format(code), format(expect))
      })
      .then(tearDown)
  })
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
