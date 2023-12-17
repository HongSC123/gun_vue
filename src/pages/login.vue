<script setup>
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2LoginIllustrationDark from '@images/pages/auth-v2-login-illustration-dark.png'
import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png'
import authV2MaskDark from '@images/pages/auth-v2-mask-dark.png'
import authV2MaskLight from '@images/pages/auth-v2-mask-light.png'
import tree from '@images/pages/tree.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { useRouter } from 'vue-router'
import { useKakao } from 'vue3-kakao-sdk'
import axios from 'e:/gun_workspace/gun_vue/node_modules/axios/index'

const { kakao } = useKakao()

const router = useRouter()

const form = ref({
  email: '',
  password: '',
  remember: false,
})

const isPasswordVisible = ref(false)
const authThemeImg = useGenerateImageVariant(authV2LoginIllustrationLight, authV2LoginIllustrationDark, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)


const loginCheck = () => {
  axios.post('/login', {
    memEmail: form.value.email,
    memPw: form.value.password,
  }).then(r => {
    
    const { accessToken, refreshToken, role } = r.data

    sessionStorage.setItem('accessToken', accessToken)
    sessionStorage.setItem('refreshToken', refreshToken)
    sessionStorage.setItem('role', role)
    sessionStorage.setItem('memEmail', form.value.email)
    sessionStorage.setItem('loginType', 'MEMBER')
    axios.defaults.headers['loginType'] = 'MEMBER'
    console.log(r)
    if(r.data.error === '801'){
      alert("회원이 아닙니다.")
      
      return
    }
    if(r.data.error === '802'){
      alert("비밀번호가 틀렸습니다.")

      return
    }
    if(r.data.error === '803'){
      alert("Admin 로그인을 이용하세요")
      
      return
    }

    router.push("/")
    
  }).catch(e => {
    console.log(e)
  })
}

const kakaoLogin = () => {
  console.log("카카오 로그인 누름")
  kakao.value.Auth.login({
    success(success){
      console.log(success)

      // console.log(success.access_token)
      // console.log(success.refresh_token)

      const accessToken = success.access_token
      const apiUrl = 'https://kapi.kakao.com/v2/user/me'

      // 카카오 API를 호출하여 사용자 정보 및 이메일 가져오기
      axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          property_keys: ['kakao_account.email'], // 이메일 정보를 가져오기 위한 요청
        },
      })
        .then(response => {
          const email = response.data.kakao_account.email

          // console.log('사용자 이메일:', email)

          const kakaoInfo = {
            memEmail: email,
          }

          performKakaoLogin(kakaoInfo)
        })
        .catch(error => {
          console.error('이메일 가져오기 실패:', error.response.data)
        })
    },
    fail(err){
      console.log(err)
    },
  })
}

const performKakaoLogin = kakaoInfo => {
  axios.post('/loginkakao', kakaoInfo, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      console.log("Response from server:", response)

      const { accessToken, refreshToken, role } = response.data

      sessionStorage.setItem('accessToken', accessToken)
      sessionStorage.setItem('refreshToken', refreshToken)
      sessionStorage.setItem('memEmail', kakaoInfo.memEmail)
      sessionStorage.setItem('loginType', 'KAKAO')
      sessionStorage.setItem('role', role)
      axios.defaults.headers['loginType'] = 'KAKAO'

      console.log(axios.defaults.headers)

      router.replace("/")
    })
    .catch(error => {
      console.error('로그인:', error)
    })
}

const loginface = () => {
  console.log("face")

  router.push("/faceLogin")

  // axios.post("/login/face")
  //   .then(r => {
  //     console.log(r)
  //   })
  //   .catch(e => {
  //     console.log(e)
  //   })
}
</script>

<template>
  <div>
    <!-- Title and Logo -->
    <div class="auth-logo d-flex align-start gap-x-3">
      <VNodeRenderer :nodes="themeConfig.app.logo" />

      <h1 class="font-weight-medium leading-normal text-2xl text-uppercase">
        {{ themeConfig.app.title }}
      </h1>
    </div>

    <VRow
      no-gutters
      class="auth-wrapper"
    >
      <VCol
        md="8"
        class="d-none d-md-flex align-center justify-center position-relative"
      >
        <div class="d-flex align-center justify-center w-100 pa-10 pe-0">
          <VImg
            max-width="768px"
            :src="authThemeImg"
            class="auth-illustration"
          />
        </div>

        <VImg
          :width="276"
          :src="tree"
          class="auth-footer-start-tree"
        />
        <VImg
          class="auth-footer-mask"
          :src="authThemeMask"
        />
      </VCol>

      <VCol
        cols="12"
        md="4"
        class="auth-card-v2 d-flex align-center justify-center"
      >
        <VCard
          flat
          :max-width="500"
          class="mt-12 mt-sm-0 pa-4"
        >
          <VCardText>
            <h5 class="text-h5 font-weight-medium mb-1">
              Welcome to {{ themeConfig.app.title }}! 👋🏻
            </h5>
            <p class="mb-0">
              Please sign-in to your account and start the adventure
            </p>
          </VCardText>
          <VCardText>
            <VForm @submit.prevent="loginCheck">
              <VRow>
                <!-- email -->
                <VCol cols="12">
                  <VTextField
                    v-model="form.email"
                    label="Email"
                    type="email"
                  />
                </VCol>

                <!-- password -->
                <VCol cols="12">
                  <VTextField
                    v-model="form.password"
                    label="Password"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                    @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  />

                  <div class="d-flex align-center flex-wrap justify-space-between mt-1 mb-4">
                    <VCheckbox
                      v-model="form.remember"
                      label="Remember me"
                    />
                    <a
                      class="text-primary ms-2 mb-1"
                      href="#"
                    >
                      Forgot Password?
                    </a>
                  </div>

                  <VBtn
                    block
                    type="submit"
                    style="margin-bottom: 10px;"
                  >
                    Login
                  </VBtn>
                  <VBtn
                    block
                    @click="loginface"
                    style="margin-bottom: 10px;"
                  >
                    안면인식
                  </VBtn>
                </VCol>

                <!-- create account -->
                <VCol
                  cols="12"
                  class="text-center text-base"
                >
                  <span>New on our platform?</span>
                  <RouterLink
                    class="text-primary ms-2"
                    :to="{ name: 'register' }"
                  >
                    Create an account
                  </routerlink>
                </VCol>

                <VCol
                  cols="12"
                  class="d-flex align-center"
                >
                  <VDivider />
                  <span class="mx-4">or</span>
                  <VDivider />
                </VCol>

                <!-- auth providers -->
                <VCol
                  cols="12"
                  class="text-center"
                >
                  <img
                    src="@images/loginImages/kakao_login_small.png"
                    alt="카카오로그인"
                    @click="kakaoLogin"
                  >
                </VCol>
              </VRow>
            </VForm>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
