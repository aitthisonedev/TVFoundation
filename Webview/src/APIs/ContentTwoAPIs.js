import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";

export function useContentTwo() {
  const { locale } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;
  const contentTwoList = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchContentTwo = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${apiUrl}/api/content-twos`);
      if (response.data) {
        contentTwoList.value = response.data.map((item) => ({
          id: item.id,
          image: item.image 
            ? item.image.startsWith('http')
              ? item.image 
              : `${apiUrl}/ImageUpload/${item.image}`
            : null,
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
      console.error("Error fetching content two:", error);
      error.value = "Failed to fetch content two";
    } finally {
      loading.value = false;
    }
  };

  watch(locale, () => {
    fetchContentTwo();
  });

  onMounted(() => {
    fetchContentTwo();
  });

  return { 
    contentTwoList, 
    loading, 
    error,
    refreshData: fetchContentTwo 
  };
}
