import { ref, onMounted } from "vue";
import axios from "axios";

export const usePartners = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const partnersList = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const usePhotoSlides = ref(false);

  const fetchPartners = async () => {
    if (partnersList.value.length) return;
    isLoading.value = true;
    error.value = null;
    usePhotoSlides.value = false;

    try {
      const response = await axios.get(`${apiUrl}/api/logoPartners`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.data || typeof response.data === 'string') {
        console.error('Invalid API response:', response.data);
        usePhotoSlides.value = true;
        partnersList.value = [];
        return;
      }

      const partnersData = Array.isArray(response.data) ? response.data : 
                          (response.data.data || []);

      if (partnersData.length > 0) {
        partnersList.value = partnersData.map((partner) => ({
          id: partner.id,
          src: partner.image ? `${apiUrl}/ImageUpload/logopartners/${partner.image.split('/').pop()}` : "",
          imageName: partner.image ? partner.image.split("/").pop() : "",
        }));

        const imageLoadPromises = partnersList.value.map(partner => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = partner.src;
          });
        });

        const results = await Promise.all(imageLoadPromises);
        if (!results.some(result => result)) {
          usePhotoSlides.value = true;
          partnersList.value = [];
        }
      } else {
        usePhotoSlides.value = true;
        partnersList.value = [];
      }
    } catch (err) {
      console.error("Partner API Error:", err);
      console.log("Full error details:", {
        message: err.message,
        response: err.response,
        data: err.response?.data
      });
      error.value = "Failed to fetch partners. Using default photos.";
      usePhotoSlides.value = true;
      partnersList.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(fetchPartners);

  return {
    partnersList,
    isLoading,
    error,
    fetchPartners,
    usePhotoSlides,
  };
};
