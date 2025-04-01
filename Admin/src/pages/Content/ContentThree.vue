<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
const contentList = ref([]);
const dialogVisible = ref(false);
const isEditing = ref(false);
const imagePreview = ref(null);
const confirmDialogVisible = ref(false);
const itemToDeleteIndex = ref(null);
const currentPage = ref(1);
const itemsPerPage = ref(10);

const formData = ref({
  title_en: "",
  title_lo: "",
  description_en: "",
  description_lo: "",
  image: null,
});

const snackbar = ref({
  visible: false,
  message: "",
  color: "success",
});

// Computed properties
const pageCount = computed(() => Math.ceil(contentList.value.length / itemsPerPage.value));
const paginatedContents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return contentList.value.slice(start, end);
});

// Functions
const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.value.image = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const handleImageError = (error) => {
  console.error('Error loading image:', error);
  error.target.src = '/path-to-fallback-image.jpg';
};

const truncateText = (text, length) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

const resetForm = () => {
  formData.value = {
    title_en: "",
    title_lo: "",
    description_en: "",
    description_lo: "",
    image: null,
  };
  imagePreview.value = null;
  isEditing.value = false;
};

const editContent = (content) => {
  isEditing.value = true;
  formData.value = { ...content };
  imagePreview.value = content.image ? `${apiUrl}/ImageUpload/${content.image}` : null;
  dialogVisible.value = true;
};

const submitForm = async () => {
  try {
    const formDataToSend = new FormData();
    Object.keys(formData.value).forEach(key => {
      if (formData.value[key] !== null) {
        if (key === 'image' && formData.value[key] instanceof File) {
          formDataToSend.append(key, formData.value[key]);
        } else if (key !== 'image') {
          formDataToSend.append(key, formData.value[key]);
        }
      }
    });

    if (isEditing.value) {
      await axios.put(`${apiUrl}/api/content-threes/${formData.value.id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      snackbar.value.message = "Content updated successfully!";
    } else {
      await axios.post(`${apiUrl}/api/content-threes`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      snackbar.value.message = "Content created successfully!";
    }

    await fetchContents();
    dialogVisible.value = false;
    snackbar.value.visible = true;
    snackbar.value.color = "success";
    resetForm();
  } catch (error) {
    console.error("Error submitting form:", error);
    snackbar.value = {
      visible: true,
      message: "Error saving content",
      color: "error",
    };
  }
};

const openDeleteConfirmation = (index) => {
  itemToDeleteIndex.value = index;
  confirmDialogVisible.value = true;
};

const cancelDelete = () => {
  itemToDeleteIndex.value = null;
  confirmDialogVisible.value = false;
};

const confirmDelete = async () => {
  try {
    const contentId = paginatedContents.value[itemToDeleteIndex.value].id;
    await axios.delete(`${apiUrl}/api/content-threes/${contentId}`);
    
    snackbar.value = {
      visible: true,
      message: 'Content deleted successfully',
      color: 'success',
    };
    
    fetchContents();
  } catch (error) {
    console.error('Error deleting content:', error);
    snackbar.value = {
      visible: true,
      message: 'Error deleting content',
      color: 'error',
    };
  } finally {
    cancelDelete();
  }
};

const handlePageChange = (page) => {
  currentPage.value = page;
};

const fetchContents = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/content-threes`);
    contentList.value = response.data;
  } catch (error) {
    console.error("Error fetching contents:", error);
    snackbar.value = {
      visible: true,
      message: "Error fetching contents",
      color: "error",
    };
  }
};

onMounted(fetchContents);
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-card elevation="2" class="rounded-lg">
        <v-card-title class="d-flex justify-space-between align-center pa-6 bg-primary">
          <h6 class="text-h5 text-white font-weight-bold">How do we work?</h6>
          <v-btn 
            color="white" 
            variant="flat"
            prepend-icon="mdi-plus"
            class="text-capitalize"
            @click="dialogVisible = true"
          >
            Add New
          </v-btn>
        </v-card-title>

        <v-card-text v-if="contentList.length === 0" class="pa-6 text-center">
          <p class="text-subtitle-1 text-grey">No content available.</p>
        </v-card-text>

        <v-card-text v-else class="pa-4">
          <v-table hover class="rounded">
            <thead>
              <tr>
                <th class="text-left font-weight-bold">SL</th>
                <th class="text-left font-weight-bold">Image</th>
                <th class="text-left font-weight-bold">Title (EN)</th>
                <th class="text-left font-weight-bold">Title (LO)</th>
                <th class="text-left font-weight-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(content, index) in paginatedContents" :key="content.id">
                <td class="text-caption">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="py-2" style="width: 120px">
                  <v-img
                    class="rounded-lg mx-auto"
                    width="100"
                    height="auto"
                    :src="content.image ? `${apiUrl}/ImageUpload/${content.image}` : ''"
                    cover
                    @error="handleImageError"
                  >
                    <template v-slot:placeholder>
                      <v-row align="center" justify="center" class="fill-height">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </td>
                <td class="text-body-2">{{ truncateText(content.title_en, 50) }}</td>
                <td class="text-body-2">{{ truncateText(content.title_lo, 50) }}</td>
                <td>
                  <v-btn
                    size="small"
                    color="warning"
                    variant="flat"
                    class="mr-2"
                    @click="editContent(content)"
                  >
                    <v-icon size="small">mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    size="small"
                    color="error"
                    variant="flat"
                    @click="openDeleteConfirmation(index)"
                  >
                    <v-icon size="small">mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>

          <div class="d-flex justify-center mt-6">
            <v-pagination
              v-model="currentPage"
              :length="pageCount"
              rounded="circle"
              @update:modelValue="handlePageChange"
            ></v-pagination>
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialogVisible" persistent max-width="800px">
      <v-card class="rounded-lg">
        <v-card-title class="pa-6 bg-primary text-white">
          <span class="text-h5 font-weight-bold">{{ isEditing ? 'Edit' : 'Add' }} Content</span>
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form @submit.prevent="submitForm">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.title_en"
                  label="Title (EN)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.title_lo"
                  label="Title (LO)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="formData.description_en"
                  label="Description (EN)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="formData.description_lo"
                  label="Description (LO)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12">
                <v-file-input
                  label="Upload Image"
                  accept="image/*"
                  prepend-icon="mdi-camera"
                  variant="outlined"
                  class="rounded-lg"
                  @change="handleImageChange"
                />
                <v-avatar
                  v-if="imagePreview"
                  :image="imagePreview"
                  size="150"
                  class="mt-4 rounded-lg"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn 
            color="error" 
            variant="flat"
            class="text-capitalize mr-2"
            @click="dialogVisible = false"
          >
            Cancel
          </v-btn>
          <v-btn 
            color="primary"
            variant="flat" 
            class="text-capitalize"
            @click="submitForm"
          >
            {{ isEditing ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="confirmDialogVisible" max-width="400px">
      <v-card class="rounded-lg">
        <v-card-title class="pa-6 bg-error text-white">Confirm Delete</v-card-title>
        <v-card-text class="pa-6 text-body-1">
          Are you sure you want to delete this content?
        </v-card-text>
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn 
            color="grey" 
            variant="flat"
            class="text-capitalize mr-2"
            @click="cancelDelete"
          >
            Cancel
          </v-btn>
          <v-btn 
            color="error"
            variant="flat"
            class="text-capitalize"
            @click="confirmDelete"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.visible"
      :color="snackbar.color"
      location="top"
      class="text-center"
      timeout="3000"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </v-row>
</template>

<style>
  
</style>
