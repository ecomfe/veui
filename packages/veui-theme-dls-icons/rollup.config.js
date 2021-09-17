import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: './icons/index.js',
  output: {
    file: 'dist/icons.esm.js',
    format: 'esm'
  },
  plugins: [
    {
      name: 'transform-veui',
      resolveId (source) {
        if (source === 'veui') {
          return {
            id: 'veui/dist/veui.esm',
            external: true
          }
        }
        return null
      }
    },
    nodeResolve(),
    commonjs()
  ]
}
