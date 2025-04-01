// src/APIs/LogoAPIs.js
import { ref, onMounted } from "vue";
import axios from "axios";

export function useLogo() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const logo1 = ref("/src/assets/logo.png");
  const logo2 = ref("/src/assets/logo-right.png");

  const fetchLogos = async () => {
    try {
      const [logo1Response, logo2Response] = await Promise.all([
        axios.get(`${apiUrl}/api/imageUpload/logo1`),
        axios.get(`${apiUrl}/api/imageUpload/logo2`)
      ]);
      
      if (logo1Response.data && logo1Response.data.imageUrl) {
        logo1.value = logo1Response.data.imageUrl;
      }
      
      if (logo2Response.data && logo2Response.data.imageUrl) {
        logo2.value = logo2Response.data.imageUrl;
      }
    } catch (error) {
      console.error("Error fetching logos:", error);
    }
  };

  onMounted(() => {
    fetchLogos();
  });

  return { logo1, logo2 };
}
