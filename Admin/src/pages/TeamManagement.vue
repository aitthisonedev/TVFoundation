<template>
  <v-row>
    <!-- Team Management Section -->
    <v-col cols="12">
      <v-card>
        <v-card-title
          class="d-flex justify-space-between align-center pa-6 bg-primary rounded-lg"
        >
          <h4 class="text-white">Teams Management</h4>
          <v-btn @click="dialogVisible = true">
            <v-icon left>mdi-plus</v-icon> Add Team Member
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text v-if="teamList.length === 0">
          <p class="text-subtitle-1">No team members available.</p>
        </v-card-text>
        <v-card-text v-else>
          <v-table>
            <thead>
              <tr>
                <th>SL</th>
                <th>Image</th>
                <th>Name (EN)</th>
                <th>Name (LO)</th>
                <th>Position (EN)</th>
                <th>Position (LO)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(teamMember, index) in paginatedTeamList" :key="index">
                <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="text-center">
                  <v-avatar
                    rounded="lg"
                    size="80"
                    :image="
                      teamMember.image ? `${apiUrl}${teamMember.image}` : ''
                    "
                  />
                </td>
                <td class="text-center">
                  {{ truncateText(teamMember.name_en, 10) }}
                </td>
                <td class="text-center">
                  {{ truncateText(teamMember.name_lo, 10) }}
                </td>
                <td class="text-center">
                  {{ truncateText(teamMember.position_en, 10) }}
                </td>
                <td class="text-center">
                  {{ truncateText(teamMember.position_lo, 10) }}
                </td>
                <td class="d-flex justify-center align-center text-center">
                  <v-btn
                    class="mr-2 pa-2 mb-1"
                    text
                    small
                    color="primary"
                    @click="editTeamMember(index)"
                  >
                    <v-icon class="text-sm">mdi-pencil</v-icon>
                    <span class="d-none d-sm-inline text-sm">Edit</span>
                  </v-btn>
                  <v-btn
                    class="mr-2 pa-2 mb-1"
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
          <!-- Pagination Component -->
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

    <!-- Add/Edit Team Member Dialog with Confirmation -->
    <v-dialog v-model="isDialogVisible" persistent max-width="900px">
      <v-card>
        <v-card-title>
          <h2 class="text-h5">
            {{ editDialogVisible ? "Edit" : "Add" }} Team Member
          </h2>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.name_en"
                  label="Name (EN)"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.name_lo"
                  label="Name (LO)"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.position_en"
                  label="Position (EN)"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.position_lo"
                  label="Position (LO)"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="formData.description_en"
                  label="Description (EN)"
                  rows="3"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="formData.description_lo"
                  label="Description (LO)"
                  rows="3"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.facebook"
                  label="Facebook Link"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.whatsapp"
                  label="WhatsApp Link"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="formData.phone" label="Line Link" />
              </v-col>
              <v-col cols="12" md="6">
                <v-file-input
                  label="Upload Image"
                  accept="image/*"
                  prepend-icon="mdi-camera"
                  @change="handleImageUpload"
                />
                <v-avatar
                  v-if="editDialogVisible ? editingImagePreview : imagePreview"
                  :image="
                    editDialogVisible ? editingImagePreview : imagePreview
                  "
                  max-width="150"
                  max-height="auto"
                  class="rounded mt-3"
                />
              </v-col>
            </v-row>
            <v-card-actions class="mt-4 d-flex justify-end">
              <v-btn
                class="mr-4"
                color="primary"
                @click="
                  editDialogVisible ? saveEditedTeamMember() : addTeamMember()
                "
              >
                {{ editDialogVisible ? "Save Changes" : "Add Team Member" }}
              </v-btn>
              <v-btn
                color="error"
                @click="
                  editDialogVisible
                    ? (editDialogVisible = false)
                    : (dialogVisible = false)
                "
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="confirmDialogVisible">
      <v-card>
        <v-card-title class="text-h6">Confirm Deletion</v-card-title>
        <v-card-text>
          Are you sure you want to delete this team member?
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

const teamList = ref([]);
const apiUrl = import.meta.env.VITE_API_URL;
const newTeamMember = ref({
  name_en: "",
  position_en: "",
  description_en: "",
  name_lo: "",
  position_lo: "",
  description_lo: "",
  facebook: "",
  whatsapp: "",
  phone: "",
  image: null,
});

const imagePreview = ref(null);
const editingTeamMember = ref(null);
const editingImagePreview = ref(null);
const dialogVisible = ref(false);
const editDialogVisible = ref(false);
const confirmDialogVisible = ref(false);
const itemToDeleteIndex = ref(null);

const snackbar = ref({
  visible: false,
  message: "",
  color: "success", // 'error' or 'success'
});

const fetchTeam = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/team`);
    teamList.value = response.data;
  } catch (error) {
    console.error("Error fetching team:", error);
  }
};

const addTeamMember = async () => {
  if (
    !newTeamMember.value.name_en ||
    !newTeamMember.value.position_en ||
    !newTeamMember.value.description_en ||
    !newTeamMember.value.name_lo ||
    !newTeamMember.value.position_lo ||
    !newTeamMember.value.description_lo
  ) {
    alert("All name, position, and description fields are required.");
    return;
  }

  const formData = new FormData();
  formData.append("name_en", newTeamMember.value.name_en);
  formData.append("position_en", newTeamMember.value.position_en);
  formData.append("description_en", newTeamMember.value.description_en);
  formData.append("name_lo", newTeamMember.value.name_lo);
  formData.append("position_lo", newTeamMember.value.position_lo);
  formData.append("description_lo", newTeamMember.value.description_lo);
  formData.append("facebook", newTeamMember.value.facebook);
  formData.append("whatsapp", newTeamMember.value.whatsapp);
  formData.append("phone", newTeamMember.value.phone);

  if (newTeamMember.value.image) {
    formData.append("image", newTeamMember.value.image);
  }

  try {
    await axios.post(`${apiUrl}/api/team`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    await fetchTeam();
    dialogVisible.value = false;

    newTeamMember.value = {
      name_en: "",
      position_en: "",
      description_en: "",
      name_lo: "",
      position_lo: "",
      description_lo: "",
      facebook: "",
      whatsapp: "",
      phone: "",
      image: null,
    };

    imagePreview.value = null;

    snackbar.value = {
      visible: true,
      message: "Team member added successfully!",
      color: "success",
    };
  } catch (error) {
    console.error(
      "Error adding team member:",
      error.response ? error.response.data : error
    );
    snackbar.value = {
      visible: true,
      message: "An error occurred while adding the team member.",
      color: "error",
    };
  }
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (editingTeamMember.value) {
    editingImagePreview.value = URL.createObjectURL(file);
    editingTeamMember.value.image = file;
  } else {
    imagePreview.value = URL.createObjectURL(file);
    newTeamMember.value.image = file;
  }
};

const editTeamMember = (index) => {
  const item = teamList.value[index];
  editingTeamMember.value = { ...item };
  editingImagePreview.value = `${apiUrl}${item.image}` || null;
  editDialogVisible.value = true;
};

const saveEditedTeamMember = async () => {
  if (
    !editingTeamMember.value.name_en ||
    !editingTeamMember.value.position_en ||
    !editingTeamMember.value.description_en ||
    !editingTeamMember.value.name_lo ||
    !editingTeamMember.value.position_lo ||
    !editingTeamMember.value.description_lo
  ) {
    alert("All name, position, and description fields are required.");
    return;
  }

  const formData = new FormData();
  formData.append("name_en", editingTeamMember.value.name_en);
  formData.append("position_en", editingTeamMember.value.position_en);
  formData.append("description_en", editingTeamMember.value.description_en);
  formData.append("name_lo", editingTeamMember.value.name_lo);
  formData.append("position_lo", editingTeamMember.value.position_lo);
  formData.append("description_lo", editingTeamMember.value.description_lo);
  formData.append("facebook", editingTeamMember.value.facebook);
  formData.append("whatsapp", editingTeamMember.value.whatsapp);
  formData.append("phone", editingTeamMember.value.phone);

  if (editingTeamMember.value.image instanceof File) {
    formData.append("image", editingTeamMember.value.image);
  }

  try {
    await axios.put(
      `${apiUrl}/api/team/${editingTeamMember.value.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    await fetchTeam();
    editDialogVisible.value = false;
    snackbar.value = {
      visible: true,
      message: "Team member updated successfully!",
      color: "success",
    };
  } catch (error) {
    console.error(
      "Error updating team member:",
      error.response ? error.response.data : error
    );
    snackbar.value = {
      visible: true,
      message: "An error occurred while updating the team member.",
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
  const teamMember = teamList.value[index];
  try {
    await axios.delete(`${apiUrl}/api/team/${teamMember.id}`);
    teamList.value.splice(index, 1);
    snackbar.value = {
      visible: true,
      message: "Team member deleted successfully!",
      color: "success",
    };
  } catch (error) {
    console.error(
      "Error deleting team member:",
      error.response ? error.response.data : error
    );
    snackbar.value = {
      visible: true,
      message: "An error occurred while deleting the team member.",
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

const currentPage = ref(1);
const itemsPerPage = ref(10);

const paginatedTeamList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return teamList.value.slice(start, end);
});

const pageCount = computed(() => {
  return Math.ceil(teamList.value.length / itemsPerPage.value);
});

const handlePageChange = (page) => {
  currentPage.value = page;
};

const truncateText = (text, length) => {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
};

// Add computed properties for form fields
const formData = computed({
  get: () =>
    editDialogVisible.value ? editingTeamMember.value : newTeamMember.value,
  set: (value) => {
    if (editDialogVisible.value) {
      editingTeamMember.value = value;
    } else {
      newTeamMember.value = value;
    }
  },
});

// Add computed property for dialog visibility
const isDialogVisible = computed({
  get: () => dialogVisible.value || editDialogVisible.value,
  set: (value) => {
    if (!value) {
      dialogVisible.value = false;
      editDialogVisible.value = false;
    }
  },
});

onMounted(fetchTeam);
</script>

<style scoped></style>
