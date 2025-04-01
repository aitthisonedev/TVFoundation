<template>
  <v-card title="Update Phone Numbers">
    <v-card-text>
      <v-textarea
        class="my-5"
        v-model="officeNumber"
        label="Office Number"
        rows="1"
        outlined
      ></v-textarea>
      <v-textarea
        class="my-5"
        v-model="phoneNumber"
        label="Phone Number"
        rows="1"
        outlined
      ></v-textarea>
      <div
        v-if="officeNumber || phoneNumber || senoNumber || pakseNumber"
        class="border-t pt-10"
      >
        <h3 class="py-5">Preview</h3>
        <div class="my-3">
          <strong>Office Number:</strong> {{ officeNumber }}
        </div>
        <div class="my-3"><strong>Phone Number:</strong> {{ phoneNumber }}</div>
      </div>
      <div class="d-flex justify-end my-3">
        <v-btn
          @click="savePhoneSettings"
          :disabled="
            !officeNumber && !phoneNumber && !senoNumber && !pakseNumber
          "
          >Save</v-btn
        >
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const officeNumber = ref("");
const phoneNumber = ref("");
const senoNumber = ref("");
const pakseNumber = ref("");
const isContentSaved = ref(false);
const apiUrl = import.meta.env.VITE_API_URL;

const fetchPhoneSettings = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/phone-updates`);
    if (response.data) {
      response.data.forEach((setting) => {
        if (setting.type === "office_number")
          officeNumber.value = setting.value;
        if (setting.type === "phone_number") phoneNumber.value = setting.value;
        if (setting.type === "seno_Number") senoNumber.value = setting.value;
        if (setting.type === "pakse_Number") pakseNumber.value = setting.value;
      });
    }
  } catch (error) {
    console.error("Error fetching phone settings:", error);
  }
};

const savePhoneSettings = async () => {
  if (
    !officeNumber.value &&
    !phoneNumber.value &&
    !pakseNumber.value &&
    !senoNumber.value
  ) {
    alert("Please enter the phone settings first.");
    return;
  }

  try {
    const response = await axios.post(`${apiUrl}/api/phone-updates`, {
      office_number: officeNumber.value,
      phone_number: phoneNumber.value,
      pakse_Number: pakseNumber.value,
      seno_Number: senoNumber.value,
    });

    if (response.status === 200) {
      alert("Phone settings saved successfully!");
      isContentSaved.value = true;
    } else {
      alert("Failed to save phone settings.");
    }
  } catch (error) {
    console.error("Error saving phone settings:", error);
    alert("An error occurred while saving the phone settings.");
  }
};

onMounted(() => {
  fetchPhoneSettings();
});
</script>
