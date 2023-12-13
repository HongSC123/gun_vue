<script setup>
import axios from '@axios'
import avatar1 from '@images/avatars/avatar-1.png'
import { onMounted } from 'vue'
import { useKakao } from 'vue3-kakao-sdk'

const { kakao } = useKakao()

const loginType = sessionStorage.getItem('loginType')
const accessToken = sessionStorage.getItem('accessToken')

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
      sessionStorage.removeItem('accessToken')
      sessionStorage.removeItem('refreshToken')
      sessionStorage.removeItem('memEmail')
      sessionStorage.removeItem('loginType')

      // 로그아웃 시에 실행할 코드
      axios.defaults.headers.common['Authorization'] = 'logout'
      
      console.log(axios.defaults.headers.common['Authorization'])

      // console.log("response", r)
      showLogout.value = false
      showLogin.value = true

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

const userData = ref(null)

onMounted(async () => {
  if (accessToken) {
    try {
      const response = await axios.get('/profile')

      userData.value = response.data

      // E:\gun_workspace\gun\src\main\resources\
      // console.log(userData.value)
      // console.log(userData.value.memEmail)
      // console.log(userData.value.memPhoto)

    } catch (error) {
      console.error(error)
    }
  }
})

// const photoUrl = "E:/gun_workspace/gun/src/main/resources/" + userData.value.memPhoto

// console.log(photoUrl)
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
      <VImg :src="avatar1" />

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
                      v-if="userData.memPhoto"
                      src="E:/gun_workspace/gun/src/main/resources/member/test6/avatar.png"
                      alt="프로필"
                      style="width: 24px; height: 24px;"
                    >
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
          <VListItem link>
            <template #prepend>
              <VIcon
                class="me-2"
                icon="mdi-account-outline"
                size="22"
              />
            </template>

            <VListItemTitle>Profile</VListItemTitle>
          </VListItem>

          <!-- 👉 Settings -->
          <VListItem link>
            <template #prepend>
              <VIcon
                class="me-2"
                icon="mdi-cog-outline"
                size="22"
              />
            </template>

            <VListItemTitle>Settings</VListItemTitle>
          </VListItem>

          <!-- 👉 Pricing -->
          <VListItem link>
            <template #prepend>
              <VIcon
                class="me-2"
                icon="mdi-currency-usd"
                size="22"
              />
            </template>

            <VListItemTitle>Pricing</VListItemTitle>
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
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
