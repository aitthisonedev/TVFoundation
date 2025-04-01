<template>
  <v-row>
    <v-col cols="12">
      <v-card class="rounded-lg">
        <v-card-title class="d-flex justify-space-between align-center pa-6 bg-primary">
          <h6 class="text-h5 text-white font-weight-bold">Tourist Attraction Ads</h6>
          <v-btn color="primary" @click="openModal('add')">
            <v-icon left>mdi-plus</v-icon>Add
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text v-if="ads.length === 0">
          <p class="text-subtitle-1">No ads available.</p>
        </v-card-text>
        <v-card-text v-else>
          <v-table>
            <thead>
              <tr class="text-center">
                <th>SL</th>
                <th>Image</th>
                <th>Name (English)</th>
                <th>Name (Lao)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(ad, index) in ads" :key="index">
                <td>{{ index + 1 }}</td>
                <td class="text-center">
                  <v-img
                    v-if="ad.image"
                    :src="`${apiUrl}/ImageUpload/${ad.image}`"
                    width="auto"
                    height="100"
                    contain
                    class="mx-auto"
                  />
                </td>
                <td class="text-center">
                  <v-text-field
                    variant="plain"
                    v-model="ad.name_en"
                    readonly
                    @dblclick="openModal('edit', ad)"
                  />
                </td>
                <td class="text-center">
                  <v-text-field
                    variant="plain"
                    v-model="ad.name_lo"
                    readonly
                    @dblclick="openModal('edit', ad)"
                  />
                </td>
                <td class="justify-center align-center text-center">
                  <v-btn
                    @click="openModal('edit', ad)"
                    color="primary"
                    class="mr-2"
                    icon
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    @click="confirmDelete(index)"
                    color="error"
                    icon
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>

      <!-- Add/Edit Modal -->
      <v-dialog v-model="isModalVisible" max-width="500px">
        <v-card>
          <v-card-title>
            <h2 class="text-h5">{{ isEditing ? "Edit" : "Add" }} Ad</h2>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-form @submit.prevent="handleSave">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="formData.name_en"
                      label="Name (English)"
                      required
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="formData.name_lo"
                      label="Name (Lao)"
                      required
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-file-input
                      label="Ad Image"
                      accept="image/*"
                      @change="handleImageUpload"
                    />
                  </v-col>
                  <v-col cols="12" v-if="imagePreview || formData.image">
                    <v-img
                      :src="imagePreview || `${apiUrl}/ImageUpload/${formData.image}`"
                      max-height="200"
                      contain
                    />
                  </v-col>
                </v-row>
              </v-container>
              <v-card-actions class="justify-end">
                <v-btn color="primary" type="submit">{{ isEditing ? "Save" : "Add" }}</v-btn>
                <v-btn color="error" @click="closeModal">Cancel</v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- Delete Confirmation Dialog -->
      <v-dialog v-model="isDeleteDialogVisible" max-width="400px">
        <v-card>
          <v-card-title>Confirm Deletion</v-card-title>
          <v-card-text>Are you sure you want to delete this ad?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="deleteAd">Delete</v-btn>
            <v-btn color="grey" @click="closeDeleteDialog">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar v-model="snackbar.show" :color="snackbar.color">
        {{ snackbar.message }}
      </v-snackbar>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const ads = ref([]);
const isModalVisible = ref(false);
const isDeleteDialogVisible = ref(false);
const isEditing = ref(false);
const adToDeleteIndex = ref(null);
const imagePreview = ref(null);

const formData = ref({
  name_en: '',
  name_lo: '',
  image: null
});

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
});

const fetchAds = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/tourist-attraction-ads`);
    ads.value = response.data;
  } catch (error) {
    showSnackbar('Error fetching ads', 'error');
  }
};

const openModal = (action, ad = null) => {
  isEditing.value = action === 'edit';
  if (ad) {
    formData.value = { ...ad };
  } else {
    formData.value = { name_en: '', name_lo: '', image: null };
  }
  imagePreview.value = null;
  isModalVisible.value = true;
};

const handleImageUpload = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    formData.value.image = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const handleSave = async () => {
  try {
    const token = localStorage.getItem('token');
    const formDataToSend = new FormData();
    formDataToSend.append('name_en', formData.value.name_en);
    formDataToSend.append('name_lo', formData.value.name_lo);
    if (formData.value.image instanceof File) {
      formDataToSend.append('image', formData.value.image);
    }

    if (isEditing.value) {
      await axios.put(
        `${apiUrl}/api/tourist-attraction-ads/${formData.value.id}`,
        formDataToSend,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSnackbar('Ad updated successfully');
    } else {
      await axios.post(
        `${apiUrl}/api/tourist-attraction-ads`,
        formDataToSend,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSnackbar('Ad added successfully');
    }
    
    await fetchAds();
    closeModal();
  } catch (error) {
    showSnackbar('Error saving ad', 'error');
  }
};

const confirmDelete = (index) => {
  adToDeleteIndex.value = index;
  isDeleteDialogVisible.value = true;
};

const deleteAd = async () => {
  try {
    const token = localStorage.getItem('token');
    const adId = ads.value[adToDeleteIndex.value].id;
    await axios.delete(
      `${apiUrl}/api/tourist-attraction-ads/${adId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await fetchAds();
    showSnackbar('Ad deleted successfully');
    closeDeleteDialog();
  } catch (error) {
    showSnackbar('Error deleting ad', 'error');
  }
};

const closeModal = () => {
  isModalVisible.value = false;
  formData.value = { name_en: '', name_lo: '', image: null };
  imagePreview.value = null;
};

const closeDeleteDialog = () => {
  isDeleteDialogVisible.value = false;
  adToDeleteIndex.value = null;
};

const showSnackbar = (message, color = 'success') => {
  snackbar.value = {
    show: true,
    message,
    color,
  };
};

onMounted(fetchAds);
</script> 
