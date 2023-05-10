import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'normalize.css/normalize.css'
import 'element-plus/dist/index.css'
import './style.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from './App.vue'
import routers from '@/router/router'
// 解决vue-pdf需要process对象的问题
import process from 'process'
window.process = process
const app = createApp(App).use(routers)
app.use(ElementPlus)
app.mount('#app')
