import Login from '@/pages/login.vue'
import AccoutSettings from '@/pages/member/AccountSettingsAccount.vue'
import KakaoLogin from '@/pages/member/kakaologin.vue'

const sun = [{
  path: '/register/account',
  name: 'AccountSettings',
  component: AccoutSettings,
},
{
  path: '/login/kakao',
  name: 'KakaoLogin',
  component: KakaoLogin,
},
{
  path: '/login',
  name: 'Login',
  component: Login,
}]

export default sun
