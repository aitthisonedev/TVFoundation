<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center pa-6 bg-primary">
          <h4 class="text-white" >Project Management</h4>
          <v-btn class="bg-primary" @click="openAddProjectDialog">
            <i class="bx bx-plus"></i> Add Project
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text v-if="projectsList.length === 0">
          <p>No projects available.</p>
        </v-card-text>
        <v-table v-else class="center-table">
          <thead>
            <tr class="head-Table">
              <th>SL</th>
              <th>Image</th>
              <th>Title</th>
              <th>Location</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(project, index) in paginatedProjectsList" :key="index">
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td class="text-center">
                <v-img
                  v-if="project.coverImage"
                  :src="`${apiUrl}/ImageUpload/${project.coverImage}`"
                  width="auto"
                  height="100"
                  cover
                  class="ma-1 contain-image rounded"
                />
              </td>
              <td>{{ truncateText(project.title_en, 20) }}</td>
              <td>{{ truncateText(project.location_en, 20) }}</td>
              <td class="text-center">
                {{ project.status?.status_name_en || "N/A" }}
              </td>
              <td>{{ formatDate(project.start_date) }}</td>
              <td>{{ formatDate(project.end_date) }}</td>
              <td class="text-center">
                <v-btn
                  @click="
                    editProjectItem((currentPage - 1) * itemsPerPage + index)
                  "
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
                  @click="
                    openDeleteConfirmation(
                      (currentPage - 1) * itemsPerPage + index
                    )
                  "
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
          :model-value="currentPage"
          :length="pageCount"
          @update:model-value="handlePageChange"
          :total-visible="5"
          :size="'large'"
        ></v-pagination>
      </v-card>
    </v-col>

    <!-- Add Project Dialog -->
    <v-dialog v-model="dialogVisible" persistent max-width="1200px">
      <v-card class="rounded-lg py-3 ">
        <v-card-title>
          <v-toolbar class="pa-0 bg-primary rounded-lg">
            <v-btn icon="mdi-close" @click="closeDialog" color="white"></v-btn>
            <v-toolbar-title>Add Project</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn @click="closeDialog">Cancel</v-btn>
              <v-btn
                @click="addProjectItem"
                variant="outlined"
                class=""
                >Add Project</v-btn
              >
            </v-toolbar-items>
          </v-toolbar>
        </v-card-title>
        <v-card-subtitle>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.title_en"
                label="Title (EN)"
                required
                class="dialog-input pt-5"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.title_lo"
                label="Title (LO)"
                required
                class="dialog-input pt-5"
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
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-textarea
                v-model="formData.content_lo"
                label="Content (LO)"
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
              <v-select
                v-model="formData.status_id"
                :items="projectStatuses"
                item-title="status_name_en"
                item-value="id"
                label="Status"
                required
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formattedTargetAmount"
                label="Target Amount"
                required
                @input="handleTargetAmountInput"
                hint="Enter numbers only"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formattedCurrentAmount"
                label="Current Amount"
                required
                class="dialog-input"
                @input="handleCurrentAmountInput"
                hint="Enter numbers only"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formattedSupporters"
                label="Number of Supporters"
                required
                @input="handleSupportersInput"
                hint="Enter numbers only"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.start_date"
                label="Start Date"
                type="date"
                required
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.end_date"
                label="End Date"
                type="date"
                required
              />
            </v-col>

            <v-col cols="12">
              <v-file-input
                label="Cover Image"
                accept="image/*"
                @change="(event) => handleFileUpload(event, 'coverImage')"
                class="dialog-input"
              />
            </v-col>
            <!-- Image Previews -->
            <v-col cols="12">
              <v-sheet>
                <v-card
                  v-if="coverImagePreview || formData.coverImage"
                  class="mx-auto overflow-hidden"
                  max-width="100%"
                  elevation="2"
                >
                  <v-img
                    :src="
                      coverImagePreview ||
                      `${apiUrl}/ImageUpload/${formData.coverImage}`
                    "
                    aspect-ratio="16/9"
                    contain
                    class="bg-grey-lighten-4"
                  />
                </v-card>
              </v-sheet>
            </v-col>
            <v-col cols="12">
              <v-file-input
                label="Sub Images"
                accept="image/*"
                multiple
                @change="(event) => handleFileUpload(event, 'subImages')"
                class="dialog-input"
              />
            </v-col>
            <v-col cols="12">
              <v-sheet>
                <v-row>
                  <v-col
                    v-for="(preview, index) in subImagePreviews"
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
                        class="bg-grey-lighten-4"
                      >
                        <template v-slot:placeholder>
                          <v-row
                            align="center"
                            justify="center"
                            class="fill-height"
                          >
                            <v-progress-circular
                              indeterminate
                            ></v-progress-circular>
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
                          @click="removeSubImage(index)"
                        ></v-btn>
                      </v-overlay>
                    </v-card>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-col>
          </v-row>
        </v-card-subtitle>
      </v-card>
    </v-dialog>

    <!-- Edit Project Dialog -->
    <v-dialog v-model="editDialogVisible" persistent max-width="1200px">
      <v-card class="rounded-lg">
        <v-card-title>
          <v-toolbar class="bg-primary rounded-lg text-white">
            <v-btn icon="mdi-close" @click="closeEditDialog" color="white"></v-btn>
            <v-toolbar-title>Edit Project</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn @click="closeEditDialog">Cancel</v-btn>
              <v-btn
                @click="saveEditedProjectItem"
                variant="outlined"
                >Save</v-btn
              >
            </v-toolbar-items>
          </v-toolbar>
        </v-card-title>
        <v-card-subtitle>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="editingProjectItem.title_en"
                label="Title (EN)"
                required
                class="dialog-input pt-5"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="editingProjectItem.title_lo"
                label="Title (LO)"
                required
                class="dialog-input pt-5"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-textarea
                v-model="editingProjectItem.description_en"
                label="Description (EN)"
                required
                class="dialog-input"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-textarea
                v-model="editingProjectItem.description_lo"
                label="Description (LO)"
                required
                class="dialog-input"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-textarea
                v-model="editingProjectItem.content_en"
                label="Content (EN)"
                class="dialog-input"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-textarea
                v-model="editingProjectItem.content_lo"
                label="Content (LO)"
                class="dialog-input"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="editingProjectItem.location_en"
                label="Location (EN)"
                required
                class="dialog-input"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="editingProjectItem.location_lo"
                label="Location (LO)"
                required
                class="dialog-input"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="editingProjectItem.status_id"
                :items="projectStatuses"
                item-title="status_name_en"
                item-value="id"
                label="Status"
                required
                class="dialog-input"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formattedEditTargetAmount"
                label="Target Amount"
                required
                class="dialog-input"
                @input="handleEditTargetAmountInput"
                hint="Enter numbers only"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formattedEditCurrentAmount"
                label="Current Amount"
                required
                class="dialog-input"
                @input="handleEditCurrentAmountInput"
                hint="Enter numbers only"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formattedEditSupporters"
                label="Number of Supporters"
                required
                class="dialog-input"
                @input="handleEditSupportersInput"
                hint="Enter numbers only"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="editingProjectItem.start_date"
                label="Start Date"
                type="date"
                required
                class="dialog-input"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="editingProjectItem.end_date"
                label="End Date"
                type="date"
                required
                class="dialog-input"
              />
            </v-col>
            <!-- Project Dates Preview -->
            <v-col cols="12" >
              <v-sheet>
                <p class="text-subtitle-1 mb-4">Project Timeline</p>
                <v-row>
                  <v-col cols="12" md="6">
                    <div class="date-preview">
                      <strong>Start Date:</strong>
                      <span>{{
                        formatDate(editingProjectItem.start_date)
                      }}</span>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="date-preview">
                      <strong>End Date:</strong>
                      <span>{{ formatDate(editingProjectItem.end_date) }}</span>
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <div class="date-preview">
                      <strong>Duration:</strong>
                      <span
                        >{{
                          calculateDuration(
                            editingProjectItem.start_date,
                            editingProjectItem.end_date
                          )
                        }}
                        days</span
                      >
                    </div>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-col>
            <v-col cols="12">
              <v-file-input
                label="Cover Image"
                accept="image/*"
                @change="(event) => handleEditFileUpload(event, 'coverImage')"
                class="dialog-input"
              />
            </v-col>
            <!-- Sub Images Preview -->
            <v-col cols="12">
              <v-sheet>
                <v-card
                  v-if="coverImgPreview || editingProjectItem.coverImage"
                  class="mx-auto overflow-hidden"
                  max-width="100%"
                  elevation="2"
                >
                  <v-img
                    :src="
                      coverImgPreview ||
                      `${apiUrl}/ImageUpload/${editingProjectItem.coverImage}`
                    "
                    contain
                    class="bg-grey-lighten-4"
                  />
                </v-card>
              </v-sheet>
            </v-col>
            <v-col cols="12">
              <v-file-input
                label="Sub Images"
                accept="image/*"
                multiple
                @change="(event) => handleEditFileUpload(event, 'subImages')"
                class="dialog-input"
              />
            </v-col>
            <v-col cols="12">
              <v-sheet>
                <v-row>
                  <v-col
                    v-for="(preview, index) in editingSubImgs"
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
                        class="bg-grey-lighten-4"
                      >
                        <template v-slot:placeholder>
                          <v-row
                            align="center"
                            justify="center"
                            class="fill-height"
                          >
                            <v-progress-circular
                              indeterminate
                            ></v-progress-circular>
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
                          @click="removeEditSubImage(index)"
                        ></v-btn>
                      </v-overlay>
                    </v-card>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-col>
          </v-row>
        </v-card-subtitle>
      </v-card>
    </v-dialog>

    <!-- Confirmation Dialog -->
    <v-dialog v-model="confirmDialogVisible" max-width="400px">
      <v-card>
        <v-card-title class="headline">Confirm Deletion</v-card-title>
        <v-card-subtitle
          >Are you sure you want to delete this project?</v-card-subtitle
        >
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
      multi-line
    >
      <div class="snackbar-content">
        <p class="snackbar-text">{{ snackbar.message }}</p>
      </div>
    </v-snackbar>
  </v-row>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import { debounce } from "lodash";

const apiUrl = import.meta.env.VITE_API_URL;

const projectsList = ref([]);
const formData = ref({
  title_en: "",
  title_lo: "",
  description_en: "",
  description_lo: "",
  content_en: "",
  content_lo: "",
  location_en: "",
  location_lo: "",
  status_id: null,
  currentAmount: 0,
  targetAmount: 0,
  supporters: 0,
  coverImage: null,
  subImages: [],
  start_date: "",
  end_date: "",
});

const coverImgPreview = ref(null);
const subImgsPreviews = ref([]);

const editingProjectItem = ref(null);
const editingCoverImg = ref(null);
const editingSubImgs = ref([]);

const dialogVisible = ref(false);
const editDialogVisible = ref(false);
const confirmDialogVisible = ref(false);
const deleteIndex = ref(null);

const snackbar = ref({
  visible: false,
  message: "",
  color: "success",
});
const cancelDelete = () => {
  confirmDialogVisible.value = false;
};
const statusOptions = ["Pending", "Complete"];
const projectTypes = ref([]);

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const handleFileUpload = (event, type) => {
  const files = event.target.files;
  if (!files) return;

  if (type === "coverImage") {
    formData.value.coverImage = files[0];
    coverImagePreview.value = URL.createObjectURL(files[0]);
  } else if (type === "subImages") {
    formData.value.subImages = Array.from(files);
    subImagePreviews.value = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
  }
};

// Fetch project types from API
const fetchProjectTypes = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/project-types`);
    projectTypes.value = response.data.map(
      (item) => item.type_name + " " + item.type_name_en
    );
  } catch (error) {
    
    showSnackbar("Error fetching project types.", "error");
  }
};

const fetchProjects = async () => {
  try {
    const [projectsResponse, statusesResponse] = await Promise.all([
      axios.get(`${apiUrl}/api/projects`),
      axios.get(`${apiUrl}/api/project-status`),
    ]);

    const statuses = statusesResponse.data;
    const projects = projectsResponse.data.map((project) => {
      const status = statuses.find((s) => s.id === project.status_id);
      return {
        ...project,
        status: status || null,
      };
    });

    projectsList.value = projects;
  } catch (error) {
    
    showSnackbar("Error fetching projects.", "error");
  }
};

const addProjectItem = async () => {
  if (
    !formData.value.title_en ||
    !formData.value.description_en ||
    !formData.value.location_en
  ) {
    showSnackbar("Required fields are missing.", "error");
    return;
  }

  const submitFormData = new FormData();

  submitFormData.append("title_en", formData.value.title_en);
  submitFormData.append("title_lo", formData.value.title_lo);
  submitFormData.append("description_en", formData.value.description_en);
  submitFormData.append("description_lo", formData.value.description_lo);
  submitFormData.append("content_en", formData.value.content_en);
  submitFormData.append("content_lo", formData.value.content_lo);
  submitFormData.append("location_en", formData.value.location_en);
  submitFormData.append("location_lo", formData.value.location_lo);
  submitFormData.append("status_id", formData.value.status_id);
  submitFormData.append(
    "currentAmount",
    unformatNumber(formData.value.currentAmount)
  );
  submitFormData.append(
    "targetAmount",
    unformatNumber(formData.value.targetAmount)
  );
  submitFormData.append(
    "supporters",
    unformatNumber(formData.value.supporters)
  );
  submitFormData.append("start_date", formData.value.start_date);
  submitFormData.append("end_date", formData.value.end_date);

  if (formData.value.coverImage) {
    submitFormData.append("coverImage", formData.value.coverImage);
  }

  if (formData.value.subImages.length > 0) {
    formData.value.subImages.forEach((file) => {
      submitFormData.append("subImages", file);
    });
  }

  try {
    const token = localStorage.getItem("token");
    await axios.post(`${apiUrl}/api/projects`, submitFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    await fetchProjects();
    closeDialog();
    showSnackbar("Project added successfully!");
  } catch (error) {
    console.error(
      "Error adding project:",
      error.response ? error.response.data : error
    );
    showSnackbar("An error occurred while adding the project.", "error");
  }
};

const saveEditedProjectItem = async () => {
  if (!editingProjectItem.value.title_en || !editingProjectItem.value.description_en || !editingProjectItem.value.location_en) {
    showSnackbar("Required fields are missing.", "error");
    return;
  }

  const submitFormData = new FormData();

  // Add basic fields
  Object.entries(editingProjectItem.value).forEach(([key, value]) => {
    if (key !== 'coverImage' && key !== 'subImages' && value !== null && value !== undefined) {
      if (key.includes('Amount') || key === 'supporters') {
        submitFormData.append(key, unformatNumber(value));
      } else {
        submitFormData.append(key, value);
      }
    }
  });

  // Handle cover image
  if (editingProjectItem.value.coverImage instanceof File) {
    submitFormData.append("coverImage", editingProjectItem.value.coverImage);
  }

  // Handle subImages - now replacing instead of merging
  if (editingProjectItem.value.subImages) {
    if (editingProjectItem.value.subImages.some(img => img instanceof File)) {
      // If there are new files, send only the new files
      editingProjectItem.value.subImages.forEach(image => {
        if (image instanceof File) {
          submitFormData.append('subImages', image);
        }
      });
      // Send empty array for existing images to indicate complete replacement
      submitFormData.append('existingSubImages', JSON.stringify([]));
    } else {
      // If no new files, keep existing images
      const existingImages = editingProjectItem.value.subImages
        .filter(img => typeof img === 'string')
        .map(img => img.replace(`${apiUrl}/ImageUpload/`, ''));
      submitFormData.append('existingSubImages', JSON.stringify(existingImages));
    }
  }

  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${apiUrl}/api/projects/${editingProjectItem.value.project_id}`,
      submitFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Update local list
    const index = projectsList.value.findIndex(
      item => item.project_id === editingProjectItem.value.project_id
    );
    projectsList.value[index] = response.data;

    // Cleanup old blob URLs
    editingSubImgs.value
      .filter(url => url.startsWith('blob:'))
      .forEach(url => URL.revokeObjectURL(url));

    // Update the preview with new images from response
    editingSubImgs.value = response.data.subImages
      ? response.data.subImages.map(img => `${apiUrl}/ImageUpload/${img}`)
      : [];

    closeEditDialog();
    showSnackbar("Project updated successfully!");
  } catch (error) {
    console.error("Error updating project:", error);
    showSnackbar("An error occurred while updating the project.", "error");
  }
};

const resetEditingProjectItem = () => {
  editingProjectItem.value = {
    title_en: "",
    title_lo: "",
    description_en: "",
    description_lo: "",
    content_en: "",
    content_lo: "",
    location_en: "",
    location_lo: "",
    status_id: null,
    currentAmount: 0,
    targetAmount: 0,
    supporters: 0,
    coverImage: null,
    subImages: [],
    start_date: "",
    end_date: "",
  };
  coverImagePreview.value = null;
  subImagePreviews.value = [];
};

const openAddProjectDialog = () => {
  resetEditingProjectItem();
  dialogVisible.value = true;
};

const editProjectItem = (index) => {
  try {
    const item = projectsList.value[index];
    if (!item) return;

    // Create a deep copy of the item
    editingProjectItem.value = JSON.parse(JSON.stringify({
      ...item,
      subImages: Array.isArray(item.subImages) ? item.subImages : []
    }));

    // Set cover image preview
    editingCoverImg.value = item.coverImage
      ? `${apiUrl}/ImageUpload/${item.coverImage}`
      : null;

    // Set sub images previews with full URLs
    editingSubImgs.value = Array.isArray(item.subImages) 
      ? item.subImages.map(img => `${apiUrl}/ImageUpload/${img}`)
      : [];

    editDialogVisible.value = true;
  } catch (error) {
    console.error("Error loading project for editing:", error);
    showSnackbar("Error loading project for editing", "error");
  }
};

const openDeleteConfirmation = debounce((index) => {
  
  confirmDialogVisible.value = true;
  deleteIndex.value = index;
}, 300);

const confirmDelete = async () => {
  try {
    const id = projectsList.value[deleteIndex.value].project_id;
    const token = localStorage.getItem("token");
    await axios.delete(`${apiUrl}/api/projects/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    projectsList.value.splice(deleteIndex.value, 1);
    confirmDialogVisible.value = false;
    showSnackbar("Project deleted successfully!");
  } catch (error) {
    console.error(
      "Error deleting project:",
      error.response ? error.response.data : error
    );
    showSnackbar("Failed to delete project.", "error");
  }
};

const closeDialog = () => {
  dialogVisible.value = false;
  resetEditingProjectItem();
};

const closeEditDialog = () => {
  editDialogVisible.value = false;
  resetEditingProjectItem();
};

const handlePageChange = (page) => {
  currentPage.value = page;
};

const truncateText = (text, length) => {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
};

const isTextEmpty = (text) => {
  return !text || text.trim() === "";
};

const currentPage = ref(1);
const itemsPerPage = ref(6);

const paginatedProjectsList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return projectsList.value.slice(start, end);
});

const pageCount = computed(() => {
  return Math.ceil(projectsList.value.length / itemsPerPage.value);
});

const showSnackbar = (message, color = "success") => {
  snackbar.value.message = message;
  snackbar.value.color = color;
  snackbar.value.visible = true;
};

const removeSubImgPreview = (index, isEditing = false) => {
  if (isEditing) {
    editingSubImgs.value.splice(index, 1);
    editingProjectItem.value.subImgs.splice(index, 1);
  } else {
    subImgsPreviews.value.splice(index, 1);
    formData.value.subImages.splice(index, 1);
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const projectStatuses = ref([]);
const coverImagePreview = ref(null);
const subImagePreviews = ref([]);

// Fetch project statuses
const fetchProjectStatuses = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/project-status`);
    projectStatuses.value = response.data;
     // Debug log
  } catch (error) {
    
    showSnackbar("Error fetching project statuses", "error");
  }
};

const calculateProgress = (current, target) => {
  if (!target) return 0;
  return Math.round((current / target) * 100);
};

const removeSubImage = (index) => {
  formData.value.subImages.splice(index, 1);
  subImagePreviews.value.splice(index, 1);
};

const formatNumber = (value) => {
  if (value === null || value === undefined) return "0";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const unformatNumber = (value) => {
  if (!value) return 0;
  return parseInt(value.toString().replace(/,/g, ""), 10);
};

const formattedTargetAmount = computed({
  get: () => formatNumber(formData.value.targetAmount),
  set: (val) => {
    formData.value.targetAmount = unformatNumber(val);
  },
});

const formattedCurrentAmount = computed({
  get: () => formatNumber(formData.value.currentAmount),
  set: (val) => {
    formData.value.currentAmount = unformatNumber(val);
  },
});

const formattedSupporters = computed({
  get: () => formatNumber(formData.value.supporters),
  set: (val) => {
    formData.value.supporters = unformatNumber(val);
  },
});

const handleTargetAmountInput = (event) => {
  const value = event.target.value;
  const numbers = value.replace(/[^\d]/g, "");
  formData.value.targetAmount = numbers ? parseInt(numbers, 10) : 0;
};

const handleCurrentAmountInput = (event) => {
  const value = event.target.value;
  const numbers = value.replace(/[^\d]/g, "");
  formData.value.currentAmount = numbers ? parseInt(numbers, 10) : 0;
};

const handleSupportersInput = (event) => {
  const value = event.target.value;
  const numbers = value.replace(/[^\d]/g, "");
  formData.value.supporters = numbers ? parseInt(numbers, 10) : 0;
};

const formattedEditTargetAmount = computed({
  get: () => formatNumber(editingProjectItem.value?.targetAmount),
  set: (val) => {
    if (editingProjectItem.value) {
      editingProjectItem.value.targetAmount = unformatNumber(val);
    }
  },
});

const formattedEditCurrentAmount = computed({
  get: () => formatNumber(editingProjectItem.value?.currentAmount),
  set: (val) => {
    if (editingProjectItem.value) {
      editingProjectItem.value.currentAmount = unformatNumber(val);
    }
  },
});

const formattedEditSupporters = computed({
  get: () => formatNumber(editingProjectItem.value?.supporters),
  set: (val) => {
    if (editingProjectItem.value) {
      editingProjectItem.value.supporters = unformatNumber(val);
    }
  },
});

const handleEditTargetAmountInput = (event) => {
  const value = event.target.value;
  const numbers = value.replace(/[^\d]/g, "");
  if (editingProjectItem.value) {
    editingProjectItem.value.targetAmount = numbers ? parseInt(numbers, 10) : 0;
  }
};

const handleEditCurrentAmountInput = (event) => {
  const value = event.target.value;
  const numbers = value.replace(/[^\d]/g, "");
  if (editingProjectItem.value) {
    editingProjectItem.value.currentAmount = numbers
      ? parseInt(numbers, 10)
      : 0;
  }
};

const handleEditSupportersInput = (event) => {
  const value = event.target.value;
  const numbers = value.replace(/[^\d]/g, "");
  if (editingProjectItem.value) {
    editingProjectItem.value.supporters = numbers ? parseInt(numbers, 10) : 0;
  }
};

const handleEditFileUpload = (event, type) => {
  const files = event.target.files;
  if (!files) return;

  if (type === "coverImage") {
    if (editingCoverImg.value && editingCoverImg.value.startsWith("blob:")) {
      URL.revokeObjectURL(editingCoverImg.value);
    }
    editingProjectItem.value.coverImage = files[0];
    editingCoverImg.value = URL.createObjectURL(files[0]);
  } else if (type === "subImages") {
    const newFiles = Array.from(files);
    
    // Revoke any existing blob URLs
    editingSubImgs.value
      .filter(url => url.startsWith('blob:'))
      .forEach(url => URL.revokeObjectURL(url));

    // Replace all images with new files
    editingProjectItem.value.subImages = newFiles;

    // Create new preview URLs
    editingSubImgs.value = newFiles.map(file => URL.createObjectURL(file));
  }
};

const removeEditSubImage = (index) => {
  // Revoke URL if it's a blob URL
  const preview = editingSubImgs.value[index];
  if (preview && preview.startsWith("blob:")) {
    URL.revokeObjectURL(preview);
  }
  
  // Remove from both arrays
  editingSubImgs.value.splice(index, 1);
  editingProjectItem.value.subImages.splice(index, 1);
};

watch(
  projectStatuses,
  (newStatuses) => {
    if (newStatuses.length > 0) {
      projectsList.value = projectsList.value.map((project) => ({
        ...project,
        status: newStatuses.find((s) => s.id === project.status_id) || null,
      }));
    }
  },
  { deep: true }
);

const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

onMounted(async () => {
  try {
    await fetchProjectStatuses();
    await fetchProjects();
  } catch (error) {
    
    showSnackbar("Error initializing data", "error");
  }
});
</script>

<style scoped>
</style>
