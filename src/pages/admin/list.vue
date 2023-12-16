<script setup>
import { VDataTable } from 'vuetify/labs/VDataTable'
import axios from '@axios'
import { ref, onMounted } from 'vue'

const search = ref('')
const data = ref([])

// headers
const headers = [
  {
    title: '이메일',
    key: 'memEmail',
  },
  {
    title: '로그인 타입',
    key: 'memType',
  },
  {
    title: '가입일',
    key: 'memEn',
  },
  {
    title: '수정일',
    key: 'memMod',
  },
  {
    title: '탈퇴요청일',
    key: 'memQuit',
  },
  {
    title: '활동 상태',
    key: 'memAct',

    format: value => value === 'Y' ? '활동 중' : '비활동',

  },
]

const deleteItem = itemId => {
  const index = productList.value.findIndex(item => item.product.id === itemId)

  productList.value.splice(index, 1)
}

const resolveStatusColor = status => {
  if (status === 'Confirmed')
    return 'primary'
  if (status === 'Completed')
    return 'success'
  if (status === 'Cancelled')
    return 'error'
}

onMounted(() => {
  axios.get('/admin/list').then(res => {
    // 배열로 변환
    console.log(res.data)
    console.log(typeof res.data)

    // 데이터 가공
    data.value = res.data.map(item => ({
      memEmail: item.memEmail,
      memType: item.memType,
      memEn: item.memEn,
      memMod: item.memMod,
      memQuit: item.memQuit,
      memAct: item.memAct,
    }))

    console.log("productList", data.value)
  })
})

const updateAct = memEmail =>{
  axios.put(`/admin/update/${memEmail}`).then(res => {
  })
}
</script>

<template>
  <VDataTable
    :headers="headers"
    :items="data"
    :search="search"
    :items-per-page="5"
  />
</template>
