import refMain from '@/pages/ref/refMain.vue'
import refList from '@/pages/ref/refList.vue'
import refInsert from '@/pages/ref/refInsert.vue'


const ref = [
  {
    heading: 'My 냉장고',
    path: '/pages/ref',
    children: [
      {
        path: '/refMain',
        name: 'refMain',
        component: refMain,
      },
      {
        path: '/refList/:memEmail',
        name: 'refList',
        component: refList,
      },
      { path: '/refInsert',
        name: 'refInsert',
        component: refInsert 
      },
    ],
  },
]

export default ref
