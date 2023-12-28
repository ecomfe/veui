import { sync } from '@justineo/npmmirror-sync'

const PACKAGES = [
  'babel-plugin-veui',
  'veui',
  'veui-loader',
  'veui-theme-dls',
  'veui-theme-dls-icons'
]

Promise.all(PACKAGES.map(sync)).then(() => {
  console.log('Sync request sent for all packages.')
}).catch((e) => {
  console.error(e)
})
