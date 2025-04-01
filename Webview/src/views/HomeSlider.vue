<script setup>
import { ref, onMounted, computed } from 'vue';
import { useSlider } from "../APIs/SlideHomeAPI";

// Default slides as fallback
const defaultSlides = [
  {
    image: "/path/to/default/image1.jpg",
    title: "Default Title 1",
    description: "Default Description 1"
  },
  // Add more default slides as needed
];

const { sliderList, loading, error } = useSlider();

const props = defineProps({
  slides: {
    type: Array,
    default: () => []
  }
});

const currentSlide = ref(0);

const displaySlides = computed(() => {
  return sliderList.value.length > 0 ? sliderList.value : defaultSlides;
});

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  }
};

const nextSlide = () => {
  if (currentSlide.value < props.slides.length - 1) {
    currentSlide.value++;
  }
};

const goToSlide = (index) => {
  currentSlide.value = index;
};

onMounted(() => {
  // Auto-advance slides every 5 seconds
  setInterval(() => {
    if (currentSlide.value < props.slides.length - 1) {
      currentSlide.value++;
    } else {
      currentSlide.value = 0;
    }
  }, 5000);
});
</script>

<template>
  <div class="slider-section">
    <div class="slider-container position-relative">
      <!-- Slides -->
      <div
        class="slides-wrapper"
        :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
      >
        <div v-for="(slide, index) in displaySlides" :key="index" class="slide">
          <img :src="slide.src || slide.image" :alt="slide.title" />
          <div class="slide-content">
            <h2>{{ slide.title }}</h2>
            <p>{{ slide.description }}</p>
          </div>
        </div>
      </div>

      <!-- Pagination Dots -->
      <div class="slider-pagination">
        <button
          v-for="(slide, index) in slides"
          :key="index"
          class="pagination-dot"
          :class="{ active: currentSlide === index }"
          @click="goToSlide(index)"
        ></button>
      </div>
    </div>
  </div>
</template>

<style>
.slider-section {
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
}

.slider-container {
  width: 100%;
  height: 100%;
}

.slides-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease-in-out;
}

.slide {
  min-width: 100%;
  position: relative;
}

.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
}

.slider-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  z-index: 2;
  padding: 1rem;
}

.slider-nav.prev {
  left: 1rem;
}

.slider-nav.next {
  right: 1rem;
}

.slider-pagination {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}

.pagination-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
}

.pagination-dot.active {
  background: white;
}
</style>
