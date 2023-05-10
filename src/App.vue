<script setup>
import { ref } from 'vue'
import { fetchQuery, fetchDelDoc } from './api'

import Upload from './views/Upload.vue'

import SiderMenu from '@/views/SideMenu.vue'
import { docState, formatByteSize, docType, nameWithoutExt, docUrl, showLastMessage } from './utils'

const docList = ref([])
const active = ref(null)
const file_id = ref('')
const uploadSuccess = file_id => {
  alert(file_id)
  file_id.value = file_id
}
// 该文档中李志有多少个女朋友
const fileChange = url => {
  active.value = url
}

function query() {
  if (!input.value) {
    return
  }
  messages.value.push({
    content: input.value,
    role: 'user',
  })
  showLastMessage()
  msgLoading.value = true
  fetchQuery(active.value.doc_id, input.value).then(res => {
    messages.value.push({
      content: res?.data?.response || '',
      role: 'chatdoc',
    })
    showLastMessage()
    msgLoading.value = false
  })
  input.value = ''
}

function delDoc(doc_id) {
  if (active.value.doc_id == doc_id) {
    active.value = null
  }
  if (active.value == null && docList.value.length > 0) {
    const doc = docList.value[0]
    active.value = doc
  }

  fetchDelDoc(doc_id).then(() => {
    loadDos()
  })
}

const loadFileState = () => {
  if (docList.value.filter(e => e.state != 2).length > 0) {
    setTimeout(() => {
      loadDos()
      loadFileState()
    }, 2000)
  }
}

const onerror = e => {
  console.log(e)
}
</script>

<template>
  <div class="container">
    <div class="sidebar">
      <div class="sider-menu">
        <SiderMenu />
      </div>

      <div class="user-info">
        <el-avatar :size="50" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
        <span class="user-name">Anonymous</span>
      </div>
    </div>

    <div class="chat">
      <router-view v-slot="{ Component }" :key="key">
        <component :is="Component" :fileId="file_id" :active="active" :key="key" />
      </router-view>
    </div>
    <div class="doc">
      <div v-if="!active" class="empty-info">
        <div>当前没有文档, 请先上传</div>
        <div>
          <Upload @upload-success="uploadSuccess" @file-change="fileChange" style="width: 100%; height: 100%" />
        </div>
      </div>
      <iframe v-if="active" :src="active" style="width: 100%; height: 100%" :key="active.doc_id" @onerror="onerror"></iframe>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ellipsis {
  width: 300px;
  overflow: hidden;
  /*文本不会换行*/
  white-space: nowrap;
  /*当文本溢出包含元素时，以省略号表示超出的文本*/
  text-overflow: ellipsis;
}

.empty-info {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  color: #cdd0d6;
  font-size: 18px;
  align-items: center;
  justify-content: center;
}

.container {
  display: flex;
  width: 100%;
  height: 100vh;

  .sidebar {
    display: flex;
    width: 200px;
    width: 15%;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid #ebedf0;
    .add-doc {
      display: flex;
      padding: 10px;
      align-items: center;
      justify-content: space-between;
    }

    .doc-list {
      display: flex;
      align-items: center;
      justify-content: center;

      &:last-child .doc-item {
        border-bottom: none;
      }

      .doc-item {
        width: 100%;
        padding: 3px 10px;
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid #ebedf0;

        .doc-item-title {
          display: flex;
          font-size: 14px;
          height: 28px;
          line-height: 28px;
          justify-content: space-between;

          .remove-icon {
            color: #cdd0d6;
            height: 100%;

            &:hover {
              color: #79bbff;
            }
          }
        }

        .doc-item-info {
          display: flex;
          font-size: 10px;
          color: gray;
          height: 10px;
          line-height: 10px;
          justify-content: space-between;

          .doc-item-info-cell {
            margin: 0 2px;
          }
        }
      }

      .doc-active {
        background-color: #a0cfff;
      }
    }

    .user-info {
      padding: 20px;
      height: 30px;
      display: flex;
      align-items: center;
      border-top: 1px solid #ebedf0;

      .user-name {
        margin: 0 10px;
        color: #cdd0d6;
        font-size: 14px;
      }
    }
  }

  .doc {
    width: 55%;
    display: flex;
    border-right: 1px solid #ebedf0;
    border-left: 1px solid #ebedf0;
  }

  .chat {
    width: 30%;
    background-color: #f3f3f3;
  }
}
</style>
