<script setup>
import { VDataTable } from 'vuetify/labs/VDataTable'
import axios from '@axios'

const search = ref('')
const itemList = ref([])

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

const deleteItem = itemId => {
  const index = itemList.value.findIndex(item => item.product.id === itemId)
  itemList.value.splice(index, 1)
}


onMounted(() => {
  axios.get(`/ref/list/${sessionStorage.getItem("memEmail")}`).then(res => {
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
        <div class="d-flex align-center">
          <div>
            <VImg
              :src="'data:image/png;base64,' + item.raw.refPhoto"
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
        <div class="d-flex align-center">
          <span class="text-no-wrap font-weight-medium">
            {{ new Date(item.raw.refEndDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }) }}
            </span>
        </div>
      </template>

      <!-- refQuan -->
      <template #item.refQuan="{ item }">
        <div class="d-flex align-center">
          <span class="text-no-wrap font-weight-medium text--primary ms-2">{{ item.raw.refQuan }}</span>
        </div>
      </template>

      <!-- ref_SAVE_DATE -->
      <template #item.ref_SAVE_DATE="{ item }">
        <div class="d-flex flex-column">
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
</template>
