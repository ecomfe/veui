import { some } from 'lodash'

export function isSupportFileListContructor () {
  try {
    return !!createDataTransfer().items
  } catch (err) {
    return false
  }
}

export function createFileList (files) {
  // FileList没有构造函数来创建，通过 DataTransferItemList 来绕过
  // from https://github.com/jimmywarting/filelist-constructor/blob/bd262ed3778317d48dceed998f845dfedb2b69a6/filelist.js
  files = [].concat(files)
  if (some(files, (file) => !(file instanceof File))) {
    throw new Error(
      '[veui-file] Expected argument to `FileList` is `File` or array of `File` objects.'
    )
  }
  let dataTransfer = createDataTransfer()
  files.forEach(function (file) {
    dataTransfer.items.add(file)
  })
  return dataTransfer.files
}

function createDataTransfer () {
  return new ClipboardEvent('').clipboardData || new DataTransfer()
}
