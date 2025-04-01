// src/APIs/FooterAPIs.js
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";

export function useFooterContent() {
  const { t, locale } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL || 'https://tv-server.vientianetraffic.com';
  const footerContent = ref(t("footer.contactInfo"));

  const fetchFooterContent = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/other-contents`, { timeout: 5000 });
      if (response.data) {
        let found = false;
        response.data.forEach((setting) => {
          if (locale.value === "en" && setting.type === "footer_english") {
            footerContent.value = setting.value;
            found = true;
          } else if (locale.value === "lo" && setting.type === "footer_lao") {
            footerContent.value = setting.value;
            found = true;
          }
        });
        // If no matching content found, use translation fallback
        if (!found) {
          footerContent.value = t("footer.contactInfo");
        }
      }
    } catch (error) {
      console.error("Error fetching footer content:", error);
      // Fallback to translation on error
      footerContent.value = t("footer.contactInfo");
    }
  };

  watch(locale, () => {
    fetchFooterContent();
  });

  onMounted(() => {
    fetchFooterContent();
  });

  return { footerContent };
}
