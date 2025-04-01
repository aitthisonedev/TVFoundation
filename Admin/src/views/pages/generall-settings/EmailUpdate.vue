<template>
  <v-card title="Update Email">
    <v-card-text>
      <v-textarea
        class="my-5"
        v-model="officeEmail"
        label="Office Email"
        rows="3"
        outlined
      ></v-textarea>
      <v-textarea
        class="my-5"
        v-model="contactEmail"
        label="Contact Email"
        rows="3"
        outlined
      ></v-textarea>
      <div v-if="officeEmail || contactEmail" class="border-t pt-10">
        <h3 class="py-5">Preview</h3>
        <div class="my-3"><strong>Office Email:</strong> {{ officeEmail }}</div>
        <div class="my-3"><strong>Contact Email:</strong> {{ contactEmail }}</div>
      </div>
      <div class="d-flex justify-end my-3">
        <v-btn @click="saveEmailSettings" :disabled="!officeEmail && !contactEmail">Save</v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const officeEmail = ref("");
const contactEmail = ref("");
const isContentSaved = ref(false);
const apiUrl = import.meta.env.VITE_API_URL;

const fetchEmailSettings = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/email-updates`);
    if (response.data) {
      response.data.forEach(setting => {
        if (setting.type === 'office') officeEmail.value = setting.value;
        if (setting.type === 'contact') contactEmail.value = setting.value;
      });
    }
  } catch (error) {
    console.error("Error fetching email settings:", error);
  }
};

const saveEmailSettings = async () => {
  if (!officeEmail.value && !contactEmail.value) {
    alert("Please enter the email settings first.");
    return;
  }

  try {
    const response = await axios.post(`${apiUrl}/api/email-updates`, {
      office: officeEmail.value,
      contact: contactEmail.value,
    });

    if (response.status === 200) {
      alert("Email settings saved successfully!");
      isContentSaved.value = true;
    } else {
      alert("Failed to save email settings.");
    }
  } catch (error) {
    console.error("Error saving email settings:", error);
    alert("An error occurred while saving the email settings.");
  }
};

onMounted(() => {
  fetchEmailSettings();
});
</script>
