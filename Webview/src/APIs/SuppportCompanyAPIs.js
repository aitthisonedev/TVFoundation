import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";

export function useCompanyNames() {
  const { locale } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;
  const companyList = ref([]);

  const formatAmount = (value) => {
    if (!value) return '0 LAK';
    return `${Number(value).toLocaleString()} LAK`;
  };

  const fetchCompanyNames = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/supportcompanies`);
      if (response.data) {
        companyList.value = response.data.map((company) => ({
          id: company.id,
          name: locale.value === "en" ? company.name : company.nameLA,
          description: locale.value === "en" ? company.description : company.descriptionLA,
          logo: company.logo,
          supportAmount: formatAmount(company.supportAmount),
          createdAt: company.createdAt,
        }));
      }
    } catch (error) {
      console.error("Error fetching company names:", error);
    }
  };

  watch(locale, () => {
    fetchCompanyNames();
  });

  onMounted(() => {
    fetchCompanyNames();
  });

  return { companyList };
}
