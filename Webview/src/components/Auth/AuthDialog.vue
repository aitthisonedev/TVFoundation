<template>
  <div class="modal fade" id="authModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 rounded-4">
        <!-- Modal Header with Tabs -->
        <div class="modal-header border-0 pb-0">
          <ul class="nav nav-tabs border-0 w-100" role="tablist">
            <li class="nav-item flex-grow-1" role="presentation">
              <button
                class="nav-link w-100 active"
                :class="{ active: activeTab === 'login' }"
                @click="activeTab = 'login'"
                type="button"
              >
                {{ $t("auth.login.title") }}
              </button>
            </li>
            <li class="nav-item flex-grow-1" role="presentation">
              <button
                class="nav-link w-100"
                :class="{ active: activeTab === 'register' }"
                @click="activeTab = 'register'"
                type="button"
              >
                {{ $t("auth.register.title") }}
              </button>
            </li>
          </ul>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body p-4">
          <!-- Login Form -->
          <div v-if="activeTab === 'login'" class="tab-pane fade show active">
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label class="form-label">{{ $t("auth.login.email") }}</label>
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0">
                    <i class="fas fa-envelope text-primary"></i>
                  </span>
                  <input
                    type="email"
                    class="form-control border-start-0"
                    v-model="loginForm.email"
                    required
                  />
                </div>
              </div>

              <div class="mb-4">
                <label class="form-label">{{ $t("auth.login.password") }}</label>
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0">
                    <i class="fas fa-lock text-primary"></i>
                  </span>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control border-start-0"
                    v-model="loginForm.password"
                    required
                  />
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="togglePassword"
                  >
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
              </div>

              <button type="submit" class="btn btn-primary w-100 mb-3">
                {{ $t("auth.login.submit") }}
              </button>
            </form>
          </div>

          <!-- Register Form -->
          <div v-else class="tab-pane fade show active">
            <form @submit.prevent="handleRegister">
              <div class="mb-3">
                <label class="form-label">{{ $t("auth.register.name") }}</label>
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0">
                    <i class="fas fa-user text-primary"></i>
                  </span>
                  <input
                    type="text"
                    class="form-control border-start-0"
                    v-model="registerForm.name"
                    required
                  />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">{{ $t("auth.register.email") }}</label>
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0">
                    <i class="fas fa-envelope text-primary"></i>
                  </span>
                  <input
                    type="email"
                    class="form-control border-start-0"
                    v-model="registerForm.email"
                    required
                  />
                </div>
              </div>

              <div class="mb-4">
                <label class="form-label">{{ $t("auth.register.password") }}</label>
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0">
                    <i class="fas fa-lock text-primary"></i>
                  </span>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control border-start-0"
                    v-model="registerForm.password"
                    required
                  />
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="togglePassword"
                  >
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
              </div>

              <button type="submit" class="btn btn-primary w-100 mb-3">
                {{ $t("auth.register.submit") }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { Modal } from 'bootstrap';

const authStore = useAuthStore();
const activeTab = ref('login');
const showPassword = ref(false);

const loginForm = ref({
  email: '',
  password: ''
});

const registerForm = ref({
  name: '',
  email: '',
  password: ''
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  try {
    await authStore.login(loginForm.value);
    closeModal();
  } catch (error) {
    console.error('Login failed:', error);
  }
};

const handleRegister = async () => {
  try {
    await authStore.register(registerForm.value);
    closeModal();
  } catch (error) {
    console.error('Registration failed:', error);
  }
};

const closeModal = () => {
  const modal = Modal.getInstance(document.getElementById('authModal'));
  if (modal) {
    modal.hide();
  }
};
</script>

<style scoped>
.modal-content {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.nav-tabs {
  border: none;
}

.nav-tabs .nav-link {
  border: none;
  color: #6c757d;
  font-weight: 500;
  padding: 1rem;
  transition: all 0.3s ease;
}

.nav-tabs .nav-link.active {
  color: #ed207b;
  border-bottom: 2px solid #ed207b;
}

.input-group-text {
  border-right: none;
}

.form-control:focus {
  border-color: #ed207b;
  box-shadow: none;
}

.btn-primary {
  background-color: #ed207b;
  border-color: #ed207b;
}

.btn-primary:hover {
  background-color: #d41c6c;
  border-color: #d41c6c;
}

.btn-outline-secondary {
  border-color: #ced4da;
}

.btn-outline-secondary:hover {
  background-color: #f8f9fa;
  border-color: #ced4da;
  color: #6c757d;
}
</style> 