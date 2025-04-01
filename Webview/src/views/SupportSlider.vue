<template>
  <div class="slider-section">
    <div v-if="loading" class="loading-overlay">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    
    <div v-else class="slider-container position-relative">
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
      <div class="slider-pagination" v-if="displaySlides.length > 1">
        <button
          v-for="(slide, index) in displaySlides"
          :key="index"
          class="pagination-dot"
          :class="{ active: currentSlide === index }"
          @click="goToSlide(index)"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useSlider } from "../APIs/SlideSupportAPI";

// Default slides as fallback
const defaultSlides = [
  {
    image: "/path/to/default/image1.jpg",
    title: "Support Title 1",
    description: "Support Description 1"
  },
  {
    image: "/path/to/default/image2.jpg",
    title: "Support Title 2",
    description: "Support Description 2"
  }
];

const { sliderList, loading, error } = useSlider();
const currentSlide = ref(0);
let intervalId = null;

const displaySlides = computed(() => {
  return sliderList.value.length > 0 ? sliderList.value : defaultSlides;
});

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  } else {
    currentSlide.value = displaySlides.value.length - 1;
  }
};

const nextSlide = () => {
  if (currentSlide.value < displaySlides.value.length - 1) {
    currentSlide.value++;
  } else {
    currentSlide.value = 0;
  }
};

const goToSlide = (index) => {
  currentSlide.value = index;
};

const startSlideshow = () => {
  stopSlideshow(); // Clear any existing interval
  intervalId = setInterval(() => {
    nextSlide();
  }, 5000);
};

const stopSlideshow = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

onMounted(() => {
  startSlideshow();
});

onUnmounted(() => {
  stopSlideshow();
});
</script>

<style scoped>
.slider-section {
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  z-index: 10;
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
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  z-index: 2;
  padding: 1rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.slider-nav:hover {
  background: rgba(0, 0, 0, 0.8);
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
  z-index: 2;
}

.pagination-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination-dot.active {
  background: white;
}

@media (max-width: 768px) {
  .slider-section {
    height: 40vh;
  }

  .slide-content {
    padding: 1rem;
  }

  .slide-content h2 {
    font-size: 1.5rem;
  }

  .slide-content p {
    font-size: 1rem;
  }
}
</style> 