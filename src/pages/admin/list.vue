<template>
  <table>
    <thead>
      <tr>
        <th>이메일</th>
        <th>가입일</th>
        <th>가입유형</th>
        <th>활동 상태</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in data"
        :key="item.memEmail"
        @click="handleItemClick(item)"
      >
        <td>{{ item.memEmail }}</td>

        <td>{{ item.memEn }}</td>

        <td>{{ item.memType }}</td>

        <td>{{ item.memAct }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@axios'

const data = ref([])

const handleItemClick = item => {
  console.log('클릭된 값:', item)
  alert('클릭된 이메일: ' + item.memEmail)
}

onMounted(() => {
  axios.get('/admin/list')
    .then(res => {
      data.value = res.data
    })
    .catch(err => {
      console.error(err)
    })
})
</script>
