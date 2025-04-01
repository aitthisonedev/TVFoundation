import { ref, watch, onMounted } from 'vue';
import axios from 'axios';
import { useI18n } from 'vue-i18n';

export function useAboutHead() {
  const { locale, t } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;
  const headData = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchHeadContent = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get(`${apiUrl}/api/head-contents`);
      const data = response.data[0];
      
      headData.value = {
        title: locale.value === 'en' ? data.titleOne_en : data.titleOne_lo,
        description: locale.value === 'en' ? data.descriptionOne_en : data.descriptionOne_lo,
        image: data.image ? `${apiUrl}${data.image}` : null
      };
    } catch (err) {
      console.error('Error fetching head content:', err);
      error.value = err.response?.data?.message || t('Failed to fetch head content.');
    } finally {
      loading.value = false;
    }
  };

  watch(locale, fetchHeadContent);
  onMounted(fetchHeadContent);

  return {
    headData,
    loading,
    error,
  };
} 