import App from '@/App.vue'
import layoutsPlugin from '@/plugins/layouts'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import '@core/scss/template/index.scss'
import '@styles/styles.scss'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import { createVueKakaoSdk } from 'vue3-kakao-sdk'

loadFonts()

const app = createApp(App)

app.use(vuetify)
app.use(createPinia())
app.use(router)
app.use(layoutsPlugin)
app.use(createVueKakaoSdk('d62ec40e31ec1fcf10bd7b9c4ac35b04'))

app.mount('#app')

// 전역에서 키 이벤트를 감지
window.addEventListener('keydown', handleGlobalKeyDown)

function handleGlobalKeyDown(event) {
  // 쉬프트 + L 키를 눌렀을 때
  if (event.shiftKey && event.key === 'L') {
    // 콘솔에 텍스트 출력
    console.log("Shift + L 키 누름")

    // 원하는 페이지로 라우팅
    router.push('/adminLogin')
  }
}
