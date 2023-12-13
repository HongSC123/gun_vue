<template>
  <div>
    <VueKakaoLogin
      :app-id="YOUR_KAKAO_APP_ID"
      @success="handleSuccess"
      @fail="handleFail"
      @always="handleAlways"
    >
      <button>Login with Kakao</button>
    </VueKakaoLogin>
  </div>
</template>

<script setup>
const handleSuccess = response => {
  // Kakao 로그인 성공 시 처리
  console.log(response)
}

const handleFail = error => {
  // Kakao 로그인 실패 시 처리
  console.error(error)
}

const handleAlways = () => {
  // 항상 실행되는 처리
}
</script>
