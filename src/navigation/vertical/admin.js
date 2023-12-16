export default [

  { heading: '관리자 도구' },
  {
    title: '관리자',
    icon: { icon: 'mdi-chart-donut' },
    children: [
      { title: '회원 관리', to: 'admin-list' },
      { title: '공지사항 작성', to: 'notice-noticeWrite' },
    ],
  },
]
