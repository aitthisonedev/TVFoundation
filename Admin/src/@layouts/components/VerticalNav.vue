<script setup>
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import { useDisplay } from "vuetify";
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios"; // Import axios for API call
import logoFallback from "../../assets/images/logo.png"; // Initial fallback logo

// Define props
const props = defineProps({
  tag: {
    type: [String, null],
    required: false,
    default: "aside",
  },
  isOverlayNavActive: {
    type: Boolean,
    required: true,
  },
  toggleIsOverlayNavActive: {
    type: Function,
    required: true,
  },
});

const { mdAndDown } = useDisplay();
const refNav = ref();
const route = useRoute();
const logo = ref(logoFallback); // Initial logo set to fallback

// Function to fetch and update the logo
const fetchLogo = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL; // Fetch the API URL from .env
    const response = await axios.get(`${apiUrl}/api/imageUpload/logo`);
    if (response.data && response.data.imageUrl) {
      logo.value = response.data.imageUrl; // Dynamically update logoFallback with the fetched logo URL
    } else {
      console.error("imageUrl not found in the response data");
    }
  } catch (error) {
    console.error("Error fetching logo URL:", error);
  }
};

// Fetch logo when the component is mounted
onMounted(() => {
  fetchLogo();
});

watch(
  () => route.path,
  () => {
    props.toggleIsOverlayNavActive(false);
  }
);

const isVerticalNavScrolled = ref(false);
const updateIsVerticalNavScrolled = (val) =>
  (isVerticalNavScrolled.value = val);

const handleNavScroll = (evt) => {
  isVerticalNavScrolled.value = evt.target.scrollTop > 0;
};
</script>

<template>
  <Component
    :is="props.tag"
    ref="refNav"
    class="layout-vertical-nav"
    :class="[
      {
        visible: isOverlayNavActive,
        scrolled: isVerticalNavScrolled,
        'overlay-nav': mdAndDown,
      },
    ]"
  >
    <!-- 👉 Header -->
    <div class="nav-header">
      <slot name="nav-header">
        <RouterLink
          to="/settings"
          class="app-logo d-flex align-center gap-x-3 app-title-wrapper"
        >
          <!-- Dynamically loaded logo -->
          <div class="d-flex">
            <img
              class="d-flex text-primary m-0 p-0"
              :src="logo"
              alt="MTOS Group Logo"
              width="80"
              height="80"
            />
          </div>
        </RouterLink>
      </slot>
    </div>
    <slot name="before-nav-items">
      <div class="vertical-nav-items-shadow" />
    </slot>
    <slot
      name="nav-items"
      :update-is-vertical-nav-scrolled="updateIsVerticalNavScrolled"
    >
      <PerfectScrollbar
        tag="ul"
        class="nav-items"
        :options="{ wheelPropagation: false }"
        @ps-scroll-y="handleNavScroll"
      >
        <slot />
      </PerfectScrollbar>
    </slot>

    <slot name="after-nav-items" />
  </Component>
</template>

<style lang="scss">
@use "@configured-variables" as variables;
@use "@layouts/styles/mixins";

// 👉 Vertical Nav
.layout-vertical-nav {
  position: fixed;
  z-index: variables.$layout-vertical-nav-z-index;
  display: flex;
  flex-direction: column;
  block-size: 100%;
  inline-size: variables.$layout-vertical-nav-width;
  inset-block-start: 0;
  inset-inline-start: 0;
  transition: transform 0.25s ease-in-out, inline-size 0.25s ease-in-out,
    box-shadow 0.25s ease-in-out;
  will-change: transform, inline-size;

  .nav-header {
    display: flex;
    align-items: center;

    .header-action {
      cursor: pointer;
    }
  }

  .app-title-wrapper {
    margin-inline-end: auto;
  }

  .nav-items {
    block-size: 100%;
  }
  .leading-normal {
    font-size: 0.8vw;
  }
  .nav-item-title {
    overflow: hidden;
    margin-inline-end: auto;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  // 👉 Collapsed
  .layout-vertical-nav-collapsed & {
    &:not(.hovered) {
      inline-size: variables.$layout-vertical-nav-collapsed-width;
    }
  }

  // 👉 Overlay nav
  &.overlay-nav {
    &:not(.visible) {
      transform: translateX(-#{variables.$layout-vertical-nav-width});

      @include mixins.rtl {
        transform: translateX(variables.$layout-vertical-nav-width);
      }
    }
  }
}
</style>
