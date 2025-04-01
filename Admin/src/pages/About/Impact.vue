<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card elevation="2" class="rounded-lg">
          <!-- Title Section -->
          <v-card-title
            class="d-flex justify-space-between align-center pa-6 bg-primary"
          >
            <h6 class="text-h5 text-white font-weight-bold">Impact</h6>
            <v-btn
              color="white"
              variant="flat"
              prepend-icon="mdi-plus"
              class="text-capitalize"
              @click="openDialog"
            >
              Add New
            </v-btn>
          </v-card-title>

          <!-- No Data Available -->
          <v-card-text v-if="contentList.length === 0" class="pa-6 text-center">
            <p class="text-subtitle-1 text-grey">No content available.</p>
          </v-card-text>

          <!-- Table Section -->
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
                <tr
                  v-for="(content, index) in paginatedContents"
                  :key="content.id"
                >
                  <td class="text-body-2">
                    {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                  </td>
                  <td class="py-2">
                    <v-img
                      v-if="content.image"
                      class="rounded-lg mx-auto"
                      width="auto"
                      height="100%"
                      :src="content.image ? `${apiUrl}${content.image}` : ''"
                      cover
                      @error="handleImageError"
                    >
                      <template v-slot:placeholder>
                        <v-row
                          align="center"
                          justify="center"
                          class="fill-height"
                        >
                          <v-progress-circular
                            indeterminate
                            color="primary"
                          ></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                  </td>

                  <td class="text-body-2 text-center">
                    {{ truncateText(content.title_en, 50) }}
                  </td>
                  <td class="text-body-2 text-center">
                    {{ truncateText(content.title_lo, 50) }}
                  </td>
                  <td class="text-body-2 text-center">
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
                      @click="openDeleteDialog(content.id)"
                    >
                      <v-icon size="small">mdi-delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>

            <!-- Pagination -->
            <div class="d-flex justify-center mt-6">
              <v-pagination
                v-model="currentPage"
                :length="pageCount"
                rounded="circle"
              ></v-pagination>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialogVisible" persistent max-width="800px">
      <v-card class="rounded-lg">
        <v-card-title class="pa-6 bg-primary text-white">
          <span class="text-h5 font-weight-bold"
            >{{ isEditing ? "Edit" : "Add" }} Content</span
          >
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form>
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

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.caption_en"
                  label="Caption (EN)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.caption_lo"
                  label="Caption (LO)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>

              <v-col cols="12" md="6">
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
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="formData.helped"
                  label="People Helped"
                  type="number"
                  min="0"
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
            @click="closeDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            class="text-capitalize"
            @click="submitForm"
          >
            {{ isEditing ? "Update" : "Create" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="confirmDialogVisible" max-width="400px">
      <v-card class="rounded-lg">
        <v-card-title class="pa-6 bg-primary text-white"
          >Confirm Delete</v-card-title
        >
        <v-card-text class="pa-6 text-body-1">
          Are you sure you want to delete this content?
        </v-card-text>
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            variant="flat"
            class="text-capitalize"
            @click="deleteContent"
          >
            Confirm
          </v-btn>
          <v-btn
            color="grey"
            variant="flat"
            class="text-capitalize"
            @click="closeDeleteDialog"
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
    >
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

export default {
  setup() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const placeholderImage = "";
    const contentList = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = 10;
    const dialogVisible = ref(false);
    const isEditing = ref(false);
    const formData = ref({
      title_en: "",
      title_lo: "",
      description_en: "",
      description_lo: "",
      helped: 0,
      caption_en: "",
      caption_lo: "",
      image: null,
    });
    const confirmDialogVisible = ref(false);
    const itemToDelete = ref(null);
    const snackbar = ref({ visible: false, message: "", color: "success" });
    const imagePreview = ref(null);

    const fetchContents = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/impact`);
        contentList.value = response.data;
      } catch (error) {
        console.error("Error fetching impacts:", error);
        snackbar.value = {
          visible: true,
          message: error.response?.data?.error || "Error fetching impacts",
          color: "error",
        };
      }
    };

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        formData.value.image = file;
        imagePreview.value = URL.createObjectURL(file);
      }
    };

    const handleImageError = (event) => {
      event.target.src = placeholderImage;
    };

    const submitForm = async () => {
      try {
        // Validate required fields
        const requiredFields = [
          "title_en",
          "title_lo",
          "description_en",
          "description_lo",
          "caption_en",
          "caption_lo",
        ];

        const missingFields = requiredFields.filter(
          (field) => !formData.value[field]
        );
        if (missingFields.length > 0) {
          throw new Error(
            `Missing required fields: ${missingFields.join(", ")}`
          );
        }

        const url = `${apiUrl}/api/impact${
          isEditing.value ? `/${formData.value.id}` : ""
        }`;
        const method = isEditing.value ? "put" : "post";
        const payload = new FormData();

        // Add all form fields to FormData
        Object.keys(formData.value).forEach((key) => {
          // Skip image if it's null and we're editing
          if (key === "image" && !formData.value[key] && isEditing.value) {
            return;
          }
          // Handle helped as a number
          if (key === "helped") {
            payload.append(key, parseInt(formData.value[key]) || 0);
          } else {
            if (formData.value[key] !== null) {
              payload.append(key, formData.value[key]);
            }
          }
        });

        // Debug log
        console.log("Submitting form data:");
        for (let pair of payload.entries()) {
          console.log(pair[0], pair[1]);
        }

        const response = await axios({
          method,
          url,
          data: payload,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data) {
          snackbar.value = {
            visible: true,
            message: `Impact ${
              isEditing.value ? "updated" : "created"
            } successfully!`,
            color: "success",
          };
          await fetchContents();
          dialogVisible.value = false;
          resetForm();
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        snackbar.value = {
          visible: true,
          message:
            error.response?.data?.error ||
            error.message ||
            "Error saving impact",
          color: "error",
        };
      }
    };

    const editContent = (content) => {
      formData.value = { ...content };
      imagePreview.value = content.image ? `${apiUrl}${content.image}` : null;
      dialogVisible.value = true;
      isEditing.value = true;
    };

    const openDialog = () => {
      formData.value = { title_en: "", title_lo: "", image: null };
      imagePreview.value = null;
      dialogVisible.value = true;
      isEditing.value = false;
    };

    const closeDialog = () => {
      dialogVisible.value = false;
    };

    const openDeleteDialog = (id) => {
      itemToDelete.value = id;
      confirmDialogVisible.value = true;
    };

    const closeDeleteDialog = () => {
      confirmDialogVisible.value = false;
    };

    const deleteContent = async () => {
      try {
        await axios.delete(`${apiUrl}/api/impact/${itemToDelete.value}`);
        await fetchContents();
        snackbar.value = {
          visible: true,
          message: "Impact deleted successfully!",
          color: "success",
        };
        closeDeleteDialog();
      } catch (error) {
        console.error("Error deleting impact:", error);
        snackbar.value = {
          visible: true,
          message: error.response?.data?.error || "Error deleting impact",
          color: "error",
        };
      }
    };

    const paginatedContents = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return contentList.value.slice(start, start + itemsPerPage);
    });

    const pageCount = computed(() =>
      Math.ceil(contentList.value.length / itemsPerPage)
    );

    const truncateText = (text, length) => {
      return text.length > length ? `${text.substring(0, length)}...` : text;
    };

    const resetForm = () => {
      formData.value = {
        title_en: "",
        title_lo: "",
        description_en: "",
        description_lo: "",
        helped: 0,
        caption_en: "",
        caption_lo: "",
        image: null,
      };
      imagePreview.value = null;
      isEditing.value = false;
    };

    onMounted(fetchContents);

    return {
      apiUrl,
      contentList,
      currentPage,
      itemsPerPage,
      dialogVisible,
      confirmDialogVisible,
      formData,
      snackbar,
      placeholderImage,
      isEditing,
      paginatedContents,
      pageCount,
      fetchContents,
      submitForm,
      editContent,
      openDialog,
      closeDialog,
      openDeleteDialog,
      closeDeleteDialog,
      deleteContent,
      truncateText,
      imagePreview,
      handleImageUpload,
      handleImageError,
      resetForm,
    };
  },
};
</script>

<style scoped>
/* Custom styles */
</style>
