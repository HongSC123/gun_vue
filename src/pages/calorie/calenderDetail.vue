<template>
<!-- <v-app>
      <v-app-bar app color="red" dark>
        <v-spacer></v-spacer>
        <v-app-bar-title>
          <div align="center" :style="{fontSize:'xx-large'} ">상세 레시피</div>
        </v-app-bar-title>
        </v-app-bar>
</v-app> -->

  <div class="nutrition-facts-form white-box">
    <h2>오늘의 종합 영양 정보</h2>

    <!-- ... (입력 폼은 그대로 유지) -->

    <!-- 테이블로 영양 정보 표시 -->
    <table class="nutrition-table">
      <thead>
        <tr>
          <th>성분</th>
          <th>총량</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, label) in nutritionData" :key="label">
          <td>{{ label }}</td>
          <td>{{ value }}</td>
        </tr>
      </tbody>
    </table>
  </div>


</template>

<script>
// let response = await axios.get(`/caloriedetail/{mem_email}/{selection_date}`);
// let calorieData = response.data;
const mem_email = sessionStorage.getItem("memEmail");
      const selection_date = "1212-13-14";
// console.log("가져온 데이터 : " + mem_email + ", " + selection_date)
import axios from 'axios'

export default {
  
  data() {
    return {

      mem_email: '',
      selection_date: '',
      // 서버에서 가져온 영양 정보 데이터 (가상의 예시 데이터)
      totalWeight: 0,
      totalKcal: 0,
      totalCarbohydrate: 0,
      totalSugar: 0,
      totalFat: 0,
      totalProtein: 0,
      totalCalcium: 0,
      totalPhosphorus: 0,
      totalSodium: 0,
      totalPotassium: 0,
      totalMagnesium: 0,
      totalIron: 0,
      totalZinc: 0,
      totalCholesterol: 0,
      totalTrans_fat: 0,
      // ... (나머지 합산할 데이터)
    };
  },
  computed: {
    // 입력 폼 데이터와 서버에서 가져온 데이터를 합쳐서 사용할 데이터
    nutritionData() {
      return {
        중량: this.totalWeight.toFixed(2),
        열량: this.totalKcal.toFixed(2),
        탄수화물: this.totalCarbohydrate.toFixed(2),
        당류: this.totalSugar.toFixed(2),
        지방: this.totalFat.toFixed(2),
        단백질: this.totalProtein.toFixed(2),
        칼슘: this.totalCalcium.toFixed(2),
        인: this.totalPhosphorus.toFixed(2),
        나트륨: this.totalSodium.toFixed(2),
        칼륨: this.totalPotassium.toFixed(2),
        마그네슘: this.totalMagnesium.toFixed(2),
        철: this.totalIron.toFixed(2),
        아연: this.totalZinc.toFixed(2),
        콜레스테롤: this.totalCholesterol.toFixed(2),
        트랜스지방: this.totalTrans_fat.toFixed(2),
        // ... (나머지 입력 폼 데이터)

        // 서버에서 가져온 데이터 추가
      };
    },
  },
  mounted() {
    this.loadData();
    console.log('calenderDetail.vue가 로드되었습니다.');
  },
  methods: {
    async loadData() {
      const mem_email = this.$route.params.mem_email;
      const selection_date = this.$route.params.selection_date;
      const response = await axios.get(`/caloriedetail/${mem_email}/${selection_date}`);
      const calorieData = response.data;

      const events = calorieData.map(calorie => ({
        registration_date_ymd: calorie.registration_date_ymd,
        registration_date_hm: calorie.registration_date_hm,
        ingest_calorie: calorie.ingest_calorie,
        food_name: calorie.food_name,
        weight: calorie.weight,
        kcal: calorie.kcal,
        carbohydrate: calorie.carbohydrate,
        sugar: calorie.sugar,
        fat: calorie.fat,
        protein: calorie.protein,
        calcium: calorie.calcium,
        phosphorus: calorie.phosphorus,
        sodium: calorie.sodium,
        potassium: calorie.potassium,
        magnesium: calorie.magnesium,
        iron: calorie.iron,
        zinc: calorie.zinc,
        cholesterol: calorie.cholesterol,
        trans_fat: calorie.trans_fat,
    }));

    
      for (const calorie of events) {
      
        this.totalWeight += calorie.weight;
        this.totalKcal += calorie.kcal;
        this.totalCarbohydrate += calorie.carbohydrate;
        this.totalSugar += calorie.sugar;
        this.totalFat += calorie.fat;
        this.totalProtein += calorie.protein;
        this.totalCalcium += calorie.calcium;
        this.totalPhosphorus += calorie.phosphorus;
        this.totalSodium += calorie.sodium;
        this.totalPotassium += calorie.potassium;
        this.totalMagnesium += calorie.magnesium;
        this.totalIron += calorie.iron;
        this.totalZinc += calorie.zinc;
        this.totalCholesterol += calorie.cholesterol;
        this.totalTrans_fat += calorie.trans_fat;
      
      }
    

      console.log("서버로부터 받아온 데이터 : " + events);
    },
  },
};
</script>

<style scoped>
.white-box {
  background-color: white;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.nutrition-table {
  border-collapse: collapse;
  margin-top: 20px;
  width: 20%;
}

.nutrition-table th,
.nutrition-table td {
  border: 1px solid #ddd;
  padding: 15px;
  text-align: left;
  width: 20%; 
  white-space: nowrap; /* 텍스트 줄 바꿈 금지 */
  
}

.nutrition-table th {
  background-color: #f2f2f2;
}
</style>
