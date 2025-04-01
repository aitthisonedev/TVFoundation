<template>
  <v-card title="Update Other Links">
    <v-card-text>
      <v-textarea
        class="my-5"
        v-model="addressLao"
        label="Address (Lao)"
        rows="3"
        outlined
      ></v-textarea>
      <v-textarea
        class="my-5"
        v-model="addressEnglish"
        label="Address (English)"
        rows="3"
        outlined
      ></v-textarea>
      <v-textarea
        class="my-5"
        v-model="footerContentLao"
        label="Footer Content (Lao)"
        rows="3"
        outlined
      ></v-textarea>
      <v-textarea
        class="my-5"
        v-model="footerContentEnglish"
        label="Footer Content (English)"
        rows="3"
        outlined
      ></v-textarea>
      <v-textarea
        class="my-5"
        v-model="googleMap"
        label="Google Map Embed Code"
        rows="3"
        outlined
        hint="Paste your Google Maps embed iframe code here"
        persistent-hint
      ></v-textarea>
      <div v-if="addressLao || addressEnglish || footerContentLao || footerContentEnglish || googleMap" class="border-t pt-10">
        <h3 class="py-5">Preview</h3>
        <div class="my-3"><strong>Address (Lao):</strong> {{ addressLao }}</div>
        <div class="my-3"><strong>Address (English):</strong> {{ addressEnglish }}</div>
        <div class="my-3"><strong>Footer Content (Lao):</strong> {{ footerContentLao }}</div>
        <div class="my-3"><strong>Footer Content (English):</strong> {{ footerContentEnglish }}</div>
        <div class="my-3 mt-10 w-full">
          <strong>Google Map Preview:</strong>
          <div v-if="googleMap" class="mt-2 w-full" v-html="googleMap"></div>
        </div>
      </div>
      <div class="d-flex justify-end my-3">
        <v-btn 
          @click="saveFooterContents" 
          :disabled="!addressLao && !addressEnglish && !footerContentLao && !footerContentEnglish && !googleMap"
        >
          Save
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const addressLao = ref("");
const addressEnglish = ref("");
const footerContentLao = ref("");
const footerContentEnglish = ref("");
const googleMap = ref("");
const isContentSaved = ref(false);
const apiUrl = import.meta.env.VITE_API_URL;

const fetchFooterContents = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/other-contents`);
    if (response.data) {
      response.data.forEach(setting => {
        if (setting.type === 'address_lao') addressLao.value = setting.value;
        if (setting.type === 'address_english') addressEnglish.value = setting.value;
        if (setting.type === 'footer_lao') footerContentLao.value = setting.value;
        if (setting.type === 'footer_english') footerContentEnglish.value = setting.value;
        if (setting.type === 'google_map') googleMap.value = setting.value;
      });
    }
  } catch (error) {
    console.error("Error fetching footer contents:", error);
  }
};

const saveFooterContents = async () => {
  if (!addressLao.value && !addressEnglish.value && !footerContentLao.value && !footerContentEnglish.value && !googleMap.value) {
    alert("Please enter at least one content item before saving.");
    return;
  }

  try {
    const response = await axios.post(`${apiUrl}/api/other-contents`, {
      address_lao: addressLao.value,
      address_english: addressEnglish.value,
      footer_lao: footerContentLao.value,
      footer_english: footerContentEnglish.value,
      google_map: googleMap.value,
    });

    if (response.status === 200) {
      alert("Contents saved successfully!");
      isContentSaved.value = true;
    } else {
      alert("Failed to save contents.");
    }
  } catch (error) {
    console.error("Error saving contents:", error);
    alert("An error occurred while saving the contents.");
  }
};

onMounted(() => {
  fetchFooterContents();
});
</script>

<style scoped>

</style>
