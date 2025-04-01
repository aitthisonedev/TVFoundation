import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";

export function useContentThree() {
  const { locale } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;
  const features = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchContentThree = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${apiUrl}/api/content-threes`);
      if (response.data) {
        features.value = response.data.map((item) => ({
          id: item.id,
          icon: item.image 
            ? item.image.startsWith('http')
              ? item.image 
              : `${apiUrl}/ImageUpload/${item.image}`
            : null,
          title: locale.value === "en" ? item.title_en : item.title_lo,
          description: locale.value === "en" ? item.description_en : item.description_lo
        }));
      }
    } catch (error) {
      console.error("Error fetching content three:", error);
      error.value = "Failed to fetch content three";
    } finally {
      loading.value = false;
    }
  };

  watch(locale, () => {
    fetchContentThree();
  });

  onMounted(() => {
    fetchContentThree();
  });

  return { 
    features, 
    loading, 
    error,
    refreshData: fetchContentThree 
  };
}