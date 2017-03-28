<template>
  <veui-uploader uploaderType="file" :maxNumber="3" :tip="tip" :files="files"
    extentionTypes="jpg,jpeg,gif"
    :args="extraArgs"
    :deleteFile="deleteFile"
    ui="ellipsis"
    action="http://localhost:8080/upload">
  </veui-uploader>
</template>
<script>
import Uploader from '@/components/Uploader'
export default {
  name: 'uploader',
  components: {
    'veui-uploader': Uploader
  },
  data: function () {
    return {
      files: [{name: 'aaaa.jpg', fileUid: '123456', size: '200kb'},
       {name: 'bbbb.gif', fileUid: '222333', size: '350kb'}],
      extraArgs: {
        year: '2017',
        month () {
          return new Date().getMonth() + 1
        }
      },
      tip: '请选择图片',
      deleteFile (fileUid) {
        if (!fileUid) return
        this.fileList = this.fileList.filter(file => {
          return file.fileUid !== fileUid
        })
      }
    }
  }
}
</script>
