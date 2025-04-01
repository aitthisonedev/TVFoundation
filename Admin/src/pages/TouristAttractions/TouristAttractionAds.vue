<template>
  <v-card>
    <v-tabs
      v-model="activeTab"
      show-arrows
      class="ml-5 mt-5 disable-tab-transition"
      @update:modelValue="handleTabChange"
      color="primary"
    >
      <v-tab
        v-for="item in tabs"
        :key="item.tab"
        :value="item.tab"
      >
        <v-icon v-if="item.icon" size="20" start :icon="item.icon" />
        {{ item.title }}
      </v-tab>
    </v-tabs>
    
    <v-divider></v-divider>

    <v-card-text>
      <v-window v-model="activeTab">
        <v-window-item value="slides">
          <tourist-attraction-slide />
        </v-window-item>
        <v-window-item value="ads">
          <tourist-attraction-ads-content />
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import TouristAttractionSlide from "./TouristAttractionSlide.vue";
import TouristAttractionAdsContent from "./TouristAttractionAdsContent.vue";

const route = useRoute();
const router = useRouter();
const activeTab = ref("slides");

const tabs = [
  {
    title: "Slides",
    tab: "slides",
    icon: "mdi-image",
  },
  {
    title: "Ads",
    tab: "ads",
    icon: "mdi-bullhorn",
  },
];

// Handle tab changes from route
onMounted(() => {
  const tab = route.params.tab;
  if (tab) {
    activeTab.value = tab;
  }
});

// Update route when tab changes
const handleTabChange = (newTab) => {
  router.push({
    name: "TouristAttractionAds",
    params: { tab: newTab },
  });
};

// Watch for route changes
watch(
  () => route.params.tab,
  (newTab) => {
    if (newTab) {
      activeTab.value = newTab;
    }
  }
);
</script>

<style scoped>
.v-card {
  margin: 16px;
}
</style>
