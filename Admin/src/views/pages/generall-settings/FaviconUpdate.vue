<template>
  <v-card title="Update Favicon">
    <v-card-text>
      <div class="mb-5">
        <input type="file" @change="onFileChange" accept="image/*" />
      </div>
      <div v-if="faviconUrl" class="mb-5">
        <div class="text-h6">Favicon Preview {{ faviconUrl }}</div>
        <v-img
          :src="faviconUrl"
          alt="Favicon Preview"
          width="64"
          height="64"
          class="mt-2 border rounded"
        />
      </div>
      <div v-if="uploadedImageUrl" class="mt-5">
        <div class="text-h6">Uploaded Image</div>
        <v-img
          :src="uploadedImageUrl"
          alt="Uploaded Image"
          width="100"
          height="100"
          class="mt-2 border rounded"
        />
      </div>
      <div class="d-flex justify-end">
        <v-btn
          color="primary"
          :disabled="!faviconFile"
          @click="uploadFavicon"
          class="px-5"
        >
          Save
        </v-btn>
      </div>
      <v-snackbar v-model="snackbar.visible" :color="snackbar.color">
        {{ snackbar.message }}
        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="snackbar.visible = false">Close</v-btn>
        </template>
      </v-snackbar>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const faviconUrl = ref(null);
const faviconFile = ref(null);
const uploadedImageUrl = ref(null);
const apiUrl = import.meta.env.VITE_API_URL;

const snackbar = ref({
  visible: false,
  message: '',
  color: ''
});

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    faviconFile.value = file;
    faviconUrl.value = URL.createObjectURL(file);
  }
};

const uploadFavicon = async () => {
  if (!faviconFile.value) {
    snackbar.value = {
      visible: true,
      message: 'Please select a file first.',
      color: 'error'
    };
    return;
  }

  const formData = new FormData();
  formData.append('type', 'favicon'); // Adjust this value based on your requirement
  formData.append('image', faviconFile.value); // Append the file
  formData.append('seqID', '8'); // Adjust this value based on your requirement

  try {
    const response = await fetch(`${apiUrl}/api/imageUpload/upload`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      snackbar.value = {
        visible: true,
        message: 'Favicon updated successfully!',
        color: 'success'
      };

      console.log(result);
      uploadedImageUrl.value = result.imageUrl; // Set the image URL from the response

      // Clear the file input and preview
      faviconUrl.value = null;
      faviconFile.value = null;
    } else {
      snackbar.value = {
        visible: true,
        message: 'Failed to upload favicon.',
        color: 'error'
      };
    }
  } catch (error) {
    console.error('Error uploading favicon:', error);
    snackbar.value = {
      visible: true,
      message: 'An error occurred while uploading the favicon.',
      color: 'error'
    };
  }
};

// Fetch the existing image URL when the component mounts
onMounted(async () => {
  try {
    const response = await fetch(`${apiUrl}/api/imageUpload/favicon`);
    if (response.ok) {
      const result = await response.json();
      if (result.imageUrl) {
        uploadedImageUrl.value = result.imageUrl;
      } else {
        console.error('No imageUrl in the response:', result);
      }
    } else {
      console.error('Failed to fetch existing image URL:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching existing image URL:', error);
  }
});

</script>
