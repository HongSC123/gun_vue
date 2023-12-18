import Account from '@/pages/account-settings/AccountSettingsAccount.vue'
import Security from '@/pages/account-settings/AccountSettingsSecurity.vue'
import AdminLogin from '@/pages/admin/adminLogin.vue'
import AdminRegister from '@/pages/admin/adminRegister.vue'
import Login from '@/pages/login.vue'
import AccoutSettings from '@/pages/member/AccountSettingsAccount.vue'
import FaceLogin from '@/pages/member/FaceLogin.vue'
import KakaoLogin from '@/pages/member/kakaologin.vue'
import NaverTemp from '@/pages/naverTemp.vue'


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
},
{
  path: '/info',
  name: 'Account',
  component: Account,
},
{
  path: '/security',
  name: 'Security',
  component: Security,
},
{
  path: '/adminLogin',
  name: 'AdminLogin',
  component: AdminLogin,
  mate: {
    layout: 'blank',
  },
},
{
  path: '/adminRegister',
  name: 'AdminRegister',
  component: AdminRegister,
},
{
  path: '/faceLogin',
  name: 'FaceLogin',
  component: FaceLogin,
},
{
  path: '/login/naver',
  name: 'NaverLogin',
  component: NaverTemp,
  mate: {
    layout: 'blank',
  },

}]

export default sun
