<template>
  <!-- <div class="large-image">
    <img src="@/assets/images/maintitle.png" alt="Main Title">
  </div> -->
<div>
  <v-row>
    <v-col v-for="(image, index) in images" :key="index" cols="3">
      <VCard
      @mouseenter="toggleImageAndText(index, true)"
        @mouseleave="toggleImageAndText(index, false)"
        class="card-container"
      >
        <div class="image-container">
          <div class="image-wrapper">
            <img :src="getImagePath(image)" :alt="'Image ' + index + ' description'" class="hover-image">
            <div class="text-overlay" v-show="revealedIndex === index">
              <span class="overlay-text">
                {{ texts[index] }}
              </span>
            </div>
          </div>
        </div>
      </VCard>
    </v-col>
  </v-row>
</div>
</template>

<script>
import image9 from '@/assets/images/9.jpg';
import image6 from '@/assets/images/6.jpg';
import image5 from '@/assets/images/5.jpg';
import image7 from '@/assets/images/7.jpg';

export default {
data() {
  return {
    images: [image9, image6, image5, image7],
    revealedIndex: null,
    texts: [
      "비만 여부 확인 및 AI를 통한 체형 분석",
      "AI를 통한 체형분석과 식단/칼로리 관리",
      "AI를 통한 사진의 식재료 분석, 냉장고 관리",
      "챗GPT-챗봇으로 레시피 검색서비스 제공"
    ]
  };
},
methods: {
  toggleImageAndText(index, isHovering) {
  const imgElement = document.querySelectorAll('.image-container img')[index];
  if (isHovering) {
    imgElement.style.filter = 'blur(3px)';
    imgElement.style.transform = 'translateY(-100px)';
    this.revealedIndex = index;
  } else {
    imgElement.style.filter = 'none';
    imgElement.style.transform = 'translateY(0)';
    this.revealedIndex = null;
  }
},
  getImagePath(image) {
    return image;
  }
}
};
</script>

<style scoped>
.card-container {
cursor: pointer;
}

.image-wrapper {
position: relative;
overflow: hidden;
}

.hover-image {
display: block;
width: auto; /* 이미지를 부모 요소에 맞게 조정 */
height: auto; /* 높이 자동 조정 */
object-fit: cover; /* 이미지를 확대 또는 축소하여 채움 */
transition: transform 0.3s ease;
}

.text-overlay {
position: absolute;
bottom: 0;
left: 0;
width: 100%;
background-color: rgba(0, 0, 0, 0.7);
color: white;
padding: 10px;
text-align: center;
transition: opacity 0.3s ease-in-out;
opacity: 0;
}

.image-container:hover .text-overlay {
opacity: 1;
}
</style>
