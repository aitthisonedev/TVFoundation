<template>
  <div class="project-detail">
    <!-- Show loading state -->
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

    <!-- Show content only when project is loaded -->
    <template v-else-if="project">
      <!-- Hero Section -->
      <div 
        class="project-hero" 
        :style="{ 
          backgroundImage: project.coverImage ? 
            `linear-gradient(rgba(144, 143, 143, 0.5), rgba(177, 175, 175, 0.6)), url('${project.coverImage}')` : 
            'none'
        }"
      >
        <div class="hero-overlay">
          <div class="container">
            <h1>{{ project.title }}</h1>
            <div class="project-meta">
              <span 
                class="status" 
                :class="getStatusClass"
              >
                {{ adjustedStatus?.name }}
              </span>
              <span class="location">
                <i class="bi bi-geo-alt-fill"></i>
                {{ project.location }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Project Detail Section -->
      <div id="project-detail-section" class="container py-5">
        <div class="row">
          <!-- Left Column - Project Content -->
          <div class="col-lg-8">
            <div class="content-card">
              <h2 class="text-primary">{{ project.title }}</h2>

              <!-- First Two Images Only -->
              <div class="project-gallery mt-4" v-if="project.images?.length">
                <div class="image-grid">
                  <div
                    v-for="(image, index) in project.images.slice(0, 2)"
                    :key="index"
                    class="image-grid-item"
                    @click="openModal(index)"
                  >
                    <div class="image-card">
                      <img
                        :src="image"
                        :data-original-src="image"
                        :alt="`${project.title} - Image ${index + 1}`"
                        class="grid-image"
                        @error="handleImageError"
                        @load="handleImageLoad(index)"
                      />
                      <div class="image-overlay">
                        <p class="image-caption">{{ project.title }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <p class="project-description mt-4">{{ project.description }}</p>
              <!-- First Two-four Images Only -->
              <div class="project-gallery mt-4" v-if="project.images?.length">
                <div class="image-grid">
                  <div
                    v-for="(image, index) in project.images.slice(2, 4)"
                    :key="index"
                    class="image-grid-item"
                    @click="openModal(index)"
                  >
                    <div class="image-card">
                      <img
                        :src="image"
                        :data-original-src="image"
                        :alt="`${project.title} - Image ${index + 1}`"
                        class="grid-image"
                        @error="handleImageError"
                        @load="handleImageLoad(index)"
                      />
                      <div class="image-overlay">
                        <p class="image-caption">{{ project.title }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Main Content -->
              <div class="content mt-4" v-html="project.content"></div>
              <!-- First after two-four Images Only -->
              <div class="project-gallery mt-4" v-if="project.images?.length">
                <div class="image-grid">
                  <div
                    v-for="(image, index) in project.images.slice(4, index)"
                    :key="index"
                    class="image-grid-item"
                    @click="openModal(index)"
                  >
                    <div class="image-card">
                      <img
                        :src="image"
                        :data-original-src="image"
                        :alt="`${project.title} - Image ${index + 1}`"
                        class="grid-image"
                        @error="handleImageError"
                        @load="handleImageLoad(index)"
                      />
                      <div class="image-overlay">
                        <p class="image-caption">{{ project.title }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Right Column - Donation Stats -->
          <div class="col-lg-4">
            <div class="stats-card">
              <div class="progress-stats">
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
                <div class="amount-details">
                  <h3>{{ formatCurrency(project.currentAmount) }} LAK</h3>
                  <p>
                    {{ $t("projects.goal") }}:
                    {{ formatCurrency(project.targetAmount) }} LAK
                  </p>
                </div>
              </div>

              <div class="stat-items">
                <div class="stat-item">
                  <i class="bi bi-people-fill"></i>
                  <div class="stat-info">
                    <h4>{{ project.supporters }}</h4>
                    <p>{{ $t("projects.supporters") }}</p>
                  </div>
                </div>
                <div class="stat-item">
                  <i class="bi bi-calendar-event"></i>
                  <div class="stat-info">
                    <h4>{{ formatDaysLeft }}</h4>
                  </div>
                </div>
              </div>

              <button class="btn btn-danger w-100 mt-4" @click="navigateToSupport">
                {{ $t("projects.donateNow") }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Share Section -->
      <div class="container mb-5">
        <div class="content-card">
          <ShareSection
            :title="project.title"
            :description="project.description"
            :url="currentUrl"
            :image="shareImage"
          />
        </div>
      </div>

      <!-- Logo Partner -->
      <LogoPartner />

      <!-- Project Section  -->
      <div class="container mb-5">
        <ProjectSection :projects="relatedProjects" />
      </div>

      <!-- Image Modal -->
      <div class="image-modal" v-if="showModal" @click="closeModal">
        <div class="modal-content" @click.stop>
          <button class="close-button" @click="closeModal">
            <i class="bi bi-x-lg"></i>
          </button>
          <div class="modal-image-container">
            <button 
              class="nav-button prev" 
              @click="prevImage" 
              v-show="currentImageIndex > 0"
            >
              <i class="bi bi-chevron-left"></i>
            </button>
            
            <img 
              :src="modalImage" 
              :alt="project.title"
              class="modal-image"
              :class="{ 'zoomed': isZoomed }"
              @click="handleModalClick"
              @mousemove="handleModalMouseMove"
              @mouseleave="handleModalMouseLeave"
              :style="modalZoomStyle"
            />
            
            <button 
              class="nav-button next" 
              @click="nextImage"
              v-show="currentImageIndex < project.images.length - 1"
            >
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>

          <div class="modal-share-section">
            <ShareSection 
              :title="project.title"
              :description="project.description"
              :url="currentUrl"
              :image="modalImage"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- Show error state -->
    <div v-else class="loading-overlay">
      <div class="loading-dialog">
        <div class="d-flex flex-column align-items-center p-4 bg-white rounded-3 shadow">
          <i class="bi bi-exclamation-circle text-danger fs-1 mb-3"></i>
          <p class="mb-0 text-danger fw-semibold">{{ error || 'Project not found' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useProjects } from "../../APIs/ProjectsAPIs";
import LogoPartner from "../../views/PartnerLogo.vue";
import ProjectSection from "./ProjectSection.vue";
import ShareSection from '../Common/ShareSection.vue';
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

export default {
  name: "ProjectDetail",
  components: {
    LogoPartner,
    ProjectSection,
    ShareSection,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { getProjectById, formatCurrency, calculateProgress } = useProjects();
    const project = ref(null);
    const loading = ref(true);
    const showModal = ref(false);
    const currentImageIndex = ref(0);
    const modalZoom = ref(1);
    const modalPosition = ref({ x: 50, y: 50 });
    const isZoomed = ref(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const error = ref(null);
    const { locale, t } = useI18n();

    const modalImage = computed(() => {
      if (!project.value?.images?.length) return '';
      return `${apiUrl}/${project.value.images[currentImageIndex.value]}`;
    });

    const currentUrl = computed(() => window.location.href);

    const shareData = computed(() => {
      if (!project.value) return null;
      return {
        title: project.value.title,
        text: project.value.description,
        url: currentUrl.value,
        image: project.value.coverImage
      };
    });

    const fetchProjectData = async () => {
      if (route.params.id) {
        loading.value = true;
        error.value = null;
        try {
          const data = await getProjectById(parseInt(route.params.id));
          if (data) {
            project.value = data;
            console.log('Project loaded:', project.value);
          } else {
            error.value = 'Project not found';
          }
        } catch (err) {
          console.error('Error fetching project:', err);
          error.value = 'Error loading project';
        } finally {
          loading.value = false;
        }
      }
    };

    const setProjectBackground = (imageUrl) => {
      document.documentElement.style.setProperty(
        "--project-image",
        `url(${imageUrl})`
      );
    };

    const handleImageError = (e) => {
      console.error('Image load error in ProjectDetail:', {
        src: e.target.src,
        naturalWidth: e.target.naturalWidth,
        naturalHeight: e.target.naturalHeight,
        error: e.error,
        originalSrc: e.target.getAttribute('data-original-src')
      });
      e.target.src = '/images/default-project-image.jpg';
    };

    const handleImageLoad = (index) => {
      console.log('Image loaded successfully:', {
        index,
        src: project.value?.images[index],
        coverImage: project.value?.coverImage
      });
    };

    const getAdjustedStatus = (project) => {
      if (!project) return null;

      // If API status is Complete (2), always return Complete
      if (project.status?.id === 2) {
        return {
          id: 2,
          name: locale.value === 'en' ? 'Completed' : 'ສຳເລັດແລ້ວ'
        };
      }
      
      // Auto adjust status based on days left
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
      
      // Default to On Process
      return {
        id: 1,
        name: locale.value === 'en' ? 'On Process' : 'ກຳລັງດຳເນີນການ'
      };
    };

    const adjustedStatus = computed(() => {
      return getAdjustedStatus(project.value);
    });

    const formatDaysLeft = computed(() => {
      if (!project.value) return '';
      // If status is Complete, show Completed text
      if (adjustedStatus.value?.id === 2) {
        return locale.value === 'en' ? 'Completed' : 'ສຳເລັດແລ້ວ';
      }
      // Otherwise show days left
      return `${project.value.daysLeft} ${t('projects.daysLeft')}`;
    });

    const getStatusClass = computed(() => {
      const statusId = adjustedStatus.value?.id || 1;
      return {
        'on-process': statusId === 1,
        'completed': statusId === 2,
        'almost-finished': statusId === 3
      };
    });

    const navigateToSupport = () => {
      console.log('navigateToSupport method called');
      router.push({
        path: '/support',
        hash: '#payment-section'
      });
    };

    onMounted(() => {
      fetchProjectData();
    });

    watch(() => route.params.id, () => {
      fetchProjectData();
    });

    // Add debug logging
    watch(() => project.value, (newVal) => {
      if (newVal) {
        console.log('Project updated:', {
          id: newVal.id,
          coverImage: newVal.coverImage,
          images: newVal.images
        });
      }
    }, { deep: true });

    // Add debug logging for image paths
    watch(() => project.value, (newVal) => {
      if (newVal) {
        console.log('Project data:', {
          id: newVal.id,
          coverImage: newVal.coverImage,
          images: newVal.images
        });
      }
    }, { immediate: true });

    // Add more detailed watch
    watch(() => project.value, (newVal) => {
      if (newVal) {
        console.log('Project data updated:', {
          id: newVal.id,
          coverImage: newVal.coverImage,
          images: newVal.images,
          apiUrl: apiUrl
        });
      }
    }, { immediate: true });

    return {
      project,
      loading,
      showModal,
      currentImageIndex,
      modalZoom,
      modalPosition,
      isZoomed,
      modalImage,
      currentUrl,
      shareData,
      formatCurrency,
      calculateProgress,
      setProjectBackground,
      apiUrl,
      handleImageError,
      handleImageLoad,
      error,
      adjustedStatus,
      formatDaysLeft,
      locale,
      getStatusClass,
      navigateToSupport
    };
  }
};
</script>

<style scoped>
.project-hero {
  background-image: linear-gradient(
      rgba(144, 143, 143, 0.5),
      rgba(177, 175, 175, 0.6)
    ),
    var(--project-image, url("project.coverImage"));
  background-size: cover;
  background-position: center;
  padding: 100px 0;
  color: white;
}
.text-primary{
  color: #00adef !important;
}
.hero-overlay {
  padding: 2rem 0;
}

.project-meta {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.status {
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  color: white;
}

.status.on-process {
  background-color: #00adef;
}

.status.completed {
  background-color: #28a745;
}

.status.almost-finished {
  background-color: #ed207b;
}

.content-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stats-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 6rem;
}

.progress {
  height: 8px;
  margin-bottom: 1rem;
}

.amount-details h3 {
  color: #d32b2b;
  margin-bottom: 0.5rem;
}

.amount-details p {
  color: #6c757d;
  margin: 0;
}

.stat-items {
  margin-top: 2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat-item i {
  font-size: 1.5rem;
  color: #2d76bb;
}

.stat-info h4 {
  margin: 0;
  color: #2d76bb;
}

.stat-info p {
  margin: 0;
  color: #6c757d;
  font-size: 0.875rem;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.image-grid-item {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.image-grid-item:hover {
  transform: scale(1.02);
}

.image-card {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.grid-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  padding: 1rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.image-card:hover .image-overlay {
  transform: translateY(0);
}

.image-card:hover .grid-image {
  transform: scale(1.05);
}

.image-caption {
  color: white;
  margin: 0;
  font-size: 0.9rem;
  text-align: center;
}

.content {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #444;
}

.widget-title {
  position: relative;
  padding-bottom: 15px;
}

.widget-title::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 50px;
  height: 3px;
  background: #2d76bb;
}

@media (max-width: 768px) {
  .image-grid {
    grid-template-columns: 1fr;
  }

  .image-card {
    height: 200px;
  }
}

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  width: 90%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-image-container {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-image {
  max-width: 100%;
  max-height: calc(90vh - 150px);
  object-fit: contain;
  transition: transform 0.3s ease;
  cursor: zoom-in;
}

.modal-image.zoomed {
  cursor: zoom-out;
}

.close-button {
  position: absolute;
  top: -50px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;
  padding: 10px;
}

.close-button:hover {
  color: #f8f9fa;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 45px;
  height: 45px;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 1002;
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-50%) scale(1.1);
}

.nav-button.prev {
  left: -80px;
}

.nav-button.next {
  right: -80px;
}

.nav-button i {
  font-size: 1.2rem;
}

.modal-share-section {
  position: relative;
  width: 100%;
  margin-top: 2rem;
  background: transparent;
  padding: 0 1rem;
}

.modal-share-section :deep(.share-section) {
  margin-top: 0;
}

.modal-share-section :deep(.widget-title) {
  color: white;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  text-align: center;
}

.modal-share-section :deep(.social-share) {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.modal-share-section :deep(.btn) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1.25rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.modal-share-section :deep(.btn:hover) {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.modal-share-section :deep(.btn i) {
  font-size: 1.1rem;
}

/* Add responsive styles */
@media (max-width: 1200px) {
  .nav-button.prev { left: 20px; }
  .nav-button.next { right: 20px; }
}

@media (max-width: 768px) {
  .modal-image {
    max-height: calc(80vh - 150px);
  }
  
  .modal-share-section {
    margin-top: 1rem;
  }

  .nav-button {
    width: 40px;
    height: 40px;
  }
}

/* Add loading spinner styles */
.spinner-border {
  width: 3rem;
  height: 3rem;
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
