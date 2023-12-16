<script setup>
import axios from "@axios"
import { ref, onMounted } from "vue"

const partNames = {
  ear: "머리",
  shoulder: "어깨",
  hip: "골반",
  knee: "무릎",
}

 // 데이터 초기화
const data = ref({
  items: [
    {
      physicalNum: "",
      inputDate: "",
      location: "",
      point: {},
    },
  ],
})


const email = sessionStorage.getItem("memEmail")

//Point 정보 가공
const formatMeasurement = (part, value) => {
  // value가 undefined 또는 null인 경우에 대한 기본값 설정
  console.log(value, part)
  
  const formattedValue = Math.abs(parseFloat(value)).toFixed(2) // 소수점 2자리까지 표기
  if (value < 0) {
    return `${partNames[part]} :  ${formattedValue} 왼쪽으로 기울어졌습니다.`
  } else {
    return `${partNames[part]} :  ${formattedValue} 오른쪽으로 기울어졌습니다.`
  }
}

//컴포넌트가 마운트될 때 데이터 불러오는 함수
const physicalFromBoot = async () => {
  try {
    const response = await axios.post("/list/physical")
    if (response) {
      console.log(response.data, "배열")
       
      // 받아온 데이터를 data.items에 할당
      data.value.items = response.data || []
      console.log(data.value.items, "아이템")

    } else {
      console.error("응답 데이터가 없음")
    }

  } catch(error) {
    console.error("측정정보 불러오기 실패", error)
  }
}
  
//컴포넌트가 마운트되면 데이터를 가져옴
onMounted(()=>{
  physicalFromBoot()
})


</script>

<template>
  <VTable density="compact">
    <thead>
      <tr>
        <th class="text-uppercase">
          No
        </th>
        <th class="text-uppercase">
          date
        </th>
        <th class="text-uppercase">
          location
        </th>
        <th class="text-uppercase">
          info
        </th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="(item, index) in data.items" 
        :key="index"
      >
        <td>
          <!-- 이름 클릭 시 페이지 이동 처리 -->
         
          {{ item.physicalNum }}        
        </td>
        <td>
          {{ item.inputDate }}
        </td>
        <td>
          {{ item.location }}
        </td>
        <!-- item.point가 객체인 경우, 객체 내의 속성을 표시 -->
        <td v-if="item.point && typeof item.point === 'object' && Object.keys(item.point).length > 0">
          {{ item.point.ear }}, {{ item.point.shoulder }}, {{ item.point.hip }}, {{ item.point.knee }}
        </td>
        <!-- item.point가 빈 객체 또는 null/undefined인 경우 -->
        <td v-else>
          No data
        </td>
      </tr>
    </tbody>
  </VTable>

  <VBtn
    block
    color="info"
    variant="tonal"
    :to="{path: 'pagephysical'}"
    class="mt-4" 
    size="large"
  >
    체형정보 측정하기
    <VIcon 
      end
      icon="mdi-camera-outline"
    />
  </VBtn>
</template>

<style scoped>
/* 테이블과 버튼을 맞추기 위한 스타일 */
.VTable {
  margin-block-end: 16px; /* 테이블 아래 여백 추가 */
}

.VBtn {
  margin-block-start: 16px; /* 버튼 위 여백 추가 */
}
</style>
