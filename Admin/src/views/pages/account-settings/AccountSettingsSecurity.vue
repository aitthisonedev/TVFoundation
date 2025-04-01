<script setup>
import { ref } from 'vue'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL;
const isCurrentPasswordVisible = ref(false)
const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('')

const passwordRequirements = [
  'Minimum 8 characters long - the more, the better',
  'At least one lowercase character',
  'At least one number, symbol, or whitespace character',
]

// Function to update the password
const updatePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    snackbarMessage.value = 'New password and confirm password do not match.'
    snackbarColor.value = 'error'
    snackbar.value = true
    return
  }

  try {
    const data = {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    }

    const token = localStorage.getItem('token')
    const response = await axios.post(`${apiUrl}/api/users/changePassword`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' // Explicitly specify this for JSON
      },
    });

    if (response.status === 200) {
      snackbarMessage.value = 'Password updated successfully.'
      snackbarColor.value = 'success'
      snackbar.value = true

      // Reset fields
      currentPassword.value = ''
      newPassword.value = ''
      confirmPassword.value = ''
    }
  } catch (error) {
    console.error('Error updating password:', error)
    snackbarMessage.value = 'Failed to update password. Please check your current password and try again.'
    snackbarColor.value = 'error'
    snackbar.value = true
  }
}

</script>

<template>
  <!-- Root element -->
  <div>
    <VRow>
      <!-- SECTION: Change Password -->
      <VCol cols="12">
        <VCard title="Change Password">
          <VForm>
            <VCardText>
              <!-- 👉 Current Password -->
              <VRow>
                <VCol cols="12" md="6">
                  <!-- 👉 current password -->
                  <VTextField
                    v-model="currentPassword"
                    :type="isCurrentPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isCurrentPasswordVisible ? 'bx-hide' : 'bx-show'"
                    label="Current Password"
                    placeholder="············"
                    @click:append-inner="isCurrentPasswordVisible = !isCurrentPasswordVisible"
                  />
                </VCol>
              </VRow>

              <!-- 👉 New Password -->
              <VRow>
                <VCol cols="12" md="6">
                  <!-- 👉 new password -->
                  <VTextField
                    v-model="newPassword"
                    :type="isNewPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isNewPasswordVisible ? 'bx-hide' : 'bx-show'"
                    label="New Password"
                    placeholder="············"
                    @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible"
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <!-- 👉 confirm password -->
                  <VTextField
                    v-model="confirmPassword"
                    :type="isConfirmPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isConfirmPasswordVisible ? 'bx-hide' : 'bx-show'"
                    label="Confirm New Password"
                    placeholder="············"
                    @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                  />
                </VCol>
              </VRow>
            </VCardText>

            <!-- 👉 Password Requirements -->
            <!-- <VCardText>
              <p class="text-base font-weight-medium mt-2">
                Password Requirements:
              </p>

              <ul class="d-flex flex-column gap-y-3">
                <li
                  v-for="item in passwordRequirements"
                  :key="item"
                  class="d-flex"
                >
                  <div>
                    <VIcon
                      size="7"
                      icon="bxs-circle"
                      class="me-3"
                    />
                  </div>
                  <span class="font-weight-medium">{{ item }}</span>
                </li>
              </ul>
            </VCardText> -->

            <!-- 👉 Action Buttons -->
            <VCardText class="d-flex flex-wrap gap-4">
              <VBtn @click="updatePassword">Save changes</VBtn>

              <VBtn
                type="reset"
                color="secondary"
                variant="tonal"
                @click="() => { currentPassword.value = ''; newPassword.value = ''; confirmPassword.value = '' }"
              >
                Reset
              </VBtn>
            </VCardText>
          </VForm>
        </VCard>
      </VCol>
    </VRow>

    <!-- Snackbar for notifications -->
    <VSnackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarMessage }}
    </VSnackbar>
  </div>
</template>
