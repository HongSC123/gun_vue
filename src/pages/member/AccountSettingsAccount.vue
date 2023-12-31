<script setup>
import axios from '@axios'
import avatar1 from '@images/avatars/avatar-1.png'
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const date = ref('')

const memEmail = sessionStorage.getItem('memEmail')

const accountData = {
  memPhoto: avatar1,
  memGen: '성별',
  memWeight: 50,
  memHeight: 180,
  memBir: '1990-01-01',
  memActLevel: '일반',
}

function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1])
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  
  return new Blob([ab], { type: 'image/png' })
}

const refInputEl = ref()
const isConfirmDialogOpen = ref(false)
const accountDataLocal = ref(structuredClone(accountData))

const resetForm = () => {
  accountDataLocal.value = structuredClone(accountData)
}

const changeAvatar = file => {
  const fileReader = new FileReader()
  const { files } = file.target
  if (files && files.length) {
    fileReader.readAsDataURL(files[0])
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string')
        accountDataLocal.value.memPhoto = fileReader.result
    }
  }
}

// reset avatar image
const resetAvatar = () => {
  accountDataLocal.value.memPhoto = accountData.memPhoto
}

const next = () => {
  router.push("/login")
}

const optionSave = async () => {
  const formData = new FormData()

  const memPhotoFile = dataURItoBlob(accountDataLocal.value.memPhoto)

  formData.append('memPhoto', memPhotoFile, 'avatar.png')
  formData.append('memGen', accountDataLocal.value.memGen)
  formData.append('memWeight', accountDataLocal.value.memWeight)
  formData.append('memHeight', accountDataLocal.value.memHeight)
  formData.append('memBir', accountDataLocal.value.memBir)
  formData.append('memActLevel', mapActivityToFloat(accountDataLocal.value.memActLevel))
  formData.append('memEmail', memEmail)

  sessionStorage.removeItem('memEmail')

  try {
    const response = await axios.post('/memoption', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(r => {
        console.log(r)
      })
      .catch(e => {
        console.log(e)
      })

    console.log(response)

    router.push("/login")

  } catch (error) {
    console.error(error)
  }
}

onBeforeMount(() => {
  sessionStorage.removeItem('memEmail')
})

const mapActivityToFloat = activity => {
  const mappingTable = {
    '비 활동적': 1.30,
    '일반/보통': 1.50,
    '활동적': 1.70,
    '매우 활동적': 1.90,
  }

  
  return mappingTable[activity]
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardText class="d-flex">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded="sm"
            size="120"
            class="me-6"
            :image="accountDataLocal.memPhoto"
          />

          <!-- 👉 Upload Photo -->
          <form class="d-flex flex-column justify-center gap-4">
            <div class="d-flex flex-wrap gap-4">
              <VBtn
                color="primary"
                @click="refInputEl?.click()"
              >
                <VIcon
                  icon="mdi-cloud-upload-outline"
                  class="d-sm-none"
                />
                <span class="d-none d-sm-block">Upload new photo</span>
              </VBtn>

              <input
                ref="refInputEl"
                type="file"
                name="file"
                accept=".jpeg,.png,.jpg,GIF"
                hidden
                @input="changeAvatar"
              >

              <VBtn
                type="reset"
                color="error"
                variant="tonal"
                @click="resetAvatar"
              >
                <span class="d-none d-sm-block">Reset</span>
                <VIcon
                  icon="mdi-refresh"
                  class="d-sm-none"
                />
              </VBtn>
            </div>

            <p class="text-xs mb-0">
              Allowed JPG, GIF or PNG. Max size of 800K
            </p>
          </form>
        </VCardText>

        <VCardText>
          <!-- 👉 Form -->
          <VForm class="mt-6">
            <VRow>
              <!-- 👉 memGen -->
              <VCol
                md="6"
                cols="12"
              >
                <VSelect
                  v-model="accountDataLocal.memGen"
                  clearable
                  label="성별"
                  :items="['남자', '여자']"
                />
              </VCol>

              <!-- 👉 memWeight -->
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="accountDataLocal.memWeight"
                  label="몸무게"
                  type="number"
                />
              </VCol>

              <!-- 👉 memHeight -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="accountDataLocal.memHeight"
                  label="키"
                  type="number"
                />
              </VCol>

              <!-- 👉 memBir -->
              <VCol
                cols="12"
                md="6"
              >
                <AppDateTimePicker
                  v-model="accountDataLocal.memBir"
                  label="생년월일"
                />
              </VCol>

              <!-- 👉 memActLevel -->
              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="accountDataLocal.memActLevel"
                  clearable
                  label="활동량"
                  :items="['비 활동적', '일반/보통','활동적','매우 활동적']"
                />
              </VCol>
              <!-- 👉 Form Actions -->
              <VCol
                cols="12"
                class="d-flex flex-wrap gap-4"
              >
                <VBtn @click="optionSave">
                  저장하기
                </VBtn>

                <VBtn
                  color="secondary"
                  variant="outlined"
                  type="reset"
                  @click.prevent="resetForm"
                >
                  Reset
                </VBtn>
                <VBtn
                  color="secondary"
                  variant="outlined"
                  @click="next"
                >
                  다음에하기
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

  <!-- Confirm Dialog -->
  <ConfirmDialog
    v-model:isDialogVisible="isConfirmDialogOpen"
    confirmation-question="Are you sure you want to deactivate your account?"
    confirm-title="Deactivated!"
    confirm-msg="Your account has been deactivated successfully."
    cancel-title="Cancelled"
    cancel-msg="Account Deactivation Cancelled!"
  />
</template>
