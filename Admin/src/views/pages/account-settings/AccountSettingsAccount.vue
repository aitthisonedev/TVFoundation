<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import avatar1 from "@images/avatars/avt.jpg";

// Profile data and form data
const profile = ref({
  id: null, // Assuming `id` is part of the profile data
  name: "",
  lastname: "",
  email: "",
  phone: "",
  profile_image: "",
  blog_description_en: "",
  blog_description_lo: "",
});

const accountDataLocal = ref({}); // Local copy of profile data for the bottom form
const apiUrl = import.meta.env.VITE_API_URL;
const newProfileImage = ref(null);
const errorMessage = ref("");
const successMessage = ref("");
const isAccountDeactivated = ref(false);
const refInputEl = ref(null);
const showDialog = ref(false); // Controls the success dialog visibility

// Fetch profile information with token from localStorage
const fetchProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${apiUrl}/api/users/getProfile`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    profile.value = response.data;
    accountDataLocal.value = { ...response.data }; // Sync the local data with the fetched profile data
  } catch (error) {
    console.error("Failed to fetch profile", error);
  }
};

// Handle image upload
const handleImageUpload = async () => {
  if (!newProfileImage.value) {
    errorMessage.value = "Please select an image to upload.";
    return;
  }

  const formData = new FormData();
  formData.append("image", newProfileImage.value);

  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${apiUrl}/api/users/uploadProfileImage`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    profile.value.profile_image = response.data.profile_image;
    accountDataLocal.value.profile_image = response.data.profile_image; // Update local form data
    successMessage.value = "Profile image uploaded successfully.";
  } catch (error) {
    errorMessage.value = "Failed to upload image.";
    console.error("Image upload error", error);
  }
};

// Update user profile
const updateUserProfile = async () => {
  try {
    const token = localStorage.getItem("token");
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
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    await fetchProfile();
    successMessage.value = "Profile updated successfully.";
    showDialog.value = true; // Show the success dialog
  } catch (error) {
    errorMessage.value = "Failed to update profile.";
    console.error("Update profile error", error);
  }
};

// Combined function to handle both image upload and profile update
const saveChangesAndUploadImage = async () => {
  if (newProfileImage.value) {
    await handleImageUpload(); // Upload the image first if there is a new one
  }
  await updateUserProfile(); // Then update the profile data
};

// Reset the bottom form to the original profile data
const resetForm = () => {
  accountDataLocal.value = { ...profile.value };
};

// Handle avatar change
const changeAvatar = (file) => {
  const { files } = file.target;
  if (files && files.length) {
    newProfileImage.value = files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(files[0]);
    fileReader.onload = () => {
      if (typeof fileReader.result === "string") {
        accountDataLocal.value.profile_image = fileReader.result;
      }
    };
  }
};

// Reset the avatar to the original profile image
const resetAvatar = () => {
  accountDataLocal.value.profile_image = profile.value.profile_image;
};

// Fetch profile data on component mount
onMounted(fetchProfile);
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Account Details">
        <VCardText class="d-flex">
          <VAvatar
            rounded="lg"
            size="100"
            class="me-6"
            :image="accountDataLocal.profile_image || avatar1"
          />

          <form class="d-flex flex-column justify-center gap-5">
            <div class="d-flex flex-wrap gap-2">
              <VBtn color="primary" @click="refInputEl?.click()">
                <VIcon icon="bx-cloud-upload" class="d-sm-none" />
                <span class="d-none d-sm-block">Upload new photo</span>
              </VBtn>

              <input
                ref="refInputEl"
                type="file"
                name="file"
                accept=".jpeg,.png,.jpg,GIF"
                hidden
                @input="changeAvatar"
              />
              <VBtn
                type="reset"
                color="error"
                variant="tonal"
                @click="resetAvatar"
              >
                <span class="d-none d-sm-block">Reset</span>
                <VIcon icon="bx-refresh" class="d-sm-none" />
              </VBtn>
            </div>

            <p class="text-body-1 mb-0">
              Allowed JPG, GIF or PNG. Max size of 800K
            </p>
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
                <v-col cols="12" class="mt-4 d-flex justify-space-between">
                  <v-btn
                    @click="saveChangesAndUploadImage"
                    color="primary"
                    >Save change</v-btn
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
    </VCol>

    <VCol cols="12">
      <VCard title="Deactivate Account">
        <VCardText>
          <div>
            <VCheckbox
              v-model="isAccountDeactivated"
              label="I confirm my account deactivation"
            />
          </div>

          <VBtn :disabled="!isAccountDeactivated" color="error" class="mt-3">
            Deactivate Account
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>

    <!-- Success Dialog -->
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
