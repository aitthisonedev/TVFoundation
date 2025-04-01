<template>
  <v-row>
    <v-col cols="12">
      <v-card elevation="2" class="rounded-lg">
        <v-card-title class="d-flex justify-space-between align-center pa-6 bg-primary">
          <h6 class="text-h5 text-white font-weight-bold">About Foundation</h6>
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

        <v-card-text v-if="aboutList.length === 0" class="pa-6 text-center">
          <p class="text-subtitle-1 text-grey">No about content available.</p>
        </v-card-text>

        <v-card-text v-else class="pa-4">
          <v-table hover class="rounded">
            <thead>
              <tr>
                <th class="text-left font-weight-bold">SL</th>
                <th class="text-left font-weight-bold">Image</th>
                <th class="text-left font-weight-bold">Title (EN)</th>
                <th class="text-left font-weight-bold">Title (LO)</th>
                <th class="text-left font-weight-bold">People Helped</th>
                <th class="text-left font-weight-bold">Projects</th>
                <th class="text-left font-weight-bold">Years</th>
                <th class="text-left font-weight-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(about, index) in paginatedAboutList" :key="index">
                <td class="text-body-2">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="py-2">
                  <v-img
                    class="rounded"
                    width="100%"
                    height="100"
                    :src="about.image ? `${apiUrl}${about.image}` : ''"
                    cover
                  />
                </td>
                <td class="text-body-2">{{ truncateText(about.title_en, 50) }}</td>
                <td class="text-body-2">{{ truncateText(about.title_lo, 50) }}</td>
                <td class="text-body-2">{{ about.peopleHelped }}</td>
                <td class="text-body-2">{{ about.projectsCompleted }}</td>
                <td class="text-body-2">{{ about.yearsExperience }}</td>
                <td>
                  <v-btn
                    size="small"
                    color="warning"
                    variant="flat" 
                    class="mr-2 text-capitalize"
                    @click="editAbout(index)"
                  >
                    <v-icon size="small">mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    size="small"
                    color="error"
                    variant="flat"
                    class="text-capitalize"
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

    <!-- Add About Dialog -->
    <v-dialog v-model="dialogVisible" persistent max-width="800px">
      <v-card class="rounded-lg">
        <v-card-title class="pa-6 bg-primary text-white">
          <span class="text-h5 font-weight-bold">Add About</span>
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newAbout.title_en"
                  label="Title (EN)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newAbout.title_lo"
                  label="Title (LO)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="newAbout.description_en"
                  label="Description (EN)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="newAbout.description_lo"
                  label="Description (LO)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="newAbout.peopleHelped"
                  label="People Helped"
                  type="number"
                  min="0"
                  :rules="[v => v >= 0 || 'Number must be positive']"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="newAbout.projectsCompleted"
                  label="Projects Completed"
                  type="number"
                  min="0"
                  :rules="[v => v >= 0 || 'Number must be positive']"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="newAbout.yearsExperience"
                  label="Years Experience"
                  type="number"
                  min="0"
                  :rules="[v => v >= 0 || 'Number must be positive']"
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
                  @change="handleImageUpload"
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
            @click="addAbout"
          >
            Add About
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit About Dialog -->
    <v-dialog v-model="editDialogVisible" persistent max-width="800px">
      <v-card class="rounded-lg">
        <v-card-title class="pa-6 bg-primary text-white">
          <span class="text-h5 font-weight-bold">Edit About</span>
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form v-if="editingAbout">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editingAbout.title_en"
                  label="Title (EN)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editingAbout.title_lo"
                  label="Title (LO)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="editingAbout.description_en"
                  label="Description (EN)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="editingAbout.description_lo"
                  label="Description (LO)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="editingAbout.peopleHelped"
                  label="People Helped"
                  type="number"
                  min="0"
                  :rules="[v => v >= 0 || 'Number must be positive']"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="editingAbout.projectsCompleted"
                  label="Projects Completed"
                  type="number"
                  min="0"
                  :rules="[v => v >= 0 || 'Number must be positive']"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="editingAbout.yearsExperience"
                  label="Years Experience"
                  type="number"
                  min="0"
                  :rules="[v => v >= 0 || 'Number must be positive']"
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
                  @change="handleEditImageUpload"
                />
                <v-avatar
                  v-if="editingImagePreview"
                  :image="editingImagePreview"
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
            @click="editDialogVisible = false"
          >
            Cancel
          </v-btn>
          <v-btn 
            color="primary"
            variant="flat"
            class="text-capitalize"
            @click="saveEditedAbout"
          >
            Save Changes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirmation Dialog -->
    <v-dialog v-model="confirmDialogVisible" max-width="400px">
      <v-card class="rounded-lg">
        <v-card-title class="pa-6 bg-primary text-white">
          <span class="text-h6 font-weight-bold">Confirm Deletion</span>
        </v-card-title>
        <v-card-text class="pa-6">
          Are you sure you want to delete this about content?
        </v-card-text>
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn 
            color="error" 
            variant="flat"
            class="text-capitalize mr-2"
            @click="confirmDelete"
          >
            Yes, Delete
          </v-btn>
          <v-btn 
            color="grey"
            variant="flat"
            class="text-capitalize"
            @click="cancelDelete"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.visible"
      :color="snackbar.color"
      location="top"
      timeout="3000"
      class="rounded-lg"
    >
      <span>{{ snackbar.message }}</span>
      <template v-slot:actions>
        <v-btn
          icon
          variant="text"
          @click="snackbar.visible = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-row>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
const aboutList = ref([]);

const newAbout = ref({
  title_en: "",
  title_lo: "",
  description_en: "",
  description_lo: "",
  peopleHelped: 0,
  projectsCompleted: 0,
  yearsExperience: 0,
  image: null,
});

const imagePreview = ref(null);
const editingAbout = ref(null);
const editingImagePreview = ref(null);
const dialogVisible = ref(false);
const editDialogVisible = ref(false);
const confirmDialogVisible = ref(false);
const itemToDeleteIndex = ref(null);
const currentPage = ref(1);
const itemsPerPage = ref(10);

const snackbar = ref({
  visible: false,
  message: "",
  color: "success",
});

const fetchAbouts = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/about`);
    aboutList.value = response.data;
  } catch (error) {
    console.error("Error fetching abouts:", error);
    snackbar.value = {
      visible: true,
      message: "Error fetching about content",
      color: "error",
    };
  }
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    imagePreview.value = URL.createObjectURL(file);
    newAbout.value.image = file;
  }
};

const handleEditImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    editingImagePreview.value = URL.createObjectURL(file);
    editingAbout.value.image = file;
  }
};

const validateNumbers = (about) => {
  const numbers = {
    peopleHelped: parseInt(about.peopleHelped),
    projectsCompleted: parseInt(about.projectsCompleted),
    yearsExperience: parseInt(about.yearsExperience)
  };
  
  return Object.entries(numbers).every(([key, value]) => {
    if (isNaN(value) || value < 0) {
      snackbar.value = {
        visible: true,
        message: `${key} must be a positive number`,
        color: "error",
      };
      return false;
    }
    return true;
  });
};

const addAbout = async () => {
  if (!validateNumbers(newAbout.value)) return;
  
  const formData = new FormData();
  
  formData.append('title_en', newAbout.value.title_en);
  formData.append('title_lo', newAbout.value.title_lo);
  formData.append('description_en', newAbout.value.description_en);
  formData.append('description_lo', newAbout.value.description_lo);
  formData.append('peopleHelped', parseInt(newAbout.value.peopleHelped));
  formData.append('projectsCompleted', parseInt(newAbout.value.projectsCompleted));
  formData.append('yearsExperience', parseInt(newAbout.value.yearsExperience));

  if (newAbout.value.image) {
    formData.append('image', newAbout.value.image);
  }

  try {
    await axios.post(`${apiUrl}/api/about`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    await fetchAbouts();
    dialogVisible.value = false;
    resetForm();
    snackbar.value = {
      visible: true,
      message: "About content added successfully!",
      color: "success",
    };
  } catch (error) {
    console.error("Error adding about:", error);
    snackbar.value = {
      visible: true,
      message: error.response?.data?.error || "Error adding about content",
      color: "error",
    };
  }
};

const editAbout = (index) => {
  const item = aboutList.value[index];
  editingAbout.value = { ...item };
  editingImagePreview.value = item.image ? `${apiUrl}${item.image}` : null;
  editDialogVisible.value = true;
};

const saveEditedAbout = async () => {
  if (!validateNumbers(editingAbout.value)) return;
  
  const formData = new FormData();
  
  formData.append('title_en', editingAbout.value.title_en);
  formData.append('title_lo', editingAbout.value.title_lo);
  formData.append('description_en', editingAbout.value.description_en);
  formData.append('description_lo', editingAbout.value.description_lo);
  formData.append('peopleHelped', parseInt(editingAbout.value.peopleHelped));
  formData.append('projectsCompleted', parseInt(editingAbout.value.projectsCompleted));
  formData.append('yearsExperience', parseInt(editingAbout.value.yearsExperience));

  if (editingAbout.value.image instanceof File) {
    formData.append('image', editingAbout.value.image);
  }

  try {
    await axios.put(`${apiUrl}/api/about/${editingAbout.value.id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    await fetchAbouts();
    editDialogVisible.value = false;
    snackbar.value = {
      visible: true,
      message: "About content updated successfully!",
      color: "success",
    };
  } catch (error) {
    console.error("Error updating about:", error);
    snackbar.value = {
      visible: true,
      message: error.response?.data?.error || "Error updating about content",
      color: "error",
    };
  }
};

const openDeleteConfirmation = (index) => {
  itemToDeleteIndex.value = index;
  confirmDialogVisible.value = true;
};

const confirmDelete = async () => {
  const index = itemToDeleteIndex.value;
  const about = aboutList.value[index];
  try {
    await axios.delete(`${apiUrl}/api/about/${about.id}`);
    aboutList.value.splice(index, 1);
    snackbar.value = {
      visible: true,
      message: "About content deleted successfully!",
      color: "success",
    };
  } catch (error) {
    console.error("Error deleting about:", error);
    snackbar.value = {
      visible: true,
      message: "Error deleting about content",
      color: "error",
    };
  } finally {
    confirmDialogVisible.value = false;
    itemToDeleteIndex.value = null;
  }
};

const cancelDelete = () => {
  confirmDialogVisible.value = false;
  itemToDeleteIndex.value = null;
};

const resetForm = () => {
  newAbout.value = {
    title_en: "",
    title_lo: "",
    description_en: "",
    description_lo: "",
    peopleHelped: 0,
    projectsCompleted: 0,
    yearsExperience: 0,
    image: null,
  };
  imagePreview.value = null;
};

const paginatedAboutList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return aboutList.value.slice(start, end);
});

const pageCount = computed(() => {
  return Math.ceil(aboutList.value.length / itemsPerPage.value);
});

const handlePageChange = (page) => {
  currentPage.value = page;
};

const truncateText = (text, length) => {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
};

onMounted(fetchAbouts);
</script>
