import MyPhyList from '@/pages/jinwoo/MyPhyList.vue'
import PageMyPhy from '@/pages/jinwoo/PageMyPhy.vue'
import PagePhysical from '@/pages/jinwoo/PagePhysical.vue'

const jinwoo = [
  {
    heading: '신체정보',
    path: '/pages/jinwoo',
    children: [
      
      {
        path: '/physical',
        name: 'PagePhysical',
        component: PagePhysical,
      },
      {
        path: '/myphy',
        name: 'PageMyPhy',
        component: PageMyPhy,
      },
      { path: '/myphylist',
        name: 'MyPhyList',
        component: MyPhyList },
    ],
  },
]

export default jinwoo
