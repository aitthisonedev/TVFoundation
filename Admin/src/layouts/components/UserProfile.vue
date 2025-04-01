<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import avatar1 from "@images/avatars/avt.jpg";
import {
  VAlertTitle,
  VAvatar,
  VBadge,
  VCard,
  VCode,
  VCol,
} from "vuetify/lib/components/index.mjs";

const apiUrl = import.meta.env.VITE_API_URL;
// Define reactive variables for profile data
const profile = ref({
  name: "",
  role: "",
  profile_image: null,
});

// Fetch profile information from the API
const fetchProfile = async () => {
  try {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    const response = await axios.get(`${apiUrl}/api/users/getProfile`, {
      headers: { Authorization: `Bearer ${token}` }, // Include token in the headers
    });
    profile.value = response.data; // Update profile data
  } catch (error) {
    console.error("Failed to fetch profile", error);
  }
};

// Fetch profile data when the component is mounted
onMounted(fetchProfile);
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    color="success"
    bordered
  >
    <VAvatar class="cursor-pointer" color="primary" variant="tonal">
      <VImg :src="profile.profile_image || avatar1" />
      <!-- Use the profile's avatar or a default image -->

      <!-- SECTION Menu -->
      <VMenu activator="parent" width="230" location="bottom end" offset="14px">
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar color="primary" variant="tonal">
                    <VImg :src="profile.profile_image || avatar1" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ profile.name || "null" }}
              <!-- Use profile name or default -->
            </VListItemTitle>
            <VListItemSubtitle>{{ profile.role || "null" }}</VListItemSubtitle>
            <!-- Use profile role or default -->
          </VListItem>
          <VDivider class="my-2" />

          <!-- 👉 Profile -->
          <VListItem to="/account">
            <template #prepend>
              <VIcon class="me-2" icon="bx-user" size="22" />
            </template>

            <VListItemTitle>Profile</VListItemTitle>
          </VListItem>

          <!-- 👉 Settings -->
          <VListItem to="/settings">
            <template #prepend>
              <VIcon class="me-2" icon="bx-cog" size="22" />
            </template>

            <VListItemTitle>Settings</VListItemTitle>
          </VListItem>
          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem to="/login">
            <template #prepend>
              <VIcon class="me-2" icon="bx-log-out" size="22" />
            </template>

            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>

<style scoped>
/* Add your custom styles here */
</style>
