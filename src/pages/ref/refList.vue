<script setup>
import { VDataTable } from 'vuetify/labs/VDataTable'
import axios from '@axios'
import { ref, onMounted } from "vue"
import router from '@/router'

const search = ref('')
const itemList = ref([])
const axiosdialog = ref(false)
const axiosMessage = ref('')
const detailDialog = ref(false)
const editDialog = ref(false)
const menu = ref(false)
const editItem = ref({
  ref_NUM: null,
  refEndDate: null,
  refName: null,
  refQuan: null,
})

// headers
const headers = [
  {
    title: '물품이름',
    key: 'refName',
  },
  {
    title: '유통기한',
    key: 'refEndDate',
  },
  {
    title: '수량',
    key: 'refQuan',
  },
  {
    title: '저장일',
    key: 'ref_SAVE_DATE',
  },
  {
    title: 'DELETE',
    key: 'delete',
    sortable: false,
  },
]

const selectedItem = ref({
    memEmail: null,
    ref_SAVE_DATE: null,
    refEndDate: null,
    refName: null,
    refQuan: null,
    refPhoto: null,
    ref_NUM: null,
})

const openEditDialog = () => {
  editItem.value = { ...selectedItem.value }
  editDialog.value = true
}

const confirmEdit = () => {
  axios.patch(`/ref/update`, editItem.value)
    .then(res => {
      selectedItem.value = res.data
      axiosMessage.value = '수정이 성공했습니다.'
    })
    .catch(err => {
      console.log(err)
      axiosMessage.value = '수정에 실패했습니다.'
    })
    .finally(() => {
      editDialog.value = false
      axiosdialog.value = true
    })
}


const deleteItem = ref_NUM => {
  axios.delete(`/ref/deleteRef/${ref_NUM}`)
  .then((response) => {
      axiosMessage.value = '삭제가 성공했습니다.';
      console.log('response.data:', response.data)
      itemList.value = response.data
    })
    .catch((error) => {
      console.error(error);
      axiosMessage.value = '삭제에 실패했습니다.';
    })
    .finally(() => {
      axiosdialog.value = true;
    });
}

const closeDialog = () => {
    axiosdialog.value = false;
    window.location.href = "http://localhost:8888/";
};


const showDialog = ref_NUM => {
  axios.get(`/ref/detail/${ref_NUM}`)
  .then(res => {
    selectedItem.value = res.data
    console.log("selectItem {} : ",selectedItem.value)
  }) 
  .catch(err => {
    console.log(err)
  })
  .finally(() => {
    detailDialog.value = true
  })
}

onMounted(() => {
  axios.get(`/ref/list/${sessionStorage.getItem("memEmail")}`)
  .then(res => {
    itemList.value = res.data
    console.log(itemList.value)
  })
})

</script>

<template>
  <div>
    <VCardText>
      <VRow>
        <VCol
          cols="12"
          offset-md="8"
          md="4"
        >
          <VTextField
            v-model="search"
            density="compact"
            label="Search"
            append-inner-icon="mdi-magnify"
            single-line
            hide-details
            dense
            outlined
          />
        </VCol>
      </VRow>
    </VCardText>

    <!-- 👉 Data Table  -->
    <VDataTable
      :headers="headers"
      :items="itemList"
      :search="search"
      :items-per-page="5"
    >
      <!-- refName -->
      <template #item.refName="{ item }">
        <div class="d-flex align-center" @click="showDialog(item.raw.ref_NUM)">
          <div>
            <VImg
              :src="'data:image/jpg;base64,' + item.raw.refPhoto"
              height="40"
              width="40"
            />
          </div>
          <div class="d-flex flex-column ms-3">
            <span class="d-block font-weight-medium text-truncate text-high-emphasis">{{ item.raw.refName }}</span>
          </div>
        </div>
      </template>

      <!-- refEndDate -->
      <template #item.refEndDate="{ item }">
        <div class="d-flex align-center" @click="showDialog(item.raw.ref_NUM)">
          <span class="text-no-wrap font-weight-medium">
            {{ new Date(item.raw.refEndDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }) }}
            </span>
        </div>
      </template>

      <!-- refQuan -->
      <template #item.refQuan="{ item }">
        <div class="d-flex align-center" @click="showDialog(item.raw.ref_NUM)">
          <span class="text-no-wrap font-weight-medium text--primary ms-2">{{ item.raw.refQuan }}</span>
        </div>
      </template>

      <!-- ref_SAVE_DATE -->
      <template #item.ref_SAVE_DATE="{ item }">
        <div class="d-flex flex-column" @click="showDialog(item.raw.ref_NUM)">
          <div class="d-flex align-center">
            <span class="text-primary font-weight-medium">
              {{ new Date(item.raw.ref_SAVE_DATE).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }) }}
              </span>
          </div>
        </div>
      </template>

      <!-- Delete -->
      <template #item.delete="{ item }">
        <IconBtn @click="deleteItem(item.raw.ref_NUM)">
          <VIcon icon="mdi-delete-outline" />
        </IconBtn>
      </template>
    </VDataTable>
  </div>

  <v-dialog v-model="axiosdialog" max-width="400">
    <v-card>
      <v-card-title class="headline">{{ axiosMessage }}</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="closeDialog">확인</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

<v-dialog v-model="detailDialog" max-width="500px">
  <v-card v-if="selectedItem" style="text-align: center; align-items: center;">
    <v-card-title class="headline">물품번호 : {{ selectedItem.ref_NUM }}</v-card-title>
    <v-row justify="center">
      <v-col cols="12">
        <VImg
          :src="'data:image/jpg;base64,' + selectedItem.refPhoto"
          width="400"
        />
      </v-col>
    </v-row>
    <v-card-text>
      <v-col cols="12">
        <h4>저장일</h4>
        <p>{{ new Date(selectedItem.ref_SAVE_DATE).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) }}</p>
      </v-col>
      <v-col cols="12">
        <h4>유통기한</h4>
        <p>{{ new Date(selectedItem.refEndDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) }}</p>
      </v-col>
      <v-row>
        <v-col cols="6">
          <h4>물품이름</h4>
          <p>{{ selectedItem.refName }}</p>
        </v-col>
        <v-col cols="6">
          <h4>물품수량</h4>
          <p>{{ selectedItem.refQuan }}</p>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="openEditDialog">수정</v-btn>
      <v-btn color="green darken-1" text @click="detailDialog = false">닫기</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<v-dialog v-model="editDialog" max-width="500px" max-height="auto">
  <v-card>
    <v-card-title class="headline">물품 수정</v-card-title>
    <v-card>
      <v-row>
      <v-col cols="12">
      <v-text-field v-model="editItem.refName" label="물품이름"></v-text-field>
      </v-col>
    </v-row>
    <v-spacer></v-spacer>
    <v-row>
      <v-col cols="12">
      <label for="refEndDate">유통기한</label><v-spacer></v-spacer>
      <input id="refEndDate" type="date" v-model="editItem.refEndDate"><v-spacer></v-spacer>
      <p>{{ new Date(editItem.refEndDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }) }}</p>
    </v-col>
    </v-row>
    <v-spacer></v-spacer>
    <v-row>
      <v-col cols="12">
      <v-text-field v-model="editItem.refQuan" label="수량"></v-text-field>
    </v-col>
    </v-row>
    </v-card>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="green darken-1" text @click="editDialog = false">취소</v-btn>
      <v-btn color="blue darken-1" text @click="confirmEdit">확인</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<v-dialog v-model="axiosdialog" max-width="400">
  <v-card>
    <v-card-title class="headline">{{ axiosMessage }}</v-card-title>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="green darken-1" text @click="axiosdialog = false">확인</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

</template>
