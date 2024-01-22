import { resolve, extname } from 'path'
import { readFile } from 'fs/promises'
import postcss from 'rollup-plugin-postcss'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import varPlugin from './build/less/var-plugin'
import filePlugin from './build/less/file-plugin'

function transformVeuiConfig (veuiId) {
  return {
    name: 'transform-veui-config',
    resolveId (source) {
      if (source === 'veui/managers/ui') {
        return '\0virtual-config'
      }
      return null
    },
    load (id) {
      return id === '\0virtual-config'
        ? `import { ui } from "${veuiId}";\nexport default ui;`
        : null
    }
  }
}

const THEME_DIR = resolve(__dirname, 'themes')

function transformThemedLess () {
  return {
    name: 'transform-themed-less',
    async load (source) {
      const [id, query] = source.split('?')

      if (!query || extname(id) !== '.less') {
        return null
      }

      return await readFile(id, 'utf-8')
    },
    transform (code, id) {
      const [pure, query] = id.split('?')

      if (!query || extname(pure) !== '.less') {
        return null
      }

      const params = new URLSearchParams(query)
      const theme = params.get('theme')

      if (!theme) {
        return null
      }

      const themeOverrides = resolve(THEME_DIR, `${theme}.less`)
      return `${code}\n@import "${themeOverrides}";`
    }
  }
}

function getCommonPlugins ({ extractCSS = false } = {}) {
  return [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': '"development"'
    }),
    nodeResolve(),
    commonjs(),
    transformThemedLess(),
    postcss({
      minimize: true,
      use: {
        less: {
          plugins: [varPlugin(), filePlugin()],
          javascriptEnabled: true,
          math: 'always'
        }
      },
      extract: extractCSS
    })
  ]
}

const externals = ['veui', 'veui/dist/veui.esm']

export default [
  {
    input: 'index.js',
    output: {
      file: 'dist/dls.js',
      format: 'umd',
      globals: {
        veui: 'veui'
      }
    },
    plugins: [transformVeuiConfig('veui'), ...getCommonPlugins()],
    external: (id) => externals.indexOf(id) >= 0
  },
  {
    input: 'index.js',
    output: {
      file: 'dist/dls.extract.js',
      format: 'umd',
      globals: {
        veui: 'veui'
      }
    },
    plugins: [
      transformVeuiConfig('veui'),
      ...getCommonPlugins({ extractCSS: resolve('dist/dls.css') })
    ],
    external: (id) => externals.indexOf(id) >= 0
  },
  {
    input: 'index.js',
    output: {
      file: 'dist/dls.esm.js',
      format: 'esm'
    },
    plugins: [transformVeuiConfig('veui/dist/veui.esm'), ...getCommonPlugins()],
    external: (id) => externals.indexOf(id) >= 0
  },
  {
    input: 'index.js',
    output: {
      file: 'dist/dls.extract.esm.js',
      format: 'esm'
    },
    plugins: [
      transformVeuiConfig('veui/dist/veui.esm'),
      ...getCommonPlugins({ extractCSS: resolve('dist/dls.css') })
    ],
    external: (id) => externals.indexOf(id) >= 0
  }
]
