<template>
  <div>
    <VBtn
      v-show="role === 'ADMIN'"
      @click="insertNotice"
    >
      공지 작성
    </VBtn>
    <VCardText>
      <VRow>
        <VCol
          cols="12"
          offset-md="8"
          md="4"
        >
          <VTextField
            v-model="search"
            dense
            outlined
            label="검색"
            append-inner-icon="mdi-magnify"
            single-line
            hide-details
          />
        </VCol>
      </VRow>
    </VCardText>

    <VDataTable
      :headers="headers"
      :items="data"
      :items-per-page="5"
      item-key="noticeNum"
      :search="search"
      @click:row="noticeDetail"
    />

    <VDialog
      v-model="dialogVisible"
      max-width="600"
    >
      <VCard>
        <VCardTitle class="headline">
          {{ selectedNotice.noticeTitle }}
        </VCardTitle>

        <VCardText>
          <div>
            <strong>작성일:</strong> {{ selectedNotice.noticeInputDate }}
          </div>
          <div>
            <strong>작성자:</strong> {{ selectedNotice.adminId }}
          </div>
          <!-- 더 많은 정보 추가 -->
        </VCardText>

        <VCardActions>
          <VBtn
            color="primary"
            @click="closeDialog"
          >
            닫기
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { VDataTable } from 'vuetify/labs/VDataTable'
import { useRouter } from 'vue-router'
import axios from '@axios'

const router = useRouter()
const search = ref('')
const data = ref([])
const dialogVisible = ref(false)
const selectedNotice = ref({})
const role = sessionStorage.getItem('role')

const headers = [
  {
    text: '번호',
    sortable: false,
    value: 'noticeNum',
  },
  {
    text: '제목',
    value: 'noticeTitle',
  },
  {
    text: '작성일',
    value: 'noticeInputDate',
  },
  {
    text: '작성자',
    value: 'adminId',
  },
  {
    text: '조회수',
    value: 'noticeCount',
  },
]

const noticeDetail = event => {
  const row = event.target.closest('tr')
  const noticeNum = row.querySelector('.v-data-table__td.v-data-table-column--align-start').innerText

  axios.patch("/notice/addcount/" + noticeNum)

  axios.get("/notice/detail/" + noticeNum).then(res => {
    selectedNotice.value = res.data
    dialogVisible.value = true

    setTimeout(() => {
      axios.get("/notice/list").then(res => {
        data.value = res.data
      })
    }, 100)
  })

  
}

const closeDialog = () => {
  dialogVisible.value = false
}

const insertNotice = () => {
  router.push('/noticeWrite')
}

onMounted(() => {
  axios.get("/notice/list").then(res => {
    data.value = res.data
  })
})
</script>
