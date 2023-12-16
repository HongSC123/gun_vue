import calorieDetail from '@/pages/calorie/calenderDetail.vue'

const calorie = [ 
    {
        heading: '칼로리',
        path: '/pages/calorie',
        children: [
            {
            path: '/calenderdetail',
            name: 'calorieDetail',
            component: calorieDetail,
            },
        ],
    }
]
export default calorie
