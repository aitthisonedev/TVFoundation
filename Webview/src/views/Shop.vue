<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Products from '../components/shop/Products.vue';
import Hero from '../components/shop/Hero.vue';
import ProductCategories from '../components/shop/ProductCategories.vue';

const route = useRoute();
const productsRef = ref(null);

// Watch for route query changes to update category filter
watch(
  () => route.query.category,
  (newCategory) => {
    if (productsRef.value) {
      productsRef.value.filterByCategory(newCategory || null);
    }
  }
);

// Initialize category filter on component mount
onMounted(() => {
  if (route.query.category && productsRef.value) {
    productsRef.value.filterByCategory(route.query.category);
  }
});
</script>

<template>
  <div class="container">
    <Hero />
    <ProductCategories />
    <Products ref="productsRef" />
  </div>
</template>

<style>
  
</style>