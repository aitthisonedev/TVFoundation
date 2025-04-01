// src/APIs/LocationAPIs.js
import { ref, onMounted } from "vue";
import axios from "axios";

export function useLocationInfo() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const googleMap = ref("");

  const fetchLocationInfo = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/other-contents`);
      if (response.data) {
        const mapData = response.data.find(setting => setting.type === "google_map");
        if (mapData) {
          googleMap.value = mapData.value;
        }
      }
    } catch (error) {
      console.error("Error fetching Google Map:", error);
      googleMap.value = "";
    }
  };

  // Fetch data when component is mounted
  onMounted(() => {
    fetchLocationInfo();
  });

  // Function to safely render HTML content (for Google Map iframe)
  const renderGoogleMap = () => {
    if (!googleMap.value) return null;
    return {
      template: googleMap.value
    };
  };

  return {
    googleMap,
    renderGoogleMap
  };
}
