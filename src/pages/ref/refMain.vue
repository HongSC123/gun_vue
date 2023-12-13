<script>
import axios from 'axios';

export default {
  data() {
    return {
      items: [],
      headers: [
        { text: '품목 이름', value: 'itemName' },
        { text: '등록 날짜', value: 'registrationDate' },
        { text: '남은 유통기한', value: 'expiryDate' },
        { text: '수량', value: 'quantity' },
      ],
      userMail: sessionStorage.getItem('userMail'),
    };
  },
  async created() {
    try {
      const response = await axios.post('/', { email: this.userMail });
      this.items = response.data;
    } catch (error) {
      console.error(error);
    }
  },
};
</script>

<template>
  <VDataTable
    :headers="headers"
    :items="items"
    :items-per-page="10"
    :sort-by="['itemName']"
    :sort-desc="[false]"
    class="elevation-1"
  >
    <template v-slot:item.name="{ item }">
      <VChip color="blue" text-color="white">
        {{ item.itemName }}
      </VChip>
    </template>
  </VDataTable>
</template>