<template>
  <div class="projects-container mb-5 mt-3">
    <!-- Loading state -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-dialog">
        <div class="d-flex flex-column align-items-center p-4 bg-white rounded-3 shadow">
          <div class="spinner-border text-primary mb-3" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mb-0 text-primary fw-semibold">Loading...</p>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="loading-overlay">
      <div class="loading-dialog">
        <div class="d-flex flex-column align-items-center p-4 bg-white rounded-3 shadow">
          <i class="bi bi-exclamation-circle text-danger fs-1 mb-3"></i>
          <p class="mb-0 text-danger fw-semibold">{{ error }}</p>
        </div>
      </div>
    </div>

    <template v-else>
      <!-- Hero Section with Slideshow -->
      <div class="hero-section mb-5">
        <div class="hero-slideshow">
          <transition-group name="fade">
            <div 
              v-for="(slide, index) in displaySlides" 
              :key="slide.id"
              v-show="currentSlide === index"
              class="hero-slide"
              :style="{ backgroundImage: `url(${slide.image})` }"
            >
              <div class="hero-overlay">
                <div class="container">
                  <h1 class="text-white">{{ slide.title }}</h1>
                  <p class="text-white lead">{{ slide.description }}</p>
                </div>
              </div>
            </div>
          </transition-group>
        </div>
      </div>

      <!-- Projects Grid -->
      <div class="container">
        <div class="row g-4">
          <div v-for="project in paginatedProjects" :key="project.id" class="col-md-6 col-lg-4">
            <div class="project-card shadow-sm" @click="goToProjectDetail(project.id)">
              <div class="project-image">
                <img 
                  :src="project.coverImage" 
                  :alt="project.title"
                  @error="handleImageError"
                />
                <div 
                  class="project-status" 
                  :class="getStatusClass(project.status)"
                >
                  {{ project.status?.name || 'On Process' }}
                </div>
              </div>
              <div class="project-info p-4">
                <h3>{{ truncateText(project.title, 30) }}</h3>
                <p class="project-description">{{ truncateText(project.description, 50) }}</p>
                <div class="project-meta">
                  <div class="progress-wrapper">
                    <div class="progress">
                      <div 
                        class="progress-bar bg-danger" 
                        :style="{ width: `${(project.currentAmount / project.targetAmount) * 100}%` }"
                      ></div>
                    </div>
                    <div class="amount-info">
                      <div class="raised">
                        <span class="amount">{{ formatCurrency(project.currentAmount) }}</span>
                        <span class="currency">LAK</span>
                      </div>
                      <div class="target">
                        <span>{{ $t('projects.goal') }}:</span>
                        <span class="amount">{{ formatCurrency(project.targetAmount) }}</span>
                        <span class="currency">LAK</span>
                      </div>
                    </div>
                  </div>
                  <div class="project-stats">
                    <div class="stat">
                      <i class="bi bi-people-fill"></i>
                      <span>{{ project.supporters }} {{ $t('projects.supporters') }}</span>
                    </div>
                    <div class="stat">
                      <i class="bi bi-calendar-event"></i>
                      <span>{{ formatDaysLeft(project) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Add Pagination -->
        <div class="mt-4">
          <Pagination
            v-if="totalPages > 0"
            v-model="currentPage"
            :total-pages="totalPages"
            :current-page="currentPage"
          />
        </div>
      </div>
      <LogoPartner />
    </template>
  </div>
</template>

<script>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useProjects } from "../APIs/ProjectsAPIs";
import { useSlider } from "../APIs/SlideProjectAPI";
import Pagination from "../components/Common/Pagination.vue";
import { heroSlides } from "../data/projects.js";
import LogoPartner from "../views/PartnerLogo.vue";
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

export default {
  name: 'Projects',
  components: {
    Pagination,
    LogoPartner
  },
  setup() {
    const { locale, t } = useI18n();
    const router = useRouter();
    const { 
      projects, 
      loading, 
      error,
      formatCurrency,
      calculateProgress 
    } = useProjects();

    const currentSlide = ref(0);
    const currentPage = ref(1);
    const itemsPerPage = ref(6);
    const slideshowInterval = ref(null);

    const { sliderList } = useSlider();
    
    const displaySlides = computed(() => {
      if (sliderList.value?.length > 0) {
        return sliderList.value.map(slide => ({
          id: slide.id,
          image: slide.src || slide.image,
          title: slide.title,
          description: slide.description
        }));
      }
      return heroSlides;
    });

    const getAdjustedStatus = (project) => {
      if (project.status?.id === 2) {
        return {
          id: 2,
          name: project.status.name
        };
      }
      
      if (project.daysLeft <= 0) {
        return {
          id: 2,
          name: locale.value === 'en' ? 'Completed' : 'ສຳເລັດແລ້ວ'
        };
      }
      
      if (project.daysLeft <= 25) {
        return {
          id: 3,
          name: locale.value === 'en' ? 'Almost Finished' : 'ໃກ້ຈະສຳເລັດ'
        };
      }
      
      return project.status || {
        id: 1,
        name: locale.value === 'en' ? 'On Process' : 'ກຳລັງດຳເນີນການ'
      };
    };

    const paginatedProjects = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return projects.value
        .map(project => ({
          ...project,
          status: getAdjustedStatus(project)
        }))
        .slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.max(1, Math.ceil(projects.value.length / itemsPerPage.value));
    });

    const startSlideshow = () => {
      slideshowInterval.value = setInterval(() => {
        const maxSlides = displaySlides.value?.length || 0;
        if (maxSlides > 0) {
          currentSlide.value = (currentSlide.value + 1) % maxSlides;
        }
      }, 5000);
    };

    const stopSlideshow = () => {
      if (slideshowInterval.value) {
        clearInterval(slideshowInterval.value);
      }
    };

    const truncateText = (text, limit) => {
      if (!text) return '';
      if (text.length > limit) {
        return text.substring(0, limit) + '...';
      }
      return text;
    };

    const goToProjectDetail = (projectId) => {
      router.push({
        name: 'ProjectDetail',
        params: { id: projectId.toString() }
      });
    };

    const apiUrl = import.meta.env.VITE_API_URL;
    
    const formatDaysLeft = (project) => {
      if (project.status?.id === 2) {
        return locale.value === 'en' ? 'Completed' : 'ສຳເລັດແລ້ວ';
      }
      return `${project.daysLeft} ${t('projects.daysLeft')}`;
    };

    const getStatusClass = (status) => {
      const statusId = status?.id || 1;
      return {
        'on-process': statusId === 1,
        'completed': statusId === 2,
        'almost-finished': statusId === 3
      };
    };

    const handleImageError = (e) => {
      e.target.src = '/images/default-project-image.jpg';
    };

    onMounted(() => {
      startSlideshow();
    });

    onUnmounted(() => {
      stopSlideshow();
    });

    return {
      currentSlide,
      currentPage,
      displaySlides,
      paginatedProjects,
      totalPages,
      loading,
      error,
      formatCurrency,
      calculateProgress,
      truncateText,
      goToProjectDetail,
      apiUrl,
      getStatusClass,
      handleImageError,
      formatDaysLeft,
      locale,
    };
  }
};
</script>

<style scoped>
.hero-section {
  position: relative;
  height: 500px;
  overflow: hidden;
}

.hero-slideshow {
  position: relative;
  height: 100%;
}

.hero-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.hero-overlay {
  position: relative;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

/* Text animations */
.hero-overlay h1 {
  animation: slideInUp 1s ease;
}

.hero-overlay p {
  animation: slideInUp 1s ease 0.3s;
  animation-fill-mode: both;
}

@keyframes slideInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-section {
    height: 400px;
  }

  .hero-overlay h1 {
    font-size: 2rem;
  }

  .hero-overlay p {
    font-size: 1rem;
  }
}

.project-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.project-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  color: white;
  background: #00adef;
}

.project-status.on-process {
  background-color: #00adef;
}

.project-status.completed {
  background-color: #28a745;
}

.project-status.almost-finished {
  background-color: #ed207b;
}

.bg-danger{
  background-color: #ed207b !important;
}
.text-danger{
  color: #ed207b !important;
}
.project-info h3 {
  color: #00adef;
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

.project-description {
  color: #6c757d;
  font-size: 0.95rem;
  margin-bottom: 1.25rem;
}

.progress-wrapper {
  margin-bottom: 1rem;
}

.progress {
  height: 8px;
  margin-bottom: 0.5rem;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  transition: width 0.6s ease;
}

.amount-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.raised, .target {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;
  font-size: 0.875rem;
}

.raised {
  color: #ed207b;
  font-weight: 600;
}

.target {
  color: #6c757d;
}

.amount {
  font-weight: 600;
}

.currency {
  font-size: 0.75rem;
  opacity: 0.8;
}

@media (max-width: 576px) {
  .amount-info {
    font-size: 0.8rem;
  }
  
  .currency {
    font-size: 0.7rem;
  }
}

.project-stats {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6c757d;
  font-size: 0.875rem;
}

.stat i {
  color: #00adef;
}

/* Loading Dialog Styles */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-dialog {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

/* Bootstrap Color Overrides */
.text-primary {
  color: #00adef !important;
}

.text-danger {
  color: #ed207b !important;
}
</style>