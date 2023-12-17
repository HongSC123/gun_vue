
import jinwoo from './jinwoo'
import recipe from './recipe'
import ref from './ref'
import calorie from './calorie'
import admin from './admin'

const baseRoutes = [
  {
    title: 'Home',
    to: { name: 'index' },
    icon: { icon: 'mdi-home-outline' },
  },
  {
    title: 'BMI 비만도 계산',
    to: { name: 'PageBmi' },
    icon: { icon: 'mdi-calculator-variant-outline' },
  },
  {
    title: '공지사항',
    to: 'notice-noticeList',
    icon: { icon: 'mdi-bulletin-board' },
  },
  ...jinwoo,
  ...ref,
  ...recipe,
  ...calorie,

]

if(sessionStorage.getItem('loginType') === 'ADMIN'){
  baseRoutes.push(...admin)
}

export default baseRoutes 


