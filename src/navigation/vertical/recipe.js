export default [
    { heading: '레시피 검색' },
    {
      title: '레시피 검색',
      icon: { icon: 'mdi-chart-donut' },
      children: [
        { title: '검색봇', to: 'recipe-chatRecipe' },
        { title: '지난 답변', to: 'recipe-chatRecent' },
        // { title: '고정 답변', to: 'recipe-chatFixed' },
      ],
    },
  ]