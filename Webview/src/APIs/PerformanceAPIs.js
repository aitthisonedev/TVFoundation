import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";

export function usePerformance() {
  const { locale } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;
  const performanceList = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchPerformance = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${apiUrl}/api/performances`);
      if (response.data) {
        performanceList.value = response.data.map((item) => ({
          id: item.id,
          image: item.image ? `${apiUrl}${item.image}` : null,
          title: locale.value === "en" ? item.title_en : item.title_lo,
          description: locale.value === "en" ? item.description_en : item.description_lo,
          createdAt: new Date(item.createdAt).toLocaleDateString(),
          raw: {
            title_en: item.title_en,
            title_lo: item.title_lo,
            description_en: item.description_en,
            description_lo: item.description_lo,
          }
        }));
      }
    } catch (error) {
      console.error("Error fetching performance:", error);
      error.value = "Failed to fetch performance";
    } finally {
      loading.value = false;
    }
  };

  const refreshData = () => {
    fetchPerformance();
  };

  watch(locale, () => {
    fetchPerformance();
  });

  onMounted(() => {
    fetchPerformance();
  });

  return { 
    performanceList, 
    loading, 
    error,
    refreshData 
  };
}

export const usePerformanceDetail = () => {
  const performanceDetail = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const { locale } = useI18n();

  const fetchPerformanceById = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${apiUrl}/api/performances/${id}`);
      const item = response.data;
      performanceDetail.value = {
        id: item.id,
        image: item.image ? `${apiUrl}${item.image}` : null,
        title: locale.value === "en" ? item.title_en : item.title_lo,
        description: locale.value === "en" ? item.description_en : item.description_lo,
        createdAt: new Date(item.createdAt).toLocaleDateString(),
        raw: {
          title_en: item.title_en,
          title_lo: item.title_lo,
          description_en: item.description_en,
          description_lo: item.description_lo,
        }
      };
    } catch (err) {
      console.error('Error fetching performance detail:', err);
      error.value = "Failed to fetch performance detail";
    } finally {
      loading.value = false;
    }
  };

  watch(locale, () => {
    if (performanceDetail.value?.id) {
      fetchPerformanceById(performanceDetail.value.id);
    }
  });

  return {
    performanceDetail,
    loading,
    error,
    fetchPerformanceById
  };
}; 