import admin from './admin'
import jinwoo from './jinwoo'
import recipe from './recipe'
import ref from './ref'

export default [
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
  ...jinwoo,
  ...ref,
  ...recipe,
  ...admin,

]


