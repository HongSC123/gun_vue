import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'

import ChatFixed from '@/pages/recipe/ChatFixed.vue'
import ChatRecent from '@/pages/recipe/ChatRecent.vue'
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
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(routes),
    ...sun,
    ...additionalRoutes,
    ...admin,
    ...calorie,
    ...ref,
    ...notice,
  ],
  ...jinwoo,
})


// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
export default router
