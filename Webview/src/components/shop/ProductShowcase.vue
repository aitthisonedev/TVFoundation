<template>
  <div class="products-section container mb-4">
    <!-- Loading State -->
    <div v-if="loading && !products.length" class="text-center py-3">
      <div class="spinner-border spinner-border-sm text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error && !products.length" class="alert alert-danger py-2" role="alert">
      <small>{{ error }}</small>
    </div>

    <!-- Products Display -->
    <div class="row g-4">
      <div
        v-for="product in lastFourProducts"
        :key="product.id"
        class="col-12 col-sm-6 col-md-3"
      >
        <div
          class="product-card h-100"
          @click="goToProductDetail(product.id)"
          style="cursor: pointer"
        >
          <div class="product-image">
            <img 
              :src="getImageUrl(product)"
              :alt="product.name_en" 
              class="img-fluid" 
              @error="handleImageError"
            />
          </div>
          <div class="product-info">
            <h6 class="product-title mb-2">
              {{ truncateText(locale === 'en' ? product.name_en : product.name_lo, 10) }}
            </h6>
            <div class="d-flex align-items-center gap-2">
              <span class="text-danger fw-bold">₭ {{ formatPrice(product.price) }}</span>
              <small class="text-decoration-line-through text-muted">
                ₭ {{ formatPrice(product.originalPrice) }}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { useProducts } from '../../APIs/ProductsAPIs';
import { products as fallbackProducts } from '../../data/products';

export default {
  name: 'ProductShowcase',
  props: {
    products: {
      type: Array,
      default: () => []
    },
    limit: {
      type: Number,
      default: 4
    }
  },
  setup() {
    const { locale } = useI18n();
    const { products: apiProducts, loading, error } = useProducts();
    return { apiProducts, loading, error, locale };
  },
  data() {
    return {
      apiUrl: import.meta.env.VITE_API_URL,
      fallbackImage: '/placeholder-image.jpg'
    };
  },
  computed: {
    availableProducts() {
      if (this.products.length > 0) {
        return this.products;
      }
      return this.apiProducts?.length > 0 ? this.apiProducts : fallbackProducts;
    },
    lastFourProducts() {
      const allProducts = [...this.availableProducts];
      return allProducts.reverse().slice(0, 4);
    }
  },
  methods: {
    getImageUrl(product) {
      // First try coverImage
      if (product.coverImage) {
        if (product.coverImage.startsWith('http')) {
          return product.coverImage;
        }
        return `${this.apiUrl}/ImageUpload/${product.coverImage}`;
      }
      
      // Fallback to image if coverImage doesn't exist (for backwards compatibility)
      if (product.image) {
        if (product.image.startsWith('http')) {
          return product.image;
        }
        return `${this.apiUrl}/ImageUpload/${product.image}`;
      }
      
      // If no image is available, return fallback
      return this.fallbackImage;
    },
    handleImageError(e) {
      console.log('Image failed to load, using fallback');
      e.target.src = this.fallbackImage;
    },
    truncateText(text, wordLimit) {
      if (!text) return "";
      const words = text.split(" ");
      if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(" ") + "...";
      }
      return text;
    },
    goToProductDetail(productId) {
      if (productId) {
        if (this.$route.name === 'ProductDetail') {
          this.$router.replace({ name: 'Shop' }).then(() => {
            this.$router.replace({
              name: 'ProductDetail',
              params: { id: productId.toString() }
            });
          });
        } else {
          this.$router.push({
            name: "ProductDetail",
            params: { id: productId.toString() }
          }).catch(err => {
            if (err.name !== 'NavigationDuplicated') {
              console.error('Navigation error:', err);
            }
          });
        }
      }
    },
    formatPrice(price) {
      // Convert to number if it's a string, remove decimals, and format with commas
      return Number(price)
        .toFixed(0)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
};
</script>

<style scoped>
.products-section {
  width: 100%;
}

.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #eee;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.text-danger {
  color: #ed207b !important;
}

.text-primary {
  color: #00adef !important;
}

.product-image {
  position: relative;
  height: 200px;
  background: #f8f9fa;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

/* Make sure images maintain aspect ratio */
.product-image img.img-fluid {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}

/* Add a subtle loading animation */
.product-image.loading {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

.product-info {
  padding: 1rem;
  background: white;
}

.product-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  margin: 0;
  line-height: 1.4;
  height: 2.8em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Responsive adjustments */
@media (max-width: 991px) {
  .product-image {
    height: 180px;
  }
}

@media (max-width: 576px) {
  .product-image {
    height: 160px;
  }
  
  .product-info {
    padding: 0.75rem;
  }
}
</style> 