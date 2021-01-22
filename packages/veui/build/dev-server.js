const os = require('os')
const path = require('path')
const fse = require('fs-extra')
const { random, omit, isUndefined } = require('lodash')
const formidable = require('formidable')

const uploadDir = path.join(os.tmpdir(), 'veui-dev-server')

const spells = [
  'Expecto patronum',
  'Accio',
  'Wingardium Leviosa',
  'Expelliarmus',
  'Lumos',
  'Alohomora',
  'Avada Kedavra',
  'Sectumsempra',
  'Obliviate',
  'Riddikulus',
  'Amato Animo Animato Animagus'
]

const errors = [
  'Image is too large, please check it',
  'Something went wrong, please contact administrator',
  "Ops! Server can't handle it. May be try it again later"
]

module.exports = {
  before (app) {
    fse.ensureDirSync(uploadDir)

    app.post('/upload/xhr', handleXhrRequest)
    app.post('/upload/iframe', handleIframeRequest)
    app.get('/upload/file/:filename', handleFileRequest)

    // 退出是清理上传文件目录
    process.on('SIGINT', function () {
      console.log('[DevServer]', 'Will exit. Cleaning upload dir...')
      fse.removeSync(uploadDir)
      process.exit()
    })
  }
}

async function handleXhrRequest (req, res) {
  let file
  try {
    ;[, { file }] = await parseRequestBody(req)
  } catch (err) {
    console.log('[DevServer]', err)
    res.status(500).send(err.message)
    return
  }
  await sleep(random(100, 2000))
  res.json(
    getResponseImageData(
      {
        src: getFileURL(req, file.hash),
        hash: file.hash
      },
      req.query.force
    )
  )
}

async function handleIframeRequest (req, res) {
  let fields
  let file
  try {
    ;[fields, { file }] = await parseRequestBody(req)
  } catch (err) {
    console.log('[DevServer]', err)
    res.status(500).send(err.message)
    return
  }

  let callbackName = fields.callback || 'window.parent.postMessage'
  let data = convertResponse(
    getResponseImageData(
      {
        src: getFileURL(req, file.hash),
        hash: file.hash
      },
      req.query.force
    )
  )
  await sleep(random(100, 2000))
  res.send(`<script>${callbackName}(${JSON.stringify(data)})</script>`)
}

function handleFileRequest (req, res) {
  let p = path.join(uploadDir, req.params.filename)
  if (/\.{2,}[\\/]/.test(path.relative(uploadDir, p))) {
    res.status(403).end()
    return
  }
  res.sendFile(p)
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function getResponseImageData (data, force) {
  let success = isUndefined(force) ? Math.random() > 0.5 : force === 'success'
  let ret = {
    success,
    cast: spells[random(spells.length - 1)] // extra field from server
  }
  if (success) {
    Object.assign(ret, data)
    ret.alt = spells[random(spells.length - 1)] // override field on file
  } else {
    ret.message = errors[random(errors.length - 1)]
  }
  return ret
}

function convertResponse (data) {
  let code = data.success ? 0 : random(1, 9)
  let result = omit(data, ['success'])
  return { code, result }
}

function parseRequestBody (req) {
  const form = formidable({
    uploadDir,
    maxFileSize: 2 * 1024 * 1024,
    hash: 'sha1'
  })
  form.on('file', function (field, file) {
    let p = path.join(uploadDir, file.hash)
    fse.renameSync(file.path, p)
    file.path = p
  })
  return new Promise(function (resolve, reject) {
    form.parse(req, function (error, fields, files) {
      if (error) {
        return reject(error)
      }
      resolve([fields, files])
    })
  })
}

function getFileURL (req, name) {
  return `http://${req.headers.host}/upload/file/${encodeURIComponent(name)}`
}
