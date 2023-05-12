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
    <!-- :disabled="!active || msgLoading" -->

    <el-input
      :disabled="isInputDisabled"
      v-loading="msgLoading || isInputLoading"
      ref="refInput"
      class="input"
      :placeholder="!active ? '需要先上传文档才可于文档对话...' : '开始与你的文档对话吧'"
      v-model="input"
      @keyup.up.enter="talkToAI"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, watch, onBeforeMount } from 'vue'
import { fetchTalk, fetchTalkList } from '@/api/baseApi'
import { showLastMessage } from '@/libs/utils/utils.js'
import Loading from '@/assets/loading.svg?component'
import $store from '@/store'

const inputLoading = ref(false)
const props = defineProps({
  active: {
    type: String,
    default: '',
  },
  fileId: {
    type: String,
  },
  isInputLoading: {
    type: Boolean,
  },
})

const talkList = ref([])
watch(
  () => props.isInputLoading,
  () => {
    console.log(props.isInputLoading, '----active')
  }
)

const isInputDisabled = computed(() => {
  if (localStorage.getItem('file_id')) {
    return false
  }

  return !props.active || msgLoading.value
})

const messages = ref([])
const input = ref('')

const refInput = ref(null)
const getFocus = () => {
  nextTick(() => {
    refInput.value.focus()
  })
}

onBeforeMount(async () => {
  if (localStorage.getItem('file_id')) {
    const res = await fetchTalkList({ chat_id_str: localStorage.getItem('chat_id'), file_id_str: localStorage.getItem('file_id') })
    talkList.value = res.data.list
    initTalkList()
  }
})

const initTalkList = () => {
  if (talkList.value && talkList.value.length > 0) {
    talkList.value.forEach((talkContent, index) => {
      console.log(talkContent, '---talkContent')
      if (index % 2 == 1) {
        messages.value.push({
          content: talkContent.content || '',
          role: 'chatdoc',
        })
      } else {
        messages.value.push({
          content: talkContent.content || '',
          role: 'user',
        })
      }
    })
  }
}

onMounted(() => {
  getFocus()
})

const msgLoading = ref(false)
async function talkToAI() {
  messages.value.push({
    content: input.value,
    role: 'user',
  })
  showLastMessage()
  msgLoading.value = true
  inputLoading.value = true

  let formData

  if (localStorage.getItem('chat_id')) {
    formData = {
      content: input.value,
      chat_id_str: localStorage.getItem('chat_id'),
      file_id_str: localStorage.getItem('file_id') ? localStorage.getItem('file_id') : $store.state.active_file_id,
    }
  } else {
    formData = {
      content: input.value,
      file_id_str: localStorage.getItem('file_id') ? localStorage.getItem('file_id') : $store.state.active_file_id,
    }
  }

  try {
    const res = await fetchTalk(formData)

    messages.value.push({
      content: res.data.content || '',
      role: 'chatdoc',
    })
    showLastMessage()

    if (!localStorage.getItem('chat_id')) {
      localStorage.setItem('chat_id', res.data.chat_id)
    }
    msgLoading.value = false
    inputLoading.value = false
    input.value = ''
  } catch (error) {
    messages.value.push({
      content: error.msg,
      role: 'chatdoc',
    })
    msgLoading.value = false
    inputLoading.value = false
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
  :deep(.el-input) {
    // width: 88%;
    margin: 10px;
    margin-right: 20px;
    padding: 10px;
    // height: 30px;
    line-height: 30px;
    border: 1px solid blue;
    background-image: url('@/assets/send.svg');
    background-repeat: no-repeat;
    background-position: 10px;
    padding-left: 40px;
    position: fixed;
    bottom: 0;
    width: 28%;
  }
}
</style>
