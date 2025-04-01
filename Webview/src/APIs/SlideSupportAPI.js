import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";

export const useSlider = () => {
  const { locale } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;
  const sliderList = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchSliders = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${apiUrl}/api/sliders-support`);
      sliderList.value = response.data.map((slider) => ({
        ...slider,
        src: slider.imageUrl,
        title: locale.value === "en" ? slider.title_en : slider.title_lo,
        description: locale.value === "en" ? slider.description_en : slider.description_lo,
        imageName: slider.image ? slider.image.split("/").pop() : "",
        raw: {
          title_en: slider.title_en,
          title_lo: slider.title_lo,
          description_en: slider.description_en,
          description_lo: slider.description_lo,
        }
      }));
    } catch (error) {
      console.error("Error fetching sliders:", error);
      error.value = "Failed to fetch sliders";
    } finally {
      loading.value = false;
    }
  };

  watch(locale, () => {
    fetchSliders();
  });

  onMounted(() => {
    fetchSliders();
  });

  return { sliderList, loading, error };
}; 