<template>
  <div>
    <VCard title="비만도 측정 🎚️">
      <VCardText>
        <strong>성별정보</strong>
      
        <VRadioGroup
          v-model="inlineRadio"
          inline
        >
          <VRadio
            label="여성"
            value="female"
          />
          <VRadio
            label="남성"
            value="male"
          />
        </VRadioGroup>
        <VDivider class="my-4" />
      </VCardText>
      <VCardText>
        신체정보
        <br><br> 
        <VRow>
          <!-- 키 -->
          <VCol
            md="6"
            cols="12"
          >
            <VTextField
              v-model="height"
              label="키"
            />
          </VCol>
          <!-- 몸무게 -->
          <VCol
            md="6"
            cols="12"
          >
            <VTextField
              v-model="weight"
              label="몸무게"
            />
          </VCol>
          <!-- 나이 -->
          <VCol
            md="6"
            cols="12"
          >
            <VTextField
              v-model="age"
              label="나이"
            />
          </VCol>
        </VRow>
        <br>
        <VBtn
          class="btn"
          @click="calculateBMI"
        >
          계산하기
        </VBtn> 
        
        <VBtn
          color="secondary"
          variant="outlined"
          type="reset"
          class="btn"
          @click.prevent="resetForm"
        >
          Reset
        </VBtn>
        <br> <br>
        <!-- 계산된 BMI 및 결과를 화면에 표시 -->
        <div v-if="calculatedBMI !== null">
          <p>나의 체질량 지수는 {{ calculatedBMI.toFixed(2) }}</p>
          <p>{{ calculateResult() }}입니다.</p>
        </div>
      </VCardText>

      <VCardText>
        건강한 체중을 유지하는지 여부를 측정하기 위해 키와 체중을 통해 측정된 값입니다. <br>
        BMI 수치는 특정 건강 상태에 대한 위험 요소를 평가하는 데 도움이 될 수 있습니다. <br>
        그러나 BMI 지수는 키와 몸무게만을 이용하여 산출되는 값이므로 정확한 체지방을 계산할 수는 없습니다. <br>
        반드시 BMI를 하나의 참고 지표로만 사용하시길 바랍니다!
      </VCardText>
    </VCard>
  </div>
</template>

<script> 
export default {
  data() {
    return {
      inlineRadio: 'female',
      height: '',
      weight: '',
      age: '',
      calculatedBMI: null,
    }
  },
  methods: {
    calculateBMI() {
      const heightInMeters = parseFloat(this.height) / 100
      const weightInKg = parseFloat(this.weight)
      const bmi = weightInKg / (heightInMeters * heightInMeters)

      this.calculatedBMI = bmi
    },
    calculateResult() {
      if (this.calculatedBMI === null) {
        return 'BMI를 먼저 계산하세요.'
      } else if (this.calculatedBMI < 18.5) {
        return '저체중'
      } else if (this.calculatedBMI < 24.9) {
        return '정상'
      } else if (this.calculatedBMI < 29.9) {
        return '과체중'
      } else {
        return '비만'
      }
    },
    resetForm() {
      this.height = ''
      this.weight = ''
      this.age = ''
      this.calculatedBMI = null
    },
  },
}
</script>

<style scoped>
.btn {
  margin-inline-end: 15px;
}
</style>
