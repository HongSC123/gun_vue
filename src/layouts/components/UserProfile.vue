<script setup>
import axios from '@axios'
import avatar1 from '@images/avatars/avatar-1.png'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useKakao } from 'vue3-kakao-sdk'

const router = useRouter()
const { kakao } = useKakao()

const loginType = sessionStorage.getItem('loginType')
const accessToken = sessionStorage.getItem('accessToken')
const role = sessionStorage.getItem('role')

console.log(loginType)
console.log(accessToken)

const showLogout = ref(!!accessToken)
const showLogin = ref(!showLogout.value)

console.log(showLogout.value, showLogin.value)

const logout = () => {
  const accessToken = sessionStorage.getItem('accessToken')
  const loginType = sessionStorage.getItem('loginType')
  if (loginType === 'KAKAO') {
    if (kakao.value && kakao.value.Auth) {
      try {

        // window.Kakao.Auth.logout(function (){
        //   alert('로그아웃 성공', accessToken)
        // })
        
        window.Kakao.API.request({
          url: '/v1/user/unlink',
          success: function (response) {
            
          },
          fail: function (error) {
            console.log(error)
          },
        })


        // kakao.value.Auth.logout()
      } catch (error) {
        console.error('로그아웃 시도 중 오류 발생:', error)
      }
    } else {
      console.error('Kakao SDK가 초기화되지 않았습니다.')
    }
  }
  axios.post("/logout", { accessToken })
    .then(r => {
      sessionStorage.clear()

      // 로그아웃 시에 실행할 코드
      axios.defaults.headers.common['Authorization'] = 'logout'
      
      console.log(axios.defaults.headers.common['Authorization'])

      // console.log("response", r)
      showLogout.value = false
      showLogin.value = true
      window.location.reload()

      // console.log("로그아웃 성공")

    })
}

const tokenCheck = () => {
  axios.post("/tokencheck")
    .then(r=>{
      console.log("response", r)
    })
    .catch(e=>{
      console.log("error", e)
    })
}

const adminList = () => {
  router.push("/admin")
}


const userData = ref(null)

onMounted(async () => {
  
  window.location.go(0)

  if (accessToken) {
    try {
      const response = await axios.get('/profile')

      userData.value = response.data

    } catch (error) {
      console.error(error)
    }
  }
})
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    color="success"
  >
    <VAvatar
      class="cursor-pointer"
      color="primary"
      variant="tonal"
    >
      <VImg
        v-if="userData && userData.memPhoto"
        :src="'http://127.0.0.1:8080/'+userData.memPhoto"
      />
      <VImg
        v-else-if="loginType ==='KAKAO'"
        src="@images/loginImages/kakao.png"
      />
      <VImg
        v-else
        :src="avatar1"
      />
      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar
                    color="primary"
                    variant="tonal"
                  >
                    <img
                      v-if="userData && userData.memPhoto"
                      :src="'http://127.0.0.1:8080/'+ userData.memPhoto"
                      
                      alt="프로필"
                      style="width: 24px; height: 24px;"
                    >
                    <VImg
                      v-else-if="loginType === 'KAKAO'"
                      src="src/assets/images/loginImages/kakao.png"
                      alt="프로필"
                      style="width: 24px; height: 24px;"
                    />
                    <VImg
                      v-else
                      :src="avatar1"
                      alt="프로필"
                      style="width: 24px; height: 24px;"
                    />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-medium">
              {{ userData.memEmail }}
            </VListItemTitle>
            <VListItemSubtitle>{{ loginType }}</VListItemSubtitle>
          </VListItem>
          <VDivider class="my-2" />

          <!-- 👉 Profile -->
          <VListItem
            link
            @click="router.push('/info')"
          >
            <template #prepend>
              <VIcon
                class="me-2"
                icon="mdi-account-outline"
                size="22"
              />
            </template>

            <VListItemTitle>마이페이지</VListItemTitle>
          </VListItem>

          <!-- 👉 Settings -->
          <VListItem
            link
            @click="router.push('/security')"
          >
            <template #prepend>
              <VIcon
                class="me-2"
                icon="mdi-cog-outline"
                size="22"
              />
            </template>

            <VListItemTitle>비밀번호변경</VListItemTitle>
          </VListItem>

          <!-- 👉 FAQ -->
          <VListItem link>
            <template #prepend>
              <VIcon
                class="me-2"
                icon="mdi-help-circle-outline"
                size="22"
              />
            </template>

            <VListItemTitle>FAQ</VListItemTitle>
          </VListItem>

          <!-- Divider -->
          <VDivider class="my-2" />
          
          <!-- 👉 Logout -->
          <VListItem
            v-if="!showLogin"
            @click="logout"
          >
            <template #prepend>
              <VIcon
                class="me-2"
                icon="mdi-logout"
                size="22"
              />
            </template>
            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
          <!-- 👉 Login -->
          <VListItem
            v-if="!showLogout"
            to="/login"
          >
            <template #prepend>
              <VIcon
                class="me-2"
                icon="mdi-login"
                size="22"
              />
            </template>
            <VListItemTitle>Login</VListItemTitle>
          </VListItem>

          <!-- 👉 token check -->
          <VListItem 
            v-if="role === 'ADMIN'"
            @click="tokenCheck"
          >
            <template #prepend>
              <VIcon
                class="me-2"
                icon="mdi-login"
                size="22"
              />
            </template>
            <VListItemTitle>토큰확인</VListItemTitle>
          </VListItem>
          <VListItem 
            v-if="role === 'ADMIN'"
            @click="adminList"
          >
            <template #prepend>
              <VIcon
                class="me-2"
                icon="mdi-login"
                size="22"
              />
            </template>
            <VListItemTitle>회원관리</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
