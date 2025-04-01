<template>
  <section class="features-section py-5">
    <div class="container">
      <h2 class="text-center text-primary mb-5 slide-from-top visible">{{ $t("home.whatWeDo") }}</h2>
      <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-else-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>
      <div v-else class="row g-4">
        <div
          class="col-md-4 slide-from-bottom visible"
          v-for="(feature, index) in features"
          :key="feature.id"
          :style="{ transitionDelay: index * 0.2 + 's' }"
        >
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body text-center p-4">
              <div class="feature-icon-wrapper mb-3">
                <img 
                  v-if="feature.icon && !feature.icon.includes('fa-')" 
                  :src="feature.icon" 
                  :alt="feature.title"
                  class="feature-image"
                  @error="handleImageError($event, index)"
                  @load="handleImageLoad($event)"
                >
                <i v-else :class="feature.icon" class="fs-1 text-white"></i>
              </div>
              <h3 class="feature-title">{{ feature.title }}</h3>
              <p class="feature-description">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useContentThree } from '../../APIs/ContentThreeAPIs'

export default {
  name: 'FeaturesSection',
  setup() {
    const { features, loading, error } = useContentThree()
    
    return {
      features,
      loading,
      error
    }
  },
  data() {
    return {
      defaultIcons: []  // We'll get these from the API
    }
  },
  methods: {
    handleImageError(event, index) {
      console.error('Image failed to load:', event.target.src);
      event.target.style.display = 'none';
      const iconElement = document.createElement('i');
      // Use the default icon from the API or fallback to a generic icon
      iconElement.className = `fas fa-${['hand-holding-heart', 'hands-helping', 'globe-asia'][index % 3]} fs-1 text-white`;
      event.target.parentNode.appendChild(iconElement);
    },
    handleImageLoad(event) {
      console.log('Image loaded successfully:', event.target.src);
    }
  }
}
</script>

<style scoped>
.feature-icon-wrapper {
  width: 80px;
  height: 80px;
  background: #ed207b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
}

.feature-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 5px;
  background: white;
}

.feature-icon-wrapper i {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.feature-title {
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.feature-description {
  color: #666;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 0;
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: transparent;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.text-primary {
  color: #00adef !important;
}

.slide-from-top {
  opacity: 0;
  transform: translateY(-50px);
  transition: all 0.8s ease-out;
}

.slide-from-bottom {
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s ease-out;
}

.slide-from-top.visible,
.slide-from-bottom.visible {
  opacity: 1;
  transform: translate(0);
}

[style*="transition-delay"] {
  transition-property: all;
  transition-duration: 0.8s;
  transition-timing-function: ease-out;
}
</style> 