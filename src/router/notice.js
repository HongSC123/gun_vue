import noticeList from '@/pages/notice/noticeList.vue'
import noticeWrite from '@/pages/notice/noticeWrite.vue'

const notice = [{
  path: '/noticeList',
  name: 'NoticeList',
  component: noticeList,
},
{
  path: '/noticeWrite',
  name: 'NoticeWrite',
  component: noticeWrite,
}]


export default notice
