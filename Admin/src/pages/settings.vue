<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AccountSettingsFavicon from "@/views/pages/generall-settings/FaviconUpdate.vue";
import AccountSettingsLogo from "@/views/pages/generall-settings/LogoUpdate.vue";
import AccountSettingsEmail from "@/views/pages/generall-settings/EmailUpdate.vue";
import AccountSettingsPhone from "@/views/pages/generall-settings/PhoneUpdate.vue";
import SocialMedia from "@/views/pages/generall-settings/SocialMediaLinks.vue";
import Other from "@/views/pages/generall-settings/OtherUpdate.vue";

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
    title: "Logo",
    icon: "bx-log-in-circle",
    tab: "logo",
  },
  {
    title: "Favicon",
    tab: "favicon",
  },
  {
    title: "Email",
    tab: "email",
  },
  {
    title: "Phone",
    tab: "phone",
  },
  {
    title: "Social Media",
    tab: "SocialMedia",
  },
  {
    title: "Other",
    tab: "other",
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
      <!-- Logo Update -->
      <VWindowItem value="logo">
        <AccountSettingsLogo />
      </VWindowItem>

      <!-- Favicon Update -->
      <VWindowItem value="favicon">
        <AccountSettingsFavicon />
      </VWindowItem>

      <!-- Email Update -->
      <VWindowItem value="email">
        <AccountSettingsEmail />
      </VWindowItem>
      <!-- Phone Update -->
      <VWindowItem value="phone">
        <AccountSettingsPhone />
      </VWindowItem>
      <!-- Social Media Update -->
      <VWindowItem value="SocialMedia">
        <SocialMedia />
      </VWindowItem>

      <!-- Other Update -->
      <VWindowItem value="other">
        <Other />
      </VWindowItem>
    </VWindow>
  </div>
</template>
