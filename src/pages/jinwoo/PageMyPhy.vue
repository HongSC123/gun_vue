<template>
  <div>
    <VCard title="내 체형정보 보기 🖨️">
      <VCardText>체형정보</VCardText>
      <VRow>
        <VCol
          md="6"
          cols="12"
          class="d-flex justify-center"
        >
          <VCardText class="text-center">
            <img
              src="http://127.0.0.1:8080/physical/1.jpg"
              alt="사진"
              style="width: 300px; height: auto;"
            >
          </VCardText>
        </VCol>
        <VCol
          md="6"
          cols="12"
        >
          <VCardText>
            분석 내용 <br><br>
            
            <p>측정일: {{ data.inputDate }} </p>
            <p>위치: {{ data.location }}</p>
            <p>
              내용: <br><br>
              <span v-if="data.point">
                {{ formatMeasurement("ear", data.point.ear) }}<br> 
                {{ formatMeasurement("shoulder", data.point.shoulder) }}<br>
                {{ formatMeasurement("hip", data.point.hip) }}<br>
                {{ formatMeasurement("knee", data.point.knee) }}
              </span>
            </p>
          </VCardText>
        </VCol>
      </VRow>

      
      <VCardText> 
        <VRow class="mt-4">
          <!-- 간격을 조정하기 위한 추가 클래스 mt-4 사용 -->
          <VCol
            class="d-flex justify-content-between"
            cols="12"
            md="4"  
          >
            <VBtn
              variant="tonal"
              block
              :to="{path: 'pagephysical'}"
            >
              측정하기
              <VIcon
                end
                icon="mdi-camera-outline"
              />
            </VBtn>
          </VCol>
          <VCol
            class="d-flex justify-content-between"
            cols="12"
            md="4"
          >
            <VBtn
              block
              small
              color="error"
              variant="tonal"
              @click="deleteMeasurement"
            >
              삭제하기
              <VIcon
                end
                icon="mdi-delete"
              />
            </VBtn>
          </VCol>
          <VCol
            class="d-flex justify-content-between"
            cols="12"
            md="4" 
          >
            <VBtn
              block
              color="secondary"
              variant="tonal"
              :to="{path: 'myphylist'}"
              small
            >
              이전 체형보기
              <VIcon
                end
                icon="mdi-format-list-bulleted-square"
              />
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup>
import axios from "@axios"
import { ref, onMounted } from "vue"

const partNames = {
  ear: "머리",
  shoulder: "어깨",
  hip: "골반",
  knee: "무릎",
}

//데이터 초기화
const data = ref({
  location: "",
  inputDate: "",
  point: {},
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
    const response = await axios.post("/detail/physical")

    // 응답 데이터가 undefined 또는 null인 경우 처리
    if (response) {
      console.log(response)

      // 데이터를 리액티브 상태로 설정
      data.value.location = response.data.Location
      data.value.inputDate = response.data.InputDate
      data.value.point = response.data.Point
      data.value.physicalNum = response.data.physicalNum

      // 사용
      const formattedEar = formatMeasurement("ear", data.value.point.ear)
      const formattedShoulder = formatMeasurement("shoulder", data.value.point.shoulder)
      const formattedHip = formatMeasurement("hip", data.value.point.hip)
      const formattedKnee = formatMeasurement("knee", data.value.point.knee)

      console.log("physicalNum" + data.value.physicalNum)
      console.log("data.value.point.ear: " + data.value.point.ear)
      console.log("data.value.point.shoulder: " + data.value.point.shoulder)
      console.log("data.value.point.hip", data.value.point.hip)
      console.log("data.value.point.knee", data.value.point.knee)

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


const deleteMeasurement = async () => {
  // 측정정보 삭제

  
  // 변수 초기화
  const axiosMessage = ref('')
  const axiosdialog = ref(false)
  
  try {
    const mem_Physical = data.value.physicalNum
    const response = axios.delete(`/delete/physical/${mem_Physical}`)

    axiosMessage.value = '삭제 성공'
    console.log(response, "1")
    console.log('response.data: ', response.data)
    axiosdialog.value = true
    console.log("측정 정보를 삭제합니다.")
  } catch (error) {
    console.error(error)
    axiosMessage.value = '삭제 실패'
    axiosdialog.value = true
  }
}
</script>

