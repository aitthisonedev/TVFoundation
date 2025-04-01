<template>
  <v-row>
    <v-col cols="12">
      <v-card elevation="2" class="rounded-lg">
        <v-card-title class="d-flex justify-space-between align-center pa-6 bg-primary">
          <h6 class="text-h5 text-white font-weight-bold">Bank Accounts</h6>
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

        <v-card-text v-if="bankAccounts.length === 0" class="pa-6 text-center">
          <p class="text-subtitle-1 text-grey">No bank accounts available.</p>
        </v-card-text>

        <v-card-text v-else class="pa-4">
          <v-table hover class="rounded">
            <thead>
              <tr>
                <th class="text-left font-weight-bold">SL</th>
                <th class="text-left font-weight-bold">Logo</th>
                <th class="text-left font-weight-bold">Account Name</th>
                <th class="text-left font-weight-bold">Account Numbers</th>
                <th class="text-left font-weight-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(account, index) in paginatedAccounts" :key="account.id">
                <td class="text-caption">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="py-2" style="width: 120px">
                  <v-img
                    class="rounded-lg mx-auto p-1"
                    width="100%"
                    height="auto"
                    :src="account.logo ? `${apiUrl}${account.logo}` : ''"
                    cover
                    @error="handleImageError"
                  >
                    <template v-slot:placeholder>
                      <v-row align="center" justify="center" class="fill-height">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </td>
                <td class="text-body-2 text-center">{{ account.accountName }}</td>
                <td class="text-body-2 text-center">
                  <div>LAK: {{ account.accounts_lak }}</div>
                  <div>USD: {{ account.accounts_usd }}</div>
                  <div>THB: {{ account.accounts_thb }}</div>
                </td>
                <td>
                  <v-btn
                    size="small"
                    color="warning"
                    variant="flat"
                    class="mr-2"
                    @click="editAccount(account)"
                  >
                    <v-icon size="small">mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    size="small"
                    color="error"
                    variant="flat"
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
          <span class="text-h5 font-weight-bold">{{ isEditing ? 'Edit' : 'Add' }} Bank Account</span>
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form @submit.prevent="submitForm">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.BankName_en"
                  label="Bank Name (English)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.BankName_lo"
                  label="Bank Name (Lao)"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.accountName"
                  label="Account Name"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="formData.accounts_lak"
                  label="LAK Account Number"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="formData.accounts_usd"
                  label="USD Account Number"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="formData.accounts_thb"
                  label="THB Account Number"
                  variant="outlined"
                  required
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-file-input
                  label="Bank Logo"
                  accept="image/*"
                  prepend-icon="mdi-camera"
                  variant="outlined"
                  class="rounded-lg"
                  @change="(e) => handleFileChange(e, 'logo')"
                />
                <v-img
                  v-if="formData.logoPreview"
                  :src="formData.logoPreview"
                  width="150"
                  height="150"
                  cover
                  class="mt-2 rounded"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-file-input
                  label="LAK QR Code"
                  accept="image/*"
                  prepend-icon="mdi-qrcode"
                  variant="outlined"
                  class="rounded-lg"
                  @change="(e) => handleFileChange(e, 'ImageqrCodes_lak')"
                />
                <v-img
                  v-if="formData.qrLakPreview"
                  :src="formData.qrLakPreview"
                  width="150"
                  height="150"
                  cover
                  class="mt-2 rounded"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-file-input
                  label="USD QR Code"
                  accept="image/*"
                  prepend-icon="mdi-qrcode"
                  variant="outlined"
                  class="rounded-lg"
                  @change="(e) => handleFileChange(e, 'ImageqrCodes_usd')"
                />
                <v-img
                  v-if="formData.qrUsdPreview"
                  :src="formData.qrUsdPreview"
                  width="150"
                  height="150"
                  cover
                  class="mt-2 rounded"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-file-input
                  label="THB QR Code"
                  accept="image/*"
                  prepend-icon="mdi-qrcode"
                  variant="outlined"
                  class="rounded-lg"
                  @change="(e) => handleFileChange(e, 'ImageqrCodes_thb')"
                />
                <v-img
                  v-if="formData.qrThbPreview"
                  :src="formData.qrThbPreview"
                  width="150"
                  height="150"
                  cover
                  class="mt-2 rounded"
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
        <v-card-title class="pa-6 bg-error text-white">Confirm Delete</v-card-title>
        <v-card-text class="pa-6 text-body-1">
          Are you sure you want to delete this bank account?
        </v-card-text>
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn 
            color="grey" 
            variant="flat"
            class="text-capitalize mr-2"
            @click="cancelDelete"
          >
            Cancel
          </v-btn>
          <v-btn 
            color="error"
            variant="flat"
            class="text-capitalize"
            @click="confirmDelete"
          >
            Confirm
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
      timeout="3000"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </v-row>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
const bankAccounts = ref([]);
const dialogVisible = ref(false);
const isEditing = ref(false);
const confirmDialogVisible = ref(false);
const itemToDeleteIndex = ref(null);
const currentPage = ref(1);
const itemsPerPage = ref(10);

const formData = ref({
  id: null,
  BankName_en: "",
  BankName_lo: "",
  accountName: "",
  accounts_lak: "",
  accounts_usd: "",
  accounts_thb: "",
  logo: null,
  ImageqrCodes_lak: null,
  ImageqrCodes_usd: null,
  ImageqrCodes_thb: null,
  logoPreview: null,
  qrLakPreview: null,
  qrUsdPreview: null,
  qrThbPreview: null,
});

const snackbar = ref({
  visible: false,
  message: "",
  color: "success",
});

const fetchBankAccounts = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/bank-accounts`);
    bankAccounts.value = response.data;
  } catch (error) {
    console.error("Error fetching bank accounts:", error);
    showSnackbar("Error fetching bank accounts", "error");
  }
};

const handleFileChange = (event, field) => {
  const file = event.target.files[0];
  if (file) {
    formData.value[field] = file;
    const previewField = {
      logo: 'logoPreview',
      ImageqrCodes_lak: 'qrLakPreview',
      ImageqrCodes_usd: 'qrUsdPreview',
      ImageqrCodes_thb: 'qrThbPreview',
    }[field];
    formData.value[previewField] = URL.createObjectURL(file);
  }
};

const submitForm = async () => {
  try {
    const formDataToSend = new FormData();
    Object.keys(formData.value).forEach(key => {
      if (formData.value[key] !== null && !key.includes('Preview')) {
        formDataToSend.append(key, formData.value[key]);
      }
    });

    if (isEditing.value) {
      await axios.put(`${apiUrl}/api/bank-accounts/${formData.value.id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showSnackbar("Bank account updated successfully!");
    } else {
      await axios.post(`${apiUrl}/api/bank-accounts`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showSnackbar("Bank account created successfully!");
    }

    await fetchBankAccounts();
    dialogVisible.value = false;
    resetForm();
  } catch (error) {
    console.error("Error submitting form:", error);
    showSnackbar("Error saving bank account", "error");
  }
};

const editAccount = (account) => {
  formData.value = {
    ...account,
    logoPreview: account.logo ? `${apiUrl}${account.logo}` : null,
    qrLakPreview: account.ImageqrCodes_lak ? `${apiUrl}${account.ImageqrCodes_lak}` : null,
    qrUsdPreview: account.ImageqrCodes_usd ? `${apiUrl}${account.ImageqrCodes_usd}` : null,
    qrThbPreview: account.ImageqrCodes_thb ? `${apiUrl}${account.ImageqrCodes_thb}` : null,
  };
  isEditing.value = true;
  dialogVisible.value = true;
};

const resetForm = () => {
  formData.value = {
    id: null,
    BankName_en: "",
    BankName_lo: "",
    accountName: "",
    accounts_lak: "",
    accounts_usd: "",
    accounts_thb: "",
    logo: null,
    ImageqrCodes_lak: null,
    ImageqrCodes_usd: null,
    ImageqrCodes_thb: null,
    logoPreview: null,
    qrLakPreview: null,
    qrUsdPreview: null,
    qrThbPreview: null,
  };
  isEditing.value = false;
};

const showSnackbar = (message, color = "success") => {
  snackbar.value = {
    visible: true,
    message,
    color,
  };
};

const paginatedAccounts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return bankAccounts.value.slice(start, end);
});

const pageCount = computed(() => {
  return Math.ceil(bankAccounts.value.length / itemsPerPage.value);
});

const handlePageChange = (page) => {
  currentPage.value = page;
};

const openDeleteConfirmation = (index) => {
  itemToDeleteIndex.value = index;
  confirmDialogVisible.value = true;
};

const confirmDelete = async () => {
  const index = itemToDeleteIndex.value;
  const account = bankAccounts.value[index];
  try {
    await axios.delete(`${apiUrl}/api/bank-accounts/${account.id}`);
    await fetchBankAccounts();
    showSnackbar("Bank account deleted successfully!");
  } catch (error) {
    console.error("Error deleting bank account:", error);
    showSnackbar("Error deleting bank account", "error");
  } finally {
    confirmDialogVisible.value = false;
    itemToDeleteIndex.value = null;
  }
};

const cancelDelete = () => {
  confirmDialogVisible.value = false;
  itemToDeleteIndex.value = null;
};

const handleImageError = (error) => {
  console.error('Error loading image:', error);
};

onMounted(fetchBankAccounts);
</script> 
