import { symlink } from 'fs'
import { resolve } from 'path'

symlink(
  resolve(__dirname, '../node_modules/veui'),
  resolve(__dirname, '../node_modules/veui-next'),
  () => {}
)
