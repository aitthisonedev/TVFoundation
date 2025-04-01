import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";

export function useAbout() {
  const { locale, t } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;
  const aboutData = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchAbout = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get(`${apiUrl}/api/about`);
      const data = response.data[0];
      
      aboutData.value = {
        title: locale.value === 'en' ? data.title_en : data.title_lo,
        description: locale.value === 'en' ? data.description_en : data.description_lo,
        image: data.image ? `${apiUrl}${data.image}` : null,
        stats: {
          peopleHelped: data.peopleHelped,
          projectsCompleted: data.projectsCompleted,
          yearsExperience: data.yearsExperience
        }
      };
    } catch (err) {
      console.error('Error fetching about data:', err);
      error.value = err.response?.data?.message || t('Failed to fetch about data.');
    } finally {
      loading.value = false;
    }
  };

  watch(locale, fetchAbout);
  onMounted(fetchAbout);

  return {
    aboutData,
    loading,
    error,
  };
}

export const useAboutDetail = () => {
  const aboutDetail = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchAboutById = async (id) => {
    loading.value = true;
    try {
      const response = await axios.get(`${apiUrl}/api/about/${id}`);
      aboutDetail.value = response.data;
    } catch (err) {
      error.value = err;
      console.error('Error fetching about detail:', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    aboutDetail,
    loading,
    error,
    fetchAboutById
  };
};
