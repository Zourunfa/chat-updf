<template>
  <div class="chat-translate">
    <div id="messages" class="messages">
      <div :class="{ 'message-item': true, 'message-user': item.role == 'user' }" v-for="(item, index) in messages" :key="index">
        {{ item.content }}
      </div>
    </div>
    <div class="loading">
      <el-icon :size="30" v-if="msgLoading">
        <Loading />
      </el-icon>
    </div>
    <!--   :disabled="active?.state != 2 || msgLoading" -->
    <input ref="refInput" class="input" :placeholder="active?.state != 2 ? '索引构建中...' : '开始与你的文档对话吧'" v-model="input" @keyup.up.enter="translateText" />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { fetchTranslate } from '@/api/baseApi'
import { showLastMessage } from '@/libs/utils/utils.js'
import { DeleteFilled } from '@element-plus/icons-vue'
import Loading from '@/assets/loading.svg?component'
const messages = ref([])
const input = ref('')

console.log(Loading, '---loading')

const refInput = ref(null)
const getFocus = () => {
  nextTick(() => {
    refInput.value.focus()
  })
}
onMounted(() => {
  getFocus()
})

const msgLoading = ref(false)
async function translateText() {
  messages.value.push({
    content: input.value,
    role: 'user',
  })
  showLastMessage()
  msgLoading.value = true
  try {
    const res = await fetchTranslate({ content: input.value })
    messages.value.push({
      content: res.data.content || '',
      role: 'chatdoc',
    })
    showLastMessage()
    msgLoading.value = false
    input.value = ''
  } catch (error) {
    messages.value.push({
      content: 'has a error',
      role: 'chatdoc',
    })
    msgLoading.value = false
    input.value = ''
  }
}
</script>

<style>
.el-menu {
  width: 100%;
}
</style>
<style lang="scss" scoped>
:deep(.el-menu) {
  width: 100%;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.chat-translate {
  width: 100%;
  // height: 100%;
  flex-direction: column;
  justify-content: space-between;
  display: flex;
  position: relative;

  .messages {
    display: flex;
    flex-direction: column;
    padding: 10px;
    // height: 90%;
    // overflow-y: scroll;
    ::-webkit-scrollbar {
      display: none;
    }
    .message-item {
      border: 1px solid #fafafa;
      background: #fafafa;
      margin-top: 15px;
      border-radius: 10px;
      padding: 10px;
      max-width: 70%;
    }

    .message-user {
      background-color: #caeef6;
      margin-top: 30px;
      border-radius: 10px;
      margin-left: auto;
    }
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .input {
    // width: 88%;
    margin: 10px;
    margin-right: 20px;
    padding: 10px;
    height: 30px;
    line-height: 30px;
    border: 1px solid blue;
    background-image: url('@/assets/send.svg');
    background-repeat: no-repeat;
    background-position: 10px;
    padding-left: 40px;
    position: fixed;
    bottom: 0;
    width: 26%;
  }
}
</style>
