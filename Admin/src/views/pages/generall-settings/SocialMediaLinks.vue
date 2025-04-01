<template>
  <v-card title="Update Social Media Links">
    <v-card-text>
      <v-textarea
        class="my-5"
        v-model="facebookLink"
        label="Facebook Link"
        rows="1"
        outlined
      ></v-textarea>
      <v-textarea
        class="my-5"
        v-model="whatsappLink"
        label="WhatsApp Link"
        rows="1"
        outlined
      ></v-textarea>
      <v-textarea
        class="my-5"
        v-model="wechatLink"
        label="Line Link"
        rows="1"
        outlined
      ></v-textarea>
      <v-textarea
        class="my-5"
        v-model="callLink"
        label="Call Link"
        rows="1"
        outlined
      ></v-textarea>
      <div v-if="facebookLink || whatsappLink || wechatLink || callLink" class="preview-section">
        <h3 class="py-5">Preview</h3>
        <div class="my-3"><strong>Facebook Link:</strong> {{ facebookLink }}</div>
        <div class="my-3"><strong>WhatsApp Link:</strong> {{ whatsappLink }}</div>
        <div class="my-3"><strong>Line Link:</strong> {{ wechatLink }}</div>
        <div class="my-3"><strong>Call Link:</strong> {{ callLink }}</div>
      </div>
      <div class="d-flex justify-end my-3">
        <v-btn @click="saveSocialLinks" :disabled="!facebookLink && !whatsappLink && !wechatLink && !callLink">Save</v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const facebookLink = ref("");
const whatsappLink = ref("");
const wechatLink = ref("");
const callLink = ref("");
const isContentSaved = ref(false);
const apiUrl = import.meta.env.VITE_API_URL;

const fetchSocialLinks = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/social-links`);
    if (response.data) {
      response.data.forEach(setting => {
        if (setting.type === 'facebook') facebookLink.value = setting.value;
        if (setting.type === 'whatsapp') whatsappLink.value = setting.value;
        if (setting.type === 'wechat') wechatLink.value = setting.value;
        if (setting.type === 'call') callLink.value = setting.value;
      });
    }
  } catch (error) {
    console.error("Error fetching social links:", error);
  }
};

const saveSocialLinks = async () => {
  if (!facebookLink.value && !whatsappLink.value && !wechatLink.value && !callLink.value) {
    alert("Please enter the social media links first.");
    return;
  }

  try {
    const response = await axios.post(`${apiUrl}/api/social-links`, {
      facebook: facebookLink.value,
      whatsapp: whatsappLink.value,
      wechat: wechatLink.value,
      call: callLink.value,
    });

    if (response.status === 200) {
      alert("Social media links saved successfully!");
      isContentSaved.value = true;
    } else {
      alert("Failed to save social media links.");
    }
  } catch (error) {
    console.error("Error saving social media links:", error);
    alert("An error occurred while saving the social media links.");
  }
};

onMounted(() => {
  fetchSocialLinks();
});
</script>

<style scoped>
.preview-section {
  border-top: 1px solid #ddd;
  padding-top: 10px;
}

.d-flex {
  display: flex;
}

.justify-end {
  justify-content: flex-end;
}
</style>
