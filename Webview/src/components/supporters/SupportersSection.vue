<template>
  <div class="supporters-section mt-4 mb-5">
    <div class="container">
      <h2 class="section-title text-start text-primary mb-5">
        {{ $t("ads.ourSupporters") }}
      </h2>
      <div class="supporters-scroll">
        <div class="supporters-wrapper">
          <div
            v-for="(supporter, index) in supportersDisplay"
            :key="index"
            class="supporter-item"
          >
            <div
              class="supporter-card"
              @click="goToFoundation"
              style="cursor: pointer"
            >
              <div class="supporter-image">
                <img
                  :src="supporter.logo || defaultLogo"
                  :alt="supporter.name"
                  class="supporter-logo"
                />
              </div>
              <div class="supporter-info text-start">
                <h5>{{ supporter.name }}</h5>
                <p class="mb-0">{{ supporter.description }}</p>
                <div class="donation-amount mt-2">
                  <span class="text-danger fw-bold">{{ supporter.supportAmount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useCompanyNames } from "@/APIs/SuppportCompanyAPIs";
import defaultLogo from "../../assets/logo.png"; // Make sure to add a default logo image

const { companyList } = useCompanyNames();

// Default data when API fails
const defaultSupporters = [
  {
    id: 1,
    name: "Default Company 1",
    description: "Default description for company 1",
    logo: null,
    supportAmount: "1,000,000 LAK"
  },
  {
    id: 2,
    name: "Default Company 2",
    description: "Default description for company 2",
    logo: null,
    supportAmount: "2,000,000 LAK"
  },
  {
    id: 3,
    name: "Default Company 3",
    description: "Default description for company 3",
    logo: null,
    supportAmount: "3,000,000 LAK"
  }
];

// Computed property to handle API data or fallback to default
const supportersDisplay = computed(() => {
  const supporters = companyList.value.length > 0 ? companyList.value : defaultSupporters;
  // Repeat the array three times for continuous scrolling
  return [...supporters, ...supporters, ...supporters];
});

const goToFoundation = () => {
  router.push({ name: "Foundation" });
};
</script>

<style scoped>
.supporter-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  height: 100%;
}

.supporter-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.supporter-image {
  height: 200px;
  overflow: hidden;
}

.supporter-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 1rem;
}

.supporter-info {
  padding: 1.5rem;
}

.supporter-info h6 {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.supporter-info p {
  color: #6c757d;
  font-size: 0.9rem;
}

.supporters-scroll {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.supporters-wrapper {
  display: flex;
  gap: 1.5rem;
  padding: 0.5rem;
  animation: scrollLeft 30s linear infinite;
}

.supporters-wrapper:hover {
  animation-play-state: paused;
}

.text-danger {
  color: #ed207b !important;
}

.text-primary {
  color: #00adef !important;
}

.supporter-item {
  flex: 0 0 300px;
  min-width: 300px;
}

@keyframes scrollLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-300px * 4));
  }
}

.supporters-scroll::before,
.supporters-scroll::after {
  content: "";
  position: absolute;
  top: 0;
  width: 100px;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.supporters-scroll::before {
  left: 0;
  background: linear-gradient(to right, white, transparent);
}

.supporters-scroll::after {
  right: 0;
  background: linear-gradient(to left, white, transparent);
}

@media (max-width: 768px) {
  .supporter-item {
    flex: 0 0 250px;
    min-width: 250px;
  }

  @keyframes scrollLeft {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(calc(-250px * 4));
    }
  }
}
</style> 