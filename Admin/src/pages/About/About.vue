<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AboutManagement from "@/pages/About/AboutManagement.vue";
import HeadContent from "@/pages/About/HeadContent.vue";
import Impact from "@/pages/About/Impact.vue";
import VisionMission from "@/pages/About/VisionMission.vue";
import CoreValues from "@/pages/About/CoreValues.vue";
const route = useRoute();
const router = useRouter();
const activeTab = ref(route.params.tab || "logo");

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
    title: "Head Content",
    icon: "bx-window-alt",
    tab: "HeadContent",
  },
  {
    title: "About",
    icon: "bx-building-house",
    tab: "AboutManagement",
  },
  {
    title: "Vision & Mission",
    icon: "bx-layout",
    tab: "VisionMission",
  },
  {
    title: "Core Values",
    icon: "bx-git-branch",
    tab: "CoreValues",
  },
  {
    title: "Impact",
    icon: "mdi-account-multiple",
    tab: "Impact",
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
      <VWindowItem value="Impact">
        <Impact />
      </VWindowItem>
      <VWindowItem value="AboutManagement">
        <AboutManagement />
      </VWindowItem>
      <VWindowItem value="HeadContent">
        <HeadContent />
      </VWindowItem>
      <VWindowItem value="VisionMission">
        <VisionMission />
      </VWindowItem>
      <VWindowItem value="CoreValues">
        <CoreValues />
      </VWindowItem>
    </VWindow>
  </div>
</template>
