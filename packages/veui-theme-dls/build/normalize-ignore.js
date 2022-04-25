import { resolve } from 'path'
import { readFileSync, writeFileSync } from 'fs'

const SEPARATOR = '### Auto Generated ###'
const ignoreFile = resolve(__dirname, '../.dlsignore')

const ignored = readFileSync(ignoreFile, { encoding: 'utf-8' })

const handwritten = ignored.substring(
  0,
  ignored.indexOf(SEPARATOR) + SEPARATOR.length
)
const generated = ignored.substring(handwritten.length)

const sorted = generated.split(/\n+/).filter(Boolean).sort().join('\n')

writeFileSync(ignoreFile, `${handwritten}\n${sorted}\n`, { encoding: 'utf-8' })
