<script setup>
import axios from '@axios'
import avatar1 from '@images/avatars/avatar-1.png'

const logout = () => {
  const accessToken = sessionStorage.getItem('accessToken')

  axios.post("/logout", { accessToken })
    .then(r => {
      sessionStorage.removeItem('accessToken')
      sessionStorage.removeItem('refreshToken')

      // 로그아웃 시에 실행할 코드
      axios.defaults.headers.common['Authorization'] = 'logout'
      
      console.log(axios.defaults.headers.common['Authorization'])

      // console.log("response", r)

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
                    <VImg :src="avatar1" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-medium">
              John Doe
            </VListItemTitle>
            <VListItemSubtitle>Admin</VListItemSubtitle>
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
          <div>
            <!-- 👉 Logout -->
            <VListItem @click="logout">
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
            <VListItem to="/login">
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
            <VListItem @click="tokenCheck">
              <template #prepend>
                <VIcon
                  class="me-2"
                  icon="mdi-login"
                  size="22"
                />
              </template>
              <VListItemTitle>token</VListItemTitle>
            </VListItem>
          </div>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
