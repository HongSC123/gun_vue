import MyPhyCompare from '@/pages/jinwoo/MyPhyCompare.vue'
import MyPhyList from '@/pages/jinwoo/MyPhyList.vue'
import PageMyPhy from '@/pages/jinwoo/PageMyPhy.vue'
import PagePhysical from '@/pages/jinwoo/PagePhysical.vue'

const jinwoo = [
  {
    heading: '신체정보',
    path: '/pages/jinwoo',
    children: [
      // 부모 경로 지정
      {
        path: '/physical',
        component: PagePhysical,
        children: [
          // 중복 경로 삭제
          // { path: '/physical', name: 'PagePhysical', component: PagePhysical },
          { path: '/myphy', name: 'PageMyPhy', component: PageMyPhy },
          { path: '/myphylist', name: 'MyPhyList', component: MyPhyList },
        ],
      },

      // 명확성을 위한 부모 경로 지정
      { path: '/myphycompare', name: 'MyPhyCompare', component: MyPhyCompare },
    ],
  },
]

export default jinwoo
