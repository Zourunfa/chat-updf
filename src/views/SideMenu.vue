<template>
  <el-menu style="width: 100%; border: none" :default-active="$route.name" unique-opened router class="el-menu-vertical-demo" :collapse="isCollapse" @open="handleOpen" @close="handleClose">
    <el-menu-item index="chatupdf" route="/chatupdf">
      <el-icon><document /></el-icon>
      <template #title>Chat with PDF</template>
    </el-menu-item>
    <el-menu-item index="translate" route="/translate">
      <el-icon><icon-menu /></el-icon>
      <template #title>Translate</template>
    </el-menu-item>

    <!-- <el-menu-item route="/translate">
      <el-icon><setting /></el-icon>
      <template #title>summarize</template>
    </el-menu-item> -->
  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Document, Menu as IconMenu } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

const $route = useRoute()
const isCollapse = ref(false)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style>
.el-menu {
  width: 100%;
}
</style>
<style scoped>
:deep(.el-menu) {
  width: 100%;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
