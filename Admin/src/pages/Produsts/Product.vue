<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title  class="d-flex justify-space-between pa-6 bg-primary">
          <h5 class="text-h5 text-white">Product Management</h5>
          <v-btn class="bg-primary" @click="openAddDialog">
            <i class="bx bx-plus"></i> Add Product
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text v-if="productsList.length === 0">
          <p>No products available.</p>
        </v-card-text>
        <v-table v-else class="center-table">
          <thead>
            <tr class="head-Table">
              <th>SL</th>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Available</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in paginatedProducts" :key="index">
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td class="text-center">
                <v-img
                  v-if="product.coverImage"
                  :src="`${apiUrl}/ImageUpload/${product.coverImage}`"
                  width="auto"
                  height="100"
                  cover
                  class="ma-1 contain-image rounded"
                />
              </td>
              <td>{{ truncateText(product.name_en, 20) }}</td>
              <td>{{ formatPrice(product.price) }}</td>
              <td>{{ product.category?.name_en || "N/A" }}</td>
              <td>{{ product.available }}</td>
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
            <v-toolbar-title
              >{{ isEditing ? "Edit" : "Add" }} Product</v-toolbar-title
            >
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn @click="closeDialog">Cancel</v-btn>
              <v-btn @click="saveItem" variant="outlined"
                >{{ isEditing ? "Save" : "Add" }} Product</v-btn
              >
            </v-toolbar-items>
          </v-toolbar>
        </v-card-title>
        <v-card-text>
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
                v-model="formData.price"
                label="Price"
                type="number"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.originalPrice"
                label="Original Price"
                type="number"
                required
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.discount"
                label="Discount (%)"
                type="number"
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
                v-model="formData.shippingFee"
                label="Shipping Fee"
                type="number"
                required
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.available"
                label="Available Quantity"
                type="number"
                required
              />
            </v-col>

            <v-col cols="12">
              <v-file-input
                label="Cover Image"
                accept="image/*"
                @change="handleFileUpload($event, 'coverImage')"
              />
            </v-col>

            <v-col cols="12">
              <v-sheet v-if="coverImagePreview || formData.coverImage">
                <v-img
                  :src="
                    coverImagePreview ||
                    `${apiUrl}/ImageUpload/${formData.coverImage}`
                  "
                  max-height="300"
                  contain
                />
              </v-sheet>
            </v-col>

            <v-col cols="12">
              <v-file-input
                label="Sub Images"
                accept="image/*"
                multiple
                @change="handleFileUpload($event, 'subImages')"
              />
            </v-col>

            <v-col cols="12">
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
                    <v-img :src="preview" aspect-ratio="1" contain>
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
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="confirmDialogVisible" max-width="400px">
      <v-card>
        <v-card-title class="headline">Confirm Deletion</v-card-title>
        <v-card-text>Are you sure you want to delete this product?</v-card-text>
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
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import ProductCategories from "./ProductCategories.vue";
const apiUrl = import.meta.env.VITE_API_URL;
const productsList = ref([]);
const categories = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const dialogVisible = ref(false);
const confirmDialogVisible = ref(false);
const deleteIndex = ref(null);
const isEditing = ref(false);
const coverImagePreview = ref(null);
const subImagePreviews = ref([]);

const formData = ref({
  name_en: "",
  name_lo: "",
  price: 0,
  originalPrice: 0,
  discount: 0,
  description_en: "",
  description_lo: "",
  location_en: "",
  location_lo: "",
  shippingFee: 0,
  available: 0,
  category_id: null,
  coverImage: null,
  subImages: [],
});

const snackbar = ref({
  visible: false,
  message: "",
  color: "success",
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return productsList.value.slice(start, end);
});

const pageCount = computed(() => {
  return Math.ceil(productsList.value.length / itemsPerPage.value);
});

const fetchProducts = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/products`);
    productsList.value = response.data;
  } catch (error) {
    showSnackbar("Error fetching products", "error");
  }
};

const fetchCategories = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/product-categories`);
    categories.value = response.data;
  } catch (error) {
    showSnackbar("Error fetching categories", "error");
  }
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

const removeSubImage = (index) => {
  formData.value.subImages.splice(index, 1);
  subImagePreviews.value.splice(index, 1);
};

const saveItem = async () => {
  try {
    const submitFormData = new FormData();
    Object.keys(formData.value).forEach((key) => {
      if (key !== "coverImage" && key !== "subImages") {
        submitFormData.append(key, formData.value[key]);
      }
    });

    if (formData.value.coverImage instanceof File) {
      submitFormData.append("coverImage", formData.value.coverImage);
    }

    if (formData.value.subImages.length > 0) {
      formData.value.subImages.forEach((file) => {
        submitFormData.append("subImages", file);
      });
    }

    if (isEditing.value) {
      await axios.put(
        `${apiUrl}/api/products/${formData.value.product_id}`,
        submitFormData
      );
      showSnackbar("Product updated successfully");
    } else {
      await axios.post(`${apiUrl}/api/products`, submitFormData);
      showSnackbar("Product added successfully");
    }

    await fetchProducts();
    closeDialog();
  } catch (error) {
    showSnackbar("Error saving product", "error");
  }
};

const editItem = (index) => {
  const product = productsList.value[index];
  formData.value = { ...product };
  isEditing.value = true;
  dialogVisible.value = true;
};

const openAddDialog = () => {
  isEditing.value = false;
  formData.value = {
    name_en: "",
    name_lo: "",
    price: 0,
    originalPrice: 0,
    discount: 0,
    description_en: "",
    description_lo: "",
    location_en: "",
    location_lo: "",
    shippingFee: 0,
    available: 0,
    category_id: null,
    coverImage: null,
    subImages: [],
  };
  coverImagePreview.value = null;
  subImagePreviews.value = [];
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
    const productId = productsList.value[deleteIndex.value].product_id;
    await axios.delete(`${apiUrl}/api/products/${productId}`);
    await fetchProducts();
    showSnackbar("Product deleted successfully");
    confirmDialogVisible.value = false;
  } catch (error) {
    showSnackbar("Error deleting product", "error");
  }
};

const cancelDelete = () => {
  confirmDialogVisible.value = false;
  deleteIndex.value = null;
};

const handlePageChange = (page) => {
  currentPage.value = page;
};

const formatPrice = (price) => {
  return `${new Intl.NumberFormat("en-US").format(price)} ₭`;
};

const truncateText = (text, length) => {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
};

const showSnackbar = (message, color = "success") => {
  snackbar.value = {
    message,
    color,
    visible: true,
  };
};

onMounted(async () => {
  await Promise.all([fetchProducts(), fetchCategories()]);
});
</script>

<style scoped>
</style>
