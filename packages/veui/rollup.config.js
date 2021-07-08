import vue from 'rollup-plugin-vue'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import replace from 'rollup-plugin-replace'
import alias from '@rollup/plugin-alias'
import path from 'path'

const commonPlugins = [
  alias({
    entries: [{ find: 'veui', replacement: path.resolve(__dirname, './src') }]
  }),
  resolve({
    extensions: ['.mjs', '.js', '.jsx', '.json', '.vue']
  }),
  vue({
    template: {
      compilerOptions: {
        whitespace: 'condense'
      }
    }
  }),
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
    'process.env.NODE_ENV': `'development'`,
    'process.env.VEUI_LOCALE': `'zh-Hans'`,
    'process.env.VUE_APP_VEUI_PREFIX': `'veui'`,
    'process.env.VEUI_PREFIX': `'veui'`,
    'process.env.VUE_ENV': `'browser'`
  }),
  commonjs()
]

function bundleUmd () {
  return {
    input: 'src/index-with-locale.js',
    output: {
      file: 'dist/veui.js',
      format: 'umd',
      name: 'veui',
      globals: {
        vue: 'Vue'
      },
      sourcemap: false
    },
    plugins: commonPlugins,
    external: id => ['vue'].includes(id)
  }
}

function bundleEsm () {
  return {
    input: 'src/index.js',
    output: {
      file: 'dist/veui.esm.js',
      format: 'esm',
      sourcemap: false
    },
    plugins: commonPlugins,
    external: id => {
      return (
        ['vue', 'bytes', 'popper.js'].includes(id) ||
        id.match(/^(?:vue-awesome|date-fns|lodash)(?:\/|$)/)
      )
    }
  }
}

function bundleLocales (locales) {
  return locales.map(({ input, output }) => ({
    input,
    output: {
      file: output,
      format: 'esm',
      sourcemap: false
    },
    plugins: [
      {
        name: 'transform-veui-18n',
        load (id) {
          return id.includes('/managers/i18n')
            ? 'import { i18n } from "veui";\n export default i18n;'
            : null
        }
      }
    ],
    external: id => id === 'veui'
  }))
}

export default [
  bundleUmd(),
  bundleEsm(),
  ...bundleLocales([
    {
      input: 'src/locale/en-US/index.js',
      output: 'dist/locale.en-US.esm.js'
    },
    {
      input: 'src/locale/zh-Hans/index.js',
      output: 'dist/locale.zh-Hans.esm.js'
    }
  ])
]
