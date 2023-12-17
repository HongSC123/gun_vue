
const ref = [
  {
    heading: 'My 냉장고',
    path: '/pages/ref',
    children: [
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
        ],
      },
    ]

export default ref
