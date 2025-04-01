<template>
  <div class="mt-4">
    <div class="container">
      <h2 class="section-title text-primary text-start mb-4">
        {{ $t("ads.assistanceProjects") }}
      </h2>

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

      <!-- Projects list -->
      <div v-else class="project-cards-scroll" ref="scrollContainer">
        <div class="project-cards-wrapper">
          <div
            v-for="project in filteredProjects"
            :key="project.id"
            class="project-card shadow-sm"
            @click="goToProjectDetail(project.id)"
            style="cursor: pointer"
          >
            <div class="project-image">
              <img 
                :src="project.coverImage" 
                :data-original-src="project.coverImage"
                :alt="project.title"
                @error="handleImageError"
                @load="handleImageLoad"
              />
              <div
                class="project-status"
                :class="getStatusClass(project.status)"
              >
                {{ project.status?.name || 'On Process' }}
              </div>
            </div>
            <div class="project-info p-4">
              <h3 @click.stop="goToProjectDetail(project.id)" style="cursor: pointer;">
                {{ truncateText(project.title, 50) }}
              </h3>
              <div class="project-meta">
                <div class="progress-wrapper">
                  <div class="progress">
                    <div
                      class="progress-bar bg-danger"
                      :style="{
                        width: `${
                          (project.currentAmount / project.targetAmount) * 100
                        }%`,
                      }"
                    ></div>
                  </div>
                  <div class="amount-info">
                    <div class="raised">
                      <span class="amount">{{
                        formatCurrency(project.currentAmount)
                      }}</span>
                      <span class="currency">LAK</span>
                    </div>
                    <div class="target">
                      <span>{{ $t("projects.goal") }}:</span>
                      <span class="amount">{{
                        formatCurrency(project.targetAmount)
                      }}</span>
                      <span class="currency">LAK</span>
                    </div>
                  </div>
                </div>
                <div class="project-stats">
                  <div class="stat">
                    <i class="bi bi-people-fill"></i>
                    <span>{{ project.supporters }} {{ $t("projects.supporters") }}</span>
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
      <!-- Navigation buttons -->
      <div v-if="showNavigation" class="scroll-navigation">
        <button class="nav-btn prev" @click="scroll('left')" :disabled="atStart">
          <i class="bi bi-chevron-left"></i>
        </button>
        <button class="nav-btn next" @click="scroll('right')" :disabled="atEnd">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useProjects } from "../../APIs/ProjectsAPIs";
import { computed, ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

export default {
  name: 'ProjectSection',
  setup() {
    const { locale, t } = useI18n();
    const { 
      projects, 
      loading, 
      error, 
      fetchProjects, 
      formatCurrency, 
      calculateProgress 
    } = useProjects();
    const apiUrl = import.meta.env.VITE_API_URL;
    const router = useRouter();
    const scrollContainer = ref(null);
    const atStart = ref(true);
    const atEnd = ref(false);

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

    const filteredProjects = computed(() => {
      return projects.value
        .map(project => ({
          ...project,
          status: getAdjustedStatus(project)
        }))
        .filter(project => project.status?.id !== 2);
    });

    const formatDaysLeft = (project) => {
      if (project.status?.id === 2) {
        return locale.value === 'en' ? 'Completed' : 'ສຳເລັດແລ້ວ';
      }
      return `${project.daysLeft} ${t('projects.daysLeft')}`;
    };

    const showNavigation = computed(() => {
      if (!scrollContainer.value) return false;
      return scrollContainer.value.scrollWidth > scrollContainer.value.clientWidth;
    });

    const scroll = (direction) => {
      if (!scrollContainer.value) return;
      const scrollAmount = scrollContainer.value.clientWidth * 0.8;
      const newScrollLeft = direction === 'left' 
        ? scrollContainer.value.scrollLeft - scrollAmount
        : scrollContainer.value.scrollLeft + scrollAmount;
      
      scrollContainer.value.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    };

    const updateScrollButtons = () => {
      if (!scrollContainer.value) return;
      atStart.value = scrollContainer.value.scrollLeft <= 0;
      atEnd.value = 
        scrollContainer.value.scrollLeft + scrollContainer.value.clientWidth >= 
        scrollContainer.value.scrollWidth;
    };

    const goToProjectDetail = (id) => {
      router.push(`/projects/${id}`);
    };

    onMounted(async () => {
      await fetchProjects();
      if (scrollContainer.value) {
        scrollContainer.value.addEventListener('scroll', updateScrollButtons);
        updateScrollButtons();
      }
    });

    const truncateText = (text, limit) => {
      if (!text) return '';
      if (text.length > limit) {
        return text.substring(0, limit) + '...';
      }
      return text;
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
      console.error('Image load error in ProjectSection:', {
        src: e.target.src,
        originalSrc: e.target.getAttribute('data-original-src'),
        naturalWidth: e.target.naturalWidth,
        naturalHeight: e.target.naturalHeight,
        error: e.error,
        status: e.target.status,
        complete: e.target.complete
      });
      e.target.src = '/images/default-project-image.jpg';
    };

    const handleImageLoad = (e) => {
      console.log('Image loaded successfully in ProjectSection:', {
        src: e.target.src
      });
    };

    return {
      filteredProjects,
      formatCurrency,
      calculateProgress,
      truncateText,
      apiUrl,
      getStatusClass,
      handleImageError,
      handleImageLoad,
      scrollContainer,
      showNavigation,
      atStart,
      atEnd,
      scroll,
      goToProjectDetail,
      loading,
      error,
      formatDaysLeft,
      locale,
    };
  }
};
</script>

<style scoped>
.project-cards-scroll {
  position: relative;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.project-cards-scroll::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.project-cards-wrapper {
  display: flex;
  gap: 1.5rem;
  padding: 0.5rem;
}
.text-primary{
  color: #00adef !important;
}
.project-card {
  flex: 0 0 calc(33.333% - 1rem);
  min-width: calc(33.333% - 1rem);
  max-width: calc(33.333% - 1rem);
  background: white;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}
.text-danger{
  color: #ed207b !important;
}
.btn-danger{
  background-color: #ed207b !important;
}
.bg-danger{
  background-color: #ed207b !important;
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
}

.project-status.on-process {
  background-color: #00adef;  /* Blue for On Process */
}

.project-status.completed {
  background-color: #28a745;  /* Green for Completed */
}

.project-status.almost-finished {
  background-color: #ed207b;  /* Pink for Almost Finished */
}

.project-info h3 {
  color: #00adef;
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
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

.raised,
.target {
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

@media (max-width: 992px) {
  .project-card {
    flex: 0 0 calc(50% - 1rem);
    min-width: calc(50% - 1rem);
    max-width: calc(50% - 1rem);
  }
}

@media (max-width: 576px) {
  .project-card {
    flex: 0 0 calc(100% - 1rem);
    min-width: calc(100% - 1rem);
    max-width: calc(100% - 1rem);
  }
}

.scroll-navigation {
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  pointer-events: none;
  padding: 0 1rem;
}

.nav-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.3s ease;
}

.nav-btn:hover:not(:disabled) {
  background: #00adef;
  color: white;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-btn i {
  font-size: 1.25rem;
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
</style> 