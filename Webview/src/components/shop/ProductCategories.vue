<template>
  <div class="categories-section py-5">
    <div class="container position-relative">
      <h4 class="mb-4 text-start text-primary">{{ $t("newsCardDetail.sidebar.categories") }}</h4>
      
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-3">
        <div class="spinner-border spinner-border-sm text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted small">Loading categories...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger py-2" role="alert">
        <small>{{ error }}</small>
        <button class="btn btn-link btn-sm" @click="refreshCategories">Try Again</button>
      </div>

      <!-- Categories Display -->
      <div v-else class="row row-cols-2 row-cols-md-4 row-cols-xl-5 g-3">
        <div
          v-for="category in visibleCategories"
          :key="category.id"
          class="col"
        >
          <div
            class="category-card text-center shadow-sm p-0 m-0"
            @click="selectCategory(category.name)"
            style="cursor: pointer"
          >
            <div class="category-icon">
              <img
                :src="`${apiUrl}/ImageUpload/${category.image}`"
                :alt="category.name"
                class="img-fluid rounded"
              />
            </div>
            <h3 class="category-name py-2">{{ category.name }}</h3>
          </div>
        </div>
      </div>

      <!-- Navigation buttons -->
      <button
        v-show="currentIndex > 0"
        class="nav-button prev-button"
        @click="showPreviousCategories"
      >
        <i class="fas text-red fa-chevron-left"></i>
      </button>

      <button
        v-if="categories.length > itemsPerPage"
        class="nav-button next-button"
        @click="showNextCategories"
        :disabled="currentIndex + itemsPerPage >= categories.length"
      >
        <i class="fas text-red fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from 'vue-router';
import { useProductCategories } from '../../APIs/ProductsAPIs';
// Fallback data in case API fails
import { categories as fallbackCategories } from '../../data/products';

const router = useRouter();
const route = useRoute();
const apiUrl = import.meta.env.VITE_API_URL;

// Use the API composable
const { categories: apiCategories, loading, error, refreshCategories } = useProductCategories();

const currentIndex = ref(0);
const itemsPerPage = ref(5);

// Compute categories with fallback
const categories = computed(() => {
  return apiCategories.value.length > 0 ? apiCategories.value : fallbackCategories;
});

// Update visible categories computation
const visibleCategories = computed(() => {
  return categories.value.slice(
    currentIndex.value,
    currentIndex.value + itemsPerPage.value
  );
});

// Add window resize handler
const updateItemsPerPage = () => {
  if (window.innerWidth < 768) {
    itemsPerPage.value = 2;
  } else if (window.innerWidth < 1200) {
    itemsPerPage.value = 4;
  } else {
    itemsPerPage.value = 5;
  }
};

const showPreviousCategories = () => {
  if (currentIndex.value > 0) {
    currentIndex.value -= itemsPerPage.value;
  }
};

const showNextCategories = () => {
  if (currentIndex.value + itemsPerPage.value < categories.value.length) {
    currentIndex.value += itemsPerPage.value;
  }
};

const selectCategory = async (categoryName) => {
  try {
    console.log('Selected category:', categoryName);
    await router.push({
      path: '/shop',
      query: { category: categoryName }
    });
  } catch (error) {
    console.error('Navigation error:', error);
  }
};

// Lifecycle hooks
onMounted(() => {
  updateItemsPerPage();
  window.addEventListener("resize", updateItemsPerPage);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateItemsPerPage);
});
</script>

<style scoped>
.category-card {
  padding: 1rem;
  background-color: #fff;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.text-red {
  color: #ed207b;
}
.text-primary{
  color: #00adef !important;
}
.category-icon {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.category-icon img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}

.category-name {
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 1;
}

.prev-button {
  left: -20px;
}

.next-button {
  right: -20px;
}

.nav-button:hover {
  background-color: #f8f9fa;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Improve transition smoothness */
.row {
  transition: all 0.3s ease;
}
</style>
