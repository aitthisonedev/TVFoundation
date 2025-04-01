<template>
  <div class="mb-3">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="mb-0 text-primary">{{ $t("tourist.title") }}</h4>
      <div v-if="selectedCategory" class="category-filter">
        <span class="badge bg-primary">{{ selectedCategory }}</span>
        <button class="btn btn-sm btn-link" @click="clearFilter">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <!-- Tourist List -->
    <div v-else class="row g-4">
      <div
        v-for="attraction in paginatedAttractions"
        :key="attraction.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
        @click="goToAttractionDetail(attraction.id)"
      >
        <div class="tour-card">
          <!-- Image Container -->
          <div class="image-container">
            <img
              :src="getFullImageUrl(attraction.image)"
              :alt="attraction.name"
              class="tour-image"
            />
          </div>

          <!-- Content Container -->
          <div class="content-container">
            <h5 class="tour-title text-primary" :title="attraction.name">
              {{ attraction.name.length > 50 ? attraction.name.substring(0, 50) + "..." : attraction.name }}
            </h5>

            <!-- Description -->
            <p class="tour-description">{{ attraction.description }}</p>

            <!-- Location -->
            <div class="location text-danger">
              <i class="bi bi-geo-alt"></i>
              <span>{{ attraction.location }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-4">
      <Pagination
        v-if="totalPages > 0"
        v-model="currentPage"
        :total-pages="totalPages"
        :current-page="currentPage"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAttractions } from '../../APIs/AttractionAPIs';
import Pagination from "../Common/Pagination.vue";

const router = useRouter();
const route = useRoute();
const apiUrl = import.meta.env.VITE_API_URL;

const currentPage = ref(1);
const itemsPerPage = ref(8);

// Get attractions from API
const { attractions, loading, error, refreshAttractions } = useAttractions();

// Helper function to construct full image URL
const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null;
  return `${apiUrl}/ImageUpload/${imagePath}`;
};

const selectedCategory = computed(() => route.query.category);

const filteredAttractions = computed(() => {
  if (!attractions.value) return [];
  if (selectedCategory.value) {
    return attractions.value.filter(item => item.category.name === selectedCategory.value);
  }
  return attractions.value;
});

const totalPages = computed(() => {
  return Math.ceil(filteredAttractions.value.length / itemsPerPage.value);
});

const paginatedAttractions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredAttractions.value.slice(start, end);
});

const clearFilter = () => {
  router.push({ query: {} });
  currentPage.value = 1;
};

const goToAttractionDetail = (attractionId) => {
  router.push({
    name: "TouristDetail",
    params: { id: attractionId },
  });
};

// Watch for category changes
watch(selectedCategory, () => {
  currentPage.value = 1;
});

// Watch currentPage changes
watch(currentPage, (newPage) => {
  // Scroll to top when page changes
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
</script>

<style scoped>
.tour-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tour-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.image-container {
  position: relative;
  padding-top: 66.67%; /* 3:2 aspect ratio */
  overflow: hidden;
}
.text-primary{
  color: #00adef !important;
}
.tour-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.tour-card:hover .tour-image {
  transform: scale(1.05);
}

.content-container {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.tour-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #2d3436;
  line-height: 1.4;
}

.tour-description {
  color: #6c757d;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
}

.view-details-btn {
  background: none;
  border: none;
  color: #ed207b;
  font-weight: 600;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
}
.text-danger{
  color: #ed207b !important;
}
.view-details-btn:hover {
  color: #ed207b;
}

.view-details-btn i {
  transition: transform 0.2s ease;
}

.view-details-btn:hover i {
  transform: translateX(4px);
}

.location {
  font-size: 0.875rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
}

.location i {
  color: #00adef;
}

.category-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-filter .btn-link {
  padding: 0;
  color: #6c757d;
}

.category-filter .btn-link:hover {
  color: #dc3545;
}
</style>
