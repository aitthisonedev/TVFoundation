import { ref, watch, onMounted } from 'vue';
import axios from 'axios';
import { useI18n } from 'vue-i18n';

export function useVisionMission() {
  const { locale, t } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;
  const visionMission = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchVisionMission = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get(`${apiUrl}/api/vision-mission`);
      const data = response.data[0];
      
      visionMission.value = {
        vision: {
          title: locale.value === 'en' ? data.vision_en : data.vision_lo,
          description: locale.value === 'en' ? data.visionDescription_en : data.visionDescription_lo,
          points: [
            locale.value === 'en' ? data.visionContentOne_en : data.visionContentOne_lo,
            locale.value === 'en' ? data.visionContentTwo_en : data.visionContentTwo_lo,
            locale.value === 'en' ? data.visionContentThree_en : data.visionContentThree_lo,
          ]
        },
        mission: {
          title: locale.value === 'en' ? data.mission_en : data.mission_lo,
          description: locale.value === 'en' ? data.missionDescription_en : data.missionDescription_lo,
          points: [
            locale.value === 'en' ? data.missionContentOne_en : data.missionContentOne_lo,
            locale.value === 'en' ? data.missionContentTwo_en : data.missionContentTwo_lo,
            locale.value === 'en' ? data.missionContentThree_en : data.missionContentThree_lo,
          ]
        }
      };
    } catch (err) {
      console.error('Error fetching vision-mission:', err);
      error.value = err.response?.data?.message || t('Failed to fetch vision-mission data.');
    } finally {
      loading.value = false;
    }
  };

  watch(locale, fetchVisionMission);
  onMounted(fetchVisionMission);

  return {
    visionMission,
    loading,
    error,
  };
} 