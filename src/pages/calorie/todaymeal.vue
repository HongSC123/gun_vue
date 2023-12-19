<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue';

const mem_email = sessionStorage.getItem("memEmail");

// 변수 초기화
let limitCalorieResponse = ref(0);
let limitCal = ref(0);
let synthesisCalorie = ref([]);
let totalIngestCalorie = ref(0);
let totalIngestCalorieYesterday = ref(0);
let percentCal = 0;
let totalcal = ref(0);
let cutline = ref("");
let yesterThen = ref("");
let today1 = "";
let gongback = ref("");
let YesterdayCal = ref(0);
let totalNutrition = ref([]);

const fetchData = async () => {
  //회원 일일권장 칼로리
  limitCalorieResponse.value = await axios.get(`/caloriedaycalorie/${mem_email}`);
  console.log("회원 일일권장 칼로리 : " + limitCalorieResponse.value.data);
  limitCal = limitCalorieResponse.value.data;
  // 날짜를 "yyyy-mm-dd" 형식으로 포맷하는 함수
  const formatDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하고 문자열로 변환
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 날짜를 "yyyy년 mm월 dd일" 형식으로 포맷하는 함수
  const formatDate2 = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하고 문자열로 변환
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
  };

  // 서버로 보낼 날짜 데이터 초기화
  const selection_date = ref(formatDate());
  console.log("포맷한 오늘 날짜 : " + selection_date.value);

  const selection_date2 = ref(formatDate2());
  today1 = selection_date2.value;
  console.log("포맷한 오늘 날짜 : " + today1);
  
  //상세보기에 출력하는 모든 값들 다 가져오기
  synthesisCalorie.value = await axios.get(`/caloriedetail/${mem_email}/${selection_date.value}`);//${selection_date.value}`);
  console.log("칼로리 영양종합정보 : " + synthesisCalorie.value.data);

  
  // const formatDate3 = () => {
  //   const today = new Date();
  //   const year = today.getFullYear();
  //   const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하고 문자열로 변환
  //   const day = String(today.getDate() - 1).padStart(2, '0');
  //   return `${year}-${month}-${day}`;
  // };

  // synthesisCalorie.value = await axios.get(`/caloriedetail/${mem_email}/${"2023-12-04"}`);//${selection_date.value}`);
  // console.log("칼로리 영양종합정보 : " + synthesisCalorie.value.data);

  // ingest_calorie 값을 더하기
  totalIngestCalorie.value = synthesisCalorie.value.data.reduce((total, entry) => total + entry.ingest_calorie, 0);

  // 콘솔에 출력하여 확인
  console.log('Total Ingest Calorie:', totalIngestCalorie.value);

  //오늘날짜의 현재까지 섭취한 칼로리 계산 
  percentCal =  totalIngestCalorie.value / limitCalorieResponse.value.data * 100;
  console.log("퍼센트 ddd: " + percentCal.toFixed(1))
  totalcal = totalIngestCalorie.value;
  if(limitCalorieResponse.value.data <  totalIngestCalorie.value){
    cutline.value = "일일 권장 초과"
    gongback.value = " ";
  }else{
    cutline.value = "일일 권장치 내"
    gongback.value = " ";
  }

  // 어제날짜 만들기
  // 날짜를 "yyyy-mm-dd" 형식으로 포맷하는 함수
  const formatDate3 = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하고 문자열로 변환
    const day = String(today.getDate() - 1).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 서버로 보낼 날짜 데이터 초기화
  const selection_date3 = ref(formatDate3());
  console.log("포맷한 어제 날짜 : " + selection_date3.value);

  //어제날짜의 칼로리 가져오기 - 본래 있는 메소드 사용
  synthesisCalorie.value = await axios.get(`/caloriedetail/${mem_email}/${selection_date3.value}`);//${selection_date.value}`);
  console.log("칼로리 영양종합정보 : " + synthesisCalorie.value.data);

  // ingest_calorie 값을 더하기
  totalIngestCalorieYesterday.value = synthesisCalorie.value.data.reduce((total, entry) => total + entry.ingest_calorie, 0);
  
  YesterdayCal = totalIngestCalorieYesterday.value
  
  // 콘솔에 출력하여 확인
  console.log('Total Ingest Calorie:', totalIngestCalorieYesterday.value);
  console.log(limitCal - (limitCal - totalcal) - YesterdayCal);

  if((limitCal - (limitCal - totalcal) - YesterdayCal) > 0){
    yesterThen.value = (limitCal - (limitCal - totalcal) - YesterdayCal) + "kcal 더 섭취"
  }else if ((limitCal - (limitCal - totalcal) - YesterdayCal) == 0){
    yesterThen.value = "동일 "
  }else{
    yesterThen.value = (limitCal - (limitCal - totalcal) - YesterdayCal) + "kcal 덜 섭취"
  }
  console.log("어제결과 : " + yesterThen.value)

  
  try {
    const response = await axios.get(`/caloriedetail/${mem_email}/${selection_date.value}`);
    const array = response.data;
    console.log("서버 응답:", response.data);

    totalNutrition.value = array.reduce((accumulator, currentItem) => {
      // 누산기에 더하고자 하는 각각의 영양소 더하기
      accumulator.ingest_calorie = (accumulator.ingest_calorie || 0) + currentItem.ingest_calorie;
      accumulator.weight = (accumulator.weight || 0) + currentItem.weight;
      accumulator.kcal = (accumulator.kcal || 0) + currentItem.kcal;
      accumulator.carbohydrate = (accumulator.carbohydrate || 0) + currentItem.carbohydrate;
      accumulator.sugar = (accumulator.sugar || 0) + currentItem.sugar;
      accumulator.fat = (accumulator.fat || 0) + currentItem.fat;
      accumulator.protein = (accumulator.protein || 0) + currentItem.protein;
      accumulator.calcium = (accumulator.calcium || 0) + currentItem.calcium;
      accumulator.phosphorus = (accumulator.phosphorus || 0) + currentItem.phosphorus;
      accumulator.sodium = (accumulator.sodium || 0) + currentItem.sodium;
      accumulator.potassium = (accumulator.potassium || 0) + currentItem.potassium;
      accumulator.magnesium = (accumulator.magnesium || 0) + currentItem.magnesium;
      accumulator.iron = (accumulator.iron || 0) + currentItem.iron;
      accumulator.zinc = (accumulator.zinc || 0) + currentItem.zinc;
      accumulator.cholesterol = (accumulator.cholesterol || 0) + currentItem.cholesterol;
      accumulator.trans_fat = (accumulator.trans_fat || 0) + currentItem.trans_fat;
      return accumulator;
    }, {});

    console.log("현재의 영양소:", totalNutrition);
    console.log("칼슘",totalNutrition.calcium);
    console.log("타입",typeof(totalNutrition.calcium));
  } catch (error) {
    console.error("서버에서 데이터를 가져오는 중 오류 발생:", error);
    // 오류를 처리합니다. 예를 들어 사용자에게 오류 메시지를 표시할 수 있습니다.
  }
 }

onMounted(fetchData);
    
</script>

<template>
  <div style="font-size: 20px; font-weight: bold;">{{ today1 }}{{ gongback }}</div>
  <VCard style="display: flex;">
    <VCardItem/>
    <VCardItem/>
    <VCardItem/><VCardItem/>
    <VCardItem style="text-align: center;">
      <VCardTitle class="headline font-weight-bold"><br>나의 일일 권장 칼로리</VCardTitle>
      <br><br>
      <div style="font-size: 20px; font-weight: bold;">
        {{ limitCal }}kcal <br>&nbsp;{{ gongback }}
      </div>
    </VCardItem>
    <VCardItem/>
    <VCardItem/><VCardItem/><VCardItem/><VCardItem/>
    <VCardItem style="text-align: center;">
      <VCardTitle class="headline font-weight-bold">오늘 잔여 칼로리</VCardTitle>
      <br>
      <div style="font-size: 20px; font-weight: bold;">
        {{ limitCal - totalcal }}kcal <br>&nbsp;
      </div>
      <div>
        {{percentCal.toFixed(1)}}%
        <p class="text-xs mb-2 mt-4">
          {{cutline}}
        </p>
      </div>
    </VCardItem><VCardItem/><VCardItem/><VCardItem/><VCardItem/><VCardItem/><VCardItem/>
    <VCardItem>
      <VCardItem style="text-align: center;">
      <VCardTitle class="headline font-weight-bold"><br>어제보다</VCardTitle>
      <br>
      <div style="font-size: 20px; font-weight: bold;">
        {{ yesterThen }}<br>&nbsp;
      </div>
    </VCardItem>
    </VCardItem>
  </VCard>
  <br>
  <br>
  <VCard>
    <VRow style="flex-direction: column;">
      <v-card style="width:1400px">
      <v-card-text>
        <div class="nutrition-facts-form white-box">
          <VTable height="300px">
            <thead>
              <tr>
                <th class="text-uppercase" style="font-size: 20px; font-weight: bold;">
                  영양성분
                </th>
                <th class="text-uppercase" style="justify-content: space-between;">
                  <div style="font-size: 20px; font-weight: bold;">총합</div> 
                </th>
                <th style="width: 10px;">
                  <div style="text-align: right; font-size: 15px;">{{ totalNutrition.ingest_calorie }}kcal</div>
                </th>
              </tr>
            </thead>

            <tbody>
                <tr>
                  <td>중량</td><td>{{ totalNutrition.weight.toFixed(2) }}</td>
                </tr>
                <tr>
                  <td>열량</td><td>{{ totalNutrition.kcal.toFixed(2) }}</td>
                </tr>
                <tr>
                  <td>탄수화물</td><td>{{ totalNutrition.carbohydrate.toFixed(2) }}</td>
                </tr>
                <tr>
                  <td>당류</td><td>{{ totalNutrition.sugar.toFixed(2) }}</td>
                </tr>
                <tr>
                  <td>지방</td><td>{{ totalNutrition.fat.toFixed(2) }}</td>
                </tr>
                <tr>
                  <td>단백질</td><td>{{ totalNutrition.protein.toFixed(2) }}</td>
                </tr>
                <tr>
                  <td>칼슘</td><td>{{ totalNutrition.calcium.toFixed(2) }}</td>
                </tr>
                <tr>
                  <td>인</td><td>{{ totalNutrition.phosphorus.toFixed(2) }}</td>
                </tr>
                <tr>
                  <td>나트륨</td><td>{{ totalNutrition.sodium.toFixed(2) }}</td>
                </tr>
                <tr>
                  <td>칼륨</td><td>{{ totalNutrition.potassium.toFixed(2) }}</td>
                </tr>
                <tr>
                  <td>마그네슘</td><td>{{ totalNutrition.magnesium.toFixed(2) }}</td>
                </tr>
                <tr>
                  <td>철</td><td>{{ totalNutrition.iron.toFixed(2) }}</td>
                </tr>
                <tr>
                  <td>아연</td><td>{{ totalNutrition.zinc.toFixed(2) }}</td>
                </tr>
                <tr>
                  <td>콜레스테롤</td><td>{{ totalNutrition.cholesterol.toFixed(2) }}</td>
                </tr>
                <tr>
                  <td>트랜스지방</td><td>{{ totalNutrition.trans_fat.toFixed(2) }}</td>
                </tr>
            </tbody>
          </VTable>
        </div>
        </v-card-text>
        </v-card>
        </VRow>
      </VCard>
</template>
