import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";

export function useHeadContent() {
  const { locale } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;
  const headContentList = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchHeadContent = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${apiUrl}/api/head-contents`);
      if (response.data) {
        headContentList.value = response.data.map((item) => ({
          id: item.id,
          image: item.image ? `${apiUrl}${item.image}` : null,
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
      console.error("Error fetching head content:", error);
      error.value = "Failed to fetch head content";
    } finally {
      loading.value = false;
    }
  };

  const refreshData = () => {
    fetchHeadContent();
  };

  watch(locale, () => {
    fetchHeadContent();
  });

  onMounted(() => {
    fetchHeadContent();
  });

  return { 
    headContentList, 
    loading, 
    error,
    refreshData 
  };
}

export const useHeadContentDetail = () => {
  const headContentDetail = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const { locale } = useI18n();

  const fetchHeadContentById = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${apiUrl}/api/head-contents/${id}`);
      const item = response.data;
      headContentDetail.value = {
        id: item.id,
        image: item.image ? `${apiUrl}${item.image}` : null,
        titleOne: locale.value === "en" ? item.titleOne_en : item.titleOne_lo,
        descriptionOne: locale.value === "en" ? item.descriptionOne_en : item.descriptionOne_lo,
        createdAt: new Date(item.createdAt).toLocaleDateString(),
        raw: {
          titleOne_en: item.titleOne_en,
          titleOne_lo: item.titleOne_lo,
          descriptionOne_en: item.descriptionOne_en,
          descriptionOne_lo: item.descriptionOne_lo,
        }
      };
    } catch (err) {
      console.error('Error fetching head content detail:', err);
      error.value = "Failed to fetch head content detail";
    } finally {
      loading.value = false;
    }
  };

  watch(locale, () => {
    if (headContentDetail.value?.id) {
      fetchHeadContentById(headContentDetail.value.id);
    }
  });

  return {
    headContentDetail,
    loading,
    error,
    fetchHeadContentById
  };
}; 