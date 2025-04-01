<template>
  <v-card>
    <v-card-title>Update Logo</v-card-title>
    <v-col cols="12" class="d-flex">
      <v-col cols="6">
        <v-card-text>
          <v-file-input
            v-model="logo1File"
            class="my-5"
            label="Upload Logo One"
            prepend-icon="mdi-cloud-upload"
            @change="onFileChange1"
            accept="image/*"
            :show-size="true"
          ></v-file-input>

          <div v-if="logo1Url" class="d-flex align-center mt-2">
            <v-img
              :src="logo1Url"
              alt="Logo One Preview"
              width="150"
              height="150"
              class="rounded"
              contain
            />
          </div>

          <div v-if="uploadedImage1Url" class="mt-4">
            <div class="text-h6">Logo Header</div>
            <v-img
              :src="uploadedImage1Url"
              alt="Current logo one"
              width="150"
              height="150"
              class="rounded mt-2"
              contain
            />
          </div>

        </v-card-text>
      </v-col>
      <v-col cols="6">
        <v-card-text>
          <v-file-input
            v-model="logo2File"
            class="my-5"
            label="Upload Logo Two"
            prepend-icon="mdi-cloud-upload"
            @change="onFileChange2"
            accept="image/*"
            :show-size="true"
          ></v-file-input>

          <div v-if="logo2Url" class="d-flex align-center mt-2">
            <v-img
              :src="logo2Url"
              alt="Logo Two Preview"
              width="150"
              height="150"
              class="rounded"
              contain
            />
          </div>

          <div v-if="uploadedImage2Url" class="mt-4">
            <div class="text-h6">Logo Footer</div>
            <v-img
              :src="uploadedImage2Url"
              alt="Current logo two"
              width="150"
              height="150"
              class="rounded mt-2"
              contain
            />
          </div>
        </v-card-text>
      </v-col>
    </v-col>
    <v-row class="ma-5">
      <v-col cols="6">
        <v-btn color="primary" @click="uploadLogo1">
          Update
        </v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn color="primary" @click="uploadLogo2">
          Update
        </v-btn>
      </v-col>
    </v-row>
    <v-snackbar
      v-model="snackbar.visible"
      :color="snackbar.color"
      timeout="3000"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";

const logo1Url = ref(null);
const logo1File = ref(null);
const uploadedImage1Url = ref(null);
const logo2Url = ref(null);
const logo2File = ref(null);
const uploadedImage2Url = ref(null);
const apiUrl = import.meta.env.VITE_API_URL;
const fileInput1 = ref(null);
const fileInput2 = ref(null);

const snackbar = ref({
  visible: false,
  message: "",
  color: "",
});

const onFileChange1 = (event) => {
  const file = event.target?.files?.[0] || event?.target?.file;
  if (file) {
    logo1File.value = file;
    logo1Url.value = URL.createObjectURL(file);
  }
};

const onFileChange2 = (event) => {
  const file = event.target?.files?.[0] || event?.target?.file;
  if (file) {
    logo2File.value = file;
    logo2Url.value = URL.createObjectURL(file);
  }
};

const uploadLogo1 = async () => {
  await uploadLogo(logo1File.value, "logo1", "1", uploadedImage1Url);
};

const uploadLogo2 = async () => {
  await uploadLogo(logo2File.value, "logo2", "2", uploadedImage2Url);
};

const uploadLogo = async (file, type, seqID, uploadedImageUrl) => {
  if (!file) {
    snackbar.value = {
      visible: true,
      message: "Please select a file first.",
      color: "error",
    };
    return;
  }

  const formData = new FormData();
  formData.append("type", type);
  formData.append("image", file);
  formData.append("seqID", seqID);

  try {
    const response = await fetch(`${apiUrl}/api/imageUpload/upload`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      snackbar.value = {
        visible: true,
        message: `${type} updated successfully!`,
        color: "success",
      };
      uploadedImageUrl.value = result.imageUrl;

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      snackbar.value = {
        visible: true,
        message: `Failed to upload ${type}.`,
        color: "error",
      };
    }
  } catch (error) {
    console.error(`Error uploading ${type}:`, error);
    snackbar.value = {
      visible: true,
      message: `An error occurred while uploading the ${type}.`,
      color: "error",
    };
  }
};

// Update onMounted to fetch both logos
onMounted(async () => {
  try {
    const [logo1Response, logo2Response] = await Promise.all([
      fetch(`${apiUrl}/api/imageUpload/logo1`),
      fetch(`${apiUrl}/api/imageUpload/logo2`),
    ]);

    if (logo1Response.ok) {
      const result = await logo1Response.json();
      uploadedImage1Url.value = result.imageUrl;
    }

    if (logo2Response.ok) {
      const result = await logo2Response.json();
      uploadedImage2Url.value = result.imageUrl;
    }
  } catch (error) {
    console.error("Error fetching existing image URLs:", error);
  }
});
</script>
