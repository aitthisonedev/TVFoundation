<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center pa-6 bg-primary">
          <h5 class="text-h5 text-white">Projects Status</h5>
          <v-btn color="primary" @click="openModalStatus('add')">
            <v-icon left>mdi-plus</v-icon> Add Project Status
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text v-if="projectStatuses.length === 0">
          <p class="text-subtitle-1">No project statuses available.</p>
        </v-card-text>
        <v-card-text v-else>
          <v-table>
            <thead>
              <tr class="text-center">
                <th>SL</th>
                <th>Status Name (English)</th>
                <th>Status Name (Lao)</th>
                <th>Update Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(status, index) in formattedProjectStatuses" :key="index">
                <td>{{ index + 1 }}</td>
                <td class="text-center">
                  <v-text-field
                    variant="none"
                    v-model="status.status_name_en"
                    readonly
                    @dblclick="openModalStatus('edit', status)"
                  />
                </td>
                <td class="text-center">
                  <v-text-field
                    class="text-center"
                    variant="none"
                    v-model="status.status_name_lo"
                    readonly
                    @dblclick="openModalStatus('edit', status)"
                  />
                </td>
                <td class="text-center">
                  <v-text-field
                    class="text-center"
                    variant="none"
                    readonly
                    v-model="status.updatedAt"
                    type="date"
                  />
                </td>
                <td class="justify-center align-center text-center">
                  <v-btn
                    class="mr-2 pa-2 mb-1"
                    text
                    small
                    color="primary"
                    @click="openModalStatus('edit', status)"
                  >
                    <v-icon class="text-sm">mdi-pencil</v-icon>
                    <span class="d-none d-sm-inline text-sm">Edit</span>
                  </v-btn>
                  <v-btn
                    class="mr-2 pa-2 mb-1"
                    text
                    small
                    color="error"
                    @click="confirmDeleteStatus(index)"
                  >
                    <v-icon class="text-sm">mdi-delete</v-icon>
                    <span class="d-none d-sm-inline text-sm">Delete</span>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>

      <!-- Modal for Add/Edit -->
      <v-dialog v-model="isModalVisible" max-width="500px">
        <v-card>
          <v-card-title>
            <h2 class="text-h5">{{ isEditing ? "Edit" : "Add" }} Project Status</h2>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-form @submit.prevent="handleSaveStatus">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="status.status_name_en"
                      label="Status Name (English)"
                      required
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="status.status_name_lo"
                      label="Status Name (Lao)"
                      required
                    />
                  </v-col>
                </v-row>
                <v-card-actions class="mt-4 d-flex justify-end">
                  <v-btn class="mr-4" color="primary" type="submit">
                    {{ isEditing ? "Save Changes" : "Add Status" }}
                  </v-btn>
                  <v-btn color="error" @click="closeModalStatus">Cancel</v-btn>
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
          <v-card-text>Are you sure you want to delete this project status?</v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text color="primary" @click="deleteStatus">Yes, Delete</v-btn>
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
import axios from "axios";
import moment from "moment";
import { computed, onMounted, ref } from "vue";

const apiUrl = import.meta.env.VITE_API_URL;
const isModalVisible = ref(false);
const isDeleteDialogVisible = ref(false);
const isEditing = ref(false);
const status = ref({
  status_name_en: "",
  status_name_lo: "",
});
const currentStatusId = ref(null);
const statusToDeleteIndex = ref(null);
const projectStatuses = ref([]);
const snackbar = ref({
  visible: false,
  message: "",
  color: "success",
});

const fetchProjectStatuses = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/project-status`);
    projectStatuses.value = response.data;
  } catch (error) {
    console.error("Error fetching project statuses:", error);
    showSnackbar("Error fetching project statuses", "error");
  }
};

const formattedProjectStatuses = computed(() => {
  return projectStatuses.value.map((status) => ({
    ...status,
    updatedAt: status.updatedAt ? moment(status.updatedAt).format("YYYY-MM-DD") : "",
  }));
});

const openModalStatus = (action, statusData = null) => {
  if (action === "edit" && statusData) {
    isEditing.value = true;
    currentStatusId.value = statusData.id;
    status.value = { ...statusData };
  } else {
    isEditing.value = false;
    status.value = {
      status_name_en: "",
      status_name_lo: "",
    };
  }
  isModalVisible.value = true;
};

const closeModalStatus = () => {
  isModalVisible.value = false;
  resetForm();
};

const handleSaveStatus = async () => {
  try {
    if (isEditing.value) {
      await axios.put(`${apiUrl}/api/project-status/${currentStatusId.value}`, status.value);
      showSnackbar("Status updated successfully!");
    } else {
      await axios.post(`${apiUrl}/api/project-status`, status.value);
      showSnackbar("Status added successfully!");
    }
    await fetchProjectStatuses();
    closeModalStatus();
  } catch (error) {
    console.error("Error saving status:", error);
    showSnackbar("Error saving status", "error");
  }
};

const confirmDeleteStatus = (index) => {
  statusToDeleteIndex.value = index;
  isDeleteDialogVisible.value = true;
};

const deleteStatus = async () => {
  try {
    const statusId = projectStatuses.value[statusToDeleteIndex.value].id;
    await axios.delete(`${apiUrl}/api/project-status/${statusId}`);
    await fetchProjectStatuses();
    showSnackbar("Status deleted successfully!");
    closeDeleteDialog();
  } catch (error) {
    console.error("Error deleting status:", error);
    showSnackbar("Error deleting status", "error");
  }
};

const closeDeleteDialog = () => {
  isDeleteDialogVisible.value = false;
  statusToDeleteIndex.value = null;
};

const resetForm = () => {
  status.value = {
    status_name_en: "",
    status_name_lo: "",
  };
  currentStatusId.value = null;
  isEditing.value = false;
};

const showSnackbar = (message, color = "success") => {
  snackbar.value = {
    visible: true,
    message,
    color,
  };
};

onMounted(fetchProjectStatuses);
</script>

<style scoped>
</style> 
