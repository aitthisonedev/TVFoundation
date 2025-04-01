import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)

  const login = async (credentials) => {
    // Implement your login logic here
    // For demo purposes:
    user.value = {
      name: 'Demo User',
      email: credentials.email,
      avatar: null // Add user avatar URL here
    }
    isAuthenticated.value = true
  }

  const register = async (userData) => {
    // Implement your registration logic here
    // For demo purposes:
    user.value = {
      name: userData.name,
      email: userData.email,
      avatar: null // Add user avatar URL here
    }
    isAuthenticated.value = true
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout
  }
})