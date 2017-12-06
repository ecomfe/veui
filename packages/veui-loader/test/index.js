import test from 'ava'
import webpack from 'webpack'
import path from 'path'

function resolve (...args) {
  return path.resolve(__dirname, ...args)
}

test.cb(t => {
  const compiler = webpack({
    entry: resolve('../../veui/src/components/Button.vue'),
    output: {
      path: resolve('dist'),
      filename: 'bundle.js'
    },
    resolve: {
      alias: {
        'veui-theme-one': resolve('../../veui-theme-one')
      }
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: './lib/index',
          enforce: 'pre',
          options: {
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
    t.true(src.includes(`\nimport 'veui-theme-one/components/Button.js'\n`))
    t.true(src.includes(`\n<style lang="less" src="veui-theme-one/components/button.less"></style>\n`))
    t.end()
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
