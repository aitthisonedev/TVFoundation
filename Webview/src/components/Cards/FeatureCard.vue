<template>
  <div class="feature-card h-100">
    <div class="feature-card-inner">
      <div class="feature-icon-container">
        <div class="feature-icon-circle" :style="{ backgroundColor: iconColor }">
          <i :class="icon" class="feature-icon"></i>
        </div>
      </div>
      <div class="feature-content">
        <h3 class="feature-title">{{ title }}</h3>
        <p class="feature-description">{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FeatureCard',
  props: {
    icon: {
      type: String,
      required: true,
      default: 'fas fa-star'
    },
    iconColor: {
      type: String,
      default: '#ed207b'
    },
    title: {
      type: String,
      required: true,
      default: 'Title'
    },
    description: {
      type: String,
      required: true,
      default: 'Description'
    }
  },
  mounted() {
    console.log('FeatureCard mounted with props:', {
      icon: this.icon,
      iconColor: this.iconColor,
      title: this.title,
      description: this.description
    });
  }
}
</script>

<style scoped>
.feature-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.feature-card-inner {
  padding: 2rem;
  text-align: center;
}

.feature-icon-container {
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
}

.feature-icon-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.feature-icon {
  font-size: 2rem;
  color: white;
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon-circle {
  transform: scale(1.1) rotate(5deg);
}

.feature-title {
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
}

.feature-description {
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 0;
}

.feature-card:hover .feature-title {
  color: #ed207b;
}

@media (max-width: 768px) {
  .feature-card-inner {
    padding: 1.5rem;
  }
  
  .feature-icon-circle {
    width: 60px;
    height: 60px;
  }
  
  .feature-icon {
    font-size: 1.5rem;
  }
  
  .feature-title {
    font-size: 1.25rem;
  }
}
</style> 