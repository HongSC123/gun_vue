import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'

import ChatFixed from '@/pages/recipe/chatFixed.vue'
import ChatRecent from '@/pages/recipe/chatRecent.vue'
import calorieDetail from '@/pages/calorie/calenderDetail.vue'
import routes from '~pages'
import admin from './admin'
import jinwoo from './jinwoo'
import sun from './sun'
import calorie from './calorie'
import ref from './ref'
import notice from './notice'


const additionalRoutes = [
  {
    path: '/recipe/chatrecent',
    name: 'ChatRecent',
    component: ChatRecent,
  },
  {
    path: '/recipe/chatdfixed',
    name: 'ChatFixed',
    component: ChatFixed,
  },
  {
    path: '/calorie/calenderdetail',
    name: 'calorieDetail',
    component: calorieDetail,
  },
  {
    path: '/refList',
    name: 'refList',
    component: () => import('@/pages/ref/refList.vue'),
  },
  {
    path: '/refinsert',
    name: 'refInsert',
    component: () => import('@/pages/ref/refInsert.vue'),
  },
]

// createWebHistory(import.meta.env.BASE_URL),

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...setupLayouts(routes),
    ...sun,
    ...additionalRoutes,
    ...admin,
    ...calorie,
    ...ref,
    ...notice,
  ],
  ...ref,
  ...jinwoo,
})


// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
export default router
