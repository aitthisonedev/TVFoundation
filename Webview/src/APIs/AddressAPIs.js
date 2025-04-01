// src/APIs/AddressAPIs.js
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";

export function useAddressInfo() {
  const { t, locale } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;
  const addressInfo = ref(t("Address"));

  const fetchAddressInfo = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/other-contents`);
      if (response.data) {
        response.data.forEach((setting) => {
          if (locale.value === "en" && setting.type === "address_english") {
            addressInfo.value = setting.value;
          } else if (locale.value === "lo" && setting.type === "address_lao") {
            addressInfo.value = setting.value;
          }
        });
      }
    } catch (error) {
      console.error("Error fetching address info:", error);
    }
  };

  watch(locale, () => {
    fetchAddressInfo();
  });

  onMounted(() => {
    fetchAddressInfo();
  });

  return { addressInfo };
}
