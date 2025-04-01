<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center pa-6 bg-primary rounded-lg">
          <h4 class="text-white">Support Company</h4>
          <v-btn @click="openAddDialog">
            <v-icon left>mdi-plus</v-icon> Add Company
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text v-if="supportCompaniesList.length === 0">
          <p class="text-subtitle-1">No companies available.</p>
        </v-card-text>
        <v-card-text v-else>
          <v-table>
            <thead >
              <tr>
                <th>SL</th>
                <th>Logo</th>
                <th>Company Name(EN)</th>
                <th>Company Name(LA)</th>
                <th>Support Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(company, index) in paginatedSupportCompaniesList"
                :key="index"
              >
                <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="text-center">
                  <v-avatar
                    rounded="lg"
                    class="w-auto h-10 p-1"
                    :image="company.logo || ''"
                  />
                </td>
                <td>{{ truncateText(company.name, 50) }}</td>
                <td>{{ truncateText(company.nameLA, 50) }}</td>
                <td>{{ formatDisplayAmount(company.supportAmount) }}</td>
                <td class="text-center">
                  <v-btn
                    class="mr-2 pa-2 mb-1"
                    text
                    small
                    color="primary"
                    @click="editSupportCompany(index)"
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
        <v-card-title>
          <h2 class="text-h5">{{ isEditing ? 'Edit Company' : 'Add Company' }}</h2>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              class="mb-3"
              label="Company Name (EN)"
              v-model="supportCompanyForm.name"
              :rules="[rules.required]"
            />
            <v-text-field
              class="mb-3"
              label="Company Name (LA)"
              v-model="supportCompanyForm.nameLA"
              :rules="[rules.required]"
            />
            <v-textarea
              class="mb-3"
              label="Description (EN)"
              v-model="supportCompanyForm.description"
              rows="3"
            />
            <v-textarea
              class="mb-3"
              label="Description (LA)"
              v-model="supportCompanyForm.descriptionLA"
              rows="3"
            />
            <v-text-field
              class="mb-3"
              label="Support Amount (LAK)"
              v-model="supportCompanyForm.supportAmount"
              type="text"
              :rules="[rules.required, rules.number]"
              @input="formatAmount"
              step="100000"
              min="0"
              @mousewheel.prevent="handleScroll"
            >
              <template v-slot:append>
                <div class="d-flex flex-column">
                  <v-btn
                    icon="mdi-chevron-up"
                    size="x-small"
                    variant="text"
                    @click="incrementAmount(100000)"
                    class="mb-1"
                  ></v-btn>
                  <v-btn
                    icon="mdi-chevron-down"
                    size="x-small"
                    variant="text"
                    @click="incrementAmount(-100000)"
                  ></v-btn>
                </div>
              </template>
            </v-text-field>
            <v-file-input
              label="Upload Logo"
              accept="image/*"
              prepend-icon="mdi-camera"
              @change="handleLogoUpload"
              class="mt-3"
            />
            <v-avatar
              v-if="logoPreview"
              :image="logoPreview"
              max-width="150"
              max-height="150"
              class="rounded mt-3"
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialogVisible = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveSupportCompany" class="ml-2">
            {{ isEditing ? 'Save Changes' : 'Add Company' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirmation Dialog -->
    <v-dialog v-model="confirmDialogVisible" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">Confirm Deletion</v-card-title>
        <v-card-text>
          Are you sure you want to delete this company?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="grey" @click="cancelDelete">Cancel</v-btn>
          <v-btn text color="error" @click="confirmDelete">Delete</v-btn>
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
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn icon @click="snackbar.visible = false">
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

// Data
const supportCompaniesList = ref([]);
const supportCompanyForm = ref({
  id: null,
  name: "",
  nameLA: "",
  description: "",
  descriptionLA: "",
  supportAmount: null,
  logo: null,
});
const dialogVisible = ref(false);
const confirmDialogVisible = ref(false);
const isEditing = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const logoPreview = ref(null);
const itemToDeleteIndex = ref(null);
const form = ref(null);

const snackbar = ref({
  visible: false,
  message: "",
  color: "success",
});

// Validation rules
const rules = {
  required: (value) => !!value || "This field is required.",
  number: (value) => !isNaN(parseFloat(value?.toString().replace(/,/g, ''))) || "Must be a valid number"
};

// Methods
const fetchSupportCompanies = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/supportcompanies`);
    supportCompaniesList.value = response.data.map(company => ({
      ...company,
      displayAmount: formatDisplayAmount(company.supportAmount)
    }));
  } catch (error) {
    console.error("Error fetching support companies:", error);
    showSnackbar("Failed to fetch companies.", "error");
  }
};

const truncateText = (text, length) => {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
};

const openAddDialog = () => {
  supportCompanyForm.value = {
    id: null,
    name: "",
    nameLA: "",
    description: "",
    descriptionLA: "",
    supportAmount: null,
    logo: null,
  };
  logoPreview.value = null;
  isEditing.value = false;
  dialogVisible.value = true;
};

const editSupportCompany = (index) => {
  const company = supportCompaniesList.value[index];
  const formattedAmount = company.supportAmount ? 
    parseInt(company.supportAmount).toLocaleString() : 
    '0';
  
  supportCompanyForm.value = {
    ...company,
    supportAmount: formattedAmount
  };
  logoPreview.value = company.logo || null;
  isEditing.value = true;
  dialogVisible.value = true;
};

const saveSupportCompany = async () => {
  try {
    if (!supportCompanyForm.value.name || !supportCompanyForm.value.nameLA) {
      showSnackbar("Please fill in all required fields.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("name", supportCompanyForm.value.name);
    formData.append("nameLA", supportCompanyForm.value.nameLA);
    formData.append("description", supportCompanyForm.value.description || "");
    formData.append("descriptionLA", supportCompanyForm.value.descriptionLA || "");
    
    // Convert formatted number back to raw number for saving
    const rawAmount = parseInt(supportCompanyForm.value.supportAmount?.toString().replace(/,/g, '')) || 0;
    formData.append("supportAmount", rawAmount);

    if (supportCompanyForm.value.logo instanceof File) {
      formData.append("logo", supportCompanyForm.value.logo);
    }

    if (isEditing.value) {
      formData.append("id", supportCompanyForm.value.id);
    }

    await axios.post(`${apiUrl}/api/supportcompanies`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    await fetchSupportCompanies();
    dialogVisible.value = false;
    showSnackbar(
      isEditing.value
        ? "Company updated successfully!"
        : "Company added successfully!",
      "success"
    );
  } catch (error) {
    console.error("Error saving company:", error);
    showSnackbar("An error occurred while saving the company.", "error");
  }
};

const handleLogoUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    logoPreview.value = URL.createObjectURL(file);
    supportCompanyForm.value.logo = file;
  } else {
    logoPreview.value = null;
    supportCompanyForm.value.logo = null;
  }
};

const openDeleteConfirmation = (index) => {
  itemToDeleteIndex.value = index;
  confirmDialogVisible.value = true;
};

const confirmDelete = async () => {
  try {
    const index = itemToDeleteIndex.value;
    const company = supportCompaniesList.value[index];
    await axios.delete(`${apiUrl}/api/supportcompanies/${company.id}`);
    supportCompaniesList.value.splice(index, 1);
    confirmDialogVisible.value = false;
    showSnackbar("Company deleted successfully!", "success");
  } catch (error) {
    console.error("Error deleting company:", error);
    showSnackbar("An error occurred while deleting the company.", "error");
  }
};

const cancelDelete = () => {
  confirmDialogVisible.value = false;
  itemToDeleteIndex.value = null;
};

const showSnackbar = (message, color) => {
  snackbar.value = {
    visible: true,
    message,
    color,
  };
};

// Computed
const paginatedSupportCompaniesList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return supportCompaniesList.value.slice(start, end);
});

const pageCount = computed(() => {
  return Math.ceil(supportCompaniesList.value.length / itemsPerPage.value);
});

// Methods
const handlePageChange = (page) => {
  currentPage.value = page;
};

// Add new methods for formatting
const formatAmount = (event) => {
  // Get the raw value
  let value = event.target.value.toString();
  
  // Remove non-digit characters except commas
  value = value.replace(/[^\d,]/g, '');
  
  // Remove existing commas
  value = value.replace(/,/g, '');
  
  // Convert to number
  const numValue = parseInt(value) || 0;
  
  // Format with commas
  const formattedValue = numValue.toLocaleString();
  
  // Update the form with both raw and formatted values
  supportCompanyForm.value.supportAmount = formattedValue;
};

const formatDisplayAmount = (value) => {
  if (!value) return '0 LAK';
  // Remove any existing commas and convert to number
  const numValue = typeof value === 'string' ? 
    parseInt(value.replace(/,/g, '')) : 
    parseInt(value);
  // Format with commas and add LAK
  return `${numValue.toLocaleString()} LAK`;
};

const handleScroll = (event) => {
  event.preventDefault();
  const delta = event.deltaY > 0 ? -100000 : 100000;
  incrementAmount(delta);
};

const incrementAmount = (delta) => {
  // Get current amount, removing commas if present
  const currentAmount = parseInt(supportCompanyForm.value.supportAmount?.toString().replace(/,/g, '')) || 0;
  const newAmount = Math.max(0, currentAmount + delta);
  // Update with formatted value
  supportCompanyForm.value.supportAmount = newAmount.toLocaleString();
};

// Lifecycle
onMounted(fetchSupportCompanies);
</script>

<style scoped>
</style>
