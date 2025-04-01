<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";
import logoFallback from "../assets/images/logo.png"; // fallback logo if API fails

const store = useStore();
const router = useRouter();
const logo = ref(logoFallback); // initial logo fallback

const apiUrl = import.meta.env.VITE_API_URL; // Ensure this is correctly set

const form = ref({
  email: "",
  password: "",
  remember: true,
});

const isPasswordVisible = ref(false);
const errorMessage = ref("");
const isLoading = ref(false); // Add a loading state

// Login function
const login = async () => {
  isLoading.value = true; // Set loading to true when login starts
  try {
    errorMessage.value = "";
    await store.dispatch("login", form.value);
    await store.dispatch("fetchUserInfo");
    router.push("/dashboard");
  } catch (error) {
    errorMessage.value = error.response?.data?.error || "Login failed";
    console.error("Login failed", error);
  } finally {
    isLoading.value = false; // Set loading to false when login completes
  }
};

// Fetch the logo from the API
const fetchLogo = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/imageUpload/logo`);
    console.log('API Response:', response.data); // Debugging: log the response data

    if (response.data && response.data.imageUrl) {
      logo.value = response.data.imageUrl; // Assign imageUrl from response
      console.log('Logo URL:', logo.value); // Debugging: log the logo URL
    } else {
      console.error("Logo imageUrl not found in API response.");
      logo.value = logoFallback;
    }
  } catch (error) {
    console.error("Error fetching the logo:", error);
    logo.value = logoFallback; // fallback to default logo in case of error
  }
};

onMounted(fetchLogo);
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <v-card class="auth-card pa-4 pt-7" max-width="448">
      <v-card-item class="justify-center">
        <template #prepend>
          <img
            class="d-flex text-primary m-0 p-0"
            :src="logo"
            alt="MeaThao YaiThongVanh Logo"
            width="100"
            height="100"
          />
        </template>
        <v-card-title class="text-2xl font-weight-bold">
        </v-card-title>
      </v-card-item>
      <v-card-text class="pt-2">
        <h5 class="text-h6 mb-1">MeaThao YaiThongVanh!👋🏻</h5>
        <p class="mb-0">
          Sign in to your account and embark on an exciting journey with us.
        </p>
      </v-card-text>
      <v-card-text>
        <v-form @submit.prevent="login">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.email"
                autofocus
                placeholder="admin.a@tv-foundation.com"
                label="Email"
                type="email"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.password"
                label="Password"
                placeholder="*********"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />
              <div
                class="d-flex align-center justify-space-between flex-wrap mt-1 mb-4"
              >
                <v-checkbox v-model="form.remember" label="Remember me" />
                <router-link class="text-primary ms-2 mb-1" to="/password-reset"
                  >Forgot Password?</router-link
                >
              </div>
              <v-btn block type="submit" :loading="isLoading" :disabled="isLoading">Login</v-btn>
              <v-alert type="error" v-if="errorMessage">{{
                errorMessage
              }}</v-alert>
            </v-col>
            <v-col cols="12" class="text-center text-base">
              <span>New on our platform?</span>
              <!-- <router-link class="text-primary ms-2" to="/register"
                >Create an account</router-link
              > -->
            </v-col>
            <v-col cols="12" class="d-flex align-center">
              <v-divider />
              <span class="mx-4">or</span>
              <v-divider />
            </v-col>
            <v-col cols="12" class="text-center">
              <AuthProvider />
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
