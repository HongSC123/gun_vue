import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'

import ChatFixed from '@/pages/recipe/ChatFixed.vue'
import ChatRecent from '@/pages/recipe/ChatRecent.vue'
import routes from '~pages'
import admin from './admin'
import jinwoo from './jinwoo'
import sun from './sun'
import calorie from './calorie'


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
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(routes),
    ...sun,
    ...additionalRoutes,
    ...admin,
    ...calorie,
  ],
  ...jinwoo,
})


// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
export default router
