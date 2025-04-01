<template>
  <div class="home">
    <!-- Hero Section with Image Slider -->
    <Slider :slides="heroSlides" class="hero-slider" />

    <!-- Mission Statement Section -->
    <section class="mission-section my-5 py-4">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 slide-from-left">
            <h1 class="display-4 fw-bold mb-4">
              {{ contentOneList[0]?.title || $t("home.heroTitle") }}
            </h1>
            <p class="lead mb-4">
              {{ contentOneList[0]?.description || $t("home.heroDescription") }}
            </p>
            <router-link
              :to="{ name: 'Projects' }"
              class="btn btn-outline-primary rounded-pill text-decoration-none"
            >
              {{ $t("home.learnMore") }}
            </router-link>
          </div>
          <div class="col-lg-6 slide-from-right">
            <div class="position-relative">
              <img
                :src="contentOneList[0]?.image || heroImage"
                alt="Hero"
                class="img-fluid rounded shadow-lg p-10"
              />
              <div class="stats-card">
                <div
                  class="d-flex justify-content-around bg-white p-4 rounded-3 shadow-sm"
                >
                  <div class="text-center">
                    <h5 class="fw-bold text-yellow">
                      {{ contentOneList[0]?.content || $t("home.peopleHelped") }}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <img
              :src="contentTwoList[0]?.image || 'https://i0.wp.com/amirandazadeh.com/wp-content/uploads/2021/03/16_result.jpg?fit=1000%2C667&ssl=1'"
              alt="meathaoyaithonvanh"
              class="img-fluid testimonial-image rounded slide-from-left"
            />
          </div>
          <div class="col-lg-6">
            <div class="testimonial-content gap-2 p-4 slide-from-right">
              <div class="rating mb-3">
                <h5 class="client-name mb-1">
                  {{ contentTwoList[0]?.title || $t("home.TestimonialsTitle") }}
                </h5>
              </div>
              <p class="testimonial-text lead mb-4">
                "{{ contentTwoList[0]?.description || $t("home.TestimonialsDescription") }}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Vision & Mission Section -->
    <section class="pt-4 my-5">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-6 slide-from-left">
            <div class="vision-card p-4 bg-white rounded-3 shadow-sm h-100">
              <div class="card-icon d-flex align-items-center mb-3">
                <i class="bi bi-eye-fill me-3 text-danger fs-2"></i>
                <h3 class="section-title mb-0">
                  {{ visionMission?.vision?.title || $t("aboutUs.ourVision") }}
                </h3>
              </div>
              <p class="section-text text-start mb-4">
                {{ visionMission?.vision?.description || $t("aboutUs.visionText") }}
              </p>
              <ul class="vision-list text-start list-unstyled">
                <template v-if="visionMission?.vision?.points">
                  <li v-for="(point, index) in visionMission.vision.points" 
                      :key="index" 
                      class="mb-2">
                    <i class="bi bi-check-circle-fill text-danger me-2"></i>
                    {{ point }}
                  </li>
                </template>
                <template v-else>
                  <li class="mb-2">
                    <i class="bi bi-check-circle-fill text-danger me-2"></i>
                    {{ $t("aboutUs.visionPoint1") }}
                  </li>
                  <li class="mb-2">
                    <i class="bi bi-check-circle-fill text-danger me-2"></i>
                    {{ $t("aboutUs.visionPoint2") }}
                  </li>
                  <li class="mb-2">
                    <i class="bi bi-check-circle-fill text-danger me-2"></i>
                    {{ $t("aboutUs.visionPoint3") }}
                  </li>
                </template>
              </ul>
            </div>
          </div>
          <div class="col-md-6 slide-from-right">
            <div class="mission-card p-4 bg-white rounded-3 shadow-sm h-100">
              <div class="card-icon d-flex align-items-center mb-3">
                <i class="bi bi-flag-fill me-3 text-danger fs-2"></i>
                <h3 class="section-title mb-0">
                  {{ visionMission?.mission?.title || $t("aboutUs.ourMission") }}
                </h3>
              </div>
              <p class="section-text text-start mb-4">
                {{ visionMission?.mission?.description || $t("aboutUs.missionText") }}
              </p>
              <ul class="mission-list text-start list-unstyled">
                <template v-if="visionMission?.mission?.points">
                  <li v-for="(point, index) in visionMission.mission.points" 
                      :key="index" 
                      class="mb-2">
                    <i class="bi bi-check-circle-fill text-danger me-2"></i>
                    {{ point }}
                  </li>
                </template>
                <template v-else>
                  <li class="mb-2">
                    <i class="bi bi-check-circle-fill text-danger me-2"></i>
                    {{ $t("aboutUs.missionPoint1") }}
                  </li>
                  <li class="mb-2">
                    <i class="bi bi-check-circle-fill text-danger me-2"></i>
                    {{ $t("aboutUs.missionPoint2") }}
                  </li>
                  <li class="mb-2">
                    <i class="bi bi-check-circle-fill text-danger me-2"></i>
                    {{ $t("aboutUs.missionPoint3") }}
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Features Section -->
    <FeaturesSection />

    <!-- Projects Preview Section -->
    <section class="projects-section">
      <div class="container slide-from-bottom">
        <div class="d-flex justify-content-end align-items-center">
          <router-link
            :to="{ name: 'Projects' }"
            class="btn btn-link text-primary"
          >
            {{ $t("home.viewAll") }}
            <i class="fas fa-arrow-right"></i>
          </router-link>
        </div>
        <ProjectSection :projects="featuredProjects" />
      </div>
    </section>
    <!-- Supporters Section -->
    <SupportersSection :supporters="supporters" />
    <!-- Payment Method Section -->
    <div id="payment-section">
      <Payment />
    </div>
    
    <!-- News Card Preview -->
    <NewsCardPreview />

    <!-- Partners Section -->
    <LogoPartner />
  </div>
</template>

<script>
import Slider from "./HomeSlider.vue";
import LogoPartner from "./PartnerLogo.vue";
import NewsCard from "../components/News/NewsCard.vue";
import TouristPreviewCard from "@/components/Tourist/TouristPreviewCard.vue";
import ProjectSection from "../components/project/ProjectSection.vue";
import { heroSlides } from "../data/projects";
import { projects, supporters } from "../data/projects";
import { newsData } from "../data/News";
import Payment from "./Payment.vue";
import SupportersSection from "../components/supporters/SupportersSection.vue";
import NewsCardPreview from "../components/News/NewsCardPreview.vue";
import { useContentOne } from '../APIs/ContentOneAPIs'
import { useContentTwo } from '../APIs/ContentTwoAPIs'
import { useVisionMission } from '../APIs/Vision-missionAPIs'
import { useContentThree } from '../APIs/ContentThreeAPIs'
import heroImage from '../assets/hero-image.jpg'
import FeaturesSection from '../components/Common/FeaturesSection.vue'

export default {
  name: "Home",
  components: {
    Slider,
    LogoPartner,
    NewsCard,
    TouristPreviewCard,
    ProjectSection,
    Payment,
    SupportersSection,
    NewsCardPreview,
    FeaturesSection,
  },
  setup() {
    const { contentOneList, loading: contentLoading, error: contentError } = useContentOne()
    const { contentTwoList, loading: contentTwoLoading, error: contentTwoError } = useContentTwo()
    const { visionMission, loading: vmLoading, error: vmError } = useVisionMission()
    const { features, loading, error } = useContentThree()
    
    return {
      contentOneList,
      contentLoading,
      contentError,
      heroImage,
      contentTwoList,
      contentTwoLoading,
      contentTwoError,
      visionMission,
      vmLoading,
      vmError,
      features,
      loading,
      error,
      supporters,
      featuredProjects: projects.slice(0, 3),
      defaultIcons: [
        "fas fa-heart",
        "fas fa-hands-helping",
        "fas fa-globe"
      ]
    }
  },
  data() {
    return {
      heroSlides,
    };
  },
  methods: {
    initializeAnimations() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '50px'
      });

      // Observe all animated elements
      document.querySelectorAll('.slide-from-left, .slide-from-right, .slide-from-top, .slide-from-bottom').forEach(el => {
        observer.observe(el);
      });
    },
    handleImageError(event, index) {
      // Replace failed image with default icon
      event.target.style.display = 'none';
      const iconElement = document.createElement('i');
      iconElement.className = `${this.defaultIcons[index % this.defaultIcons.length]} fs-1 text-white`;
      event.target.parentNode.appendChild(iconElement);
    },
  },
  mounted() {
    this.initializeAnimations();
  }
};
</script>

<style scoped>
.hero-slider {
  margin-bottom: -2rem;
}

.mission-section {
  position: relative;
  z-index: 1;
}

.stats-card {
  position: absolute;
  bottom: -90%;
  left: 50%;
  transform: translateX(-50%);
  background: transparent;
  padding: 2rem;
  border-radius: 1rem;
  width: 100%;
  height: 100%;
}

.feature-icon-wrapper {
  width: 80px;
  height: 80px;
  background: #ed207b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
}

.feature-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  padding: 15px;
}

.feature-icon-wrapper i {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.feature-title {
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.feature-description {
  color: #666;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 0;
}

.text-danger{
  color: #ed207b !important;
}
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: transparent;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.btn-primary {
  background-color: #ed207b;
  border-color: #ed207b;
}
.text-primary {
  color: #00adef !important;
}
.btn-primary:hover {
  background-color: #ffde15;
  border-color: #ffde15;
}

.btn-outline-primary {
  color: #ed207b;
  border-color: #ed207b;
}

.btn-outline-primary:hover {
  background-color: #ed207b;
  border-color: #ed207b;
  color: white;
}

.partners-section {
  background-color: #fff;
}

.news-section .card,
.tourist-section .card {
  border: none;
  border-radius: 1rem;
  overflow: hidden;
}

.projects-section h2 {
  color: #00adef;
}

.projects-section .btn-link {
  color: #ed207b;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.projects-section .btn-link:hover {
  color: #ffde15;
}

.vision-card,
.mission-card {
  background: transparent;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.vision-card:hover,
.mission-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.card-icon i {
  color: #ed207b;
}

.section-title {
  color: #00adef;
  font-weight: 600;
}

.section-text {
  color: #6c757d;
  line-height: 1.6;
}

.vision-list li,
.mission-list li {
  color: #495057;
  font-size: 1rem;
  line-height: 1.5;
}

.vision-list i,
.mission-list i {
  font-size: 1.1rem;
}

/* News Section Styles */
.news-section {
  background-color: #f8f9fa;
}

.news-section h2 {
  color: #00adef;
  font-weight: 600;
}

.news-section .btn-link {
  color: #ed207b;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.news-section .btn-link:hover {
  color: #ffde15;
}

.news-section .row {
  margin: -1rem;
}

.news-section .col-md-4 {
  padding: 1rem;
}

.testimonials-section {
  position: relative;
}

.testimonial-image {
  box-shadow: none;
  position: relative;
  max-height: 600px;
  object-fit: contain;
}

.testimonial-content {
  border-radius: 10px;
  box-shadow: none;
  padding: 2rem;
}

.rating {
  font-size: 1.2rem;
}

.testimonial-text {
  font-size: 1.25rem;
  line-height: 1.6;
  color: #4a4a4a;
  font-style: italic;
}

.client-name {
  color: #00adef;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

@media (max-width: 991.98px) {
  .testimonial-content {
    margin-top: 2rem;
  }
}

.slide-from-left {
  opacity: 0;
  transform: translateX(-100px);
  transition: all 0.8s ease-out;
}

.slide-from-right {
  opacity: 0;
  transform: translateX(100px);
  transition: all 0.8s ease-out;
}

.slide-from-left.visible,
.slide-from-right.visible {
  opacity: 1;
  transform: translateX(0);
}

/* New animations */
.slide-from-top {
  opacity: 0;
  transform: translateY(-50px);
  transition: all 0.8s ease-out;
}

.slide-from-bottom {
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s ease-out;
}

/* Visible state for all animations */
.slide-from-left.visible,
.slide-from-right.visible,
.slide-from-top.visible,
.slide-from-bottom.visible {
  opacity: 1;
  transform: translate(0);
}

/* Add transition-delay support */
[style*="transition-delay"] {
  transition-property: all;
  transition-duration: 0.8s;
  transition-timing-function: ease-out;
}
</style>
