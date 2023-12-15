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
            분석 내용 영역
            <p>Location: {{ location }}</p>
            <p>Point: {{ point }}</p>
            <p>Input Date: {{ inputDate }}</p>
          </VCardText>
        </VCol>
        <VCardText>
          <VCol
            class="d-flex justify-content-between"
            cols="12"
            sm="6"
          >
            <VBtn
              variant="tonal"
              block
              style="margin-right: 25px;"
              :to="{path: 'pagephysical'}"
            >
              측정하기
              <VIcon
                end
                icon="mdi-camera-outline"
              />
            </VBtn>
            <VBtn
              block
              color="secondary"
              variant="tonal"
              :to="{path: 'myphylist'}"
            >
              이전 체형보기
              <VIcon
                end
                icon="mdi-format-list-bulleted-square"
              />
            </VBtn>
          </VCol>
        </VCardText>
      </VRow>
    </VCard>
  </div>
</template>

<script setup>
import axios from "axios"

//데이터 초기화
const location = ref('')
const point = ref('')
const inputDate = ref('')

//컴포넌트가 마운트될 때 데이터 불러오는 함수
const physicalFromBoot = async () => {
  try {
    const response = axios.get("/detail/physical")

    console.log(response, "불러오기")
    console.log(response.data, "불러오기데이터")
    location.value = response.data.mem_location
    point.value = response.data.mem_point
    inputDate.value = response.data.mem__input_date
  } catch(error) {
    console.error("측정정보 불러오기 실패", error)
  }
}
  
//컴포넌트가 마운트되면 데이터를 가져옴
onMounted(()=>{
  physicalFromBoot()
})
</script>

