<template>
  <div class="container py-4">
    <Hero />
    
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

    <!-- Attraction Detail -->
    <TouristDetailCard
      v-else-if="attraction"
      :attraction="attraction"
    />

    <!-- Not Found State -->
    <div v-else class="alert alert-warning">
      Attraction not found
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAttractionDetail } from '../../APIs/AttractionAPIs';
import Hero from "./Hero.vue";
import TouristDetailCard from "./TouristDetailCard.vue";

const route = useRoute();
const { attraction, loading, error, fetchAttractionById } = useAttractionDetail();

onMounted(async () => {
  const attractionId = parseInt(route.params.id);
  await fetchAttractionById(attractionId);
});
</script> 