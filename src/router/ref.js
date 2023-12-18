import refList from '@/pages/ref/refList.vue'
import refInsert from '@/pages/ref/refInsert.vue'


const ref = [
  {
    heading: 'My 냉장고',
    path: '/pages/ref',
    children: [
      {
        path: '/refInsert',
        component: refInsert,
        children: [
          { path: '/refList', name: 'refList', component: refList,
          meta :{
            layout
          },
         }
        ],
      },
    ],
  },
]
export default ref
