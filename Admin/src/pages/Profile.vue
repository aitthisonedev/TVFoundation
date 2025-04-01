<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import avatar1 from "@images/avatars/avt.jpg";
const apiUrl = import.meta.env.VITE_API_URL;

const profile = ref({
  name: "",
  lastname: "", // Added lastname field
  email: "",
  phone: "",
  profile_image: "",
  blog_description_en: "",
  blog_description_lo: "",
});

const newProfileImage = ref(null);
const errorMessage = ref("");
const successMessage = ref("");

// Fetch profile information with token from localStorage
const fetchProfile = async () => {
  try {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    const response = await axios.get(`${apiUrl}/api/users/getProfile`,
      {
        headers: { Authorization: `Bearer ${token}` }, // Include token in the headers
      }
    );
    profile.value = response.data;
  } catch (error) {
    console.error("Failed to fetch profile", error);
  }
};

// Handle image upload
const handleImageUpload = async () => {
  if (!newProfileImage.value || !newProfileImage.value.length) {
    errorMessage.value = "Please select an image to upload.";
    return;
  }

  const formData = new FormData();
  // Assuming newProfileImage.value is an array of files
  formData.append("image", newProfileImage.value[0]); // Extract the first file from the array

  try {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    await axios.post(`${apiUrl}/api/users/uploadProfileImage`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Include token in the headers
        },
      }
    );
    await fetchProfile(); // Refresh profile data
    errorMessage.value = "";
    successMessage.value = "Profile image uploaded successfully.";
  } catch (error) {
    errorMessage.value = "Failed to upload image.";
    console.error("Image upload error", error);
  }
};

// Update user profile
const updateUserProfile = async () => {
  try {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    await axios.put(`${apiUrl}/api/users/update/${profile.value.id}`,
      {
        name: profile.value.name,
        lastname: profile.value.lastname,
        email: profile.value.email,
        phone: profile.value.phone,
        blog_description_en: profile.value.blog_description_en,
        blog_description_lo: profile.value.blog_description_lo,
      },
      {
        headers: { Authorization: `Bearer ${token}` }, // Include token in the headers
      }
    );
    await fetchProfile();
    successMessage.value = "Profile updated successfully.";
  } catch (error) {
    errorMessage.value = "Failed to update profile.";
    console.error("Update profile error", error);
  }
};

onMounted(fetchProfile);
</script>

<template>
  <VRow>
    <VCol cols="12">
      <v-card>
        <VCard title="Account Management">
          <VCardText class="d-flex">
            <v-img
              :src="profile.profile_image || avatar1"
              class="me-6"
              rounded="lg"
              size="100"
              max-width="150"
              max-height="150"
              contain
            />
            <form class="d-flex flex-column justify-center gap-5">
              <div class="d-flex flex-wrap gap-2">
                <v-file-input
                  v-model="newProfileImage"
                  type="file"
                  label="Update"
                  name="file"
                  variant="none"
                  accept="image/*"
                />
              </div>

              <VBtn class="text-body-1 mb-0"> Update your profile </VBtn>
            </form>
          </VCardText>
          <VDivider />
          <VCardText>
            <VForm class="mt-6">
              <VRow>
                <VCol md="6" cols="12">
                  <v-text-field v-model="profile.name" label="Name" />
                </VCol>
                <VCol md="6" cols="12">
                  <v-text-field v-model="profile.lastname" label="Last Name" />
                </VCol>
                <VCol md="6" cols="12">
                  <v-text-field v-model="profile.email" label="Email" />
                </VCol>
                <VCol md="6" cols="12">
                  <v-text-field v-model="profile.phone" label="Phone" />
                </VCol>
                <VCol md="6" cols="12">
                  <v-textarea
                    v-model="profile.blog_description_en"
                    label="Blog Description (English)"
                    rows="3"
                  />
                </VCol>
                <VCol md="6" cols="12">
                  <v-textarea
                    v-model="profile.blog_description_lo"
                    label="Blog Description (Lao)"
                    rows="3"
                  />
                </VCol>

                <v-row>
                  <v-col cols="12">
                    <v-file-input
                      v-model="newProfileImage"
                      label="Upload New Profile Image"
                      accept="image/*"
                    />
                  </v-col>
                  <v-col cols="12" class="mt-4 d-flex justify-space-between">
                    <v-btn
                      @click="handleImageUpload"
                      :disabled="!newProfileImage"
                      color="primary"
                      >Upload Image</v-btn
                    >
                    <v-btn @click="updateUserProfile" color="secondary"
                      >Update Profile</v-btn
                    >
                  </v-col>
                  <v-col cols="12">
                    <v-alert v-if="errorMessage" type="error">{{
                      errorMessage
                    }}</v-alert>
                    <v-alert v-if="successMessage" type="success">{{
                      successMessage
                    }}</v-alert>
                  </v-col>
                </v-row>
              </VRow>
            </VForm>
          </VCardText>
        </VCard>
      </v-card>
    </VCol>
    <VDialog v-model="showDialog" max-width="290">
      <VCard>
        <VCardTitle class="headline">Success</VCardTitle>
        <VCardText>Profile updated successfully!</VCardText>
        <VCardActions>
          <VBtn color="primary" text @click="showDialog = false">Close</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VRow>
</template>

<style scoped>
.profile-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
}

.profile-image-preview {
  border-radius: 50%;
  margin: 0 auto; /* Center the image horizontally */
}
</style>
