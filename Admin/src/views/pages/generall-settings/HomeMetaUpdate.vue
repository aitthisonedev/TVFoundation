<template>
  <v-card title="Update Home Meta">
    <v-card-text>
      <div class="py-6">
        <v-text-field
          class="my-3"
          v-model="metaTitle"
          label="Meta Title"
          outlined
        ></v-text-field>
        <v-textarea
          class="my-5"
          v-model="metaKeywords"
          label="Meta Keywords"
          rows="5"
          outlined
        ></v-textarea>
        <v-textarea
          class="my-5"
          v-model="metaDescription"
          label="Meta Description"
          rows="3"
          outlined
        ></v-textarea>
      </div>
      <div
        v-if="metaTitle || metaDescription || metaKeywords"
        class="preview-section"
      >
        <h3 class="py-3">Preview</h3>
        <div class="my-3"><strong>Title:</strong> {{ metaTitle }}</div>
        <div class="my-3">
          <strong>Description:</strong> {{ metaDescription }}
        </div>
        <div class="my-3"><strong>Keywords:</strong> {{ metaKeywords }}</div>
      </div>
      <div class="d-flex justify-end">
        <v-btn
          @click="saveMeta"
          :disabled="!metaTitle && !metaDescription && !metaKeywords"
          >Save
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const metaTitle = ref("");
const metaDescription = ref("");
const metaKeywords = ref("");
const apiUrl = import.meta.env.VITE_API_URL;

// Fetch existing meta information on component mount
const fetchMeta = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/homeMeta`);
    if (response.ok) {
      const data = await response.json();
      metaTitle.value = data.title || "";
      metaDescription.value = data.description || "";
      metaKeywords.value = data.keywords || "";
    } else {
      console.error('Failed to fetch home meta information.');
    }
  } catch (error) {
    console.error('Error fetching home meta information:', error);
  }
};

// Save updated meta information
const saveMeta = async () => {
  if (!metaTitle.value && !metaDescription.value && !metaKeywords.value) {
    alert("Please enter meta information first.");
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/api/homeMeta`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: metaTitle.value,
        description: metaDescription.value,
        keywords: metaKeywords.value,
      }),
    });

    if (response.ok) {
      alert('Home meta information saved successfully!');
    } else {
      alert('Failed to save home meta information.');
    }
  } catch (error) {
    console.error('Error saving home meta information:', error);
    alert('An error occurred while saving the home meta information.');
  }
};

// Fetch the existing meta information when the component mounts
onMounted(fetchMeta);
</script>
