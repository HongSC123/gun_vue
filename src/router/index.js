import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
import jinwoo from './jinwoo'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(routes),
  ],
  ...jinwoo,
})


// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
export default router
