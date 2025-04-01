<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";
import VerticalNavSectionTitle from "@/@layouts/components/VerticalNavSectionTitle.vue";
import Footer from "@/layouts/components/Footer.vue";
import NavbarThemeSwitcher from "@/layouts/components/NavbarThemeSwitcher.vue";
import UserProfile from "@/layouts/components/UserProfile.vue";
import VerticalNavLayout from "@layouts/components/VerticalNavLayout.vue";
import VerticalNavLink from "@layouts/components/VerticalNavLink.vue";
import VerticalNavGroup from "@layouts/components/VerticalNavGroup.vue";
import { useTheme } from "vuetify";
import logoFallback from "@/assets/images/logo.png";
import { VCol } from "vuetify/lib/components/index.mjs";

const vuetifyTheme = useTheme();

const logo = ref(logoFallback);

const dialog = ref(false);
const searchQuery = ref("");

const PopularItems = [
  { title: "Dashboard", icon: "mdi-view-dashboard", href: "/dashboard" },
  { title: "Projects", icon: "mdi-folder-multiple", href: "/project" },
  { title: "News", icon: "mdi-newspaper", href: "/news" },
  { title: "Users", icon: "mdi-account-group", href: "/users" },
];

const PageItems = [
  { title: "Slider", icon: "mdi-image", href: "/slider" },
  { title: "About", icon: "mdi-information", href: "/about" },
  { title: "News", icon: "mdi-newspaper", href: "/news" },
  { title: "Services", icon: "mdi-wrench-cog", href: "/services" },
];

// Computed properties to filter items based on searchQuery
const filteredPopularItems = computed(() => {
  return PopularItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const filteredPageItems = computed(() => {
  return PageItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const fetchLogo = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      throw new Error("API URL is not defined in the environment variables");
    }
    const response = await axios.get(`${apiUrl}/api/imageUpload/logo`);
    if (response.data && response.data.imageUrl) {
      logo.value = response.data.imageUrl;
    } else {
      console.error("imageUrl not found in the response data");
    }
  } catch (error) {
    console.error("Error fetching logo URL:", error.message);
  }
};

const handleKeydown = (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "k") {
    event.preventDefault();
    dialog.value = true;
  }
};

onMounted(() => {
  fetchLogo();
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <VerticalNavLayout>
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <IconBtn
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="bx-menu" />
        </IconBtn>

        <div
          class="d-flex align-center cursor-pointer"
          style="user-select: none"
        >
          <v-dialog v-model="dialog" max-width="550">
            <template v-slot:activator="{ props: activatorProps }">
              <IconBtn v-bind="activatorProps">
                <VIcon icon="bx-search" />
              </IconBtn>
              <span
                class="d-none d-md-flex align-center text-disabled"
                v-bind="activatorProps"
              >
                <span class="me-3">Search</span>
                <span class="meta-key">&#8984;K</span>
              </span>
            </template>

            <template v-slot:default="{ isActive }">
              <v-card>
                <v-card class="d-flex align-center pl-5 pr-5">
                  <v-text-field
                    v-model="searchQuery"
                    size="large"
                    prepend-inner-icon="mdi-magnify"
                    dense
                    variant="plain"
                    hide-details
                    :label="searchQuery ? '' : 'Search...'"
                  ></v-text-field>
                  <span @click="isActive.value = false" class="text-sm"
                    >[esc]</span
                  >&nbsp;
                  <VIcon
                    size="large"
                    @click="isActive.value = false"
                    icon="bx-x"
                  />
                </v-card>
                <v-card-text class="d-flex">
                  <VCol color="primary" cols="6">
                    <div>
                      <h5 class="ml-5">Popular Searches</h5>
                      <v-list>
                        <v-list-item
                          class="d-flex text-xs text-start"
                          v-for="item in filteredPopularItems"
                          :key="item.title"
                          :link="true"
                          :href="item.href"
                        >
                          <template v-slot:prepend>
                            <VIcon color="primary" :icon="item.icon" />
                          </template>
                          <v-list-item-title class="text-xs">{{
                            item.title
                          }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </div>
                  </VCol>
                  <VCol cols="6">
                    <div>
                      <h5 class="ml-5">Apps & Pages</h5>
                      <v-list>
                        <v-list-item
                          class="d-flex text-xs text-start"
                          v-for="item in filteredPageItems"
                          :key="item.title"
                          :link="true"
                          :href="item.href"
                        >
                          <template v-slot:prepend>
                            <VIcon color="primary" :icon="item.icon" />
                          </template>
                          <v-list-item-title class="text-xs">{{
                            item.title
                          }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </div>
                  </VCol>
                </v-card-text>
              </v-card>
            </template>
          </v-dialog>
        </div>

        <VSpacer />

        <IconBtn class="me-2">
          <VIcon icon="bx-bell" />
        </IconBtn>

        <NavbarThemeSwitcher class="me-2" />
        <div
          class="d-flex align-center bg-primary-variant pl-3 pr-1 py-1 rounded-lg"
        >
          <img
            :src="logo"
            alt="MeaThao YaiThongVanh Logo"
            :height="40"
            :width="auto"
            class="mr-2"
          />
          <UserProfile />
        </div>
      </div>
    </template>

    <template #vertical-nav-content>
      <VerticalNavLink
        :item="{
          title: 'Dashboard',
          icon: 'bxs-dashboard',
          to: '/dashboard',
        }"
      />
      <VerticalNavGroup
        :item="{
          title: 'Settings',
          icon: 'bxs-cog',
        }"
      >
        <VerticalNavLink
          :item="{
            title: 'Data Info',
            icon: 'bx-data',
            to: '/settings',
          }"
        />
        <VerticalNavLink
          :item="{
            title: 'Account',
            icon: 'bx-user',
            to: '/account',
          }"
        />
        <VerticalNavLink
          :item="{
            title: 'Users',
            icon: 'bx-user',
            to: '/users',
          }"
        />
      </VerticalNavGroup>

      <VerticalNavSectionTitle
        :item="{
          heading: 'Pages',
        }"
      />
      <!-- Slider -->
      <VerticalNavLink
        :item="{
          title: 'Sliders',
          icon: 'bx-slider',
          to: '/slider',
        }"
      />
      <!-- Home -->
      <VerticalNavGroup
        :item="{
          title: 'Home',
          icon: 'bx-home',
        }"
      >
        <VerticalNavLink
          :item="{
            title: 'Bank Accounts',
            icon: 'bx-credit-card',
            to: '/bank-accounts',
          }"
        />
        <VerticalNavLink
          :item="{
            title: 'Support',
            icon: 'bx-help-circle',
            to: '/groupCompany',
          }"
        />

        <VerticalNavLink
          :item="{
            title: 'Content',
            icon: 'bx-file-blank',
            to: '/content',
          }"
        />
      </VerticalNavGroup>

      <VerticalNavGroup
        :item="{
          title: 'Projects',
          icon: 'bx-folder',
        }"
      >
        <VerticalNavLink
          :item="{
            title: 'Project',
            icon: 'bx-folder-plus',
            to: '/project',
          }"
        />
        <VerticalNavLink
          :item="{
            title: 'Project Status',
            icon: 'bx-task',
            to: '/projectStatus',
          }"
        />
      </VerticalNavGroup>
      <!-- Product -->
      <VerticalNavGroup
        :item="{
          title: 'Products',
          icon: 'bx-package',
        }"
      >
        <VerticalNavLink
          :item="{
            title: 'Product Ads',
            icon: 'bx-news',
            to: '/product-ads',
          }"
        />
        <VerticalNavLink
          :item="{
            title: 'Categories',
            icon: 'bx-package',
            to: '/product-categories',
          }"
        />
        <VerticalNavLink
          :item="{
            title: 'Products',
            icon: 'bx-package',
            to: '/products',
          }"
        />
      </VerticalNavGroup>
      <!-- Tourist Attraction -->
      <VerticalNavGroup
        :item="{
          title: 'Attraction',
          icon: 'bx-map-alt',
        }"
      >
        <VerticalNavLink
          :item="{
            title: 'Attraction Ads',
            icon: 'bx-map-pin',
            to: '/tourist-attraction-ads',
          }"
        />
        <VerticalNavLink
          :item="{
            title: 'Attraction',
            icon: 'bx-map',
            to: '/tourist-attractions',
          }"
        />
        <VerticalNavLink
          :item="{
            title: 'Categories',
            icon: 'bx-category',
            to: '/tourist-attraction-categories',
          }"
        />
      </VerticalNavGroup>

      <VerticalNavGroup
        :item="{
          title: 'News',
          icon: 'bx-news',
        }"
      >
        <VerticalNavLink
          :item="{
            title: 'News',
            icon: 'bx-news',
            to: '/news',
          }"
        />
        <VerticalNavLink
          :item="{
            title: 'Categories',
            icon: 'bx-news',
            to: '/news-categories',
          }"
        />
      </VerticalNavGroup>

      <!-- About -->
      <VerticalNavGroup
        :item="{
          title: 'About',
          icon: 'bx-buildings',
        }"
      >
        <VerticalNavLink
          :item="{
            title: 'About',
            icon: 'bx-buildings',
            to: '/about',
          }"
        />
        <VerticalNavLink
          :item="{
            title: 'Teams',
            icon: 'bxl-microsoft-teams',
            to: '/teams',
          }"
        />
      </VerticalNavGroup>
    </template>

    <slot />

    <template #footer>
      <Footer />
    </template>
  </VerticalNavLayout>
</template>

<style lang="scss" scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 0.375rem;
  block-size: 25px;
  line-height: 21px;
  padding-block: 2px;
  padding-inline: 4px;
}
.search-input {
  margin-right: 8px;
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-categories {
  display: flex;
  justify-content: space-between;
}

.search-categories div {
  width: 45%;
}

h5 {
  margin-bottom: 10px;
  font-weight: bold;
  color: #666;
}

.v-list-item-title {
  font-size: 0.9rem; /* Adjust font size */
}

.v-list-item-icon {
  font-size: 1.2rem; /* Adjust icon size */
}
</style>
