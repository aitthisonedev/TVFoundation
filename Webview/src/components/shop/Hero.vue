<template>
    <div>
      <div class="row g-2 mt-4">
        <!-- Main Slide -->
        <div class="col-lg-8 ">
          <div class="main-slide rounded overflow-hidden ">
            <img 
              :src="currentImage" 
              :alt="currentImageAlt" 
              class="w-100 object-fit-cover main-image"
            >
          </div>
        </div>
        
        <!-- Right Side Images -->
        <div class="col-lg-4">
          <div class="d-flex flex-lg-column flex-row gap-2 h-100">
            <div class="right-image rounded overflow-hidden flex-grow-1">
              <img 
                :src="rightImage1.image || defaultRightImage1" 
                :alt="rightImage1.name || 'First right image'" 
                class="w-100 object-fit-cover side-image"
              >
            </div>
            <div class="right-image rounded overflow-hidden flex-grow-1">
              <img 
                :src="rightImage2.image || defaultRightImage2" 
                :alt="rightImage2.name || 'Second right image'" 
                class="w-100 object-fit-cover side-image"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useProductSlides, useProductAds } from '../../APIs/ProductsAPIs';

// Import default images as fallback
import defaultMainImage from '../../assets/shop/1.jpeg';
import defaultMainImage2 from '../../assets/shop/2.jpeg';
import defaultMainImage3 from '../../assets/shop/3.jpeg';
import defaultRightImage1 from '../../assets/shop/11.jpeg';
import defaultRightImage2 from '../../assets/shop/22.jpeg';

// Get API URL from environment
const apiUrl = import.meta.env.VITE_API_URL;

// Get data from APIs
const { slides, loading: slidesLoading } = useProductSlides();
const { ads, loading: adsLoading } = useProductAds();

// Default images array
const defaultMainImages = [defaultMainImage, defaultMainImage2, defaultMainImage3];

const currentImageIndex = ref(0);

// Helper function to construct full image URL
const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${apiUrl}/ImageUpload/${imagePath}`;
};

// Computed property for slides images
const slideImages = computed(() => {
  if (slides.value && slides.value.length > 0) {
    return slides.value.map(slide => ({
      src: getFullImageUrl(slide.image),
      alt: slide.name
    }));
  }
  return defaultMainImages.map(img => ({
    src: img,
    alt: 'Default slide image'
  }));
});

// Computed properties for current image and its alt text
const currentImage = computed(() => {
  const images = slideImages.value;
  return images[currentImageIndex.value]?.src;
});

const currentImageAlt = computed(() => {
  const images = slideImages.value;
  return images[currentImageIndex.value]?.alt;
});

// Computed properties for ads images
const rightImage1 = computed(() => {
  if (ads.value && ads.value[0]) {
    return {
      image: getFullImageUrl(ads.value[0].image),
      name: ads.value[0].name
    };
  }
  return { image: defaultRightImage1, name: 'Default ad image 1' };
});

const rightImage2 = computed(() => {
  if (ads.value && ads.value[1]) {
    return {
      image: getFullImageUrl(ads.value[1].image),
      name: ads.value[1].name
    };
  }
  return { image: defaultRightImage2, name: 'Default ad image 2' };
});

// Function to move to next image
const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % slideImages.value.length;
};

let intervalId = null;

// Start autoplay on component mount
onMounted(() => {
  intervalId = setInterval(nextImage, 3000); // Change image every 3 seconds
});

// Clean up interval when component unmounts
onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<style lang="scss" scoped>
.main-slide {
  height: 300px; // Reduced from 400px
  
  .main-image {
    height: 100%;
  }
}

.right-image {
  height: 145px; // Reduced from 150px
  
  .side-image {
    height: 100%;
  }
}

// Make images responsive on smaller screens
@media (max-width: 991px) { // Bootstrap lg breakpoint
  .main-slide {
    height: 250px; // Reduced from 300px
  }
  
  .right-image {
    height: 120px; // Reduced from 150px
  }
}

@media (max-width: 576px) { // Bootstrap sm breakpoint
  .main-slide {
    height: 200px; // Reduced from 250px
  }
  
  .right-image {
    height: 100px; // Reduced from 125px
  }
}
</style>
