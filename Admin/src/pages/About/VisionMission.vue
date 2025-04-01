<template>
  <v-row>
    <v-col cols="12">
      <v-card elevation="2" class="rounded-lg">
        <v-card-title class="d-flex justify-space-between align-center pa-6 bg-primary">
          <h6 class="text-h5 text-white font-weight-bold">Vision & Mission</h6>
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

        <v-card-text v-if="contents.length === 0" class="pa-6 text-center">
          <p class="text-subtitle-1 text-grey">No content available.</p>
        </v-card-text>

        <v-card-text v-else class="pa-4">
          <v-table hover class="rounded">
            <thead>
              <tr>
                <th class="text-left font-weight-bold">SL</th>
                <th class="text-left font-weight-bold">Vision (EN)</th>
                <th class="text-left font-weight-bold">Vision (LO)</th>
                <th class="text-left font-weight-bold">Mission (EN)</th>
                <th class="text-left font-weight-bold">Mission (LO)</th>
                <th class="text-left font-weight-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(content, index) in paginatedContents" :key="content.id">
                <td class="text-caption">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="text-body-2">{{ truncateText(content.vision_en, 50) }}</td>
                <td class="text-body-2">{{ truncateText(content.vision_lo, 50) }}</td>
                <td class="text-body-2">{{ truncateText(content.mission_en, 50) }}</td>
                <td class="text-body-2">{{ truncateText(content.mission_lo, 50) }}</td>
                <td>
                  <v-btn
                    size="small"
                    color="warning"
                    variant="flat" 
                    class="mr-2 text-capitalize"
                    @click="editContent(content)"
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

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialogVisible" persistent max-width="800px">
      <v-card class="rounded-lg">
        <v-card-title class="pa-6 bg-primary text-white">
          <span class="text-h5 font-weight-bold">{{ isEditing ? 'Edit' : 'Add' }} Content</span>
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form @submit.prevent="submitForm">
            <v-row>
              <!-- Vision Section -->
              <v-col cols="12">
                <h6 class="text-h6 mb-4">Vision</h6>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.vision_en"
                  label="Vision Title (EN)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.vision_lo"
                  label="Vision Title (LO)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="formData.visionDescription_en"
                  label="Vision Description (EN)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="formData.visionDescription_lo"
                  label="Vision Description (LO)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="formData.visionContentOne_en"
                  label="Vision Content 1 (EN)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="formData.visionContentOne_lo"
                  label="Vision Content 1 (LO)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="formData.visionContentTwo_en"
                  label="Vision Content 2 (EN)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="formData.visionContentTwo_lo"
                  label="Vision Content 2 (LO)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="formData.visionContentThree_en"
                  label="Vision Content 3 (EN)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="formData.visionContentThree_lo"
                  label="Vision Content 3 (LO)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>

              <!-- Mission Section -->
              <v-col cols="12">
                <h6 class="text-h6 mb-4">Mission</h6>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.mission_en"
                  label="Mission Title (EN)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.mission_lo"
                  label="Mission Title (LO)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="formData.missionDescription_en"
                  label="Mission Description (EN)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="formData.missionDescription_lo"
                  label="Mission Description (LO)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="formData.missionContentOne_en"
                  label="Mission Content 1 (EN)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="formData.missionContentOne_lo"
                  label="Mission Content 1 (LO)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="formData.missionContentTwo_en"
                  label="Mission Content 2 (EN)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="formData.missionContentTwo_lo"
                  label="Mission Content 2 (LO)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="formData.missionContentThree_en"
                  label="Mission Content 3 (EN)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="formData.missionContentThree_lo"
                  label="Mission Content 3 (LO)"
                  variant="outlined"
                  required
                  class="rounded-lg"
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
        <v-card-title class="pa-6 bg-primary text-white">
          <span class="text-h5 font-weight-bold">Confirm Delete</span>
        </v-card-title>
        <v-card-text class="pa-6">
          <p class="text-body-1">Are you sure you want to delete this content?</p>
        </v-card-text>
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn 
            color="error" 
            variant="flat"
            class="text-capitalize mr-2"
            @click="confirmDelete"
          >
            Delete
          </v-btn>
          <v-btn 
            color="primary"
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
      class="text-center"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </v-row>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const contents = ref([]);
const dialogVisible = ref(false);
const confirmDialogVisible = ref(false);
const isEditing = ref(false);
const itemToDeleteIndex = ref(null);
const currentPage = ref(1);
const itemsPerPage = ref(10);

const snackbar = ref({
  visible: false,
  message: '',
  color: 'success'
});

const formData = ref({
  vision_en: '',
  vision_lo: '',
  visionDescription_en: '',
  visionDescription_lo: '',
  visionContentOne_en: '',
  visionContentOne_lo: '',
  visionContentTwo_en: '',
  visionContentTwo_lo: '',
  visionContentThree_en: '',
  visionContentThree_lo: '',
  mission_en: '',
  mission_lo: '',
  missionDescription_en: '',
  missionDescription_lo: '',
  missionContentOne_en: '',
  missionContentOne_lo: '',
  missionContentTwo_en: '',
  missionContentTwo_lo: '',
  missionContentThree_en: '',
  missionContentThree_lo: '',
});

const fetchContents = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/vision-mission`);
    contents.value = response.data;
  } catch (error) {
    console.error('Error fetching vision & mission:', error);
    showError('Error fetching vision & mission data');
  }
};

const submitForm = async () => {
  try {
    if (isEditing.value) {
      await axios.put(`${apiUrl}/api/vision-mission/${formData.value.id}`, formData.value);
      snackbar.value.message = "Vision & Mission updated successfully!";
    } else {
      await axios.post(`${apiUrl}/api/vision-mission`, formData.value);
      snackbar.value.message = "Vision & Mission created successfully!";
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
      message: error.response?.data?.error || "Error saving Vision & Mission content",
      color: "error",
    };
  }
};

const editContent = (content) => {
  formData.value = { ...content };
  isEditing.value = true;
  dialogVisible.value = true;
};

const openDeleteConfirmation = (index) => {
  itemToDeleteIndex.value = index;
  confirmDialogVisible.value = true;
};

const confirmDelete = async () => {
  const index = itemToDeleteIndex.value;
  const content = contents.value[index];
  try {
    await axios.delete(`${apiUrl}/api/vision-mission/${content.id}`);
    await fetchContents();
    snackbar.value = {
      visible: true,
      message: "Vision & Mission deleted successfully!",
      color: "success",
    };
  } catch (error) {
    console.error("Error deleting content:", error);
    snackbar.value = {
      visible: true,
      message: "Error deleting Vision & Mission content",
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
  formData.value = {
    vision_en: '',
    vision_lo: '',
    visionDescription_en: '',
    visionDescription_lo: '',
    visionContentOne_en: '',
    visionContentOne_lo: '',
    visionContentTwo_en: '',
    visionContentTwo_lo: '',
    visionContentThree_en: '',
    visionContentThree_lo: '',
    mission_en: '',
    mission_lo: '',
    missionDescription_en: '',
    missionDescription_lo: '',
    missionContentOne_en: '',
    missionContentOne_lo: '',
    missionContentTwo_en: '',
    missionContentTwo_lo: '',
    missionContentThree_en: '',
    missionContentThree_lo: '',
  };
  isEditing.value = false;
};

const paginatedContents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return contents.value.slice(start, end);
});

const pageCount = computed(() => {
  return Math.ceil(contents.value.length / itemsPerPage.value);
});

const handlePageChange = (page) => {
  currentPage.value = page;
};

const truncateText = (text, length) => {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
};

onMounted(fetchContents);
</script>
