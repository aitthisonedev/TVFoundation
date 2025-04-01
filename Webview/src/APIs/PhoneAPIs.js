// src/APIs/PhoneAPIs.js
import { ref, onMounted } from "vue";
import axios from "axios";

export function usePhoneNumber() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const phoneNumber = ref("+856 20 91 563 333");
  const phoneOffice = ref("+856 20 91 563 333");

  const fetchPhoneNumber = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/phone-updates`);
      if (response.data) {
        response.data.forEach((setting) => {
          if (setting.type === "office_number") {
            phoneOffice.value = setting.value;
          }
          if (setting.type === "phone_number") {
            phoneNumber.value = setting.value;
          }
        });
      }
    } catch (error) {
      console.error("Error fetching phone number:", error);
    }
  };

  onMounted(() => {
    fetchPhoneNumber();
  });

  return { phoneNumber, phoneOffice, fetchPhoneNumber };
}
