<template>
  <div>
    <VRow>
      <VCol
        cols="8"
        md="4"
      >
        <VBtn
          v-show="role === 'ADMIN'"
          @click="insertNotice"
        >
          공지 작성
        </VBtn>
      </VCol>
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

    <VDataTable
      :headers="tableHeaders"
      :items="data"
      :items-per-page="5"
      item-key="noticeNum"
      :search="search"
      :sort-desc="['noticeNum']"
      @click:row="noticeDetail"
    />

    <VDialog
      v-model="dialogVisible"
      max-width="600"
    >
      <VCard>
        <VCardTitle class="headline">
          {{ selectedNotice.noticeNum }}번 : {{ selectedNotice.noticeTitle }}
        </VCardTitle>

        <VCardText>
          <div>
            <strong>작성일:</strong> {{ selectedNotice.noticeInputDate }}
          </div>
          <div>
            <strong>작성자:</strong> {{ selectedNotice.adminId }}
          </div>
          <div>
            <strong>작성시간:</strong> {{ selectedNotice.noticeInputDate }}
          </div>
          <div>
            <strong>공지:</strong> {{ selectedNotice.noticeCon }}
          </div>
          <div v-if="selectedNotice.noticeFile">
            <img
              :src="'http://127.0.0.1:8080/'+selectedNotice.noticeFile"
              alt="공지사항 이미지"
            >
          </div>
        </VCardText>

        <VCardActions>
          <VBtn
            color="primary"
            @click="closeDialog"
          >
            닫기
          </VBtn>
          <VBtn
            v-show="role === 'ADMIN'"
            color="secondary"
            @click="editNotice"
          >
            공지수정
          </VBtn>
          <VBtn
            v-show="role === 'ADMIN'"
            color="secondary"
            @click="deleteNotice(selectedNotice.noticeNum)"
          >
            공지삭제
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VDialog
      v-model="insertDialogVisible"
      max-width="800"
    >
      <VCard>
        <VCardTitle class="headline">
          공지사항 작성
        </VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="6">
              <VTextField
                v-model="newNotice.title"
                label="제목"
                outlined
                dense
              />
              <VTextarea
                v-model="newNotice.content"
                label="내용"
                outlined
                dense
              />
              <VFileInput
                v-model="newNotice.image"
                label="이미지 업로드"
                outlined
                dense
                accept="image/*"
                @change="onImageChange"
              />
            </VCol>
            <VCol cols="6">
              <VImg
                v-if="imagePreview"
                :src="imagePreview"
                aspect-ratio="1.6"
                contain
              />
            </VCol>
          </VRow>
        </VCardText>

        <VCardActions>
          <VSpacer />
          <VBtn
            color="primary"
            @click="submitNotice"
          >
            등록
          </VBtn>
          <VBtn
            color="grey"
            @click="closeInsertDialog"
          >
            취소
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VDialog
      v-model="editDialogVisible"
      max-width="800"
    >
      <VCard>
        <VCardTitle class="headline">
          공지사항 수정
        </VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="6">
              <VTextField
                v-model="newNotice.title"
                label="제목"
                outlined
                dense
              />
              <VTextarea
                v-model="newNotice.content"
                label="내용"
                outlined
                dense
              />
              <VFileInput
                :key="newNotice.image ? 'withImage' : 'withoutImage'"
                label="이미지 업로드"
                outlined
                dense
                accept="image/*"
                @change="onImageInputChange"
              />
            </VCol>
            <VCol cols="6">
              <VImg
                v-if="imagePreview"
                :src="imagePreview"
                aspect-ratio="1.6"
                contain
              />
            </VCol>
          </VRow>
        </VCardText>

        <VCardActions>
          <VSpacer />
          <VBtn
            color="primary"
            @click="updateNotice"
          >
            수정
          </VBtn>
          <VBtn
            color="grey"
            @click="closeEditDialog"
          >
            취소
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
const insertDialogVisible = ref(false)
const imagePreview = ref('')
const editDialogVisible = ref(false)

const newNotice = ref({
  title: '',
  content: '',
  image: null, // 새 공지사항 이미지
})

const tableHeaders = [
  {
    title: '번호',
    key: 'noticeNum',
    width: '10%',
  },
  {
    title: '제목',
    key: 'noticeTitle',
    width: '50%',
  },
  {
    title: '작성일',
    key: 'noticeInputDate',
    width: '15%',
  },
  {
    title: '작성자',
    key: 'adminId',
    width: '15%',
  },
  {
    title: '조회수',
    key: 'noticeCount',
    width: '10%',
  },
]

const openEditDialog = () => {
  editDialogVisible.value = true
}

const closeEditDialog = () => {
  editDialogVisible.value = false

  // 파일 입력 컴포넌트 초기화
  newNotice.value.image = null
  imagePreview.value = ''
}

const onImageChange = () => {
  if (newNotice.value.image && newNotice.value.image[0]) {

    const reader = new FileReader()

    reader.onload = e => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(newNotice.value.image[0])
  }
}


const onImageInputChange = event => {
  // 별도의 수정용 change 이벤트 핸들러
  const selectedFile = event.target.files[0]

  newNotice.value.image = [selectedFile] // 이미지 변경 로직에 필요한 newNotice 객체 업데이트
}


const noticeDetail = event => {
  const row = event.target.closest('tr')
  const noticeNum = row.querySelector('.v-data-table__td.v-data-table-column--align-start').innerText

  axios.patch("/notice/addcount/" + noticeNum)
  axios.get("/notice/detail/" + noticeNum).then(res => {
    selectedNotice.value = res.data
    dialogVisible.value = true
    setTimeout(() => {
      fetchNoticeList()
    }, 100)
  })
}

const closeDialog = () => {
  dialogVisible.value = false
}

const insertNotice = () => {
  insertDialogVisible.value = true
  newNotice.value = {} // 새로운 공지사항 작성을 위해 newNotice 초기화
}

const closeInsertDialog = () => {
  insertDialogVisible.value = false
}

const submitNotice = async () => {
  const formData = new FormData()

  console.log(newNotice.value)

  formData.append('adminId', sessionStorage.getItem('memEmail')) // 세션스토리지에서 ID 가져오기
  formData.append('noticeTitle', newNotice.value.title)
  formData.append('noticeCon', newNotice.value.content)
  formData.append('noticeFile', newNotice.value.image[0])


  for(let pair of formData.entries()) {
    console.log(pair[0]+ ', '+ pair[1])
  }

  console.log(formData.value)
  try {
    const response = await axios.post('/notice/insert', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (response.data === 'success') {
      insertDialogVisible.value = false
      console.log(response)
      await fetchNoticeList()
    } else {
      console.log(response)
    }
  } catch (error) {
    console.log(error)
  }
}

const editNotice = () => {
  newNotice.value.title = selectedNotice.value.noticeTitle
  newNotice.value.content = selectedNotice.value.noticeCon
  newNotice.value.image = selectedNotice.value.noticeFile
  console.log("1 : " + newNotice.value.image)
  newNotice.value.num = selectedNotice.value.noticeNum
  imagePreview.value = selectedNotice.value.noticeFile ? `http://127.0.0.1:8080/${selectedNotice.value.noticeFile}` : ''
  editDialogVisible.value = true // 수정 다이얼로그 열기
}


const updateNotice = async () => {
  const formData = new FormData()

  console.log(newNotice.value.num)
  formData.append('noticeNum', newNotice.value.num)
  formData.append('adminId', sessionStorage.getItem('memEmail')) // 세션스토리지에서 ID 가져오기
  formData.append('noticeTitle', newNotice.value.title)
  formData.append('noticeCon', newNotice.value.content)

  console.log(newNotice.value.image)
  if (newNotice.value.image[0]) {
    // 새로운 이미지가 있는 경우에만 업로드
    formData.append('noticeFile', newNotice.value.image[0])
  }

  try {
    const response = await axios.patch('/notice/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (response.data === 'success') {
      alert('공지사항이 성공적으로 수정되었습니다.')
      dialogVisible.value = false
      
      await fetchNoticeList()
    } else {
      alert('공지사항 수정에 실패하였습니다. 다시 시도해주세요.')
    }
  } catch (error) {
    console.error(error)
    alert('서버 에러가 발생했습니다. 관리자에게 문의해주세요.')
  }
}


const fetchNoticeList = async () => {
  const response = await axios.get("/notice/list")

  data.value = response.data
}

const deleteNotice = async noticeNum => {
  try {
    await axios.patch('/notice/delete/' + noticeNum)
    console.log('공지사항 삭제가 완료되었습니다.')
    setTimeout(() => {
      fetchNoticeList()
    }, 100)
    dialogVisible.value = false
  } catch (error) {
    console.error('공지사항 삭제 중에 오류가 발생했습니다.', error)
  }
}

onMounted(() => {
  fetchNoticeList()
})
</script>
