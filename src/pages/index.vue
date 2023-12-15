<template>
  <div>
    <v-row>
      <v-col
        v-for="(image, index) in images"
        :key="index"
        cols="3"
      >
        <VCard
          @mouseover="revealText(index)"
          @mouseleave="hideText(index)"
          class="card-container"
        >
          <div class="image-container">
            <img
              :src="getImagePath(image)"
              :alt="'Image ' + index + ' description'"
              class="hover-image"
            >
            <span v-show="revealedIndex === index" class="overlay-text">
              Overlay Text Here
            </span>
          </div>
        </VCard>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import image3 from '@/assets/images/3.jpg';
import image6 from '@/assets/images/6.jpg';
import image5 from '@/assets/images/5.jpg';
import image7 from '@/assets/images/7.jpg';

export default {
  data() {
    return {
      images: [image3, image6, image5, image7],
      revealedIndex: null
    };
  },
  methods: {
    revealText(index) {
      this.revealedIndex = index;
    },
    hideText(index) {
      this.revealedIndex = null;
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

.image-container {
  position: relative;
  overflow: hidden;
  transition: transform 0.3s;
}

.hover-image {
  display: block;
  width: 100%;
  height: auto;
  transition: transform 0.3s;
}

.overlay-text {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  text-align: center;
  transform: translateY(100%);
  transition: transform 0.3s;
}

.VCard:hover .image-container {
  transform: translateY(-10px);
}

.VCard:hover .hover-image {
  transform: translateY(10px);
}

.VCard:hover .overlay-text {
  transform: translateY(0);
}
</style>