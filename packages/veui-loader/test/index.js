import test from 'ava'
import webpack from 'webpack'
import path from 'path'

function resolve (...args) {
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
        `\nimport 'veui/locale/en-US/common.js'\n`,
        `\nimport 'veui-theme-dls/components/Button.js'\n`,
        `\nimport 'veui-theme-dls/components/Button.js'\n`,
        `\n<style lang="less" src="veui-theme-dls/components/button.less"></style>\n`
      ]
    }
  },
  {
    title: 'should inject locale module',
    entry: '../../veui/src/components/Calendar.vue',
    expect: {
      include: [
        `\nimport 'veui/locale/en-US/common.js'\n`,
        `\nimport 'veui/locale/en-US/Calendar.js'\n`,
        `\nimport 'veui/locale/en-US/Calendar.js'\n`
      ]
    }
  }
]

SPECS.forEach(({ entry, expect, title }) => {
  test.cb(title, t => {
    const compiler = webpack({
      entry: resolve(entry),
      output: {
        path: resolve('dist'),
        filename: 'bundle.js'
      },
      resolve: {
        alias: {
          'veui-theme-dls': resolve('../../veui-theme-dls'),
          veui: resolve('../../veui/src')
        }
      },
      module: {
        rules: [
          {
            test: /\.vue$/,
            loader: './lib',
            enforce: 'pre',
            options: {
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

    compiler.run((err, stats) => {
      if (err) {
        console.error(err)
        return
      }

      let src = getSource(stats)
      if (!src) {
        t.is(typeof src, 'string')
        t.end()
        return
      }

      let { include = [], exclude = [] } = expect
      include.forEach(item => t.true(src.includes(item)))
      exclude.forEach(item => t.false(src.includes(item)))

      t.end()
    })
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
