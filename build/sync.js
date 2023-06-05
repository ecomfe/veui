import https from 'https'

const PACKAGES = [
  'babel-plugin-veui',
  'veui',
  'veui-loader',
  'veui-theme-dls',
  'veui-theme-dls-icons'
]

async function syncPackage (name) {
  const options = {
    hostname: 'npmmirror.com',
    path: `/sync/${name}/?sync_upstream=true`,
    method: 'PUT'
  }

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.on('data', () => {})
      res.on('end', () => {
        resolve()
      })
    })
    req.on('error', (e) => {
      reject(e)
    })
    req.end()
  })
}

Promise.all(PACKAGES.map(syncPackage)).then(() => {
  console.log('Sync request sent for all packages.')
}).catch((e) => {
  console.error(e)
})
