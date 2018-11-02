import test from 'ava'
import webpack from 'webpack'
import path from 'path'

function resolve (...args) {
  return path.resolve(__dirname, ...args)
}

const SPECS = [
  {
    entry: '../../veui/src/components/Breadcrumb.vue',
    expect: {
      include: [
        `\n<style lang="less" src="veui-theme-one/components/breadcrumb.less"></style>\n`
      ],
      exclude: [
        `\nimport 'veui-theme-one/components/Breadcrumb.js'\n`
      ]
    }
  },
  {
    entry: '../../veui/src/components/Button.vue',
    expect: {
      include: [
        `\nimport 'veui/locale/en-US/common.js'\n`,
        `\nimport 'veui-theme-one/components/Button.js'\n`,
        `\nimport 'veui-theme-one/components/Button.js'\n`,
        `\n<style lang="less" src="veui-theme-one/components/button.less"></style>\n`
      ]
    }
  },
  {
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

SPECS.forEach(({ entry, expect }) => {
  test.cb(t => {
    const compiler = webpack({
      entry: resolve(entry),
      output: {
        path: resolve('dist'),
        filename: 'bundle.js'
      },
      resolve: {
        alias: {
          'veui-theme-one': resolve('../../veui-theme-one'),
          'veui': resolve('../../veui/src')
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
                  package: 'veui-theme-one',
                  fileName: '${module}.less'
                },
                {
                  package: 'veui-theme-one',
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
