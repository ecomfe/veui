import { resolve, basename } from 'path'
import { mkdirSync, readFileSync, writeFileSync, readdirSync } from 'fs'
import globby from 'globby'
import { rimrafSync } from 'rimraf'
import less from 'less'
import postcss from 'postcss'
import postcssrc from 'postcss-load-config'
import filePlugin from './less/file-plugin'

const ENTRIES = ['common.less', 'typography.less', 'components/*.less']
const OUTPUT_DIR = resolve(__dirname, '..', 'dist/themes')
const THEMES = resolve(__dirname, '..', 'themes')

rimrafSync(OUTPUT_DIR)
mkdirSync(OUTPUT_DIR, { recursive: true })

async function build () {
  const paths = await globby(ENTRIES)
  const { plugins, options } = await postcssrc()

  const filePluginInstance = filePlugin()
  const postcssInstance = postcss(plugins)

  const themes = readdirSync(THEMES)
  await Promise.all(
    themes
      .map((themeFileName) => {
        const theme = basename(themeFileName, '.less')

        return paths.map(async (path) => {
          const filePath = resolve(__dirname, '..', path)
          const lessCode = readFileSync(filePath, 'utf-8')

          const { css } = await less.render(
            `${lessCode}\n@import "${resolve(THEMES, themeFileName)}";`,
            {
              javascriptEnabled: true,
              math: 'always',
              filename: filePath,
              plugins: [filePluginInstance]
            }
          )

          const outputPath = resolve(
            OUTPUT_DIR,
            theme,
            path.replace(/\.less$/, '.css')
          )
          const { css: postcssResult } = await postcssInstance.process(css, {
            ...options,
            from: filePath,
            to: outputPath
          })

          mkdirSync(resolve(outputPath, '..'), { recursive: true })
          writeFileSync(outputPath, postcssResult)
        })
      })
      .flat()
  )
}

build()
