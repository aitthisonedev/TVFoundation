// src/APIs/EmailAPIs.js
import { ref, onMounted } from "vue";
import axios from "axios";

export function useEmail() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const contactEmail = ref("pvs@tv-foundation.com"); // Default value
  const officeEmail = ref("admin.a@tv-foundation.com"); // Default value

  const fetchEmail = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/email-updates`);
      if (response.data) {
        response.data.forEach((setting) => {
          if (setting.type === "contact") {
            contactEmail.value = setting.value.trim(); // Trim to remove extra spaces
          }
          if (setting.type === "office") {
            officeEmail.value = setting.value.trim(); // Trim to remove extra spaces
          }
        });
      }
    } catch (error) {
      console.error("Error fetching contact email:", error);
    }
  };

  onMounted(() => {
    fetchEmail();
  });

  return { contactEmail, officeEmail };
}
