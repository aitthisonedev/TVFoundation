<template>
  <div>
    <div class="row g-2 my-1 Hero-section">
      <div class="col-lg-12">
        <div class="main-slide rounded overflow-hidden">
          <div class="slider-container">
            <div v-for="(slide, index) in slides" :key="index" 
                 :class="['slider-item', { active: currentImageIndex === index }]">
              <img
                :src="slide.src || slide.image"
                class="slider-image"
                alt="Main slide"
              />
              <div class="slide-content">
                <h2 class="slide-title">{{ slide.title }}</h2>
                <p class="slide-description">{{ slide.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useSlider } from "../../APIs/SlideNewsAPI";

// Default slides as fallback
const defaultSlides = [
  {
    image: "https://assets.nst.com.my/images/articles/LAOS-VIETNAM-FLOOD-WEATHER-LANDSLIDE_110924n01_1726061821.jpg",
    title: "Natural Disaster Strikes",
    description: "Heavy flooding and landslides affect local communities in Southeast Asia"
  },
  {
    image: "https://brokenchalk.org/wp-content/uploads/2024/01/15674311173_33109e4445_o-e1705422423916.jpg",
    title: "Education Initiative",
    description: "New programs launched to support rural education development"
  },
  {
    image: "https://www.globaltimes.cn/Portals/0/attachment/2022/2022-08-09/f112059c-0fb8-48a7-8828-709d94e8ac48.jpeg",
    title: "Economic Growth",
    description: "Regional cooperation leads to increased economic opportunities"
  },
];

const { sliderList, loading, error } = useSlider();
const currentImageIndex = ref(0);
let intervalId = null;

const slides = computed(() => {
  return sliderList.value.length > 0 ? sliderList.value : defaultSlides;
});

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % slides.value.length;
};

onMounted(() => {
  intervalId = setInterval(nextImage, 3000);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<style lang="scss" scoped>
.main-slide {
  height: 500px;
  position: relative;
  overflow: hidden;

  .slider-container {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .slider-item {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 1.5s ease-in-out;

    &.active {
      opacity: 1;
    }
  }

  .slider-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 1.5s ease;

    &:hover {
      transform: scale(1.1);
      cursor: pointer;
    }
  }

  .slide-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
    color: white;
    text-align: left;
  }

  .slide-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .slide-description {
    font-size: 16px;
    margin: 0;
  }
}

.Hero-section {
  position: relative;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  padding: 0;
  overflow: hidden;
}
</style>
