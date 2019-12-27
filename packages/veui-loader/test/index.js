import test from 'ava'
import webpack from 'webpack'
import path from 'path'
import { symlink, unlink } from 'fs'

function r (...args) {
  return path.resolve(__dirname, ...args)
}

const SPECS = [
  {
    title: 'should inject peer style module',
    entry: '../../veui/src/components/Badge.vue',
    expect: {
      include: [
        `\n<style lang="less" src="veui-theme-dls/components/badge.less"></style>\n`
      ],
      exclude: [`\nimport 'veui-theme-dls/components/Badge.js'\n`]
    }
  },
  {
    title:
      'should inject peer locale module and peer style script module if exists',
    entry: '../../veui/src/components/Button.vue',
    expect: {
      include: [
        `\nimport 'veui-next/locale/en-US/common.js'\n`,
        `\nimport 'veui-theme-dls/components/Button.js'\n`,
        `\nimport 'veui-theme-dls/components/Button.js'\n`,
        `\n<style lang="less" src="veui-theme-dls/components/button.less"></style>\n`
      ]
    }
  },
  {
    title: 'should inject locale module',
    entry: '../../veui/src/components/Calendar/Calendar.vue',
    expect: {
      include: [
        `\nimport 'veui-next/locale/en-US/common.js'\n`,
        `\nimport 'veui-next/locale/en-US/Calendar.js'\n`,
        `\nimport 'veui-next/locale/en-US/Calendar.js'\n`
      ]
    }
  }
]

function runWebpack (config) {
  return new Promise(resolve => {
    const compiler = webpack(config)

    compiler.run((err, stats) => {
      resolve({ err, stats })
    })
  })
}

SPECS.forEach(({ entry, expect, title }) => {
  test(title, t => {
    return prepare()
      .then(() =>
        runWebpack({
          entry: r(entry),
          output: {
            path: r('dist'),
            filename: 'bundle.js'
          },
          resolve: {
            alias: {
              'veui-theme-dls': r('../../veui-theme-dls'),
              'veui-next': r('../../veui/src')
            }
          },
          module: {
            rules: [
              {
                test: /\.vue$/,
                loader: './lib',
                enforce: 'pre',
                options: {
                  name: 'veui-next',
                  locale: ['en-US'],
                  modules: [
                    {
                      package: 'veui-theme-dls',
                      fileName: '${module}.less'
                    },
                    {
                      package: 'veui-theme-dls',
                      fileName: '${module}.js',
                      transform: false
                    }
                  ]
                }
              },
              {
                test: /\.vue$/,
                use: 'raw-loader'
              }
            ]
          }
        })
      )
      .then(({ err, stats }) => {
        if (err) {
          console.error(err)
          return
        }

        let src = getSource(stats)
        if (!src) {
          t.is(typeof src, 'string')
          return
        }

        let { include = [], exclude = [] } = expect
        include.forEach(item => t.true(src.includes(item)))
        exclude.forEach(item => t.false(src.includes(item)))
      })
      .then(tearDown)
  })
})

function getSource (stats) {
  let s = stats.toJson()
  let module = s.modules[0]
  let source = null
  if (module && module.source) {
    let json = module.source.replace('module.exports =', '')
    try {
      source = JSON.parse(json)
    } catch (e) {
      console.error(e)
    }
  }

  return source
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
