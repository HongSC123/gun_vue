import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'

import ChatFixed from '@/pages/recipe/chatFixed.vue'
import ChatRecent from '@/pages/recipe/chatRecent.vue'
import refInsert from '@/pages/ref/refInsert.vue'
import refList from '@/pages/ref/refList.vue'

import routes from '~pages'
import admin from './admin'
import jinwoo from './jinwoo'
import sun from './sun'
import calorie from './calorie'
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
    path: '/ref/refList',
    name: 'refList',
    component: refList,
    meta : {
      Layout : setupLayouts
    },
  },
  {
    path: '/ref/refinsert',
    name: 'refInsert',
    component: refInsert,
    meta : {
      Layout : setupLayouts
    },
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
    ...notice,
  ],
  ...jinwoo,
})


// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
export default router
