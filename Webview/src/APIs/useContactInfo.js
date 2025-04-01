// src/composables/useContactInfo.js
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";

export function useContactInfo() {
  const { t, locale } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;

  // Set default values using translations as fallback
  const phoneNumber = ref("+856 20 99 645 556");
  const contactEmail = ref("xangthala@mtosgroup.com");
  const addressInfo = ref(t("Address"));
  const footerContent = ref(t("FooterContent"));
  const logo = ref("/logo.png"); // Default logo path

  // Function to fetch API data based on the current locale
  const fetchContactInfo = async () => {
    try {
      // Fetch phone number
      const phoneResponse = await axios.get(`${apiUrl}/api/phone-updates`);
      if (phoneResponse.data) {
        phoneResponse.data.forEach((setting) => {
          if (setting.type === "phone_number") phoneNumber.value = setting.value;
          if (setting.type === "office_number") phoneNumber.value = setting.value;
        });
      }

      // Fetch email
      const emailResponse = await axios.get(`${apiUrl}/api/email-updates`);
      if (emailResponse.data) {
        emailResponse.data.forEach((setting) => {
          if (setting.type === "contact") contactEmail.value = setting.value;
        });
      }

      // Fetch Logo
      const logoResponse = await axios.get(`${apiUrl}/api/imageUpload/logo`);
      if (logoResponse.data && logoResponse.data.imageUrl) {
        logo.value = logoResponse.data.imageUrl;
      }

      // Fetch other contents based on language
      const otherContentResponse = await axios.get(`${apiUrl}/api/other-contents`);
      if (otherContentResponse.data) {
        otherContentResponse.data.forEach((setting) => {
          // Set values based on locale
          if (locale.value === "en") {
            if (setting.type === "address_english") addressInfo.value = setting.value;
            if (setting.type === "footer_english") footerContent.value = setting.value;
          } else if (locale.value === "la") {
            if (setting.type === "address_lao") addressInfo.value = setting.value;
            if (setting.type === "footer_lao") footerContent.value = setting.value;
          }
        });
      }
    } catch (error) {
      console.error("Error fetching contact information:", error);
      // Default fallback values remain if fetching fails
    }
  };

  // Watch for changes in the locale to re-fetch data if the language changes
  watch(locale, () => {
    fetchContactInfo();
  });

  // Fetch data initially on component mount
  onMounted(() => {
    fetchContactInfo();
  });

  return {
    phoneNumber,
    contactEmail,
    addressInfo,
    footerContent,
    logo,
  };
}
