<template>
    <div>
      <div class="row g-2 mt-4">
        <!-- Main Slide -->
        <div class="col-lg-12 ">
          <div class="main-slide rounded overflow-hidden ">
            <img 
              :src="currentImage" 
              :alt="currentImageAlt" 
              class="w-100 object-fit-cover main-image"
            >
          </div>
        </div>
        
        <!-- Right Side Images -->
        <div class="d-flex">
          <div class="d-flex gap-2 w-100">
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
import { useAttractionSlides, useAttractionAds } from '../../APIs/AttractionAPIs';

// Import default images as fallback
const defaultMainImages = [
  'https://laotiantimes.com/wp-content/uploads/2023/02/Vang-Vieng-Laos-.jpg',
  'https://i.natgeofe.com/n/76197d9a-5c93-41c2-b95e-66d06ffa5928/laos-travel.jpg',
  'https://www.secret-retreats.com/blog/wp-content/uploads/2021/06/young-woman-walking-wooden-path-with-green-rice-field-vang-vieng-laos-scaled.jpg'
];

const defaultRightImage1 = 'https://kampatour.com/pic/news/7df9b3d4-91e7-4db7-8b11-b68520a95854.jpg';
const defaultRightImage2 = 'https://res.cloudinary.com/rainforest-cruises/images/c_fill,g_auto/f_auto,q_auto/v1620075386/Best-Places-To-Visit-Laos-Kuang-Si-Waterfall/Best-Places-To-Visit-Laos-Kuang-Si-Waterfall.jpg';

// Get data from APIs
const { slides, loading: slidesLoading } = useAttractionSlides();
const { ads, loading: adsLoading } = useAttractionAds();

const currentImageIndex = ref(0);

// Helper function to construct full image URL
const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null;
  const apiUrl = import.meta.env.VITE_API_URL;
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
.main-slide, .right-image {
  overflow: hidden;
  
  img {
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.1);
    }
  }
}

.main-slide {
  height: 400px;
  
  .main-image {
    height: 100%;
  }
}

.right-image {
  height: 200px;
  
  .side-image {
    height: 100%;
  }
}

@media (max-width: 991px) {
  .main-slide {
    height: 300px;
  }
  
  .right-image {
    height: 150px;
  }
}

@media (max-width: 576px) {
  .main-slide {
    height: 250px;
  }
  
  .right-image {
    height: 125px;
  }
}
</style>
