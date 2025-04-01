import { ref, onMounted, watch } from "vue";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
export function useService() {
  console.log("apiUrl: ", apiUrl)
  const services = ref({});

  // Function to fetch API data based on the current locale
  const fetchService = async () => {
    try {
      // Fetch phone number
      const projectRes = await axios.get(`${apiUrl}/api/service-descriptions`);
      if (projectRes.data) {
        return projectRes.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching contact information:", error);
      // Default fallback values remain if fetching fails
    }
  };

  // Fetch data initially on component mount
  onMounted(async () => {
    services.value = await fetchService();
  });

  return {
    fetchService,
    services
  };
}
