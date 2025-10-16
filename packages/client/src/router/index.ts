import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue')
  },
  {
    path: '/upload',
    name: 'Upload',
    component: () => import('@/views/UploadView.vue')
  },
  {
    path: '/models',
    name: 'Models',
    component: () => import('@/views/ModelsView.vue')
  },
  {
    path: '/rules',
    name: 'Rules',
    component: () => import('@/views/RulesView.vue')
  },
  {
    path: '/audit',
    name: 'Audit',
    component: () => import('@/views/AuditView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router