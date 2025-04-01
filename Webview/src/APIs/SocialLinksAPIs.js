// src/APIs/SocialLinksAPIs.js
import { ref, onMounted } from "vue";
import axios from "axios";

export function useSocialLinks() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const facebook = ref("https://facebook.com"); // Default value
  const whatsapp = ref("https://wa.me/"); // Default value
  const line = ref("https://line.me"); // Default value
  const telephone = ref("tel:+856"); // Default value

  const fetchSocialLinks = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/social-links`);
      if (response.data) {
        response.data.forEach((setting) => {
          if (setting.type === "facebook") {
            facebook.value = setting.value.trim();
          }
          if (setting.type === "whatsapp") {
            whatsapp.value = setting.value.trim();
          }
          if (setting.type === "wechat") {
            line.value = setting.value.trim();
          }
          if (setting.type === "telephone") {
            telephone.value = setting.value.trim();
          }
        });
      }
    } catch (error) {
      console.error("Error fetching social links:", error);
    }
  };

  onMounted(() => {
    fetchSocialLinks();
  });

  return {
    facebook,
    whatsapp,
    line,
    telephone
  };
}
