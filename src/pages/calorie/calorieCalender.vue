<script setup>
// FullCalendar 및 플러그인, RTL 훅 등을 가져옵니다.
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import FullCalendar from '@fullcalendar/vue3'
import axios from 'axios'
import { ref } from 'vue'
import { useRtl } from 'vuetify'
// import calorie from '@/router/calorie'

// 현재 이벤트 목록을 저장할 리액티브 변수
const currentEvents = ref([])
const { isRtl } = useRtl()

// // 달력에서 날짜를 선택했을 때 호출되는 핸들러 함수
// const handleDateSelect = selectInfo => {
//   const title = prompt('Please enter a new title for your event')
//   const calendarApi = selectInfo.view.calendar

const navigationTab = ref('ITEM ONE')
const navigationTab2 = ref('ITEM ONE')

let morning = '아침'
let lunch = '점심'
let dinner = '저녁'

const tabContent = 'Pudding tiramisu caramels. Gingerbread gummies danish chocolate bar toffee marzipan. Wafer wafer cake powder danish oat cake.'

//   // 날짜 선택 해제
//   calendarApi.unselect()

//   // 사용자가 제목을 입력했다면 이를 이벤트로 추가
//   if (title) {
//     calendarApi.addEvent({
//       id: createEventId(),
//       title,
//       start: selectInfo.startStr,
//       end: selectInfo.endStr,
//       allDay: selectInfo.allDay,
//     })
//   }
// }

const selectionDate = ref('');

let totalNutrition = ref([]);
const isModalOpen = ref(false);
let results = ref([]);
let serverData = ref([]);

// 함수 정의
const openModal = async (selection_date, selection_date1) => {
  try {
    const mem_email = sessionStorage.getItem("memEmail");
    selectionDate.value = selection_date1;
    
    const response = await axios.get(`/caloriedetail/${mem_email}/${selection_date}`);
    let array = response.data;
    console.log("서버 응답:", response.data);
    console.log("변수에 담기:", serverData);
    totalNutrition = array.reduce((accumulator, currentItem) => {
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
      // 필요한 다른 영양소도 위와 같이 더할 수 있음
      return accumulator;
    }, {});

    console.log("총 영양소:", totalNutrition);
    console.log("칼슘",totalNutrition.calcium);
    console.log("타입",typeof(totalNutrition.calcium))

    serverData = response.data;
    
    isModalOpen.value = true; // isModalOpen이 반응형 변수인 것으로 가정합니다.

  } catch (error) {
    console.error("서버에서 데이터를 가져오는 중 오류 발생:", error);
    // 오류를 처리합니다. 예를 들어 사용자에게 오류 메시지를 표시할 수 있습니다.
  }
};

const closeModal = () => {
  isModalOpen.value = false;
};

// 달력에서 이벤트를 클릭했을 때 호출되는 핸들러 함수
const handleEventClick = clickInfo => {
// 클릭한 이벤트의 날짜 가져오기
const clickedDate = clickInfo.event.start;

// 날짜를 원하는 형식으로 변환
const FormattedDate = clickedDate.toLocaleDateString('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});
console.log("clickInfo : " + clickInfo)
  // year, month, day 변수에 각각 할당
const month = FormattedDate.split('/')[0];
const day = FormattedDate.split('/')[1];
const year = FormattedDate.split('/')[2];

const selection_date = `${year}-${month}-${day}`

  console.log("포맷한 날짜 : " + selection_date);

const selection_date1 = `${year}년 ${month}월 ${day}일`

  openModal(selection_date, selection_date1);
}

// 달력의 이벤트가 변경될 때 호출되는 핸들러 함수
const handleEvents = events => {
  currentEvents.value = events
}

// Luxon을 가져옵니다.

// ...

// currentMonth 변수를 정의합니다.
const currentMonth = ref('');

// ...

const handleDatesSet = (info) => {
  const calendarApi = info.view.calendar;
  const currentDate = calendarApi.getDate();

  // currentDate를 이용하여 년, 월, 일 정보를 가져옵니다.
  const year = currentDate.getFullYear().toString(); // 마지막 두 자리만 가져오도록 수정
  const month = currentDate.getMonth() + 1; // 월은 0부터 시작하므로 1을 더합니다.
  //const day = currentDate.getDate();

  // 가져온 정보를 currentMonth에 저장합니다.
  const yyyy_mm = `${year}-${month}`;
  
  // 콘솔에 출력합니다.
  console.log('현재 년월일 : ', yyyy_mm);

  currentMonth.value = yyyy_mm;
  
  // 서버로 데이터를 전송
  sendDataToServer(info, yyyy_mm);


};


const sendDataToServer = async (info, yyyy_mm) => {
  try {
    const mem_email = sessionStorage.getItem("memEmail");
    console.log("회원 이메일 : " + mem_email);
    const response = await axios.get(`/caloriedaylist/${mem_email}/${yyyy_mm}`);
    const calorieData = response.data;
    
    const response1 = await axios.get(`/caloriedaycalorie/${mem_email}`);
    const memDailyCal = response1.data;

    // registration_date_ymd와 ingest_calorie 값을 추출하여 새로운 배열을 만듭니다.
    const events = calorieData.map(calorie => ({
      registration_date_ymd: calorie.registration_date_ymd,
      ingest_calorie: calorie.ingest_calorie
    }));

    // 설정 전 이벤트 로깅
    console.log('원하는 새로운 배열 : ', events);

    // calendarApi
    const calendarApi = info.view.calendar;
    // 지역변수
    let memDailyCalorie;
  
    // for 문을 사용하여 FullCalendar에 이벤트를 추가
  for (const calorie of events) {

    if(calorie.ingest_calorie > memDailyCal){
      memDailyCalorie = '초과'
    }else {
      memDailyCalorie = '적정'
    }
    const specificEvent = {
      title: `${calorie.ingest_calorie} kcal - ${memDailyCalorie}`,
      start: calorie.registration_date_ymd,
      allDay: true,
    };
    calendarApi.addEvent(specificEvent);
  }

    // FullCalendar에 이벤트 추가
    calendarOptions.value.initialEvents = events;

    console.log('서버로부터 받은 데이터:', calorieData);
  } catch (error) {
    console.error('서버와 통신 중 오류 발생:', error);
  }
};

// 달력의 옵션을 계산
const calendarOptions = ref({
  
  plugins: [
    dayGridPlugin,
    timeGridPlugin,
    interactionPlugin,
  ],
  headerToolbar: {
    start: 'prev,next',
    center: 'title',
    end: 'dayGridMonth',
  },
  initialView: 'dayGridMonth',
  initialEvents: [], // 초기 이벤트를 빈 배열로 설정
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  direction: isRtl.value ? 'rtl' : 'ltr',
  // select: handleDateSelect,
  eventClick: handleEventClick,
  eventsSet: handleEvents,
  datesSet: handleDatesSet,

});

// Breadcrumbs에 사용될 정보
const breadcrumbs = [
  {
    title: 'Home',
    disabled: false,
    to: { path: '/' },
  },
  {
    title: '나의 칼로리',
    disabled: true,
  },
  {
    title: '칼로리 달력',
    disabled: true,
  },
]

</script>

<template>
  <console class="log"></console>
  
    <VRow class="calendar-container">
      <!-- Breadcrumbs -->
      <VCol cols="12">
        <VBreadcrumbs
          :items="breadcrumbs"
          divider="-"
          class="px-0"
        />
      </VCol>

      <!-- FullCalendar를 포함한 카드 -->
      <VCol cols="12">
        <VCard>
          <FullCalendar :options="calendarOptions" />
        </VCard>
      </VCol>
    </VRow>
  

  <v-dialog v-model="isModalOpen" max-width="1000">
    <VRow style="flex-direction: column;">
      <v-card style="width:1000px">
        <v-card-title class="headline">
          <div align="center" style="font-size: 30px; font-weight: bold; padding: 20px;">{{ selectionDate }} 종합 영양 성분</div>
        </v-card-title>
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
      
      <VCol md="15" cols="50">
        <VCard style="width:1000px; height:400px;">
          <VTabs v-model="navigationTab">
            <VTab>
              {{ morning }}
            </VTab>
            <VTab>
              {{ lunch }}
            </VTab>
            <VTab>
              {{ dinner }}
            </VTab>
          </VTabs>

          <!-- tabs content -->
          <VWindow v-model="navigationTab" style="display: flex;">
            <VWindowItem style="overflow-y: auto; max-height: 300px; width: 980px;">
              <VCard v-if="navigationTab === 0" class="my-card">
                <div class="d-flex justify-space-between flex-wrap flex-md-nowrap flex-column flex-md-row">
                  <div class="ma-auto pa-5">
                  </div>
                  <div>
                    <VCardItem>
                      <VCardTitle>돈가스</VCardTitle>
                    </VCardItem>
                    <VCardText>
                      <p class="mb-2">
                        3대 영양소 <br>
                        탄수화물 :  58.9<br>
                        단백질   :  8.7<br>
                        지방     :  3<br>
                        총량     :  300.7 kcal<br>
                      </p>
                      <h6 class="text-base font-weight-medium">
                        <span class="font-weight-regular">2023년 12월 18일<br></span>
                        <span class="font-weight-medium">오전 12시 06분</span>
                      </h6>
                    </VCardText>
                  </div>
                </div>
              </VCard>
              <VCard v-if="navigationTab === 0" class="my-card">
                <div class="d-flex justify-space-between flex-wrap flex-md-nowrap flex-column flex-md-row">
                  <div class="ma-auto pa-5">
                  </div>
                  <div>
                    <VCardItem>
                      <VCardTitle>양념게장</VCardTitle>
                    </VCardItem>
                    <VCardText>
                      <p class="mb-2">
                        3대 영양소 <br>
                        탄수화물 :  46.3<br>
                        단백질   :  20.4<br>
                        지방     :  2<br>
                        총량     :  275.6 kcal<br>
                      </p>
                      <h6 class="text-base font-weight-medium">
                        <span class="font-weight-regular">2023년 12월 18일<br></span>
                        <span class="font-weight-medium">오전 02시 10분</span>
                      </h6>
                    </VCardText>
                  </div>
                </div>
              </VCard>
              <VCard v-if="navigationTab === 0" class="my-card">
                <div class="d-flex justify-space-between flex-wrap flex-md-nowrap flex-column flex-md-row">
                  <div class="ma-auto pa-5">
                  </div>
                  <div>
                    <VCardItem>
                      <VCardTitle>훈제연어</VCardTitle>
                    </VCardItem>
                    <VCardText>
                      <p class="mb-2">
                        3대 영양소 <br>
                        탄수화물 :  9.3<br>
                        단백질   :  19.3<br>
                        지방     :  6.2<br>
                        총량     :  169 kcal<br>
                      </p>
                      <h6 class="text-base font-weight-medium">
                        <span class="font-weight-regular">2023년 12월 18일<br></span>
                        <span class="font-weight-medium">오전 04시 22분</span>
                      </h6>
                    </VCardText>
                  </div>
                </div>
              </VCard>
              <VCard v-if="navigationTab === 0" class="my-card">
                <div class="d-flex justify-space-between flex-wrap flex-md-nowrap flex-column flex-md-row">
                  <div class="ma-auto pa-5">
                  </div>
                  <div>
                    <VCardItem>
                      <VCardTitle>닭죽</VCardTitle>
                    </VCardItem>
                    <VCardText>
                      <p class="mb-2">
                        3대 영양소 <br>
                        탄수화물 :  92.5<br>
                        단백질   :  75.9<br>
                        지방     :  48.2<br>
                        총량     :  1181.7 kcal<br>
                      </p>
                      <h6 class="text-base font-weight-medium">
                        <span class="font-weight-regular">2023년 12월 18일<br></span>
                        <span class="font-weight-medium">오전 09시 39분</span>
                      </h6>
                    </VCardText>
                  </div>
                </div>
              </VCard>
              <VCard v-if="navigationTab === 0" class="my-card">
                <div class="d-flex justify-space-between flex-wrap flex-md-nowrap flex-column flex-md-row">
                  <div class="ma-auto pa-5">
                  </div>
                  <div>
                    <VCardItem>
                      <VCardTitle>소고기무국</VCardTitle>
                    </VCardItem>
                    <VCardText>
                      <p class="mb-2">
                        3대 영양소 <br>
                        탄수화물 :  8.1<br>
                        단백질   :  13.5<br>
                        지방     :  4.7<br>
                        총량     :  125.2 kcal<br>
                      </p>
                      <h6 class="text-base font-weight-medium">
                        <span class="font-weight-regular">2023년 12월 18일<br></span>
                        <span class="font-weight-medium">오전 09시 42분</span>
                      </h6>
                    </VCardText>
                  </div>
                </div>
              </VCard>
              
              <!-- <template v-if="navigationTab === 0">
                <VCard>
                  {{ serverData.filter(item => item.mealType === 'morning')[0].ingest_calorie }}
                </VCard>
              </template>
              
              <template v-else-if="navigationTab === 1">
                <VCard>
                  {{ array }}
                </VCard>
              </template>
              
              <template v-else-if="navigationTab === 2">
                <VCard>
                  {{ array }}
                </VCard>
              </template> -->
              <VCardText>
                <VBtn @click="closeModal">Learn More</VBtn>
              </VCardText>
            </VWindowItem>
          </VWindow>
        </VCard>
      </VCol>
    </VRow>
  </v-dialog>
</template>



<style scoped>
.my-card {
  display: inline-block;
  margin: 20px; /* 원하는 간격으로 조절하세요 */
}
</style>
 