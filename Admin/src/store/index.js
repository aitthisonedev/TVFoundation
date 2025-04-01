import { createStore } from 'vuex';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const store = createStore({
  state: {
    user: null,
    token: localStorage.getItem('token') || '',
    inactivityTimer: null,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },
    LOGOUT(state) {
      state.user = null;
      state.token = '';
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    },
    SET_INACTIVITY_TIMER(state, timer) {
      state.inactivityTimer = timer;
    },
    CLEAR_INACTIVITY_TIMER(state) {
      if (state.inactivityTimer) {
        clearTimeout(state.inactivityTimer);
        state.inactivityTimer = null;
      }
    },
  },
  actions: {
    async requestPasswordReset(_, { email }) {
      try {
        const response = await axios.post(`${apiUrl}/api/users/requestPasswordReset`, { email });
        return response.data;
      } catch (error) {
        if (error.response) {
          throw new Error(error.response.data.error || 'Request failed');
        } else if (error.request) {
          throw new Error('Network error, please check your connection');
        } else {
          throw new Error('An unexpected error occurred');
        }
      }
    },

    async login({ commit, dispatch }, credentials) {
      try {
        const response = await axios.post(`${apiUrl}/api/users/login`, credentials);
        commit('SET_TOKEN', response.data.token);
        await dispatch('fetchUserInfo');
        dispatch('startInactivityTimer');
      } catch (error) {
        console.error('Login error:', error.response ? error.response.data : error);
        throw new Error(error.response?.data?.error || 'Login failed');
      }
    },

    async register(_, userData) {
      try {
        await axios.post(`${apiUrl}/api/users/register`, userData);
      } catch (error) {
        console.error('Registration error:', error.response ? error.response.data : error);
        throw new Error(error.response?.data?.error || 'Registration failed');
      }
    },

    async fetchUserInfo({ commit }) {
      try {
        const response = await axios.get(`${apiUrl}/api/users/me`);
        commit('SET_USER', response.data);
      } catch (error) {
        console.error('Fetch user info error:', error.response ? error.response.data : error);
        commit('LOGOUT');
        throw new Error('Session expired. Please log in again.');
      }
    },

    logout({ commit }) {
      commit('LOGOUT');
      commit('CLEAR_INACTIVITY_TIMER');
    },

    startInactivityTimer({ commit, dispatch }) {
      commit('CLEAR_INACTIVITY_TIMER');
      const timer = setTimeout(() => {
        dispatch('logout');
        alert('You have been logged out due to inactivity. Please log in again to continue your session.');
      }, 10 * 60 * 1000); // 10 minutes
      commit('SET_INACTIVITY_TIMER', timer);
    },

    resetInactivityTimer({ dispatch }) {
      dispatch('startInactivityTimer');
    },
  },

  getters: {
    isAuthenticated: state => !!state.token,
    user: state => state.user,
  },
});

export default store;

