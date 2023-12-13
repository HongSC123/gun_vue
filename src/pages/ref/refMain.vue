<template>
  <VDataTable
    :headers="headers"
    :items="data"
    :items-per-page="5"
    show-select
    no-data-text="목록이 없습니다"
  >
    <!-- item name -->
    <template #item.itemName="{ item }">
      <div class="d-flex align-center">
        <VAvatar
          size="32"
          :color="item.avatar ? '' : 'primary'"
          :class="item.avatar ? '' : 'v-avatar-light-bg primary--text'"
          :variant="!item.avatar ? 'tonal' : undefined"
        >
          <VImg
            v-if="item.avatar"
            :src="item.avatar"
          />
          <span v-else>{{ avatarText(item.itemName) }}</span>
        </VAvatar>
        <div class="d-flex flex-column ms-3">
          <span class="d-block font-weight-medium text-high-emphasis text-truncate">{{ item.itemName }}</span>
          <small>{{ item.registrationDate }}</small>
        </div>
      </div>
    </template>

    <!-- expiry date -->
    <template #item.expiryDate="{ item }">
      <VChip
        :color="resolveExpiryDateVariant(item.expiryDate).color"
        class="font-weight-medium"
        size="small"
      >
        {{ resolveExpiryDateVariant(item.expiryDate).text }}
      </VChip>
    </template>
  </VDataTable>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      data: [],
      headers: [
        { text: '품목 이름', value: 'itemName' },
        { text: '등록 날짜', value: 'registrationDate' },
        { text: '남은 유통기한', value: 'expiryDate' },
        { text: '수량', value: 'quantity' },
      ],
    };
  },
  methods: {
    avatarText(itemName) {
      return itemName.charAt(0).toUpperCase();
    },
    resolveExpiryDateVariant(expiryDate) {
      // Add your logic to determine the color and text based on expiryDate
      return { color: 'primary', text: expiryDate };
    },
  },
  async created() {
    try {
      const response = await axios.get('/ref/main');
      this.data = response.data;
    } catch (error) {
      console.error(error);
    }
  },
};
</script>