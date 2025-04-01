<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import ContentOne from "@/pages/Content/ContentOne.vue";
import ContentTwo from "@/pages/Content/ContentTwo.vue";
import ContentThree from "@/pages/Content/ContentThree.vue";
// import ContentFour from "@/pages/Content/ContentFour.vue";
// import SlidePerformance from "@/pages/Content/SlidePerformance.vue";
const route = useRoute();
const router = useRouter();
const activeTab = ref(route.params.tab || "ContentOne");

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
    title: "Hello",
    icon: "bx-message-dots",
    tab: "ContentOne",
  },
  {
    title: "About Us",
    icon: "bx-message-dots",
    tab: "ContentTwo",
  },

  {
    title: "What We Do",
    icon: "bxs-briefcase ",
    tab: "ContentThree",
  },
  // {
  //   title: "Who Are We?",
  //   icon: "bx-clinic",
  //   tab: "ContentFour",
  // },
  // {
  //   title: "Latest work!",
  //   icon: "bx-slideshow",
  //   tab: "SlidePerformance",
  // },
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
      <VWindowItem value="ContentOne">
        <ContentOne />
      </VWindowItem>
      <VWindowItem value="ContentTwo">
        <ContentTwo />
      </VWindowItem>
      <VWindowItem value="ContentThree">
        <ContentThree />
      </VWindowItem>
      <!-- <VWindowItem value="ContentFour">
          <ContentFour />
        </VWindowItem> -->
      <!-- <VWindowItem value="SlidePerformance">
          <SlidePerformance />
        </VWindowItem> -->
    </VWindow>
  </div>
</template>
