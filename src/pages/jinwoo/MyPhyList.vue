<script setup>
const desserts = [
  {
    dessert: 'Frozen Yogurt',
    calories: 159,
    fat: 6,
    carbs: 24,
    protein: 4,
  },
  {
    dessert: 'Ice cream sandwich',
    calories: 237,
    fat: 6,
    carbs: 24,
    protein: 4,
  },
  {
    dessert: 'Eclair',
    calories: 262,
    fat: 6,
    carbs: 24,
    protein: 4,
  },
  {
    dessert: 'Cupcake',
    calories: 305,
    fat: 6,
    carbs: 24,
    protein: 4,
  },
  {
    dessert: 'Gingerbread',
    calories: 356,
    fat: 6,
    carbs: 24,
    protein: 4,
  },
  {
    dessert: 'Frozen Yogurt',
    calories: 159,
    fat: 6,
    carbs: 24,
    protein: 4,
  },
  {
    dessert: 'Ice cream sandwich',
    calories: 237,
    fat: 6,
    carbs: 24,
    protein: 4,
  },
  {
    dessert: 'Eclair',
    calories: 262,
    fat: 6,
    carbs: 24,
    protein: 4,
  },
  {
    dessert: 'Cupcake',
    calories: 305,
    fat: 6,
    carbs: 24,
    protein: 4,
  },
  {
    dessert: 'Gingerbread',
    calories: 356,
    fat: 6,
    carbs: 24,
    protein: 4,
  },
]
</script>

<template>
  <VTable density="compact">
    <thead>
      <tr>
        <th class="text-uppercase">
          Desserts(100g Servings)
        </th>
        <th class="text-uppercase">
          calories
        </th>
        <th class="text-uppercase">
          Fat(g)
        </th>
        <th class="text-uppercase">
          Carbs(g)
        </th>
        <th class="text-uppercase">
          protein(g)
        </th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="item in desserts"
        :key="item.dessert"
      >
        <td>
          <!-- 이름 클릭 시 페이지 이동 처리 -->
         
          {{ item.dessert }}
        </td>
        <td>
          {{ item.calories }}
        </td>
        <td>
          {{ item.fat }}
        </td>
        <td>
          {{ item.carbs }}
        </td>
        <td>
          {{ item.protein }}
        </td>
      </tr>
    </tbody>
  </VTable>

  <VBtn
    block
    color="info"
    variant="tonal"
    :to="{path: 'myphycompare'}"
    class="mt-4" 
    size="large"
  >
    체형정보 비교하기
    <VIcon 
      end
      icon="mdi-compare-horizontal"
    />
  </VBtn>
</template>

<style scoped>
/* 테이블과 버튼을 맞추기 위한 스타일 */
.VTable {
  margin-block-end: 16px; /* 테이블 아래 여백 추가 */
}

.VBtn {
  margin-block-start: 16px; /* 버튼 위 여백 추가 */
}
</style>
