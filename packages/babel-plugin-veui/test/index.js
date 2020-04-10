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

let running = 0

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

function symlinkP (target, path) {
  return new Promise(resolve => {
    symlink(target, path, resolve)
  })
}

function unlinkP (path) {
  return new Promise(resolve => {
    unlink(path, resolve)
  })
}

function prepare () {
  running++

  if (running === 1) {
    return symlinkP(
      r(__dirname, '../node_modules/veui'),
      r(__dirname, '../node_modules/veui-next')
    )
  }

  return Promise.resolve()
}

function tearDown () {
  running--

  if (running === 0) {
    return unlinkP(r(__dirname, '../node_modules/veui-next'))
  }

  return Promise.resolve()
}
