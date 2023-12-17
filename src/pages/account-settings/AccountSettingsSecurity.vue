<script setup>
import { useRouter } from 'vue-router'
import axios from '@axios'
import { ref, onMounted } from 'vue'


const router = useRouter()
const isCurrentPasswordVisible = ref(false)
const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const accessToken = sessionStorage.getItem('accessToken')

const userData = ref(null)

const passwordRequirements = [
  'Minimum 8 characters long - the more, the better',
  'At least one lowercase character',
  'At least one number, symbol, or whitespace character',
]

const isOneTimePasswordDialogVisible = ref(false)

const passwordCheck = () => {
  const password = {
    currentPassword: currentPassword.value,
    newPassword: newPassword.value,
  }

  axios.post('/changePassword', password)
    .then(r => {
      console.log(r)
      if(r.data.result === 'success'){
        alert('비밀번호 변경 성공')
        router.push('/')
      }
      else{
        alert(r.data.error)
      }
    })
    .catch(e => {
      console.log(e)
    })
}

const email = ref('')
const checkCode = ref('')
const code = ref('')
const codeInput = ref(null)

// 이메일 전송 함수
async function sendEmail() {
  try {
    const response = await axios.post(`/email/${email.value}`)
    
    checkCode.value = response.data
  

    // 서버로부터 받은 인증 코드를 처리하는 로직을 추가하세요
  } catch (error) {
    // 요청 실패 시 에러 처리 로직을 추가하세요
  }
}
function verifyCode() {
  if (checkCode.value === code.value) {
    
    axios.patch("/emailok")
    console.log('인증 성공')

    // 컨트롤러에 접근하는 로직을 추가하세요
  } else {
    // 인증 실패 시 처리할 로직을 추가하세요
    console.log('인증 실패')
  }
}
onMounted(async () => {
  codeInput.value = ref.codeInput
  if (accessToken) {
    try {
      const response = await axios.get('/profile')

      userData.value = response.data
      console.log(userData.value.memAct)
    } catch (error) {
      console.error(error)
    }
  }

})
</script>

<template>
  <VRow>
    <!-- SECTION: Change Password -->
    <VCol cols="12">
      <VCard title="Change Password">
        <VForm>
          <VCardText class="pt-0">
            <!-- 👉 Current Password -->
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <!-- 👉 current password -->
                <VTextField
                  v-model="currentPassword"
                  :type="isCurrentPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isCurrentPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  label="Current Password"
                  @click:append-inner="isCurrentPasswordVisible = !isCurrentPasswordVisible"
                />
              </VCol>
            </VRow>

            <!-- 👉 New Password -->
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <!-- 👉 new password -->
                <VTextField
                  v-model="newPassword"
                  :type="isNewPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isNewPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  label="New Password"
                  @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <!-- 👉 confirm password -->
                <VTextField
                  v-model="confirmPassword"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isConfirmPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  label="Confirm New Password"
                  @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                />
              </VCol>
            </VRow>
          </VCardText>

          <!-- 👉 Password Requirements -->
          <VCardText>
            <p class="text-base mt-2">
              Password Requirements:
            </p>

            <ul class="d-flex flex-column gap-y-4">
              <li
                v-for="item in passwordRequirements"
                :key="item"
                class="d-flex"
              >
                <div>
                  <VIcon
                    size="7"
                    icon="mdi-circle"
                    class="me-3"
                  />
                </div>
                <span class="text-base">{{ item }}</span>
              </li>
            </ul>
          </VCardText>

          <!-- 👉 Action Buttons -->
          <VCardText class="d-flex flex-wrap gap-4">
            <VBtn @click="passwordCheck">
              Save changes
            </VBtn>

            <VBtn
              type="reset"
              color="secondary"
              variant="outlined"
            >
              Reset
            </VBtn>
          </VCardText>
        </VForm>
      </VCard>
    </VCol>
  </VRow>
  <VRow>
    <VCol
      cols="12"
      md="6"
    >
      <VTextField
        v-model="email"
        label="Email"
      />
    </VCol>
    <VCol
      cols="12"
      md="6"
    >
      <VBtn @click="sendEmail">
        Email 인증
      </VBtn>
    </VCol>
  </VRow>
  <VRow>
    <VCol
      cols="12"
      md="6"
    >
      <VTextField
        ref="codeInput"
        v-model="code"
        label="Code"
      />
    </VCol>
    <VCol
      cols="12"
      md="6"
    >
      <VBtn @click="verifyCode">
        인증 확인
      </VBtn>
    </VCol>
  </VRow>
</template>
