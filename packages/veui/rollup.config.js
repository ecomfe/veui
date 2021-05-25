import vue from 'rollup-plugin-vue'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import replace from 'rollup-plugin-replace'
import { terser } from 'rollup-plugin-terser'
import alias from '@rollup/plugin-alias'
import path from 'path'

function bundle (output) {
  let isProd = output.indexOf('.prod.') >= 0
  let mode = isProd ? 'production' : 'development'
  return {
    input: 'src/index-with-locale.js',
    output: {
      file: output,
      format: 'umd',
      name: 'veui',
      sourcemap: false
    },
    plugins: [
      resolve({
        extensions: ['.mjs', '.js', '.jsx', '.json', '.vue']
      }),
      alias({
        entries: [
          { find: 'veui', replacement: path.resolve(__dirname, './src') }
        ]
      }),
      vue(),
      babel({
        exclude: ['node_modules/**'],
        babelrc: false,
        configFile: false,
        babelHelpers: 'runtime',
        presets: [
          '@vue/jsx',
          [
            '@babel/preset-env',
            {
              // modules: true,
              // useBuiltIns: false,
              targets: {
                browsers: ['last 1 versions']
              }
            }
          ]
        ],
        extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.vue'],
        plugins: [
          '@babel/plugin-proposal-class-properties',
          '@babel/plugin-transform-runtime'
        ]
      }),
      replace({
        'process.env.NODE_ENV': `'${mode}'`,
        'process.env.VEUI_LOCALE': `'zh-Hans'`,
        'process.env.VUE_APP_VEUI_PREFIX': `'veui'`,
        'process.env.VEUI_PREFIX': `'veui'`,
        'process.env.VUE_ENV': `'browser'`
      }),
      commonjs(),
      isProd && terser()
    ],
    external: id => id === 'vue'
  }
}

export default bundle('dist/veui.dev.js')
