import chatFixed from '@/pages/recipe/chatFixed.vue'
import chatRecent from '@/pages/recipe/chatRecent.vue'
import chatRecipe from '@/pages/recipe/chatRecipe.vue'

const recipe = [
  {
    heading: '레시피',
    path: '/pages/recipe',
    children: [
      {
        path: '/chatfixed',
        name: 'chatFixed',
        component: chatFixed,
      },
      {
        path: '/chatrecent',
        name: 'chatRecent',
        component: chatRecent,
      },
      { path: '/chatrecipe',
        name: 'chatRecipe',
        component: chatRecipe 
      },
      {
        path: '/chatdetail',
        name: 'chatDetail',
        component: chatDetail,
      },
    ],
  },
]

export default recipe
