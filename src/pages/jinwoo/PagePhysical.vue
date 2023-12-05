<template>
  <div>
    <VCard title="체형정보 측정📷">
      <VCardText>촬영 예시</VCardText>
      
      <VRow>
        <!-- 정면 -->
        <VCol
          md="6"
          cols="12"
        >
          <VCardText>
            정면
          </VCardText>
          <!-- 정면 이미지 -->
          <img
            src="@images/images/standinghuman.png"
            alt="정면 이미지"
            style="width: 300px; height: 300px;"
          >
        </VCol>
        <!-- 측면 -->
        <VCol
          md="6"
          cols="12"
        >
          <VCardText>
            측면
          </VCardText>
          <!-- 측면 이미지 -->
          <img
            src="@images/images/bodysilhouette.png"
            alt="측면 이미지"
            style="width: 280px; height: 280px;"
          >
        </VCol>
      </VRow>
      <VDivider />
      <VCard title="측정하기 📷" /> 
      <VRow>
        <VCol
          class="d-flex justify-center"
          cols="12"
          sm="6"
        >
          <VBtn block>
            측정하기
            <VIcon
              end
              icon="mdi-camera-outline"
            />
          </VBtn>
        </VCol>
      </VRow>
    </vcard>
  </div>
</template>
