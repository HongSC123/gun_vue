export default [

    { heading: '칼로리 분석' },
    {
      title: '나의 칼로리',
      icon: { icon: 'mdi-chart-donut' },
      children: [
        { title: '음식 등록', to: 'calorie-foodInsert' },
        { title: '오늘의 내 칼로리', to: 'calorie-todaymeal' },
        { title: '칼로리 달력', to: 'calorie-calorieCalender' },
      ],
    },
  ]
  
  