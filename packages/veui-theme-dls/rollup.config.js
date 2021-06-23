import postcss from 'rollup-plugin-postcss'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import LessTildeFileManager from './build/LessTildeFileManager'

const commonPlugins = [
  {
    name: 'transform-veui-config',
    resolveId (source) {
      if (source === 'veui/managers/config') {
        return '\0virtual-config'
      }
      return null
    },
    load (id) {
      return id === '\0virtual-config'
        ? 'import { config } from "veui";\nexport default config;'
        : null
    }
  },
  replace({
    'process.env.NODE_ENV': '"development"'
  }),
  nodeResolve(),
  commonjs(),
  postcss({
    minimize: true,
    use: {
      less: {
        plugins: [
          {
            install (less, pluginManager) {
              pluginManager.addFileManager(new LessTildeFileManager())
            },
            minVersion: [3, 0, 0]
          }
        ],
        javascriptEnabled: true,
        math: 'always'
      }
    }
  })
]

export default {
  input: 'index.js',
  output: [
    {
      file: 'dist/dls.js',
      format: 'umd',
      globals: {
        veui: 'veui'
      }
    },
    {
      file: 'dist/dls.esm.js',
      format: 'esm'
    }
  ],
  plugins: commonPlugins,
  external: id => id === 'veui'
}
