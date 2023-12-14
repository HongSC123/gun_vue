<script setup>
// FullCalendar 및 플러그인, RTL 훅 등을 가져옵니다.
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import FullCalendar from '@fullcalendar/vue3'
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRtl } from 'vuetify'

// 현재 이벤트 목록을 저장할 리액티브 변수
const currentEvents = ref([])
const { isRtl } = useRtl()

// // 달력에서 날짜를 선택했을 때 호출되는 핸들러 함수
// const handleDateSelect = selectInfo => {
//   const title = prompt('Please enter a new title for your event')
//   const calendarApi = selectInfo.view.calendar

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

const router = useRouter();
const selectionDate = ref('');

// 달력에서 이벤트를 클릭했을 때 호출되는 핸들러 함수
const handleEventClick = clickInfo => {
  // 클릭한 이벤트의 날짜 가져오기
  const clickedDate = clickInfo.event.start;

  // 서버에서 데이터 조회
  fetchDataFromServer(clickedDate);
}

const fetchDataFromServer = async date => {
  try {
    // 여기에서 서버에서 데이터를 조회하고 필요한 처리를 수행
    const memEmail = sessionStorage.getItem("memEmail");
    const mem_email = "kiqbbq78@naver.com";
    const response = await axios.get(`/caloriedetail/${mem_email}/${date}`);
    
    // 조회된 데이터를 콘솔에 출력
    console.log('%c서버에서 조회한 데이터:', 'color: green; font-weight: bold', response.data);

    // 조회된 데이터와 함께 페이지 이동
    router.push({ 
      name: 'calender-detail', 
      params: { mem_email, selectionDate: date },
      query: { data: response.data } // 데이터를 쿼리로 전달
    });
  } catch (error) {
    console.error('%c서버와 통신 중 오류 발생:', 'color: red; font-weight: bold', error);
  }
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
  console.log('현재 년월일:', yyyy_mm);

  currentMonth.value = yyyy_mm;
  
  // 서버로 데이터를 전송
  sendDataToServer(info, yyyy_mm);


};


const sendDataToServer = async (info, yyyy_mm) => {
  try {
    const memEmail = sessionStorage.getItem("memEmail");
    const mem_email = "kiqbbq78@naver.com";

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
  <VRow>
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
</template>

<style lang="scss">
</style>
