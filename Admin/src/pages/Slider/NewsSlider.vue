<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center pa-6 bg-primary">
          <h5 class="text-h5 text-white">Slider News</h5>
          <v-btn color="primary" @click="openAddDialog">
            <v-icon left>mdi-plus</v-icon> Add Slider
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text v-if="sliderList.length === 0">
          <p class="text-subtitle-1">No sliders available.</p>
        </v-card-text>
        <v-card-text v-else>
          <v-table>
            <thead>
              <tr>
                <th>SL</th>
                <th>Image</th>
                <th>Title(En)</th>
                <th>Title(Lo)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(slider, index) in paginatedSliderList" :key="index">
                <td class="text-center">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="text-center p-2">
                  <v-img
                    :src="slider.imageUrl || ''"
                    aspect-ratio="16/9"
                    class="w-100 h-75 p-2 m-0"
                    rounded="none"
                    contain
                  />
                </td>
                <td class="text-center">{{ truncateText(slider.title_en, 30) }}</td>
                <td class="text-center">{{ truncateText(slider.title_lo, 30) }}</td>
                <td class="text-center">
                  <v-btn
                    class="mr-2 pa-2"
                    text
                    small
                    color="primary"
                    @click="editSlider(index)"
                  >
                    <v-icon class="text-sm">mdi-pencil</v-icon>
                    <span class="d-none d-sm-inline text-sm">Edit</span>
                  </v-btn>
                  <v-btn
                    class="mr-2 pa-2"
                    text
                    small
                    color="error"
                    @click="openDeleteConfirmation(index)"
                  >
                    <v-icon class="text-sm">mdi-delete</v-icon>
                    <span class="d-none d-sm-inline text-sm">Delete</span>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
          <v-pagination
            v-model="currentPage"
            :length="pageCount"
            @update:model-value="handlePageChange"
            total-visible="10"
            size="large"
          ></v-pagination>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialogVisible" persistent max-width="500px">
      <v-card>
        <v-card-title class="pb-2">
          <h2 class="text-h5">
            {{ isEditing ? "Edit Slider" : "Add Slider" }}
          </h2>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <v-form>
            <v-text-field
              class="mb-4"
              label="Slider Title (English)"
              v-model="sliderForm.title_en"
              :rules="[rules.required]"
            />
            <v-text-field
              class="mb-4"
              label="Slider Title (Lao)"
              v-model="sliderForm.title_lo"
              :rules="[rules.required]"
            />
            <v-textarea
              class="mb-4"
              label="Description (English)"
              v-model="sliderForm.description_en"
              rows="3"
            />
            <v-textarea
              class="mb-4"
              label="Description (Lao)"
              v-model="sliderForm.description_lo"
              rows="3"
            />
            <v-file-input
              class="mb-4"
              label="Upload Image"
              accept="image/*"
              prepend-icon="mdi-camera"
              @change="handleImageUpload"
            />
            <v-avatar
              v-if="imagePreview"
              :image="imagePreview"
              max-width="150"
              max-height="150"
              class="rounded mb-4"
            />
            <v-card-actions class="pa-0 d-flex justify-end">
              <v-btn color="primary" @click="saveSlider">{{
                isEditing ? "Save Changes" : "Add Slider"
              }}</v-btn>
              <v-btn color="error" @click="dialogVisible = false">Cancel</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Confirmation Dialog -->
    <v-dialog v-model="confirmDialogVisible" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">Confirm Deletion</v-card-title>
        <v-card-text>
          Are you sure you want to delete this slider?
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text color="primary" @click="confirmDelete">Yes, Delete</v-btn>
          <v-btn text color="grey" @click="cancelDelete">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.visible"
      :color="snackbar.color"
      location="top"
      timeout="3000"
      multi-line
    >
      <span>{{ snackbar.message }}</span>
      <v-btn icon @click="snackbar.visible = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-row>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const sliderList = ref([]);
const sliderForm = ref({ 
  id: null, 
  title_en: "", 
  title_lo: "", 
  description_en: "", 
  description_lo: "", 
  image: null 
});
const dialogVisible = ref(false);
const confirmDialogVisible = ref(false);
const isEditing = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const imagePreview = ref(null);
const snackbar = ref({
  visible: false,
  message: "",
  color: "success",
});
const itemToDeleteIndex = ref(null);

const rules = {
  required: (value) => !!value || "This field is required.",
};

const fetchSliders = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/sliders-news`);
    sliderList.value = response.data.map((slider) => ({
      ...slider,
      imageUrl: slider.image ? `${apiUrl}/ImageUpload/${slider.image}` : "",
    }));
  } catch (error) {
    console.error("Error fetching sliders:", error);
    showSnackbar("Failed to fetch sliders.", "error");
  }
};

const truncateText = (text, length) => {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
};

const openAddDialog = () => {
  sliderForm.value = { 
    id: null, 
    title_en: "", 
    title_lo: "", 
    description_en: "", 
    description_lo: "", 
    image: null 
  };
  imagePreview.value = null;
  isEditing.value = false;
  dialogVisible.value = true;
};

const editSlider = (index) => {
  const slider = sliderList.value[index];
  sliderForm.value = { ...slider };
  imagePreview.value = slider.imageUrl || null;
  isEditing.value = true;
  dialogVisible.value = true;
};

const saveSlider = async () => {
  if (!sliderForm.value.title_en || !sliderForm.value.title_lo) {
    showSnackbar("Slider titles are required in both languages.", "error");
    return;
  }

  const formData = new FormData();
  formData.append("title_en", sliderForm.value.title_en);
  formData.append("title_lo", sliderForm.value.title_lo);
  formData.append("description_en", sliderForm.value.description_en || "");
  formData.append("description_lo", sliderForm.value.description_lo || "");
  
  if (sliderForm.value.image instanceof File) {
    formData.append("image", sliderForm.value.image);
  }

  try {
    if (isEditing.value) {
      formData.append("id", sliderForm.value.id);
    }
    await axios.post(`${apiUrl}/api/sliders-news`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    await fetchSliders();
    dialogVisible.value = false;
    showSnackbar(
      isEditing.value
        ? "Slider updated successfully!"
        : "Slider added successfully!",
      "success"
    );
  } catch (error) {
    console.error("Error saving slider:", error);
    showSnackbar("An error occurred while saving the slider.", "error");
  }
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  imagePreview.value = URL.createObjectURL(file);
  sliderForm.value.image = file;
};

const openDeleteConfirmation = (index) => {
  itemToDeleteIndex.value = index;
  confirmDialogVisible.value = true;
};

const confirmDelete = async () => {
  const index = itemToDeleteIndex.value;
  const slider = sliderList.value[index];
  try {
    await axios.delete(`${apiUrl}/api/sliders-news/${slider.id}`);
    sliderList.value.splice(index, 1);
    confirmDialogVisible.value = false;
    showSnackbar("Slider deleted successfully!", "success");
  } catch (error) {
    console.error("Error deleting slider:", error);
    showSnackbar("An error occurred while deleting the slider.", "error");
  }
};

const cancelDelete = () => {
  confirmDialogVisible.value = false;
  itemToDeleteIndex.value = null;
};

const showSnackbar = (message, color) => {
  snackbar.value = { visible: true, message, color };
};

const paginatedSliderList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return sliderList.value.slice(start, end);
});

const pageCount = computed(() => {
  return Math.ceil(sliderList.value.length / itemsPerPage.value);
});

const handlePageChange = (page) => {
  currentPage.value = page;
};

onMounted(fetchSliders);
</script>

<style scoped>
</style>
