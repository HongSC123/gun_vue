<script setup>
import axios from '@axios'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const streamVideo = ref(null)
const cameraView = ref(null)
let captureInterval = null
let cancelTokenSource = null
const shouldStartCapture = ref(true)
let base64ImageStr = ref(null)
const email = ref('')

const openCamera = () => {
  closeCamera()
  console.log("openCamera")
  navigator.mediaDevices.getUserMedia({ video: shouldStartCapture.value })
    .then(stream => {
      streamVideo.value = stream
      cameraView.value.srcObject = stream
      cameraView.value.onloadedmetadata = () => {
        cameraView.value.play()
      }

      // shouldStartCapture 값이 true일 때만 capture 함수 호출
      if (shouldStartCapture.value) {
        console.log("shouldStartCapture.value:", shouldStartCapture.value)
        captureInterval = setInterval(capture, 4000)
      }
    })
    .catch(error => {
      console.error('카메라에 접근하는 중 오류 발생:', error)
    })
}

const closeCamera = () => {
  if (streamVideo.value) {
    const tracks = streamVideo.value.getTracks()

    tracks.forEach(track => track.stop())
    streamVideo.value = null

    // 인터벌 제거
    clearInterval(captureInterval)

    // Axios 요청 취소
    if (cancelTokenSource) {
      cancelTokenSource.cancel('카메라 종료')
    }
    
  }
}

const capture = () => {
  if (cameraView.value && cameraView.value.videoWidth) {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    canvas.width = cameraView.value.videoWidth
    canvas.height = cameraView.value.videoHeight
    context.drawImage(cameraView.value, 0, 0, canvas.width, canvas.height)

    // 캡처된 이미지를 Base64로 변환하여 저장
    base64ImageStr.value = canvas.toDataURL()
    
    // 캡처된 이미지를 서버로 전송 (서버 URL 및 엔드포인트에 맞게 수정)
    axios.post('/login/face', { email: email.value, image: base64ImageStr.value.split(',')[1] }, {
      cancelToken: cancelTokenSource ? cancelTokenSource.token : undefined,
    })
      .then(response => {
        if (response.data.result === "success") {
          shouldStartCapture.value = false
          console.log('shouldStartCapture:', shouldStartCapture.value)
          closeCamera()

          const { accessToken, refreshToken, role } = response.data

          sessionStorage.setItem('accessToken', accessToken)
          sessionStorage.setItem('refreshToken', refreshToken)
          sessionStorage.setItem('role', role)
          sessionStorage.setItem('memEmail', email.value)
          sessionStorage.setItem('loginType', 'MEMBER')
          axios.defaults.headers['loginType'] = 'MEMBER'
          router.push('/')
        }
      })
  }
}

onMounted(() => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("미디어 장치가 지원되지 않습니다")
  }
})

onBeforeUnmount(() => {
  closeCamera()
})
</script>

<template>
  <div>
    <p>
      <video
        ref="cameraView"
        width="720"
        height="480"
      />
    </p>
    <div style="text-align: center;">
      <label for="email">이메일:</label>
      <input
        id="email"
        v-model="email"
        type="text"
      >
      <button @click="openCamera">
        카메라 켜기
      </button><br>
      <button @click="closeCamera">
        카메라 끄기
      </button>
    </div>
  </div>
</template>
