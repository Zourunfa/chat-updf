import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: '_Home', redirect: { name: 'translate' } },
  {
    path: '/chatupdf',
    name: 'chatupdf',
    component: () => import('@/views/chat-view/ChatPDF.vue'),
  },
  {
    path: '/translate',
    name: 'translate',
    component: () => import('@/views/chat-view/ChatTranslate.vue'),
  },
  {
    path: '/sumarize',
    name: 'sumarize',
    component: () => import('@/views/chat-view/ChatSumary.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
