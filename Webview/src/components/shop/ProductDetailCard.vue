<template>
  <div class="product-detail-card mt-3">
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb" class="py-2 border-bottom">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/shop">{{ $t('nav.products') }}</router-link>
        </li>
        <li class="breadcrumb-item active">
          {{ locale === 'en' ? product.category.name_en : product.category.name_lo }}
        </li>
      </ol>
    </nav>

    <div class="container">
      <div class="row g-0 ">
        <!-- Left side: Image Gallery -->
        <div class="col-md-6 p-4 ">
          <div class="image-gallery">
            <div 
              class="main-image-container mb-3"
              @mousemove="handleMouseMove"
              @mouseleave="handleMouseLeave"
              @click="openModal(product.images.indexOf(selectedImage))"
              ref="imageContainer"
            >
              <img
                :src="`${apiUrl}/ImageUpload/${selectedImage}`"
                :alt="product.name"
                class="main-image img-fluid rounded"
                ref="mainImage"
                :style="zoomStyle"
              />
              <!-- Discount Badge -->
              <span class="discount-badge">-{{ product.discount }}%</span>
              <!-- Magnifying Glass Icon -->
              <div class="zoom-hint" v-if="!isZoomed">
                <i class="bi bi-search"></i>
              </div>
            </div>
            <div class="thumbnails-container d-flex gap-2">
              <div
                v-for="(image, index) in product.subImages"
                :key="index"
                class="thumbnail-wrapper"
                @click="selectImage(image)"
                :class="{ active: selectedImage === image }"
              >
                <img
                  :src="`${apiUrl}/ImageUpload/${image}`"
                  :alt="`${product.name} view ${index + 1}`"
                  class="thumbnail-image"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Right side: Product Info -->
        <div class="col-md-6 p-4">
          <div class="product-info">
            <!-- Product Title -->
            <h1 class="product-title h4 mb-3">
              {{ locale === 'en' ? product.name_en : product.name_lo }}
            </h1>

            <!-- Price Section -->
            <div class="price-section mb-4">
              <div class="current-price h3 text-danger mb-2">₭{{ formatPrice(product.price) }}</div>
              <div class="original-price">
                <span class="text-decoration-line-through text-muted me-2">
                  ₭{{ formatPrice(product.originalPrice) }}
                </span>
                <span class="discount text-danger">-{{ product.discount }}%</span>
              </div>
            </div>

            <!-- Shipping Info -->
            <div class="shipping-info mb-4">
              <h6 class="mb-3">{{ $t('ads.shippingInformation') }}</h6>
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">{{ $t('ads.location') }}</span>
                <span>{{ locale === 'en' ? product.location_en : product.location_lo }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">{{ $t('ads.shippingFee') }}</span>
                <span>₭ {{ formatPrice(product.shippingFee) }}</span>
              </div>
            </div>

            <!-- Stock Info -->
            <div class="stock-info mb-4">
              <h6 class="mb-3">{{ $t('ads.stockInformation') }}</h6>
              <div class="d-flex justify-content-between">
                <span class="text-muted">{{ $t('ads.available') }}</span>
                <span>{{ product.available }} {{ $t('ads.pieces') }}</span>
              </div>
            </div>

            <!-- Quantity Selector -->
            <div class="quantity-section mb-4">
              <h6 class="mb-3">{{ $t('ads.quantity') }}</h6>
              <div class="d-flex align-items-center gap-3">
                <div class="input-group" style="width: 150px">
                  <button class="btn btn-outline-secondary" @click="decrementQuantity">
                    <i class="bi bi-dash"></i>
                  </button>
                  <input
                    type="number"
                    class="form-control text-center"
                    v-model="quantity"
                    min="1"
                    :max="product.available"
                  />
                  <button class="btn btn-outline-secondary" @click="incrementQuantity">
                    <i class="bi bi-plus"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons d-flex justify-content-end">
              <button 
                class="btn btn-danger px-4"
                @click="buyNow"
              >
                <i class="bi bi-whatsapp me-2"></i>
                {{ $t('ads.buyNow') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Description -->
      <div class="product-description p-4 border-top mb-5 bg-right">
        <h5 class="mb-4">{{ $t('ads.productDescription') }}</h5>
        <p>{{ locale === 'en' ? product.description_en : product.description_lo }}</p>
      </div>

      <!-- Related Products -->
      <div class="related-products">
        <h5 class="mb-4">{{ $t('ads.relatedProducts') }}</h5>
        <ProductShowcase 
          :products="relatedProducts"
          :limit="4"
        />
      </div>
    </div>

    <!-- Image Modal -->
    <div 
      class="image-modal" 
      v-if="showModal" 
      @click="closeModal"
    >
      <div class="modal-content" @click.stop>
        <button class="close-button" @click="closeModal">
          <i class="bi bi-x-lg"></i>
        </button>
        <div class="modal-image-container">
          <button 
            class="nav-button prev" 
            @click="prevImage" 
            v-show="currentImageIndex > 0"
          >
            <i class="bi bi-chevron-left"></i>
          </button>
          
          <img 
            :src="modalImage" 
            :alt="product.name"
            class="modal-image"
            @mousemove="handleModalMouseMove"
            @mouseleave="handleModalMouseLeave"
            :style="modalZoomStyle"
          />
          
          <button 
            class="nav-button next" 
            @click="nextImage"
            v-show="currentImageIndex < product.images.length - 1"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>

        <!-- Thumbnails in modal -->
        <div class="modal-thumbnails">
          <div 
            v-for="(image, index) in product.images" 
            :key="index"
            class="modal-thumbnail"
            :class="{ active: currentImageIndex === index }"
            @click="setModalImage(index)"
          >
            <img :src="image" :alt="`${product.name} view ${index + 1}`" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-detail-card {
  background: #fff;
  margin-bottom: 2rem;
}

.main-image-container {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  cursor: zoom-in;
}

.main-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  transition: transform 0.3s ease;
  will-change: transform;
}

.discount-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #dc3545;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
}

.zoom-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.main-image-container:hover .zoom-hint {
  opacity: 1;
}

.main-image-container:hover .zoom-hint {
  opacity: 0;
}

.thumbnail-wrapper {
  width: 80px;
  height: 80px;
  border: 2px solid #dee2e6;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.thumbnail-wrapper:hover {
  border-color:#2d76bb ;
  transform: translateY(-2px);
}

.thumbnail-wrapper.active {
  border-color: #2d76bb;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.2);
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.thumbnail-wrapper:hover .thumbnail-image {
  transform: scale(1.1);
}

.product-title {
  font-weight: 600;
  color: #2c3e50;
}

.price-section {
  background: #fff8f8;
  padding: 1rem;
  border-radius: 8px;
}

.shipping-info, .stock-info {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}

.quantity-section .input-group {
  max-width: 200px;
}

.action-buttons .btn {
  padding: 0.8rem 1.5rem;
  font-weight: 500;
  min-width: 120px;
  transition: all 0.3s ease;
}

.action-buttons .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.2);
}

.product-description {
  border-radius: 0 0 8px 8px;
}

/* Hide number input arrows */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.related-products {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #dee2e6;
}

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  width: 90vw;
  height: 90vh;
  display: flex;
  flex-direction: column;
}

.close-button {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  z-index: 1;
}

.modal-image-container {
  position: relative;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.modal-image {
  max-height: calc(90vh - 100px);
  max-width: 100%;
  object-fit: contain;
  cursor: zoom-in;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.nav-button.prev {
  left: 20px;
}

.nav-button.next {
  right: 20px;
}

.modal-thumbnails {
  display: flex;
  gap: 10px;
  justify-content: center;
  padding: 20px 0;
}

.modal-thumbnail {
  width: 60px;
  height: 60px;
  border: 2px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-thumbnail.active {
  border-color: #dc3545;
}

.modal-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Remove underline from breadcrumb link */
.breadcrumb-item a {
  text-decoration: none;
  color: #6c757d;
  transition: color 0.3s ease;
}

.breadcrumb-item a:hover {
  color: #dc3545;
}
</style>

<script>
import { useI18n } from 'vue-i18n';
import { useProducts } from '../../APIs/ProductsAPIs';
import { usePhoneNumber } from "../../APIs/PhoneAPIs";
import { products as fallbackProducts } from '../../data/products';
import ProductShowcase from './ProductShowcase.vue';

export default {
  name: "ProductDetailCard",
  components: {
    ProductShowcase
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const { locale } = useI18n();
    const { products: apiProducts, loading, error } = useProducts();
    const { phoneNumber } = usePhoneNumber();
    return { apiProducts, loading, error, locale, phoneNumber };
  },
  computed: {
    availableProducts() {
      return this.apiProducts?.length > 0 ? this.apiProducts : fallbackProducts;
    },
    relatedProducts() {
      // Get products from the same category, excluding the current product
      return this.availableProducts
        .filter(p => p.category === this.product.category && p.id !== this.product.id)
        .slice(0, 4);
    },
    zoomStyle() {
      if (!this.isZoomed) return {};
      return {
        transform: `scale(${this.zoomLevel})`,
        transformOrigin: `${this.mouseX}% ${this.mouseY}%`,
        transition: this.isZoomed ? 'none' : 'all 0.3s ease'
      };
    },
    modalImage() {
      return this.product.images[this.currentImageIndex];
    },
    modalZoomStyle() {
      if (!this.modalIsZoomed) return {};
      return {
        transform: `scale(${this.modalZoomLevel})`,
        transformOrigin: `${this.modalMouseX}% ${this.modalMouseY}%`,
        transition: this.modalIsZoomed ? 'none' : 'all 0.3s ease'
      };
    }
  },
  data() {
    return {
      quantity: 1,
      selectedImage: null,
      isZoomed: false,
      zoomLevel: 1.5,
      mouseX: 0,
      mouseY: 0,
      showModal: false,
      currentImageIndex: 0,
      modalZoomLevel: 2,
      modalMouseX: 50,
      modalMouseY: 50,
      modalIsZoomed: false,
      apiUrl: import.meta.env.VITE_API_URL
    };
  },
  created() {
    this.selectedImage = this.product.coverImage;
  },
  methods: {
    formatPrice(price) {
      return Number(price)
        .toFixed(0)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    selectImage(image) {
      this.selectedImage = image;
    },
    incrementQuantity() {
      if (this.quantity < this.product.available) {
        this.quantity++;
      }
    },
    decrementQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
    buyNow() {
      const message = this.formatWhatsAppMessage();
      const whatsappUrl = this.createWhatsAppUrl(message);
      window.open(whatsappUrl, '_blank');
    },
    formatWhatsAppMessage() {
      const productUrl = window.location.href;
      const productName = this.locale === 'en' ? this.product.name_en : this.product.name_lo;
      const description = this.locale === 'en' ? this.product.description_en : this.product.description_lo;
      
      return encodeURIComponent(
        `*${productName}*\n\n` +
        `Price: ₭${this.formatPrice(this.product.price)}\n` +
        `Quantity: ${this.quantity}\n` +
        `Total: ₭${this.formatPrice(this.product.price * this.quantity)}\n\n` +
        `Product Link: ${productUrl}\n\n` +
        `Description: ${description}\n`
      );
    },
    createWhatsAppUrl(message) {
      // Remove any non-numeric characters from phone number and ensure it starts with the country code
      const cleanPhoneNumber = this.phoneNumber?.replace(/\D/g, '') || '856 20 91 563 333';
      return `https://wa.me/${cleanPhoneNumber}?text=${message}`;
    },
    handleMouseMove(event) {
      const rect = this.$refs.imageContainer.getBoundingClientRect();
      this.mouseX = ((event.clientX - rect.left) / rect.width) * 100;
      this.mouseY = ((event.clientY - rect.top) / rect.height) * 100;
      this.isZoomed = true;
    },
    handleMouseLeave() {
      this.isZoomed = false;
      this.mouseX = 50;
      this.mouseY = 50;
    },
    handleModalMouseMove(event) {
      const rect = event.target.getBoundingClientRect();
      this.modalMouseX = ((event.clientX - rect.left) / rect.width) * 100;
      this.modalMouseY = ((event.clientY - rect.top) / rect.height) * 100;
      this.modalIsZoomed = true;
    },
    handleModalMouseLeave() {
      this.modalIsZoomed = false;
      this.modalMouseX = 50;
      this.modalMouseY = 50;
    },
    setModalImage(index) {
      this.currentImageIndex = index;
    },
    prevImage() {
      if (this.currentImageIndex > 0) {
        this.currentImageIndex--;
      }
    },
    nextImage() {
      if (this.currentImageIndex < this.product.images.length - 1) {
        this.currentImageIndex++;
      }
    },
    openModal(index) {
      this.currentImageIndex = index;
      this.showModal = true;
      document.body.style.overflow = 'hidden'; // Prevent body scroll
    },
    closeModal() {
      this.showModal = false;
      document.body.style.overflow = ''; // Restore body scroll
    }
  },
};
</script>
