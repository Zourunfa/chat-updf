<template>
  <el-upload
    drag
    ref="uploadRef"
    :on-preview="handlePreview"
    class="upload-demo"
    action="/api/v1/file/upload"
    :auto-upload="true"
    :show-file-list="false"
    :on-change="handleFileChange"
    :on-success="handleSuccess"
    :before-upload="beforeUpload"
    :http-request="uploadFile"
  >
    <!--  :http-request="uploadFile" -->
    <!-- <template #trigger>
      <el-button type="primary" style="width: 100%">文件</el-button>
    </template> -->
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  </el-upload>

  <!-- <vue-pdf-embed :source="pdfSrc" /> -->
</template>
<script setup>
import { ref } from 'vue'
import $store from '@/store'
import axios from 'axios'

import bigInt from 'big-integer'
const pdfSrc = ref('')
const emit = defineEmits(['uploadSuccess', 'fileChange', 'resetLoading'])
const supportFileType = ['application/pdf']
const beforeUpload = rawFile => {
  if (!supportFileType.includes(rawFile.type)) {
    console.log(rawFile.type)
    ElMessage.error('仅支持 .pdf 类型文件')
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('文件大小不能超过 2MB!')
    return false
  }
  return true
}

async function uploadFile(file) {
  localStorage.setItem('chat_id', '')
  localStorage.setItem('file_id', '')
  $store.commit('reset_loading', true)
  emit('resetLoading', true)
  const formData = new FormData()

  formData.append('file', file.file, file.name)
  return axios
    .post('/api/v1/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      const result = response.data
      $store.commit('reset_loading', false)
      emit('resetLoading', false)

      return result
      // 处理上传成功的结果
    })
    .catch(error => {
      // 处理上传失败的结果
      emit('resetLoading', false)
      return error
    })
}
const handlePreview = uploadFile => {
  console.log(uploadFile, '---file')
}
const handleFileChange = uploadFile => {
  const fileReader = new FileReader()
  fileReader.readAsDataURL(uploadFile.raw)
  fileReader.onloadend = () => {
    const dataUrl = fileReader.result
    pdfSrc.value = dataUrl
    emit('fileChange', pdfSrc.value)
  }
}

const handleSuccess = res => {
  localStorage.setItem('file_id', res.data.id.toString())

  if (res && res.data && res.data.id) $store.commit('reset_file_id', res.data.id.toString())
}
</script>
