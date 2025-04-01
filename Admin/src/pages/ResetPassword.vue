<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="3" class="justify-center">
          <v-card-item class="justify-center">
            <template #prepend>
              <div class="d-flex">
                <img
                  class="d-flex text-primary m-0 p-0"
                  :src="logo"
                  alt="Mea thao yai thongvanh  Logo"
                  width="100"
                  height="100"
                />
              </div>
            </template>
          </v-card-item>
          <v-card-title class="text-h5 text-center"
            >Password Reset</v-card-title
          >
          <v-card-text>
            <v-form @submit.prevent="resetPassword">
              <v-text-field
                class="mt-5"
                v-model="password"
                label="New Password"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="
                  isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'
                "
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
                :rules="[(v) => !!v || 'Password is required']"
                outlined
                dense
              />
              <v-text-field
                class="mt-5"
                v-model="confirmPassword"
                label="Confirm Password"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="
                  isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'
                "
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
                :rules="[(v) => !!v || 'Confirm password is required']"
                outlined
                dense
              />
              <v-btn type="submit" color="primary" block class="my-4" large>
                Reset Password
              </v-btn>
              <v-alert v-if="errorMessage" type="error" class="mt-4" dense>
                {{ errorMessage }}
              </v-alert>
              <v-alert v-if="successMessage" type="success" class="mt-4" dense>
                {{ successMessage }}
              </v-alert>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import logoFallback from "../assets/images/logo.png"; // Fallback logo in case of API failure
const apiUrl = import.meta.env.VITE_API_URL;

const route = useRoute();
const router = useRouter();

const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const successMessage = ref("");
const isPasswordVisible = ref(false);
const logo = ref(logoFallback); // Logo initially set to fallback

// Fetch the logo from the API
const fetchLogo = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/imageUpload/logo`);
    if (response.data && response.data.imageUrl) {
      logo.value = response.data.imageUrl; // Set the logo dynamically from API response
    } else {
      console.error("Logo imageUrl not found in API response.");
      logo.value = logoFallback;
    }
  } catch (error) {
    console.error("Error fetching the logo:", error);
    logo.value = logoFallback; // Set fallback logo in case of error
  }
};

onMounted(fetchLogo); // Fetch the logo when the component is mounted

const resetPassword = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  if (!password.value || !confirmPassword.value) {
    errorMessage.value = "Please fill in both password fields";
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match";
    return;
  }

  if (password.value.length < 6) {
    errorMessage.value = "Password must be at least 6 characters long";
    return;
  }

  try {
    const token = route.query.token;
    if (!token) {
      throw new Error("Token is missing");
    }

    await axios.post(`${apiUrl}/api/users/resetPassword`, {
      token: token,
      newPassword: password.value,
    });

    successMessage.value = "Password has been reset successfully";

    // Reload the page after a successful password reset
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  } catch (error) {
    errorMessage.value = error.response?.data?.error || "Password reset failed";
    console.error("Password reset error:", error);
  }
};
</script>

<style scoped></style>
