<template>
  <div>
    <input
      v-model="adminId"
      type="text"
      placeholder="adminId"
    >
    <input
      v-model="noticeTitle"
      type="text"
      placeholder="noticeTitle"
    >

    <textarea
      v-model="noticeCon"
      placeholder="noticeCon"
    />
    <input
      type="file"
      @change="onFileChange"
    >
    <button @click="submitForm">
      Submit
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from '@axios'

const adminId = ref('')
const noticeTitle = ref('')
const noticeCon = ref('')
const noticeFile = ref(null)

const onFileChange = event => {
  noticeFile.value = event.target.files[0]
}

const submitForm = () => {
  const formData = new FormData()

  formData.append('adminId', adminId.value)
  formData.append('noticeTitle', noticeTitle.value)
  formData.append('noticeCon', noticeCon.value)
  formData.append('noticeFile', noticeFile.value)
  
  axios.post('/insert', formData)
    .then(response => {
      console.log(response.data)

      // 성공한 경우 처리 로직 작성
    })
    .catch(error => {
      console.error(error)

      // 실패한 경우 처리 로직 작성
    })
}
</script>

