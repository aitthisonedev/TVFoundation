<template>
  <div id="payment-section">
    <!-- Payment Method Section -->
    <div class="container mt-5">
      <h2 class="section-title text-center text-primary mb-5">
        {{ $t("ads.paymentMethods") }}
      </h2>
      <div v-if="bankLoading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-else-if="bankError" class="alert alert-danger" role="alert">
        {{ bankError }}
      </div>
      <div class="payment-cards-scroll">
        <div class="payment-cards-wrapper">
          <div
            v-for="(bank, index) in localizedBankAccounts"
            :key="index"
            class="payment-card-item"
          >
            <div class="payment-card">
              <div class="payment-logo mb-3">
                <img :src="bank.logo" :alt="bank.name" />
              </div>
              <div class="payment-info">
                <h5 class="bank-name">{{ bank.name }}</h5>
                <div class="account-details">
                  <p class="mb-2">
                    <strong>{{ $t("ads.accountName") }}:</strong>
                    <br />
                    {{ bank.accountName }}
                  </p>

                  <!-- Currency Tabs -->
                  <ul class="nav nav-tabs" role="tablist">
                    <li
                      class="nav-item"
                      role="presentation"
                      v-for="(currency, cIndex) in currencies"
                      :key="currency.code"
                    >
                      <button
                        class="nav-link"
                        :class="{ active: cIndex === 0 }"
                        :id="`${bank.id}-${currency.code}-tab`"
                        data-bs-toggle="tab"
                        :data-bs-target="`#${bank.id}-${currency.code}`"
                        type="button"
                        role="tab"
                      >
                        {{ currency.symbol }}
                        {{ $t(`ads.currencies.${currency.code}`) }}
                      </button>
                    </li>
                  </ul>

                  <!-- Currency Content -->
                  <div class="tab-content">
                    <div
                      v-for="(currency, cIndex) in currencies"
                      :key="currency.code"
                      class="tab-pane fade"
                      :class="{ 'show active': cIndex === 0 }"
                      :id="`${bank.id}-${currency.code}`"
                      role="tabpanel"
                    >
                      <div
                        class="account-number-container d-flex justify-content-start align-items-center"
                      >
                        <div
                          class="qr-code-container"
                          v-if="bank.qrCodes && bank.qrCodes[currency.code]"
                        >
                          <img
                            :src="bank.qrCodes[currency.code]"
                            :alt="`QR Code for ${bank.name} ${currency.code}`"
                            class="bank-qr-code"
                            @click="
                              openQRCodeModal(
                                bank.qrCodes[currency.code],
                                bank,
                                currency.code
                              )
                            "
                          />
                        </div>
                        <div class="account-number-container">
                          <div
                            class="d-flex justify-content-between align-items-center"
                          >
                            <p class="mb-1 account-number text-start">
                              <strong>{{ $t("ads.accountNumber") }}:</strong>
                              <br />
                              <span class="account-number">{{
                                bank.accounts[currency.code]
                              }}</span>
                            </p>
                            <button
                              class="btn btn-sm btn-outline-primary copy-btn"
                              @click="
                                copyToClipboard(bank.accounts[currency.code])
                              "
                            >
                              <i class="bi bi-clipboard"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Payment Description Section -->
      <div class="mt-5">
        <SocialLinks class="mb-3" />
        <p>
          {{ $t("ads.paymentDescription") }}
        </p>
      </div>
    </div>

    <!-- QR Code Modal -->
    <div class="modal fade" id="qrCodeModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ $t("ads.scanQRCode") }}</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body text-center p-4">
            <div class="qr-code-modal-container">
              <img
                :src="selectedQRCode"
                class="qr-code-modal-image"
                alt="QR Code"
              />
            </div>
          </div>
          <div class="modal-footer">
            <a
              :href="selectedQRCode"
              :download="`${selectedBank?.id || 'bank'}-${
                selectedCurrency || 'payment'
              }-${new Date().toISOString().slice(0, 10)}.png`"
              class="btn btn-primary"
              @click="handleDownload"
            >
              <i class="bi bi-download me-2"></i>
              {{ $t("ads.saveQRCode") }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";
import { useI18n } from "vue-i18n";
import SocialLinks from "@/components/Common/SocialLinks.vue";
import { useBankAccounts } from '../APIs/BankAccountsAPIs'

export default {
  name: "Payment",
  components: {
    SocialLinks,
  },
  setup() {
    const { t } = useI18n();
    const { bankAccounts, loading: bankLoading, error: bankError } = useBankAccounts();
    return { t, bankAccounts, bankLoading, bankError };
  },
  data() {
    return {
      selectedQRCode: null,
      selectedBank: null,
      selectedCurrency: null,
      currencies: [
        { code: "LAK", symbol: "₭" },
        { code: "USD", symbol: "$" },
        { code: "THB", symbol: "฿" },
      ],
      // Default bank accounts as fallback
      defaultBankAccounts: [
        {
          id: "bcel",
          logo: "https://www.bcel.com.la/bcel/resources/imgs/logobcel.png",
          accountName: "MEA THAO YAI THONGVANH FOUNDATION",
          accounts: {
            LAK: "010-1100-3866-04",
            USD: "010-1100-3866-31",
            THB: "010-1100-3866-22",
          },
          qrCodes: {
            LAK: "https://securingtomorrow.mcafee.com/?attachment_id=12047",
            USD: "https://securingtomorrow.mcafee.com/?attachment_id=12047",
            THB: "https://securingtomorrow.mcafee.com/?attachment_id=12047",
          },
        },
        {
          id: "ldb",
          logo: "https://www.ldblao.la/ldb2021-01-01.png",
          accountName: "MEA THAO YAI THONGVANH FOUNDATION",
          accounts: {
            LAK: "010-1100-3866-04",
            USD: "010-1100-3866-31",
            THB: "010-1100-3866-22",
          },
          qrCodes: {
            LAK: "https://securingtomorrow.mcafee.com/?attachment_id=12047",
            USD: "https://securingtomorrow.mcafee.com/?attachment_id=12047",
            THB: "https://securingtomorrow.mcafee.com/?attachment_id=12047",
          },
        },
        {
          id: "jdb",
          logo: "https://www.jdbbank.com.la/wp-content/uploads/2019/05/jdb-ico.png",
          accountName: "MEA THAO YAI THONGVANH FOUNDATION",
          accounts: {
            LAK: "010-1100-3866-04",
            USD: "010-1100-3866-31",
            THB: "010-1100-3866-22",
          },
          qrCodes: {
            LAK: "https://securingtomorrow.mcafee.com/?attachment_id=12047",
            USD: "https://securingtomorrow.mcafee.com/?attachment_id=12047",
            THB: "https://securingtomorrow.mcafee.com/?attachment_id=12047",
          },
        },
        {
          id: "bfl",
          name: "BFL Bank",
          logo: "https://bfl-bred.com/wp-content/uploads/2022/05/BFL-BRED-Group-Logo.png",
          accountName: "MEA THAO YAI THONGVANH FOUNDATION",
          accounts: {
            LAK: "010-1100-3866-04",
            USD: "010-1100-3866-31",
            THB: "010-1100-3866-22",
          },
          qrCodes: {
            LAK: "https://securingtomorrow.mcafee.com/?attachment_id=12047",
            USD: "https://securingtomorrow.mcafee.com/?attachment_id=12047",
            THB: "https://securingtomorrow.mcafee.com/?attachment_id=12047",
          },
        },
        {
          id: "pvb",
          name: "Phongsavanh Bank",
          logo: "https://www.phongsavanhbank.com/psv/allpages/images/Logo-HiApp.png",
          accountName: "MEA THAO YAI THONGVANH FOUNDATION",
          accounts: {
            LAK: "010-1100-3866-04",
            USD: "010-1100-3866-31",
            THB: "010-1100-3866-22",
          },
          qrCodes: {
            LAK: "https://securingtomorrow.mcafee.com/?attachment_id=12047",
            USD: "https://securingtomorrow.mcafee.com/?attachment_id=12047",
            THB: "https://securingtomorrow.mcafee.com/?attachment_id=12047",
          },
        },
      ],
    };
  },
  computed: {
    localizedBankAccounts() {
      // Use API data if available, otherwise use default data
      const accounts = this.bankAccounts.length > 0 ? this.bankAccounts : this.defaultBankAccounts;
      return accounts.map((bank) => ({
        ...bank,
        name: bank.name || this.t(`ads.banks.${bank.id}`),
      }));
    },
  },
  methods: {
    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text);
        alert(this.$t("ads.copySuccess"));
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    },
    openQRCodeModal(qrCodeUrl, bank, currency) {
      if (!qrCodeUrl) return;
      this.selectedQRCode = qrCodeUrl;
      this.selectedBank = bank;
      this.selectedCurrency = currency;
      const modalElement = document.getElementById("qrCodeModal");
      if (modalElement) {
        const modal = new Modal(modalElement);
        modal.show();
      }
    },
    handleDownload(event) {
      if (!this.selectedQRCode) {
        event.preventDefault();
        alert(this.$t("ads.downloadError"));
      }
    },
  },
  mounted() {
    document.querySelectorAll(".modal").forEach((modalElement) => {
      new Modal(modalElement);
    });
  },
};
</script>

<style scoped>
/* Payment card styles */
.payment-card {
  background: #fff;
  border-radius: 15px;
  padding: 1rem;
  height: 100%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(117, 116, 116, 0.05);
}

/* Add hover effect to the card */
.payment-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* Enhance logo animation */
.payment-logo img {
  height: 70px;
  width: auto;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.payment-card:hover .payment-logo img {
  transform: scale(1.05);
}

/* Add subtle animation to copy button */
.copy-btn {
  transition: all 0.2s ease;
  color: #00adef;
  border-color: #00adef;
  font-size: 14px;
}

.copy-btn:hover {
  background-color: #00adef;
  border-color: #00adef;
  color: white;
  transform: scale(1.05);
}
.text-primary {
  color: #00adef !important;
}
/* Enhance QR code hover effect */
.qr-code-container {
  width: auto;
  height: auto;
  cursor: pointer;
  transition: all 0.3s ease;
}

.qr-code-container:hover {
  transform: scale(1.08);
}

/* Add subtle animation to currency tabs */
.nav-link {
  transition: all 0.2s ease;
}

.nav-link:hover {
  background-color: rgba(45, 118, 187, 0.05);
}

.bank-name {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #00adef;
}

.account-details {
  font-size: 0.9rem;
}

/* Tab styles */
.nav-tabs {
  border-bottom: 1px solid #dee2e6;
  flex-wrap: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-tabs::-webkit-scrollbar {
  display: none;
}

.nav-tabs {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.nav-item {
  white-space: nowrap;
}

.nav-link {
  color: #6c757d;
  padding: 0.5rem 1rem;
  border: none;
  border-bottom: 2px solid transparent;
}

.nav-link.active,
.nav-link.router-link-active {
  border-bottom: 2px solid #ed207b !important;
  background: none;
  font-weight: 500;
}

/* Account number container */
.account-number-container {
  width: 100%;
  overflow-x: auto;
}

.account-number {
  font-size: 14px;
}

.copy-btn {
  flex-shrink: 0; /* Prevents button from shrinking */
  height: fit-content; /* Aligns button vertically */
}

/* QR Code styles */
.qr-code-container {
  width: 70px;
  height: 80px;
  cursor: pointer;
  transition: transform 0.2s;
  margin-right: 20px;
}

.bank-qr-code {
  width: auto;
  height: 100%;
  object-fit: contain;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  margin-right: 10px;
  padding: 4px;
}

/* Modal styles */
.qr-code-modal-container {
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
}

.qr-code-modal-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

/* Scroll container styles */
.payment-cards-scroll {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.payment-cards-wrapper {
  display: flex;
  gap: 1.5rem;
  padding: 0.5rem;
}

.payment-card-item {
  flex: 0 0 calc(33.333% - 1rem);
  min-width: calc(33.333% - 1rem);
}

/* Hide scrollbar */
.payment-cards-scroll::-webkit-scrollbar {
  display: none;
}

.payment-cards-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Add these new styles */
.modal-footer .btn-primary {
  transition: all 0.2s ease;
  background-color: #00adef;
  border-color: #00adef;
}

.modal-footer .btn-primary:hover {
  transform: translateY(-2px);
  border-color: #00adef;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 576px) {
  .payment-card-item {
    flex: 0 0 100%;
    min-width: 100%;
  }
}

@media (min-width: 577px) and (max-width: 768px) {
  .payment-card-item {
    flex: 0 0 calc(50% - 1rem);
    min-width: calc(50% - 1rem);
  }
}

@media (min-width: 769px) {
  .payment-card-item {
    flex: 0 0 calc(33.333% - 1rem);
    min-width: calc(33.333% - 1rem);
  }
}
</style>
