<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useTheme } from "vuetify";
import avatar1 from "@images/avatars/avt.jpg";
import illustrationJohnDark from "@images/cards/illustration-john-dark.png";
import illustrationJohnLight from "@images/cards/illustration-john-light.png";
const apiUrl = import.meta.env.VITE_API_URL;

const { global } = useTheme();
const illustrationJohn = computed(() =>
  global.name.value === "dark" ? illustrationJohnDark : illustrationJohnLight
);

const profile = ref({
  id: null,
  name: "",
  lastname: "",
  profile_image: "",
});

// Fetch profile information
const fetchProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${apiUrl}/api/users/getProfile`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    profile.value = response.data;
    accountDataLocal.value = { ...response.data };
  } catch (error) {
    console.error("Failed to fetch profile", error);
  }
};
onMounted(fetchProfile);

</script>
<template>
  <VCard class="text-center text-sm-start h-100">
    <VRow no-gutters>
      <VCol cols="12" sm="8" order="2" order-sm="1">
        <VCardItem>
          <VCardTitle class="text-md-h5 text-primary">
            Congratulations {{ profile.name }} {{ profile.lastname }}! 🎉
          </VCardTitle>
        </VCardItem>

        <VCardText>
          <span>
            You have done 72% 🤩 More Update today.
            <br />
            Check your profile
          </span>
          <br />
          <VBtn to="/account" variant="tonal" class="mt-4" size="small">
            Edite Your Profile
          </VBtn>
        </VCardText>
      </VCol>

      <VCol cols="12" sm="4" order="1" order-sm="2" class="text-center">
        <img
          :src="profile.profile_image || illustrationJohn"
          :height="$vuetify.display.xs ? '150' : '175'"
          :class="$vuetify.display.xs ? 'mt-6 mb-n2' : 'position-absolute'"
          class="john-illustration flip-in-rtl"
        />
      </VCol>
    </VRow>
  </VCard>
</template>

<style lang="scss" scoped>
.john-illustration {
  inset-block-end: -0.0625rem;
  inset-inline-end: 3rem;
}
</style>
