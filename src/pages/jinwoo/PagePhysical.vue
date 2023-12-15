<template>
  <div>
    <VCard title="체형정보 측정📷">
      <VCardText>촬영 예시</VCardText>
      
      <VRow>
        <!-- 정면 -->
        <VCol
          md="4"
          cols="12"
          offset-sm="2"
        >
          <VCardText>
            정면
          </VCardText>
          <!-- 정면 이미지 -->
          <img
            src="@images/images/standinghuman.png"
            alt="정면 이미지"
            style="width: 300px; height: 300px;"
          >
        </VCol>
        <!-- 측면 -->
        <VCol
          md="4"
          cols="12"
          offset-sm="2"
        >
          <VCardText>
            측면
          </VCardText>
          <!-- 측면 이미지 -->
          <img
            src="@images/images/bodysilhouette.png"
            alt="측면 이미지"
            style="width: 280px; height: 280px;"
          >
        </VCol>
      </VRow>
      <VDivider />
      <VCol
        class="d-flex justify-center"
        cols="12"
        sm="8"
        offset-sm="2"
      >
        <VCardText>
          1장씩 업로드 해주세요. (.jpg)
        </VCardText>
        <VFileInput
          show-size
          label="사진 올리기"
          variant="underlined"
          @change="changePhoto"
        />
      </VCol>
    </vcard>
  </div>
</template>

<script setup>
import axios from "axios"

const accountData = {
  memPhysical: " ",
}

const accountDataLocal = ref(structuredClone(accountData))

let sequence = 1 // 전역 변수로 시퀀스를 초기화

function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1])
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  return new Blob([ab], { type: 'image/jpeg' })
}

const changePhoto = file => {
  console.log("changePhoto")

  const fileReader = new FileReader()
  const { files } = file.target

  console.log("fileReader" + fileReader)
  console.log("file"+ file)

  console.log(files && files.length)

  if (files && files.length) {
    console.log("changePhoto file reader")
    fileReader.readAsDataURL(files[0])
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') {
        console.log("changePhoto file result: ")

        const filename = sequence + '.jpg'


        
        accountDataLocal.value.memPhysical = fileReader.result
        uploadImage(fileReader.result, filename)
      }
    }
  }
}

const uploadImage = async (dataURI, filename) => {
  console.log("uploadImage")
  try {
    const formData = new FormData()
    const file = dataURItoBlob(dataURI)

    formData.append('memPhysical', file, filename)

    const response = axios.post("/memPhysical/insert", formData)

    console.log(response)
    console.log(response.data)
  } catch (error) {
    console.error("이미지 파일 업로드 실패", error)
  }
}
</script>

