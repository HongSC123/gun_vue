<template>
  <div>
    <VCard title="내 체형정보 보기 🖨️">
      <VCardText>체형정보</VCardText>
      <VRow>
        <VCol
          md="6"
          cols="12"
        >
          <VCardText>이미지 영역</VCardText>
        </VCol>
        <VCol
          md="6"
          cols="12"
        >
          <VCardText>분석 내용 영역</VCardText>
        </VCol>
        <VCardText>
          <VCol
            class="d-flex justify-content-between"
            cols="12"
            sm="6"
          >
            <VBtn
              variant="tonal"
              block
              style="margin-right: 25px;"
            >
              측정하기
              <VIcon
                end
                icon="mdi-camera-outline"
              />
            </VBtn>
            <VBtn
              block
              color="secondary"
              variant="tonal"
              :to="{path: 'myphylist'}"
            >
              이전 체형보기
              <VIcon
                end
                icon="mdi-format-list-bulleted-square"
              />
            </VBtn>
          </VCol>
        </VCardText>
      </VRow>
    </VCard>
  </div>
</template>
