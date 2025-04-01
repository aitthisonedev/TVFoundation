<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import ProjectSlider from "@/pages/Slider/ProjectSlider.vue";
import HomeSlider from "@/pages/Slider/HomeSlider.vue.vue";
import NewsSlider from "@/pages/Slider/NewsSlider.vue";
import SupportSlider from "@/pages/Slider/SupportSlider.vue";
const route = useRoute();
const router = useRouter();
const activeTab = ref(route.params.tab || "HomeSlider");

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
    title: "Home Slider",
    icon: "bx-home-alt-2",
    tab: "HomeSlider",
  },
  {
    title: "Support Slider",
    icon: "bx-support",
    tab: "SupportSlider",
  },
  {
    title: "Project Slider",
    icon: "bx-run",
    tab: "ProjectSlider",
  },
  {
    title: "News Slider",
    icon: "bx-news",
    tab: "NewsSlider",
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
      <VWindowItem value="HomeSlider">
        <HomeSlider />
      </VWindowItem>
      <VWindowItem value="ProjectSlider">
        <ProjectSlider />
      </VWindowItem>
      <VWindowItem value="NewsSlider">
        <NewsSlider />
      </VWindowItem>
      <VWindowItem value="SupportSlider">
        <SupportSlider />
      </VWindowItem>
    </VWindow>
  </div>
</template>
