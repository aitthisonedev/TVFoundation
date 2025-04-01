<template>
  <section class="container-fluid">
    <h2 class="text-center mt-4 contact-heading">
      {{ $t("contactUs.sponsoringCompanies") }}
    </h2>
    <div class="logos-container">
      <div class="logos-slide" :style="{ '--animation-duration': `${animationDuration}s` }">
        <figure 
          v-for="(item, i) in duplicatedSlides" 
          :key="i"
          class="m-0 p-3 text-center d-flex align-items-center justify-content-center"
        >
          <img 
            :src="item.logo || defaultLogo" 
            :alt="item.name || 'Partner Logo'" 
            class="img-fluid"
            style="max-height: 80px; width: auto; object-fit: contain;"
            @error="handleImageError"
          />
        </figure>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import { useCompanyNames } from "../APIs/SuppportCompanyAPIs";
import defaultLogo from "../assets/photos/ma1.jpg"; // Your default logo path

const { companyList } = useCompanyNames();

// Default partners data when API fails
const defaultPartners = ref([
  { id: 1, logo: new URL('../assets/photos/ma1.jpg', import.meta.url).href, name: 'Partner 1' },
  { id: 2, logo: new URL('../assets/photos/ma2.jpg', import.meta.url).href, name: 'Partner 2' },
  { id: 3, logo: new URL('../assets/photos/ma3.jpg', import.meta.url).href, name: 'Partner 3' },
  { id: 4, logo: new URL('../assets/photos/ma4.jpg', import.meta.url).href, name: 'Partner 4' },
  { id: 5, logo: new URL('../assets/photos/ma5.jpg', import.meta.url).href, name: 'Partner 5' },
  { id: 6, logo: new URL('../assets/photos/ma6.jpg', import.meta.url).href, name: 'Partner 6' },
  { id: 7, logo: new URL('../assets/photos/ma7.jpg', import.meta.url).href, name: 'Partner 7' },
  { id: 8, logo: new URL('../assets/photos/ma8.jpg', import.meta.url).href, name: 'Partner 8' },
  { id: 9, logo: new URL('../assets/photos/ma9.jpg', import.meta.url).href, name: 'Partner 9' },
  { id: 10, logo: new URL('../assets/photos/ma10.jpg', import.meta.url).href, name: 'Partner 10' },
]);

// Use API data or fall back to default data
const slides = computed(() => 
  companyList.value.length > 0 ? companyList.value : defaultPartners.value
);

// Duplicate slides to create seamless loop
const duplicatedSlides = computed(() => [...slides.value, ...slides.value]);

// Calculate animation duration based on number of slides
const animationDuration = computed(() => slides.value.length * 2);

const handleImageError = (event) => {
  event.target.src = defaultLogo;
};
</script>

<style lang="scss" scoped>
.logos-container {
  overflow: hidden;
  padding: 1rem 0;
  background: white;
  position: relative;
  width: 100%;
  
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    width: 100px;
    height: 100%;
    z-index: 2;
  }
  
  &::before {
    left: 0;
    background: linear-gradient(to right, white, transparent);
  }
  
  &::after {
    right: 0;
    background: linear-gradient(to left, white, transparent);
  }
}

.logos-slide {
  display: flex;
  animation: slide var(--animation-duration) linear infinite;
  
  figure {
    flex-shrink: 0;
    width: 200px;
    margin-right: 20px;
    
    img {
      transition: transform 0.3s ease;
      
      &:hover {
        transform: scale(1.05);
      }
    }
  }
}

@keyframes slide {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

.contact-heading {
  color: #00adef;
}
</style>
