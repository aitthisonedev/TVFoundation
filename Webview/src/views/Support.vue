<template>
  <div>
    <div class="ads-component">
      <!-- Cover Image Slider -->
      <SupportSlider :slides="slides" />

      <!-- Payment Method Section -->
      <div id="payment-section">
        <Payment />
      </div>

      <!-- Project Section -->
      <ProjectSection :projects="latestProjects" />

      <!-- Supporters Section -->
      <SupportersSection :supporters="supporters" />

      <!-- Contact form -->
      <ContactForm />

      <!-- Products Showcase -->
      <ProductShowcase 
          :products="relatedProducts"
          :limit="4"
        />
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SupportSlider from "./SupportSlider.vue";
import Payment from "./Payment.vue";
import { products } from "../data/products";
import { projects, supporters } from "../data/projects";
import { slides } from "../data/slider";
import { Modal } from "bootstrap";
import ContactForm from "./ContactForm.vue";
import ProjectSection from "../components/project/ProjectSection.vue";
import ProductShowcase from "../components/shop/ProductShowcase.vue";
import SupportersSection from "../components/supporters/SupportersSection.vue";

export default {
  name: "Ads",
  components: {
    SupportSlider,
    Payment,
    ContactForm,
    ProjectSection,
    ProductShowcase,
    SupportersSection,
  },
  data() {
    return {
      slides,
      supporters,
      products: products,
      selectedQRCode: null,
    };
  },
  computed: {
    sortedProducts() {
      return [...this.products].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    },
    latestProjects() {
      return projects.filter((project) => project.status !== "completed");
    },
  },
  methods: {
    truncateText(text, wordLimit) {
      if (!text) return "";
      const words = text.split(" ");
      if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(" ") + "...";
      }
      return text;
    },
    goToProductDetail(productId) {
      this.$router.push({
        name: "ProductDetail",
        params: { id: productId.toString() },
      });
    },
    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text);
        alert(this.$t("ads.copySuccess"));
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    },
    openQRCodeModal(qrCodeUrl) {
      if (!qrCodeUrl) return;

      this.selectedQRCode = qrCodeUrl;
      const modalElement = document.getElementById("qrCodeModal");
      if (modalElement) {
        const modal = new Modal(modalElement);
        modal.show();
      }
    },
    goToFoundation() {
      this.$router.push({ name: "Foundation" });
    },
    formatCurrency(amount) {
      return amount.toLocaleString("en-US");
    },
    goToProjectDetail(projectId) {
      this.$router.push({
        name: "ProjectDetail",
        params: { id: projectId.toString() },
      });
    },
  },
  mounted() {
    document.querySelectorAll(".modal").forEach((modalElement) => {
      new Modal(modalElement);
    });
    // Check if there's a hash in the URL
    if (this.$route.hash) {
      // Wait for DOM to be ready
      this.$nextTick(() => {
        const element = document.querySelector(this.$route.hash);
        if (element) {
          // Smooth scroll to the element
          element.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  },
};
</script>

<style scoped>
.slider-section {
  position: relative;
  width: 100%;
  height: 60vh;
  overflow: hidden;
}

.slider-container {
  width: 100%;
  height: 100%;
}

.slides-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease-in-out;
}

.slide {
  min-width: 100%;
  position: relative;
}

.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
}

.slider-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  z-index: 2;
  padding: 1rem;
}

.slider-nav.prev {
  left: 1rem;
}

.slider-nav.next {
  right: 1rem;
}

.slider-pagination {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}

.pagination-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
}

.pagination-dot.active {
  background: white;
}

.product-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.product-info {
  padding: 1.5rem;
  text-align: center;
}

.section-title {
  color: #00adef;
  margin-bottom: 2rem;
}

.btn-primary {
  background-color: #00adef;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #ed207b;
}

.qr-code-container {
  width: 70px;
  height: 70px;
  cursor: pointer;
  transition: transform 0.2s;
  margin-right: 10px;
}

.qr-code-container:hover {
  transform: scale(1.05);
}

.bank-qr-code {
  width: auto;
  height: 100%;
  object-fit: contain;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 4px;
}

/* QR Code Modal Styles */
.qr-code-modal-container {
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.qr-code-modal-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  border: 2px solid #dee2e6;
  border-radius: 8px;
}

/* Make modal backdrop darker */
:deep(.modal-backdrop.show) {
  opacity: 0.7;
}

/* Responsive modal size */
@media (min-width: 576px) {
  .modal-dialog {
    max-width: auto;
  }
}

@media (min-width: 768px) {
  .qr-code-modal-container {
    max-width: 400px;
  }
}

/* Payment Cards Scroll Styles */
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

/* Hide scrollbar but keep functionality */
.payment-cards-scroll::-webkit-scrollbar {
  display: none;
}

.payment-cards-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Responsive design */
@media (max-width: 992px) {
  .payment-card-item {
    flex: 0 0 calc(50% - 1rem);
    min-width: calc(50% - 1rem);
  }
}

@media (max-width: 576px) {
  .payment-card-item {
    flex: 0 0 85%;
    min-width: 85%;
  }
}
</style>
