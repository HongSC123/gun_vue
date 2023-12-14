<template>
  <div>
    <input
      type="file"
      @change="handleFileUpload($event)"
    >
    <br>
    <br>
    <button @click="submitImage">
      Submit
    </button>
  </div>
</template>

<script setup>
import axios from '@axios'
import { ref } from 'vue'

axios.defaults.timeout = 0

const selectedFile = ref(null)

const handleFileUpload = event => {
  selectedFile.value = event.target.files[0]
}

const submitImage = () => {
  if (!selectedFile.value) {
    console.error('No file selected')
    
    return
  }

  let formData = new FormData()
  formData.append('image_file', selectedFile.value)

  axios.post('http://15.164.219.179:8000/detectFruits', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(response => {
      console.log(response.data)
    })
    .catch(error => {
      if (error.response) {
        console.error(`Error: ${error.response.status}`)
      } else {
        console.error('Error: ', error.message)
      }
    })
}
</script>
