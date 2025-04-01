<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";
import logoFallback from "@images/logo.png"; // fallback logo if API fails

const store = useStore();
const router = useRouter();
const logo = ref(logoFallback); // Initial logo fallback

const apiUrl = import.meta.env.VITE_API_URL; // Make sure this is correctly set in your environment variables

const form = ref({
  name: "",
  lastname: "",
  email: "",
  phone: "",
  password: "",
  role: "user", // Default user role, adjust as necessary
  privacyPolicies: false,
  profile_image: null,
  blog_description_en: "",
  blog_description_lo: "",
});

const isPasswordVisible = ref(false);
const errorMessage = ref("");

const register = async () => {
  try {
    errorMessage.value = "";
    await store.dispatch("register", form.value);
    router.push("/login"); // Redirect to login after registration
  } catch (error) {
    errorMessage.value = error.response?.data?.error || "Registration failed";
    console.error("Registration failed", error);
  }
};

// Fetch the logo from the API
const fetchLogo = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/imageUpload/logo`);
    console.log('API Response:', response.data); // Log the API response to check the structure

    if (response.data && response.data.imageUrl) {
      logo.value = response.data.imageUrl; // Assign the logo path from the API response
      console.log('Logo URL:', logo.value); // Log the logo URL to verify
    } else {
      console.error("Logo imageUrl not found in API response.");
      logo.value = logoFallback;
    }
  } catch (error) {
    console.error("Error fetching the logo:", error);
    logo.value = logoFallback; // Fallback logo if API call fails
  }
};

onMounted(fetchLogo); // Fetch the logo when the component mounts
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <v-card class="auth-card pa-4 pt-7" max-width="448">
      <v-card-item class="justify-center">
        <template #prepend>
          <div class="d-flex">
            <div class="d-flex text-primary" />
            <img
              class="d-flex text-primary m-0 p-0"
              :src="logo"
              alt="MTOS Group Logo"
              width="100"
              height="100"
            />
          </div>
        </template>
        <v-card-title class="text-2xl font-weight-bold">
          MTOS Group
        </v-card-title>
      </v-card-item>
      <v-card-text class="pt-2">
        <h5 class="text-h5 mb-1">Welcome to MTOS Group! 👋🏻</h5>
        <p class="mb-0">
          Already a member? Sign in to continue your journey. New to MTOS Group?
        </p>
      </v-card-text>
      <v-card-text>
        <v-form @submit.prevent="register">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.name"
                autofocus
                label="First Name"
                placeholder="MTOS Group"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.lastname"
                label="Last Name"
                placeholder="MTOS Group"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.email"
                label="Email"
                placeholder="xangthala@mtosgroup.com"
                type="email"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.phone"
                label="Phone"
                placeholder="+856 20 99 645 556"
                type="tel"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.password"
                label="Password"
                placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />
              <br />
              <div class="d-flex align-center mt-1 mb-4">
                <v-checkbox
                  id="privacy-policy"
                  v-model="form.privacyPolicies"
                  inline
                />
                <v-label for="privacy-policy" style="opacity: 1">
                  <span class="me-1">I agree to</span>
                  <a href="javascript:void(0)" class="text-primary"
                    >privacy policy & terms</a
                  >
                </v-label>
              </div>
              <v-btn block type="submit">Sign up</v-btn>
              <v-alert type="error" v-if="errorMessage">{{
                errorMessage
              }}</v-alert>
            </v-col>
            <v-col cols="12" class="text-center text-base">
              <span>Already have an account?</span>
              <router-link class="text-primary ms-2" to="/login"
                >Sign in instead</router-link
              >
            </v-col>
            <v-col cols="12" class="d-flex align-center">
              <v-divider />
              <span class="mx-4">MTOS</span>
              <v-divider />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
