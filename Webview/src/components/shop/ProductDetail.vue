<template>
  <div class="container py-4">
    <Hero />
    
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">Loading product details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
      <button class="btn btn-link" @click="reloadProduct">Try Again</button>
    </div>

    <!-- Not Found State -->
    <div v-else-if="!product" class="alert alert-warning">
      Product not found
    </div>

    <!-- Product Details -->
    <ProductDetailCard
      v-else
      :product="product"
      @add-to-cart="handleAddToCart"
      @buy-now="handleBuyNow"
    />
  </div>
</template>

<script>
import Hero from "./Hero.vue";
import ProductDetailCard from "./ProductDetailCard.vue";
import { useProductDetail } from '../../APIs/ProductsAPIs';
import { products as fallbackProducts } from '../../data/products';

export default {
  name: "ProductDetailView",
  components: {
    Hero,
    ProductDetailCard,
  },
  setup() {
    const { product: apiProduct, loading, error, fetchProductById } = useProductDetail();
    return { apiProduct, loading, error, fetchProductById };
  },
  data() {
    return {
      product: null,
    };
  },
  async created() {
    const productId = Number(this.$route.params.id);
    await this.fetchProductById(productId);
    
    // If API fails, use fallback data
    if (!this.apiProduct) {
      this.product = fallbackProducts.find(p => p.id === productId);
    } else {
      this.product = this.apiProduct;
    }
    
    if (!this.product) {
      console.error('Product not found:', productId);
    }
  },
  methods: {
    handleAddToCart(product) {
      console.log("Adding to cart:", product);
      // Implement cart functionality
    },
    handleBuyNow(product) {
      console.log("Buying now:", product);
      // Implement buy now functionality
    },
    reloadProduct() {
      const productId = Number(this.$route.params.id);
      this.fetchProductById(productId);
    }
  },
};
</script> 