import { some } from 'lodash'

export function createFileList (files) {
  // FileList没有构造函数来创建，通过 DataTransferItemList 来绕过
  // from https://github.com/jimmywarting/filelist-constructor/blob/bd262ed3778317d48dceed998f845dfedb2b69a6/filelist.js
  files = [].concat(files)
  if (some(files, file => !(file instanceof File))) {
    throw new Error(
      'expected argument to FileList is File or array of File objects'
    )
  }
  let dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer()
  files.forEach(function (file) {
    dataTransfer.items.add(file)
  })
  return dataTransfer.files
}
