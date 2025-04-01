<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Ads from "@/pages/Produsts/Ads.vue";
import Slide from "@/pages/Produsts/Slide.vue";
const route = useRoute();
const router = useRouter();
const activeTab = ref(route.params.tab || "Ads");

// Watch for route changes to update the active tab
watch(
  () => route.params.tab,
  (newTab) => {
    if (newTab) {
      activeTab.value = newTab;
    }
  }
);

// Update the route when the active tab changes
watch(activeTab, (newTab) => {
  if (newTab) {
    router.push({ params: { tab: newTab } });
  }
});

// Tabs definition
const tabs = [
  {
    title: "Product Ads",
    icon: "bx-news",
    tab: "Ads",
  },
  {
    title: "Product Slide",
    icon: "bx-slideshow",
    tab: "Slide",
  },
];
</script>

<template>
  <div>
    <VTabs v-model="activeTab" show-arrows>
      <VTab v-for="item in tabs" :key="item.tab" :value="item.tab">
        <VIcon v-if="item.icon" size="20" start :icon="item.icon" />
        {{ item.title }}
      </VTab>
    </VTabs>
    <VDivider />

    <VWindow v-model="activeTab" class="mt-5 disable-tab-transition">
      <VWindowItem value="Ads">
        <Ads />
      </VWindowItem>
      <VWindowItem value="Slide">
        <Slide />
      </VWindowItem>
    </VWindow>
  </div>
</template>
