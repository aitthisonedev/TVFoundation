import { ref } from 'vue';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const categories = ref([]);

export function useNewsCategories() {
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiUrl}/api/news-categories`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      categories.value = response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  };

  return {
    categories,
    fetchCategories
  };
} 
