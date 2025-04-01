<template>
  <v-row>
    <v-col cols="12">
      <v-card class="rounded-lg">
        <v-card-title class="d-flex justify-space-between align-center pa-6 bg-primary">
          <h6 class="text-h5 text-white font-weight-bold">Categories</h6>
          <v-btn color="primary" @click="openModal('add')">
            <v-icon left>mdi-plus</v-icon>Add
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text v-if="categories.length === 0">
          <p class="text-subtitle-1">No categories available.</p>
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
              <tr v-for="(category, index) in categories" :key="index">
                <td>{{ index + 1 }}</td>
                <td class="text-center">
                  <v-img
                    v-if="category.image"
                    :src="`${apiUrl}/ImageUpload/${category.image}`"
                    width="200"
                    height="auto"
                    contain
                    class="mx-auto pa-1 rounded-xl"
                  />
                </td>
                <td class="text-center">
                  <v-text-field
                    variant="plain"
                    v-model="category.name_en"
                    readonly
                    @dblclick="openModal('edit', category)"
                  />
                </td>
                <td class="text-center">
                  <v-text-field
                    variant="plain"
                    v-model="category.name_lo"
                    readonly
                    @dblclick="openModal('edit', category)"
                  />
                </td>
                <td class="justify-center align-center text-center">
                  <v-btn
                    @click="openModal('edit', category)"
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
                    @click="confirmDelete(index)"
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
        </v-card-text>
      </v-card>

      <!-- Add/Edit Modal -->
      <v-dialog v-model="isModalVisible" max-width="500px">
        <v-card>
          <v-card-title>
            <h2 class="text-h5">{{ isEditing ? "Edit" : "Add" }} Category</h2>
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
                      label="Category Image"
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
                <v-card-actions class="mt-4 d-flex justify-end">
                  <v-btn class="mr-4" color="primary" type="submit">
                    {{ isEditing ? "Save Changes" : "Add Category" }}
                  </v-btn>
                  <v-btn color="error" @click="closeModal">Cancel</v-btn>
                </v-card-actions>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- Delete Confirmation Dialog -->
      <v-dialog v-model="isDeleteDialogVisible" max-width="400px">
        <v-card>
          <v-card-title class="text-h6">Confirm Deletion</v-card-title>
          <v-card-text>Are you sure you want to delete this category?</v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text color="primary" @click="deleteCategory">Yes, Delete</v-btn>
            <v-btn text color="grey" @click="closeDeleteDialog">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Snackbar -->
      <v-snackbar v-model="snackbar.visible" :color="snackbar.color" timeout="3000">
        {{ snackbar.message }}
        <v-btn icon @click="snackbar.visible = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-snackbar>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const categories = ref([]);
const isModalVisible = ref(false);
const isDeleteDialogVisible = ref(false);
const isEditing = ref(false);
const categoryToDeleteIndex = ref(null);
const imagePreview = ref(null);

const formData = ref({
  name_en: '',
  name_lo: '',
  image: null
});

const snackbar = ref({
  visible: false,
  message: '',
  color: 'success'
});

const fetchCategories = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/tourist-attraction-categories`);
    categories.value = response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    showSnackbar('Error fetching categories', 'error');
  }
};

const openModal = (action, category = null) => {
  if (action === 'edit' && category) {
    isEditing.value = true;
    formData.value = { ...category };
  } else {
    isEditing.value = false;
    formData.value = {
      name_en: '',
      name_lo: '',
      image: null
    };
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
    const submitData = new FormData();
    submitData.append('name_en', formData.value.name_en);
    submitData.append('name_lo', formData.value.name_lo);
    
    if (formData.value.image instanceof File) {
      submitData.append('image', formData.value.image);
    }

    if (isEditing.value) {
      await axios.put(`${apiUrl}/api/tourist-attraction-categories/${formData.value.id}`, submitData);
      showSnackbar('Category updated successfully!');
    } else {
      await axios.post(`${apiUrl}/api/tourist-attraction-categories`, submitData);
      showSnackbar('Category added successfully!');
    }
    
    await fetchCategories();
    closeModal();
  } catch (error) {
    console.error('Error saving category:', error);
    showSnackbar('Error saving category', 'error');
  }
};

const confirmDelete = (index) => {
  categoryToDeleteIndex.value = index;
  isDeleteDialogVisible.value = true;
};

const deleteCategory = async () => {
  try {
    const categoryId = categories.value[categoryToDeleteIndex.value].id;
    await axios.delete(`${apiUrl}/api/tourist-attraction-categories/${categoryId}`);
    await fetchCategories();
    showSnackbar('Category deleted successfully!');
    closeDeleteDialog();
  } catch (error) {
    console.error('Error deleting category:', error);
    showSnackbar('Error deleting category', 'error');
  }
};

const closeModal = () => {
  isModalVisible.value = false;
  formData.value = {
    name_en: '',
    name_lo: '',
    image: null
  };
  imagePreview.value = null;
};

const closeDeleteDialog = () => {
  isDeleteDialogVisible.value = false;
  categoryToDeleteIndex.value = null;
};

const showSnackbar = (message, color = 'success') => {
  snackbar.value = {
    visible: true,
    message,
    color,
  };
};

onMounted(fetchCategories);
</script>

<style scoped>
.v-data-table {
  background: transparent;
}

.category-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
}
</style> 
