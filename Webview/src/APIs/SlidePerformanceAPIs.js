import { ref, onMounted } from "vue";
import axios from "axios";

export const useSlider = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const slidePerformanceList = ref([]);

  const fetchSlidePerformance = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/slide-performances`);
      slidePerformanceList.value = response.data.map((slidePerformance) => ({
        ...slidePerformance,
        src: slidePerformance.image ? `${apiUrl}/ImageUpload/${slidePerformance.image}` : null,
        imageName: slidePerformance.image
          ? slidePerformance.image.split("/").pop()
          : "",
      }));
    } catch (error) {
      console.error("Error fetching sliders:", error);
      slidePerformanceList.value = []; // Ensure empty array on error to trigger fallback
    }
  };

  onMounted(() => {
    fetchSlidePerformance();
  });

  return { slidePerformanceList };
};
