<template>
  <div class="mb-3">
    <div class="d-flex justify-content-between align-items-center pb-4">
      <div>
        <h4 class="text-start m-0 text-primary">{{ $t('nav.products') }}</h4>
        <small v-if="selectedCategory" class="text-muted">
          {{ $t('ads.categoryFilter', { category: selectedCategory }) }}
        </small>
      </div>
      <button 
        v-if="selectedCategory" 
        class="btn btn-outline-secondary btn-sm"
        @click="clearFilter"
      >
        {{ $t('ads.showAllProducts') }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">Loading products...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
      <button class="btn btn-link" @click="refreshProducts">Try Again</button>
    </div>

    <!-- Product List -->
    <div v-else>
      <div class="row g-4">
        <div
          v-for="product in paginatedProducts"
          :key="product.id"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
          @click="goToProductDetail(product.id)"
          style="cursor: pointer;"
        >
          <div class="text-center rounded h-100 shadow-sm transition-hover position-relative">
            <div class="position-relative">
              <img
                :src="`${apiUrl}/ImageUpload/${product.coverImage}`"
                :alt="product.name"
                class="card-img-top object-fit-contain mb-2 p-0"
                style="height: 200px; object-fit: cover"
              />
              <div class="p-2">
                <h5 class="card-title fs-6 fw-500 mb-3 text-start" :title="product.name">
                  {{ product.name.length > 50 ? product.name.substring(0, 50) + '...' : product.name }}
                </h5>
                <div class="card-text">
                  <div class="d-flex align-items-center mb-2">
                    <span class="text-danger fw-bold me-2">₭ {{ formatPrice(product.price) }}</span>
                    <br/>
                    <small class="text-decoration-line-through text-muted">
                      ₭ {{ formatPrice(product.originalPrice) }}
                    </small>
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
          v-model="currentPage"
          :total-pages="totalPages"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { useProducts } from '../../APIs/ProductsAPIs';
import { products as fallbackProducts } from '../../data/products';
import Pagination from "../Common/Pagination.vue";

export default {
  name: "Products",
  components: {
    Pagination
  },
  setup() {
    const { locale } = useI18n();
    const { products: apiProducts, loading, error } = useProducts();
    return { apiProducts, loading, error, locale };
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 8,
      selectedCategory: null,
      apiUrl: import.meta.env.VITE_API_URL
    };
  },
  computed: {
    products() {
      return this.apiProducts?.length > 0 ? this.apiProducts : fallbackProducts;
    },
    filteredProducts() {
      if (!this.selectedCategory) return this.products;
      return this.products.filter(product => 
        product.category.name.toLowerCase() === this.selectedCategory.toLowerCase()
      );
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredProducts.slice(start, end);
    }
  },
  methods: {
    goToProductDetail(productId) {
      if (productId) {
        this.$router.push({ 
          name: 'ProductDetail',
          params: { id: productId.toString() }
        });
      }
    },
    clearFilter() {
      this.selectedCategory = null;
      this.currentPage = 1;
      this.$router.push({ name: 'Shop' });
    },
    filterByCategory(category) {
      console.log('Filtering by category:', category);
      this.selectedCategory = category || null;
      this.currentPage = 1;
    },
    formatPrice(price) {
      return Number(price)
        .toFixed(0)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    getCategoryName(category) {
      return this.locale === 'en' ? category.name_en : category.name_lo;
    }
  },
  // Listen for route changes to reset category filter
  watch: {
    '$route'(to) {
      // Only reset if we're not filtering by category
      if (!to.query.category) {
        this.selectedCategory = null;
        this.currentPage = 1;
      }
    }
  }
};
</script>

<style scoped>
.transition-hover {
  transition: transform 0.2s, box-shadow 0.2s;
}

.transition-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2) !important;
}
.text-primary{
  color: #00adef !important;
}
.text-danger{
  color: #ed207b !important;
}
.bg-danger{
  background-color: #ed207b !important;
}
</style>
