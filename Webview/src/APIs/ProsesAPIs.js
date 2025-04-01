import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";

export function useCoreValues() {
  const { locale } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;
  const coreValuesList = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchCoreValues = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${apiUrl}/api/core-values`);
      if (response.data) {
        coreValuesList.value = response.data.map((item) => ({
          id: item.id,
          titleOne: locale.value === "en" ? item.titleOne_en : item.titleOne_lo,
          descriptionOne: locale.value === "en" ? item.descriptionOne_en : item.descriptionOne_lo,
          createdAt: new Date(item.createdAt).toLocaleDateString(),
          raw: {
            titleOne_en: item.titleOne_en,
            titleOne_lo: item.titleOne_lo,
            descriptionOne_en: item.descriptionOne_en,
            descriptionOne_lo: item.descriptionOne_lo,
          }
        }));
      }
    } catch (error) {
      console.error("Error fetching core values:", error);
      error.value = "Failed to fetch core values";
    } finally {
      loading.value = false;
    }
  };

  const refreshData = () => {
    fetchCoreValues();
  };

  watch(locale, () => {
    fetchCoreValues();
  });

  onMounted(() => {
    fetchCoreValues();
  });

  return { 
    coreValuesList, 
    loading, 
    error,
    refreshData 
  };
}

export const useCoreValueDetail = () => {
  const coreValueDetail = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchCoreValueById = async (id) => {
    loading.value = true;
    try {
      const response = await axios.get(`${apiUrl}/api/core-values/${id}`);
      coreValueDetail.value = response.data;
    } catch (err) {
      error.value = err;
      console.error('Error fetching core value detail:', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    coreValueDetail,
    loading,
    error,
    fetchCoreValueById
  };
}; 