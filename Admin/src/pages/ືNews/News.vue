<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title class="d-flex justify-space-between">
          <h4>News Management</h4>
          <v-btn class="bg-primary" @click="openAddDialog">
            <i class="bx bx-plus"></i> Add
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text v-if="newsList.length === 0">
          <p>No news available.</p>
        </v-card-text>
        <v-table v-else class="center-table">
          <thead>
            <tr class="head-Table">
              <th>SL</th>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Location</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(news, index) in paginatedNews" :key="index">
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td class="text-center">
                <v-img
                  v-if="news.image"
                  :src="`${apiUrl}/ImageUpload/${news.image}`"
                  width="auto"
                  height="100"
                  cover
                  class="ma-1 contain-image rounded"
                />
              </td>
              <td>{{ truncateText(news.name_en, 20) }}</td>
              <td>{{ news.category?.name_en || "N/A" }}</td>
              <td>{{ truncateText(news.location_en, 20) }}</td>
              <td class="text-center">
                <v-btn
                  @click="editItem(index)"
                  color="primary"
                  class="mr-2 pa-2 ma-2 rounded"
                  elevation="2"
                  size="medium"
                  icon
                >
                  <v-icon class="pa-0 text-sm">mdi-pencil</v-icon>
                  <span class="pa-0 d-none d-sm-inline text-sm">Edit</span>
                </v-btn>
                <v-btn
                  @click="openDeleteConfirmation(index)"
                  color="red"
                  class="mr-2 pa-2 ma-2 rounded"
                  elevation="2"
                  size="medium"
                  icon
                >
                  <v-icon class="text-sm">mdi-delete</v-icon>
                  <span class="d-sm-inline text-sm">Delete</span>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-pagination
          v-model="currentPage"
          :length="pageCount"
          @update:model-value="handlePageChange"
          :total-visible="5"
          size="large"
        ></v-pagination>
      </v-card>
    </v-col>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialogVisible" persistent max-width="1200px">
      <v-card class="rounded-lg py-3">
        <v-card-title>
          <v-toolbar class="pa-0 bg-primary rounded-lg">
            <v-btn icon="mdi-close" @click="closeDialog" color="white"></v-btn>
            <v-toolbar-title>{{ isEditing ? 'Edit' : 'Add' }} News</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn @click="closeDialog">Cancel</v-btn>
              <v-btn @click="saveItem" variant="outlined">
                {{ isEditing ? 'Save' : 'Add' }} News
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.name_en"
                label="Title (EN)"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.name_lo"
                label="Title (LO)"
                required
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-textarea
                v-model="formData.description_en"
                label="Description (EN)"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-textarea
                v-model="formData.description_lo"
                label="Description (LO)"
                required
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-textarea
                v-model="formData.content_en"
                label="Content (EN)"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-textarea
                v-model="formData.content_lo"
                label="Content (LO)"
                required
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.location_en"
                label="Location (EN)"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.location_lo"
                label="Location (LO)"
                required
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.caption_en"
                label="Caption (EN)"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.caption_lo"
                label="Caption (LO)"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.tags_en"
                label="Tags (EN)"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.tags_lo"
                label="Tags (LO)"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="formData.category_id"
                :items="categories"
                item-title="name_en"
                item-value="id"
                label="Category"
                required
              />
            </v-col>

            <v-col cols="12">
              <v-file-input
                label="Main Image"
                accept="image/*"
                @change="handleFileUpload($event, 'image')"
              />
            </v-col>

            <v-col cols="12">
              <v-sheet v-if="mainImagePreview || formData.image">
                <v-img
                  :src="mainImagePreview || `${apiUrl}/ImageUpload/${formData.image}`"
                  max-height="300"
                  contain
                />
              </v-sheet>
            </v-col>

            <v-col cols="12">
              <v-file-input
                label="Additional Images"
                accept="image/*"
                multiple
                @change="handleFileUpload($event, 'images')"
              />
            </v-col>

            <v-col cols="12">
              <v-row>
                <v-col
                  v-for="(preview, index) in additionalImagePreviews"
                  :key="index"
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                >
                  <v-card class="mx-auto" elevation="2">
                    <v-img
                      :src="preview"
                      aspect-ratio="1"
                      contain
                    >
                      <template v-slot:placeholder>
                        <v-row align="center" justify="center" class="fill-height">
                          <v-progress-circular indeterminate></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                    <v-overlay
                      activator="parent"
                      contained
                      class="align-center justify-center"
                    >
                      <v-btn
                        icon="mdi-close"
                        size="small"
                        color="error"
                        variant="tonal"
                        @click="removeAdditionalImage(index)"
                      ></v-btn>
                    </v-overlay>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="confirmDialogVisible" max-width="400px">
      <v-card>
        <v-card-title class="headline">Confirm Deletion</v-card-title>
        <v-card-text>Are you sure you want to delete this news item?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="confirmDelete" color="primary">Yes, Delete</v-btn>
          <v-btn @click="cancelDelete" color="grey">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.visible"
      :color="snackbar.color"
      location="top center"
      :timeout="3000"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </v-row>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const newsList = ref([]);
const categories = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const dialogVisible = ref(false);
const confirmDialogVisible = ref(false);
const deleteIndex = ref(null);
const isEditing = ref(false);
const mainImagePreview = ref(null);
const additionalImagePreviews = ref([]);

const formData = ref({
  name_en: '',
  name_lo: '',
  description_en: '',
  description_lo: '',
  content_en: '',
  content_lo: '',
  location_en: '',
  location_lo: '',
  caption_en: '',
  caption_lo: '',
  tags_en: '',
  tags_lo: '',
  category_id: null,
  image: null,
  images: []
});

const snackbar = ref({
  visible: false,
  message: '',
  color: 'success'
});

const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return newsList.value.slice(start, end);
});

const pageCount = computed(() => {
  return Math.ceil(newsList.value.length / itemsPerPage.value);
});

const fetchNews = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/news`);
    newsList.value = response.data;
  } catch (error) {
    showSnackbar('Error fetching news', 'error');
  }
};

const fetchCategories = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/news-categories`);
    categories.value = response.data;
  } catch (error) {
    showSnackbar('Error fetching categories', 'error');
  }
};

const handleFileUpload = (event, type) => {
  const files = event.target.files;
  if (!files) return;

  if (type === 'image') {
    formData.value.image = files[0];
    mainImagePreview.value = URL.createObjectURL(files[0]);
  } else if (type === 'images') {
    formData.value.images = Array.from(files);
    additionalImagePreviews.value = Array.from(files).map(file => URL.createObjectURL(file));
  }
};

const removeAdditionalImage = (index) => {
  formData.value.images.splice(index, 1);
  additionalImagePreviews.value.splice(index, 1);
};

const saveItem = async () => {
  try {
    if (!formData.value.name_en || !formData.value.name_lo) {
      showSnackbar('Title is required in both languages', 'error');
      return;
    }

    const formDataObj = new FormData();
    
    // Append all text fields
    Object.keys(formData.value).forEach(key => {
      if (key !== 'image' && key !== 'images') {
        formDataObj.append(key, formData.value[key]);
      }
    });

    // Append main image if exists
    if (formData.value.image instanceof File) {
      formDataObj.append('image', formData.value.image);
    }

    // Append additional images if they exist
    if (formData.value.images?.length) {
      formData.value.images.forEach(image => {
        formDataObj.append('images', image);
      });
    }

    const token = localStorage.getItem('token');
    const method = isEditing.value ? 'PUT' : 'POST';
    const url = isEditing.value 
      ? `${apiUrl}/api/news/${formData.value.news_id}`
      : `${apiUrl}/api/news`;

    const response = await axios({
      method,
      url,
      data: formDataObj,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    await fetchNews();
    showSnackbar(`News ${isEditing.value ? 'updated' : 'created'} successfully`);
    closeDialog();
  } catch (error) {
    console.error('Error saving news:', error);
    showSnackbar(error.response?.data?.error || 'Error saving news', 'error');
  }
};

const editItem = (index) => {
  const news = newsList.value[index];
  formData.value = { ...news };
  isEditing.value = true;
  dialogVisible.value = true;
};

const openAddDialog = () => {
  isEditing.value = false;
  formData.value = {
    name_en: '',
    name_lo: '',
    description_en: '',
    description_lo: '',
    content_en: '',
    content_lo: '',
    location_en: '',
    location_lo: '',
    caption_en: '',
    caption_lo: '',
    tags_en: '',
    tags_lo: '',
    category_id: null,
    image: null,
    images: []
  };
  mainImagePreview.value = null;
  additionalImagePreviews.value = [];
  dialogVisible.value = true;
};

const closeDialog = () => {
  dialogVisible.value = false;
  isEditing.value = false;
};

const openDeleteConfirmation = (index) => {
  deleteIndex.value = index;
  confirmDialogVisible.value = true;
};

const confirmDelete = async () => {
  try {
    const token = localStorage.getItem('token');
    const newsId = newsList.value[deleteIndex.value].news_id;
    await axios.delete(
      `${apiUrl}/api/news/${newsId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    await fetchNews();
    showSnackbar('News deleted successfully');
    confirmDialogVisible.value = false;
  } catch (error) {
    showSnackbar('Error deleting news', 'error');
  }
};

const cancelDelete = () => {
  confirmDialogVisible.value = false;
  deleteIndex.value = null;
};

const handlePageChange = (page) => {
  currentPage.value = page;
};

const truncateText = (text, length) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

const showSnackbar = (message, color = 'success') => {
  snackbar.value = {
    message,
    color,
    visible: true
  };
};

onMounted(async () => {
  await Promise.all([
    fetchNews(),
    fetchCategories()
  ]);
});
</script>

<style scoped>
.center-table {
  width: 100%;
}

.head-Table th {
  font-weight: bold;
  text-align: left;
}

.contain-image {
  object-fit: contain;
  background-color: #f5f5f5;
}

.v-card-title {
  background-color: var(--v-primary-base);
  color: white;
}

.dialog-actions {
  padding: 16px;
}
</style> 
