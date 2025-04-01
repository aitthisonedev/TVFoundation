<template>
  <div class="categories-section py-5">
    <div class="container position-relative">
      <h4 class="mb-4 text-start text-primary">{{ $t("sidebar.categories") }}</h4>
      
      <div class="row row-cols-2 row-cols-md-4 row-cols-xl-5 g-3">
        <div v-for="category in visibleCategories" :key="category.id" class="col">
          <div 
            class="category-card text-center shadow-sm p-0 m-0"
            @click="selectCategory(category.name)"
            :class="{ active: selectedCategory === category.name }"
          >
            <div class="category-icon">
              <img 
                :src="getFullImageUrl(category.image)" 
                :alt="category.name" 
                class="img-fluid rounded"
              >
            </div>
            <h3 class="category-name py-2">{{ category.name }}</h3>
          </div>
        </div>
      </div>

      <!-- Navigation buttons -->
      <button 
        v-if="showPrevButton"
        class="nav-button prev-button" 
        @click="showPreviousCategories"
      >
        <i class="bi bi-chevron-left"></i>
      </button>

      <button 
        v-if="showNextButton"
        class="nav-button next-button" 
        @click="showNextCategories"
      >
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAttractionCategories } from '../../APIs/AttractionAPIs'

const router = useRouter()
const route = useRoute()
const apiUrl = import.meta.env.VITE_API_URL

const currentIndex = ref(0)
const itemsPerPage = ref(5)
const selectedCategory = computed(() => route.query.category)

// Get categories from API
const { categories, loading, error, refreshCategories } = useAttractionCategories()

// Helper function to construct full image URL
const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null
  return `${apiUrl}/ImageUpload/${imagePath}`
}

const updateItemsPerPage = () => {
  if (window.innerWidth < 768) {
    itemsPerPage.value = 2
  } else if (window.innerWidth < 1200) {
    itemsPerPage.value = 4
  } else {
    itemsPerPage.value = 5
  }
}

const visibleCategories = computed(() => {
  if (categories.value) {
    return categories.value.slice(currentIndex.value, currentIndex.value + itemsPerPage.value)
  }
  return []
})

const showPrevButton = computed(() => currentIndex.value > 0)
const showNextButton = computed(() => {
  if (!categories.value) return false
  return currentIndex.value + itemsPerPage.value < categories.value.length
})

const selectCategory = (categoryName) => {
  if (selectedCategory.value === categoryName) {
    // If clicking the same category, remove filter
    router.push({ query: {} })
  } else {
    // Apply new category filter
    router.push({ query: { category: categoryName } })
  }
}

const showPreviousCategories = () => {
  if (currentIndex.value > 0) {
    currentIndex.value -= itemsPerPage.value
  }
}

const showNextCategories = () => {
  if (categories.value && currentIndex.value + itemsPerPage.value < categories.value.length) {
    currentIndex.value += itemsPerPage.value
  }
}

onMounted(() => {
  updateItemsPerPage()
  window.addEventListener('resize', updateItemsPerPage)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateItemsPerPage)
})
</script>

<style scoped>
.category-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  border: 1px solid #eee;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.text-primary{
  color: #00adef !important;
}
.category-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.category-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
  margin: 0;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-card.active {
  background-color: #f8f9fa;
  border: 2px solid #00adef;
}

.category-card.active .category-name {
  color: #00adef;
  font-weight: 600;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  border: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1;
}

.prev-button {
  left: -16px;
}

.next-button {
  right: -16px;
}

.nav-button:hover {
  background: #f8f9fa;
  border-color: #00adef;
}

.nav-button:hover i {
  color: #00adef;
}

.nav-button i {
  font-size: 1rem;
  color: #666;
}

.row {
  transition: all 0.3s ease;
}
</style> 