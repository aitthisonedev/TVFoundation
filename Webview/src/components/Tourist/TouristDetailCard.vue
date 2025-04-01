<template>
  <div class="product-detail-card">
    <div class="card border-0 shadow-sm">
      <div class="row g-0">
        <!-- Left side with main image and thumbnails -->
        <div class="col-md-6 p-3">
          <div class="image-gallery">
            <div
              class="main-image-container mb-3"
              @mousemove="handleMouseMove"
              @mouseleave="handleMouseLeave"
              @click="openModal(currentImageIndex)"
              ref="imageContainer"
            >
              <img
                :src="selectedImage"
                :alt="attraction.name"
                class="main-image img-fluid rounded"
                ref="mainImage"
                :style="zoomStyle"
              />
              <!-- Add zoom hint -->
              <div class="zoom-hint" v-if="!isZoomed">
                <i class="bi bi-search"></i>
              </div>
            </div>
            <div class="thumbnails-container d-flex gap-2">
              <div
                v-for="(image, index) in attraction.images"
                :key="index"
                class="thumbnail-wrapper"
                @click="selectImage(image)"
                :class="{ active: selectedImage === getFullImageUrl(image) }"
              >
                <img
                  :src="getFullImageUrl(image)"
                  :alt="`${attraction.name} view ${index + 1}`"
                  class="thumbnail-image"
                />
              </div>
            </div>
          </div>
          <div class="mt-4">
            <p class="text-muted">{{ attraction.content }}</p>
          </div>
          <div class="share-buttons">
            <h3>
              <i class="bi bi-share-fill me-2"></i>
              {{ $t("tourist.detail.share") }}
            </h3>
            <ShareSection
              :title="attraction.name"
              :description="attraction.description"
              :location="attraction.location"
              :url="currentUrl"
              :image="shareImage"
            />
          </div>
        </div>

        <!-- Right side with attraction details -->
        <div class="col-md-6">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="badge bg-primary"
                >{{ $t("tourist.detail.popularAttraction") }}:
                {{ attraction.category.name }}</span
              >
            </div>

            <h2 class="card-title h4 mb-3">{{ attraction.name }}</h2>

            <!-- Location -->
            <div class="location-section mb-4">
              <i class="bi bi-geo-alt text-primary"></i>
              <span class="ms-2">{{ attraction.location }}</span>
            </div>

            <!-- Description -->
            <div class="description-section mb-4">
              <h5 class="mb-3">{{ $t("tourist.detail.aboutAttraction") }}</h5>
              <p class="text-muted">{{ attraction.description }}</p>
            </div>

            <!-- Tour Details -->
            <div class="tour-details mb-4">
              <h5 class="mb-3">{{ $t("tourist.detail.highlights") }}</h5>
              <div class="tour-features">
                <div class="feature">
                  <i class="bi bi-clock text-primary"></i>
                  <span
                    >{{ $t("tourist.detail.duration") }}
                    {{
                      attraction.duration || $t("tourist.detail.duration")
                    }}</span
                  >
                </div>
                <div class="feature">
                  <i class="bi bi-people text-primary"></i>
                  <span
                    >{{ $t("tourist.detail.groupSize") }}
                    {{
                      attraction.groupSize || $t("tourist.detail.groupSize")
                    }}</span
                  >
                </div>
                <div class="feature">
                  <i class="bi bi-translate text-primary"></i>
                  <span
                    >{{ $t("tourist.detail.languages") }}
                    {{
                      attraction.language || $t("tourist.detail.languages")
                    }}</span
                  >
                </div>
                <div class="feature">
                  <i class="bi bi-calendar-check text-primary"></i>
                  <span>
                    {{
                      attraction.available || $t("tourist.detail.availability")
                    }}</span
                  >
                </div>
              </div>
            </div>

            <!-- What to Expect -->
            <div class="what-to-expect mb-4">
              <h5 class="mb-3">{{ $t("tourist.detail.whatToExpect") }}</h5>
              <ul class="list-unstyled">
                <li class="mb-2">
                  <i class="bi bi-check2-circle text-danger me-2"></i>
                  {{attraction.ExpectOne}}
                </li>
                <li class="mb-2">
                  <i class="bi bi-check2-circle text-danger me-2"></i>
                  {{attraction.ExpectTwo}}
                </li>
                <li class="mb-2">
                  <i class="bi bi-check2-circle text-danger me-2"></i>
                  {{attraction.ExpectThree}}
                </li>
              </ul>
            </div>
            <!-- Contact Button -->
            <div
              class="action-buttons d-flex align-items-center justify-content-end"
            >
              <button
                class="btn btn-success w-auto btn-lg"
                @click="shareToWhatsApp"
              >
                <i class="bi bi-whatsapp"></i>
                {{ $t("tourist.detail.askDetails") }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Second row for related attractions -->
      <div class="row g-0 mt-5 px-3 pb-4">
        <div class="col-12">
          <h4 class="mb-4 text-primary">
            {{ $t("tourist.detail.relatedAttractions") }}
          </h4>
          <div class="row g-4">
            <div
              v-for="relatedAttraction in relatedAttractions"
              :key="relatedAttraction.id"
              class="col-12 col-sm-6 col-lg-4"
              @click="goToAttraction(relatedAttraction.id)"
            >
              <div class="attraction-card">
                <div class="image-container">
                  <img
                    :src="getFullImageUrl(relatedAttraction.image)"
                    :alt="relatedAttraction.name"
                    class="attraction-image"
                  />
                </div>
                <div class="content">
                  <h5 class="attraction-title text-primary">
                    {{ relatedAttraction.name }}
                  </h5>
                  <p class="attraction-description">
                    {{ relatedAttraction.description }}
                  </p>
                  <div class="location text-danger">
                    <i class="bi bi-geo-alt text-danger"></i>
                    <span>{{ relatedAttraction.location }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div class="image-modal" v-if="showModal" @click="closeModal">
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
            :alt="attraction.name"
            class="modal-image"
            :class="{ zoomed: isZoomed }"
            @click="handleModalClick"
            @mousemove="handleModalMouseMove"
            @mouseleave="handleModalMouseLeave"
            :style="modalZoomStyle"
          />

          <button
            class="nav-button next"
            @click="nextImage"
            v-show="currentImageIndex < attraction.images.length - 1"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
        <div class="modal-share-section">
          <ShareSection
            :title="attraction.name"
            :description="attraction.description"
            :location="attraction.location"
            :url="currentUrl"
            :image="modalImage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAttractions } from "../../APIs/AttractionAPIs";
import { usePhoneNumber } from "../../APIs/PhoneAPIs";
import ShareSection from "../Common/ShareSection.vue";

const router = useRouter();
const route = useRoute();
const apiUrl = import.meta.env.VITE_API_URL;
const imageContainer = ref(null);

// Get phone number from API
const { phoneNumber } = usePhoneNumber();

// Add isDev computed property
const isDev = computed(() => process.env.NODE_ENV === "development");

const props = defineProps({
  attraction: {
    type: Object,
    required: true,
  },
});

// Get all attractions for related attractions
const { attractions } = useAttractions();

const selectedImage = ref("");
const showModal = ref(false);
const currentImageIndex = ref(0);
const modalZoom = ref(1);
const modalPosition = ref({ x: 50, y: 50 });
const isZoomed = ref(false);
const zoomLevel = ref(1.5);
const mouseX = ref(0);
const mouseY = ref(0);

// Helper function to construct full image URL
const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null;
  return `${apiUrl}/ImageUpload/${imagePath}`;
};

// Set initial selected image and update when attraction changes
watch(
  () => props.attraction,
  (newAttraction) => {
    if (newAttraction && newAttraction.image) {
      selectedImage.value = getFullImageUrl(newAttraction.image);
      currentImageIndex.value = 0;
    }
  },
  { immediate: true }
);

const relatedAttractions = computed(() => {
  if (!attractions.value || !props.attraction) return [];

  return attractions.value
    .filter(
      (item) =>
        item.location === props.attraction.location &&
        item.id !== props.attraction.id
    )
    .slice(0, 3);
});

const modalImage = computed(() => {
  if (!props.attraction.images) return null;
  return getFullImageUrl(props.attraction.images[currentImageIndex.value]);
});

const modalZoomStyle = computed(() => {
  return {
    transform: `scale(${modalZoom.value})`,
    transformOrigin: `${modalPosition.value.x}% ${modalPosition.value.y}%`,
    cursor: isZoomed.value ? "zoom-out" : "zoom-in",
  };
});

const currentUrl = computed(() => {
  return `${apiUrl}/tourist/${props.attraction.id}`;
});

const shareImage = computed(() => {
  if (!props.attraction?.image) {
    return "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a";
  }
  return getFullImageUrl(props.attraction.image);
});

const zoomStyle = computed(() => {
  if (!isZoomed.value) return {};
  return {
    transform: `scale(${zoomLevel.value})`,
    transformOrigin: `${mouseX.value}% ${mouseY.value}%`,
    transition: isZoomed.value ? "none" : "all 0.3s ease",
  };
});

const selectImage = (image) => {
  selectedImage.value = getFullImageUrl(image);
  currentImageIndex.value = props.attraction.images.indexOf(image);
};

const shareToWhatsApp = () => {
  // Create the message text with URL
  const message = `
I'm interested in visiting: ${props.attraction.name}
Please provide more information:
*About:* ${props.attraction.description}
*Location:* ${props.attraction.location}
*More Details:* ${currentUrl.value}

Thank you!
  `.trim();

  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);

  // Get phone number from API or use default
  const phoneForWhatsApp =
    phoneNumber.value?.replace(/[^0-9]/g, "") || "8562091563333";

  // WhatsApp URL with phone number from API
  const whatsappUrl = `https://wa.me/${phoneForWhatsApp}?text=${encodedMessage}`;

  // Open WhatsApp in new window
  window.open(whatsappUrl, "_blank");
};

const goToAttraction = (id) => {
  if (id !== props.attraction.id) {
    router
      .push({
        name: "TouristDetail",
        params: { id: id.toString() },
      })
      .then(() => {
        // Force page reload after route change
        window.location.reload();
      });
  }
};

const openModal = (index) => {
  currentImageIndex.value = index;
  showModal.value = true;
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  showModal.value = false;
  document.body.style.overflow = "auto";
};

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
};

const nextImage = () => {
  if (currentImageIndex.value < props.attraction.images.length - 1) {
    currentImageIndex.value++;
  }
};

const handleModalClick = (event) => {
  isZoomed.value = !isZoomed.value;

  if (isZoomed.value) {
    const rect = event.target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    modalPosition.value = { x, y };
    modalZoom.value = 2.5;
  } else {
    modalZoom.value = 1;
    modalPosition.value = { x: 50, y: 50 };
  }
};

const handleModalMouseMove = (event) => {
  if (!isZoomed.value) return;

  const rect = event.target.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  modalPosition.value = { x, y };
};

const handleModalMouseLeave = () => {
  if (!isZoomed.value) {
    modalZoom.value = 1;
    modalPosition.value = { x: 50, y: 50 };
  }
};

const handleMouseMove = (event) => {
  const rect = imageContainer.value.getBoundingClientRect();
  mouseX.value = ((event.clientX - rect.left) / rect.width) * 100;
  mouseY.value = ((event.clientY - rect.top) / rect.height) * 100;
  isZoomed.value = true;
};

const handleMouseLeave = () => {
  isZoomed.value = false;
  mouseX.value = 50;
  mouseY.value = 50;
};
</script>

<style scoped>
.product-detail-card {
  margin: 2rem 0;
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
  border-color: #00adef;
  transform: translateY(-2px);
}

.thumbnail-wrapper.active {
  border-color: #00adef;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(45, 118, 187, 0.2);
}
.btn-primary {
  background-color: #00adef !important;
  border-color: #00adef !important;
}
.bg-primary {
  background-color: #00adef !important;
}
.text-primary {
  color: #00adef !important;
}
.text-danger {
  color: #ed207b !important;
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

.description-section {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
}

.tour-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.feature i {
  color: #0d6efd;
}

.share-buttons .btn {
  padding: 0.25rem 0.5rem;
}

.location-section {
  color: #666;
}

.what-to-expect li {
  display: flex;
  align-items: center;
}

.action-buttons {
  position: sticky;
  bottom: 0;
  background-color: white;
  padding-top: 1rem;
  border-top: 1px solid #dee2e6;
}

.btn-success {
  background-color: #00adef;
  border-color: #00adef;
}

.btn-success:hover {
  background-color: #25d366;
  border-color: #25d366;
}

.attraction-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  height: 100%;
}

.attraction-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.attraction-card .image-container {
  height: 200px;
  overflow: hidden;
}

.attraction-card .attraction-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.attraction-card:hover .attraction-image {
  transform: scale(1.1);
}

.attraction-card .content {
  padding: 1rem;
}

.attraction-card .attraction-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2d3436;
}

.attraction-card .attraction-description {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.attraction-card .location {
  font-size: 0.875rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.attraction-card .location i {
  color: #00adef;
}

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  width: 90%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-image-container {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-image {
  max-width: 100%;
  max-height: calc(90vh - 150px); /* Account for share section */
  object-fit: contain;
  transition: transform 0.3s ease;
  cursor: zoom-in;
}

.modal-image.zoomed {
  cursor: zoom-out;
}

.close-button {
  position: absolute;
  top: -50px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;
  padding: 10px;
}

.close-button:hover {
  color: #f8f9fa;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 45px;
  height: 45px;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 1002;
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-50%) scale(1.1);
}

.nav-button.prev {
  left: -80px;
}

.nav-button.next {
  right: -80px;
}

.nav-button i {
  font-size: 1.2rem;
}

.modal-share-section {
  position: relative;
  width: 100%;
  margin-top: 2rem;
  background: transparent;
  padding: 0 1rem;
}

.modal-share-section :deep(.share-section) {
  margin-top: 0;
}

.modal-share-section :deep(.widget-title) {
  color: white;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  text-align: center;
}

.modal-share-section :deep(.social-share) {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.modal-share-section :deep(.btn) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1.25rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.modal-share-section :deep(.btn:hover) {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.modal-share-section :deep(.btn i) {
  font-size: 1.1rem;
}

/* Add responsive styles */
@media (max-width: 1200px) {
  .nav-button.prev {
    left: 20px;
  }
  .nav-button.next {
    right: 20px;
  }
}

@media (max-width: 768px) {
  .modal-image {
    max-height: calc(80vh - 150px);
  }

  .modal-share-section {
    margin-top: 1rem;
  }

  .nav-button {
    width: 40px;
    height: 40px;
  }
}

.share-buttons {
  margin-top: 2rem;
  border-radius: 0.5rem;
}

.share-buttons h3 {
  font-size: 1.25rem;
  color: #2d3436;
  margin-bottom: 0;
  display: flex;
  align-items: center;
}

.share-buttons h3 i {
  color: #00adef;
}

.share-buttons :deep(.share-section) {
  margin-top: 0rem;
}

.share-buttons :deep(.widget-title) {
  display: none;
}

.share-buttons :deep(.social-share) {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-start;
}

.share-buttons :deep(.btn) {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.share-buttons :deep(.btn i) {
  font-size: 1.1rem;
}

.share-buttons :deep(.btn-outline-primary:hover) {
  background-color: #00adef;
  border-color: #00adef;
}

.share-buttons :deep(.btn-outline-success:hover) {
  background-color: #25d366;
  border-color: #25d366;
}
</style>
