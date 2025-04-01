<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <h4 class="text-h5">Business Partners Management</h4>
          <v-btn color="primary" @click="dialogVisible = true">
            <v-icon left>mdi-plus</v-icon> Add Partner
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text v-if="logoPartnersList.length === 0">
          <p class="text-subtitle-1">No business partners available.</p>
        </v-card-text>
        <v-card-text v-else>
          <v-table>
            <thead>
              <tr>
                <th>SL</th>
                <th>Image</th>
                <th>Partner Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(logoPartnerItem, index) in paginatedLogoPartnersList"
                :key="index"
              >
                <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="text-center">
                  <img
                    :src="logoPartnerItem.image || ''"
                    alt="Partner Logo"
                    class="rounded-lg pa-2 mx-auto"
                    width="100"
                    height="60"
                  />
                </td>

                <td>
                  {{ truncateText(logoPartnerItem.imageName, 30) }}
                </td>
                <td class="text-center">
                  <v-btn
                    class="mr-2 pa-2 mb-1"
                    text
                    small
                    color="primary"
                    @click="editLogoPartnerItem(index)"
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

    <!-- Add Partner Dialog -->
    <v-dialog v-model="dialogVisible" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <h2 class="text-h5">Add Partner</h2>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form>
            <v-row>
              <v-col cols="12">
                <v-file-input
                  data-type="image"
                  label="Upload Image"
                  accept="image/*"
                  prepend-icon="mdi-camera"
                  @change="(event) => handleImageUpload(event, 'image')"
                  class="dialog-input"
                />
                <v-avatar
                  v-if="imagePreview"
                  :image="imagePreview"
                  max-width="150"
                  max-height="150"
                  class="rounded mt-3"
                />
              </v-col>
            </v-row>
            <v-card-actions class="mt-4 d-flex justify-end">
              <v-btn class="mr-4" color="primary" @click="addLogoPartnerItem">
                Add Partner
              </v-btn>
              <v-btn color="error" @click="dialogVisible = false">Cancel</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Edit Partner Dialog -->
    <v-dialog v-model="editDialogVisible" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <h2 class="text-h5">Edit Partner</h2>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form>
            <v-row>
              <v-col cols="12">
                <v-file-input
                  data-type="image"
                  label="Upload Image"
                  accept="image/*"
                  prepend-icon="mdi-camera"
                  @change="(event) => handleImageUpload(event, 'image')"
                  class="dialog-input"
                />
                <v-avatar
                  v-if="editingImagePreview"
                  :image="editingImagePreview"
                  max-width="150"
                  max-height="150"
                  class="rounded mt-3"
                />
              </v-col>
            </v-row>
            <v-card-actions class="mt-4 d-flex justify-end">
              <v-btn
                class="mr-4"
                color="primary"
                @click="saveEditedLogoPartnerItem"
              >
                Save Changes
              </v-btn>
              <v-btn color="error" @click="editDialogVisible = false"
                >Cancel</v-btn
              >
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
          Are you sure you want to delete this partner?
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

const logoPartnersList = ref([]);
const newLogoPartnerItem = ref({ image: "", previewUrl: "", imageName: "" });
const imagePreview = ref(null);
const editingLogoPartnerItem = ref(null);
const editingImagePreview = ref(null);
const dialogVisible = ref(false);
const editDialogVisible = ref(false);

const fetchLogoPartners = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/logoPartners`);
    logoPartnersList.value = response.data.map((partner) => ({
      ...partner,
      previewUrl: partner.image.startsWith("data:image")
        ? partner.image
        : `${apiUrl}/ImageUpload/${partner.image}`,
      imageName: partner.image ? partner.image.split("/").pop() : "",
    }));
  } catch (error) {
    console.error("Error fetching logoPartners:", error);
  }
};
const truncateText = (text, length) => {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
};
const addLogoPartnerItem = async () => {
  if (!newLogoPartnerItem.value.image) {
    alert("Image is required.");
    return;
  }

  const formData = new FormData();
  formData.append("image", newLogoPartnerItem.value.image);

  try {
    const response = await axios.post(`${apiUrl}/api/logoPartners`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    await fetchLogoPartners();
    dialogVisible.value = false;

    newLogoPartnerItem.value = { image: "", previewUrl: "", imageName: "" };
    imagePreview.value = null;

    alert("Partner added successfully!");
  } catch (error) {
    console.error(
      "Error adding partner:",
      error.response ? error.response.data : error
    );
    alert("An error occurred while adding the partner.");
  }
};

const handleImageUpload = (event, type) => {
  const file = event.target.files[0];
  if (type === "image") {
    if (editingLogoPartnerItem.value) {
      editingImagePreview.value = URL.createObjectURL(file);
      editingLogoPartnerItem.value.image = file;
    } else {
      imagePreview.value = URL.createObjectURL(file);
      newLogoPartnerItem.value.image = file;
    }
  }
};

const editLogoPartnerItem = (index) => {
  const item = logoPartnersList.value[index];
  editingLogoPartnerItem.value = { ...item };
  editingImagePreview.value = item.previewUrl || null;
  editDialogVisible.value = true;
};

const saveEditedLogoPartnerItem = async () => {
  if (!editingLogoPartnerItem.value.image) {
    alert("Image is required.");
    return;
  }

  const formData = new FormData();
  formData.append("id", editingLogoPartnerItem.value.id || "");
  if (editingLogoPartnerItem.value.image instanceof File) {
    formData.append("image", editingLogoPartnerItem.value.image);
  }

  try {
    const response = await axios.post(`${apiUrl}/api/logoPartners`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    await fetchLogoPartners();
    editDialogVisible.value = false;

    alert("Partner updated successfully!");
  } catch (error) {
    console.error(
      "Error updating partner:",
      error.response ? error.response.data : error
    );
    alert("An error occurred while updating the partner.");
  }
};

const confirmDialogVisible = ref(false);
const itemToDeleteIndex = ref(null);

const snackbar = ref({
  visible: false,
  message: "",
  color: "success", // 'error' or 'success'
});

const openDeleteConfirmation = (index) => {
  itemToDeleteIndex.value = index;
  confirmDialogVisible.value = true;
};

const confirmDelete = async () => {
  const index = itemToDeleteIndex.value;
  const logoPartnerItem = logoPartnersList.value[index];
  try {
    await axios.delete(`${apiUrl}/api/logoPartners/${logoPartnerItem.id}`);
    logoPartnersList.value.splice(index, 1);
    snackbar.value = {
      visible: true,
      message: "Partner deleted successfully!",
      color: "success",
    };
  } catch (error) {
    console.error(
      "Error deleting partner:",
      error.response ? error.response.data : error
    );
    snackbar.value = {
      visible: true,
      message: "An error occurred while deleting the partner.",
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

const paginatedLogoPartnersList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return logoPartnersList.value.slice(start, end);
});

const pageCount = computed(() => {
  return Math.ceil(logoPartnersList.value.length / itemsPerPage.value);
});

const handlePageChange = (page) => {
  currentPage.value = page;
};

onMounted(fetchLogoPartners);
</script>

<style scoped>
.d-flex.justify-space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.center-table th,
.center-table td {
  padding: 15px;
  border: 0.5px solid rgba(0, 0, 0, 0.08);
}

.text-subtitle-1 {
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.6;
}

.v-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mr-2 {
  margin-right: 0.5rem !important;
}

.pa-2 {
  padding: 0.5rem !important;
}

.mb-1 {
  margin-bottom: 0.25rem !important;
}

.mr-4 {
  margin-right: 1rem !important;
}

.mt-4 {
  margin-top: 1.5rem !important;
}

.mt-3 {
  margin-top: 1rem !important;
}

.dialog-input {
  margin-bottom: 16px;
}
</style>
