import { ref, watch, onMounted } from 'vue';
import axios from 'axios';
import { useI18n } from 'vue-i18n';

export function useBankAccounts() {
  const { locale, t } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;
  const bankAccounts = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchBankAccounts = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get(`${apiUrl}/api/bank-accounts`);
      bankAccounts.value = response.data.map(bank => ({
        id: bank.id,
        logo: bank.logo ? `${apiUrl}${bank.logo}` : null,
        name: locale.value === 'en' ? bank.BankName_en : bank.BankName_lo,
        accountName: bank.accountName,
        accounts: {
          LAK: bank.accounts_lak,
          USD: bank.accounts_usd,
          THB: bank.accounts_thb
        },
        qrCodes: {
          LAK: bank.ImageqrCodes_lak ? `${apiUrl}${bank.ImageqrCodes_lak}` : null,
          USD: bank.ImageqrCodes_usd ? `${apiUrl}${bank.ImageqrCodes_usd}` : null,
          THB: bank.ImageqrCodes_thb ? `${apiUrl}${bank.ImageqrCodes_thb}` : null
        }
      }));
    } catch (err) {
      console.error('Error fetching bank accounts:', err);
      error.value = err.response?.data?.message || t('Failed to fetch bank accounts.');
    } finally {
      loading.value = false;
    }
  };

  watch(locale, fetchBankAccounts);
  onMounted(fetchBankAccounts);

  return {
    bankAccounts,
    loading,
    error,
  };
} 