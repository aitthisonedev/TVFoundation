<template>
  <VRow>
    <!-- User Management Section -->
    <VCol cols="12">
      <VCard>
        <v-card-text class="d-flex justify-space-between align-center">
          <h3>User Management</h3>
          <VBtn color="primary" @click="openModalUser()">Add User</VBtn>
        </v-card-text>
        <VCardText>
          <VTable>
            <thead>
              <tr>
                <th>No</th>
                <th>Photo</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr  class="h-300" v-for="(user, index) in paginatedUsers" :key="index">
                <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="text-center">
                  <VAvatar
                    rounded="lg"
                    size="40"
                    :image="
                      user.profile_image
                        ? `${apiUrl}/ImageUpload/${user.profile_image}`
                        : avatar1
                    "
                  />
                </td>
                <td >{{ truncateText(user.name, 20) }}</td>
                <td >{{ truncateText(user.lastname, 20) }}</td>
                <td >{{ truncateText(user.phone, 14) }}</td>
                <td >{{ truncateText(user.email, 14) }}</td>
                <td >{{ truncateText(user.role, 5) }}</td>
                <td >
                  <VBtn
                    class="mr-2 pa-2 mb-1 bg-surface-variant rounded"
                    text
                    small
                    @click="openModalUser(user)"
                  >
                    <v-icon class="pa-0 text-sm">mdi-pencil</v-icon>
                    <span class="pa-0 d-none d-sm-inline text-sm">Edit</span>
                  </VBtn>
                  <VBtn
                    class="mr-2 pa-2 mb-1 bg-surface-variant rounded"
                    text
                    small
                    color="error"
                    @click="confirmDeleteUser(user)"
                  >
                    <v-icon class="text-sm">mdi-delete</v-icon>
                    <span class="d-sm-inline text-sm">Delete</span>
                  </VBtn>
                </td>
              </tr>
            </tbody>
          </VTable>

          <!-- Pagination Component -->
          <v-pagination
            v-model="currentPage"
            :length="pageCount"
            @update:model-value="handlePageChange"
            :total-visible="10"
            size="large"
          ></v-pagination>
        </VCardText>
      </VCard>
    </VCol>

    <!-- User Form Modal -->
    <VDialog v-model="isModalOpen" persistent max-width="500px">
      <VCard>
        <VCardTitle>
          <h2>{{ isEditMode ? "Edit User" : "Add User" }}</h2>
        </VCardTitle>
        <VDivider />
        <VCardText>
          <VForm>
            <VRow>
              <VCol cols="12" sm="6">
                <VTextField v-model="form.name" label="First Name" required />
              </VCol>
              <VCol cols="12" sm="6">
                <VTextField
                  v-model="form.lastname"
                  label="Last Name"
                  required
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="form.email"
                  label="Email"
                  type="email"
                  required
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="form.phone"
                  label="Phone"
                  type="tel"
                  required
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="form.password"
                  label="Password"
                  type="password"
                  :required="!isEditMode"
                />
              </VCol>
              <VCol cols="12">
                <VSelect
                  v-model="form.role"
                  :items="roles"
                  item-value="value"
                  item-title="label"
                  required
                />
              </VCol>
            </VRow>
            <VCardActions class="mt-8">
              <VBtn class="bg-primary" color="with" @click="saveUser"
                >{{ isEditMode ? "Update" : "Add" }} User</VBtn
              >
              <VBtn class="bg-red" color="with" @click="closeModalUser"
                >Cancel</VBtn
              >
            </VCardActions>
          </VForm>
        </VCardText>
      </VCard>
    </VDialog>

    <!-- Confirmation Dialog -->
    <VDialog v-model="confirmDialogVisible" max-width="400px">
      <VCard>
        <VCardTitle class="headline">Confirm Deletion</VCardTitle>
        <VCardText> Are you sure you want to delete this user? </VCardText>
        <VCardActions>
          <v-spacer></v-spacer>
          <VBtn @click="deleteUser" color="primary">Yes, Delete</VBtn>
          <VBtn @click="cancelDelete" color="grey">Cancel</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Success/Error Messages -->
    <VCol cols="12" class="d-flex justify-center">
      <VAlert v-if="errorMessage" type="error" class="mt-auto">{{ errorMessage }}</VAlert>
      <VAlert v-if="successMessage" type="success" class="mt-auto">{{ successMessage }}</VAlert>
    </VCol>
  </VRow>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import avatar1 from "@images/avatars/avt.jpg";

// State variables
const apiUrl = import.meta.env.VITE_API_URL;
const users = ref([]);
const form = ref({
  id: null,
  name: "",
  lastname: "",
  email: "",
  phone: "",
  password: "",
  role: "",
  profile_image: "",
  photo: null,
});
const roles = [
  { value: "Admin", label: "Admin" },
  { value: "Editor", label: "Editor" },
  { value: "Viewer", label: "Viewer" },
];
const newProfileImage = ref(null);
const isModalOpen = ref(false);
const isEditMode = ref(false);
const successMessage = ref("");
const errorMessage = ref("");
const confirmDialogVisible = ref(false);
let userToDelete = null;

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(10); // Number of users per page

//truncateText
const truncateText = (text, length) => {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
};
// Computed property for paginated users
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return users.value.slice(start, end);
});

// Calculate total page count
const pageCount = computed(() => {
  return Math.ceil(users.value.length / itemsPerPage.value);
});

// Handle page change
const handlePageChange = (page) => {
  currentPage.value = page;
};

// Fetch all users
const fetchUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${apiUrl}/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    users.value = response.data; // Assign the fetched users array to users.value
  } catch (error) {
    console.error("Error fetching users:", error);
    errorMessage.value = "Error fetching users.";
  }
};

// Open modal for adding or editing a user
const openModalUser = (user = null) => {
  if (user) {
    isEditMode.value = true;
    form.value = { ...user, password: "" };
    form.value.photo = user.profile_image
      ? `${apiUrl}/ImageUpload/${user.profile_image}`
      : avatar1;
  } else {
    isEditMode.value = false;
    resetForm();
  }
  isModalOpen.value = true;
};

// Close the modal and reset the form
const closeModalUser = () => {
  isModalOpen.value = false;
  resetForm();
};

// Save or update the user
const saveUser = async () => {
  try {
    const token = localStorage.getItem("token");

    // Upload the profile image if a new one is selected
    if (newProfileImage.value) {
      const formData = new FormData();
      formData.append("image", newProfileImage.value);
      const imageResponse = await axios.post(
        `${apiUrl}/api/users/${
          isEditMode.value ? form.value.id : ""
        }/uploadProfileImage`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      form.value.profile_image = imageResponse.data.file.filename;
    }

    if (isEditMode.value) {
      // Update existing user
      const response = await axios.put(
        `${apiUrl}/api/users/${form.value.id}`,
        form.value,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      successMessage.value = "User updated successfully.";
    } else {
      // Add new user
      const response = await axios.post(`${apiUrl}/api/users`, form.value, {
        headers: { Authorization: `Bearer ${token}` },
      });
      successMessage.value = "User added successfully.";
    }

    fetchUsers();
    closeModalUser();
  } catch (error) {
    console.error("Error saving user:", error);
    // Check if the error response indicates a permission issue
    if (error.response && error.response.status === 403) {
      errorMessage.value = "You don't have permission to edit this user.";
    } else {
      errorMessage.value = "Failed to save user.";
    }
  }
};

// Delete a user after confirmation
const deleteUser = async () => {
  try {
    if (!userToDelete) return;
    const token = localStorage.getItem("token");
    await axios.delete(`${apiUrl}/api/users/${userToDelete.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    successMessage.value = "User deleted successfully.";
    userToDelete = null;
    confirmDialogVisible.value = false;
    fetchUsers();
  } catch (error) {
    console.error("Error deleting user:", error);
    // Check if the error response indicates a permission issue
    if (error.response && error.response.status === 403) {
      errorMessage.value = "You don't have permission to delete this user.";
      confirmDialogVisible.value = false; // Close the confirmation dialog
    } else {
      errorMessage.value = "Failed to delete user.";
    }
  }
};

// Open confirmation dialog before deletion
const confirmDeleteUser = (user) => {
  userToDelete = user;
  confirmDialogVisible.value = true;
};

// Cancel deletion
const cancelDelete = () => {
  userToDelete = null;
  confirmDialogVisible.value = false;
};

// Change avatar during profile update
const changeAvatar = (event) => {
  const file = event.target.files[0]; // Get the selected file
  if (file) {
    newProfileImage.value = file; // Store the file in the reactive variable

    // Create a FileReader to read the file and convert it to a base64 string
    const reader = new FileReader();

    reader.onload = () => {
      form.value.photo = reader.result; // Set the base64 string as the photo in the form
    };

    reader.onerror = (error) => {
      console.error("Error reading the image file:", error); // Handle any errors
    };

    reader.readAsDataURL(file); // Read the file as a data URL (base64)
  } else {
    console.warn("No file selected for avatar update.");
  }
};

// Reset the form to its initial state
const resetForm = () => {
  form.value = {
    id: null,
    name: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    profile_image: "",
    photo: null,
  };
  newProfileImage.value = null;
};

// Close alert when clicking outside or on the close button
const closeErrorAlert = () => {
  errorMessage.value = ""; // Clear the error message
};

// Add a click event listener to the document to close the alert
onMounted(() => {
  document.addEventListener('click', closeErrorAlert);
});

// Clean up the event listener when the component is unmounted
onBeforeUnmount(() => {
  document.removeEventListener('click', closeErrorAlert);
});

// Fetch users when the component is mounted
onMounted(fetchUsers);
</script>

<style scoped>
/* Add any additional styling if needed */
</style>
