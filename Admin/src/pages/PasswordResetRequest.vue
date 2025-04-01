<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";
import logoFallback from "../assets/images/logo.png"; // Fallback logo in case of API failure

const store = useStore();
const router = useRouter();

const email = ref("");
const successMessage = ref("");
const errorMessage = ref("");
const loading = ref(false);
const logo = ref(logoFallback); // Initially set to fallback logo

const apiUrl = import.meta.env.VITE_API_URL;

// Fetch the logo from the API
const fetchLogo = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/imageUpload/logo`);
    if (response.data && response.data.imageUrl) {
      logo.value = response.data.imageUrl; // Dynamically assign the logo from the API response
    } else {
      console.error("Logo imageUrl not found in API response.");
      logo.value = logoFallback;
    }
  } catch (error) {
    console.error("Error fetching the logo:", error);
    logo.value = logoFallback; // Fallback logo in case of error
  }
};

onMounted(fetchLogo); // Fetch the logo when the component mounts

const requestPasswordReset = async () => {
  try {
    loading.value = true;
    errorMessage.value = "";
    successMessage.value = "";
    await store.dispatch("requestPasswordReset", { email: email.value });
    successMessage.value =
      "Password reset email sent. Please check your inbox.";
  } catch (error) {
    errorMessage.value = error.response?.data?.error || "Request failed";
    console.error("Request failed", error);
  } finally {
    loading.value = false;
  }
};
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
          Password Reset
        </v-card-title>
      </v-card-item>
      <v-card-text class="pt-2">
        <h5 class="text-h5 mb-1">Forgot your password?</h5>
        <p class="mb-0">
          Enter your email address below to receive a password reset link.
        </p>
      </v-card-text>
      <v-card-text>
        <v-form @submit.prevent="requestPasswordReset">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                placeholder="your-email@mtosgroup.com"
                :disabled="loading"
              />
              <v-alert type="success" v-if="successMessage">{{
                successMessage
              }}</v-alert>
              <v-alert type="error" v-if="errorMessage">{{
                errorMessage
              }}</v-alert>
            </v-col>
            <v-col cols="12">
              <v-btn block type="submit" :loading="loading" :disabled="loading">
                Send Reset Link
              </v-btn>
            </v-col>
            <v-col cols="12" class="text-center text-base">
              <router-link class="text-primary ms-2" to="/"
                >Back to Login</router-link
              >
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
