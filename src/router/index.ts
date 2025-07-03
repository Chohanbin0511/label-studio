import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'

const routes = [
  {
    path: '/',
    redirect: '/label-studio'
  },
  {
    path: '/label-studio',
    component: () => import('../pages/LabelStudio.vue')
  },
  {
    path: '/diff-demo',
    component: () => import('../pages/DiffDemo.vue')
  },
  {
    path: '/draggable-table',
    component: () => import('../pages/DraggableTable.vue')
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes)
})

export default router 