import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";

export function useContentOne() {
  const { locale } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;
  const contentOneList = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchContentOne = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${apiUrl}/api/content-ones`);
      if (response.data) {
        contentOneList.value = response.data.map((item) => ({
          id: item.id,
          image: item.image && !item.image.startsWith('http') ? `${apiUrl}${item.image}` : item.image,
          title: locale.value === "en" ? item.title_en : item.title_lo,
          content: locale.value === "en" ? item.content_en : item.content_lo,
          description: locale.value === "en" ? item.description_en : item.description_lo,
          createdAt: new Date(item.createdAt).toLocaleDateString(),
          raw: {
            title_en: item.title_en,
            title_lo: item.title_lo,
            content_en: item.content_en,
            content_lo: item.content_lo,
            description_en: item.description_en,
            description_lo: item.description_lo,
          }
        }));
      }
    } catch (error) {
      console.error("Error fetching content one:", error);
      error.value = "Failed to fetch content one";
    } finally {
      loading.value = false;
    }
  };

  watch(locale, () => {
    fetchContentOne();
  });

  onMounted(() => {
    fetchContentOne();
  });

  return { 
    contentOneList, 
    loading, 
    error,
    refreshData: fetchContentOne
  };
}

export const useContentOneDetail = () => {
  const contentOneDetail = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const { locale } = useI18n();

  const fetchContentOneById = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${apiUrl}/api/content-ones/${id}`);
      const item = response.data;
      contentOneDetail.value = {
        id: item.id,
        image: item.image && !item.image.startsWith('http') ? `${apiUrl}${item.image}` : item.image,
        title: locale.value === "en" ? item.title_en : item.title_lo,
        content: locale.value === "en" ? item.content_en : item.content_lo,
        description: locale.value === "en" ? item.description_en : item.description_lo,
        createdAt: new Date(item.createdAt).toLocaleDateString(),
        raw: {
          title_en: item.title_en,
          title_lo: item.title_lo,
          content_en: item.content_en,
          content_lo: item.content_lo,
          description_en: item.description_en,
          description_lo: item.description_lo,
        }
      };
    } catch (err) {
      console.error('Error fetching content one detail:', err);
      error.value = "Failed to fetch content one detail";
    } finally {
      loading.value = false;
    }
  };

  watch(locale, () => {
    if (contentOneDetail.value?.id) {
      fetchContentOneById(contentOneDetail.value.id);
    }
  });

  return {
    contentOneDetail,
    loading,
    error,
    fetchContentOneById
  };
};