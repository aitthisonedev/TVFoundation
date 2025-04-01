import { ref, watch } from 'vue';
import axios from 'axios';
import { useI18n } from 'vue-i18n';

export function useCoreValues() {
  const { locale, t } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;
  const coreValuesList = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchCoreValues = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get(`${apiUrl}/api/core-values`);
      coreValuesList.value = response.data.map((item) => ({
        id: item.id,
        image: item.image ? `${apiUrl}${item.image}` : null,
        title: locale.value === 'en' ? item.title_en : item.title_lo,
        description: locale.value === 'en' ? item.description_en : item.description_lo,
        createdAt: new Intl.DateTimeFormat(locale.value).format(new Date(item.createdAt)),
      }));
    } catch (err) {
      console.error('Error fetching core values:', err);
      error.value = err.response?.data?.message || t('Failed to fetch core values.');
    } finally {
      loading.value = false;
    }
  };

  watch(
    locale,
    fetchCoreValues,
    { immediate: true }
  );

  return {
    coreValuesList,
    loading,
    error,
  };
} 