import { ref, watch, onMounted } from 'vue';
import axios from 'axios';
import { useI18n } from 'vue-i18n';

export function useImpact() {
  const { locale, t } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;
  const impactList = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchImpact = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get(`${apiUrl}/api/impact`);
      impactList.value = response.data.map((item) => ({
        id: item.id,
        image: item.image ? `${apiUrl}${item.image}` : null,
        title: locale.value === 'en' ? item.title_en : item.title_lo,
        description: locale.value === 'en' ? item.description_en : item.description_lo,
        helped: item.helped,
        caption: locale.value === 'en' ? item.caption_en : item.caption_lo,
        createdAt: new Intl.DateTimeFormat(locale.value).format(new Date(item.createdAt)),
      }));
    } catch (err) {
      console.error('Error fetching impact:', err);
      error.value = err.response?.data?.message || t('Failed to fetch impact.');
    } finally {
      loading.value = false;
    }
  };

  watch(
    locale,
    fetchImpact,
    { immediate: true }
  );

  return {
    impactList,
    loading,
    error,
  };
} 