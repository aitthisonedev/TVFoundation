<template>
  <div class="about-us">
    <!-- Hero Section -->
    <div class="hero-section" :style="{
      backgroundImage: `url('${headData?.image || 'https://www.conservationlaos.com/wp-content/uploads/2024/08/IMG_1174-scaled.jpg'}')`
    }">
      <div class="hero-overlay">
        <div class="hero-content text-center">
          <h6 class="display-6 text-white">
            {{ headData?.title || $t("aboutUs.title") }}
          </h6>
          <p class="lead text-white">
            {{ headData?.description || $t("aboutUs.heroDescription") }}
          </p>
        </div>
      </div>
    </div>

    <!-- Introduction Section -->
    <div class="introduction-section">
      <div class="container py-5 pb-2">
        <div class="row align-items-center">
          <div class="col-md-6">
            <img
              :src="aboutData?.image || foundationWorkImage"
              alt="Foundation Work"
              class="img-fluid rounded-3 shadow-lg"
            />
          </div>
          <div class="col-md-6">
            <div class="intro-content">
              <h2 class="section-title text-primary">
                {{ aboutData?.title || $t("aboutUs.whoWeAre") }}
              </h2>
              <p class="section-text">
                {{ aboutData?.description || $t("aboutUs.whoWeAreText") }}
              </p>
              <div class="stats-container mt-4">
                <div class="stat-item">
                  <h3>{{ aboutData?.stats?.peopleHelped || '2000' }}+</h3>
                  <p>{{ $t("aboutUs.peopleHelped") }}</p>
                </div>
                <div class="stat-item">
                  <h3>{{ aboutData?.stats?.projectsCompleted || '50' }}+</h3>
                  <p>{{ $t("aboutUs.projectsCompleted") }}</p>
                </div>
                <div class="stat-item">
                  <h3>{{ aboutData?.stats?.yearsExperience || '15' }}+</h3>
                  <p>{{ $t("aboutUs.yearsExperience") }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Vision & Mission Section -->
    <section class="vision-mission-section py-5 bg-light">
      <div class="container">
        <div class="row g-4">
          <!-- Vision Card -->
          <div class="col-md-6">
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
              <ul class="text-start list-unstyled">
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

          <!-- Mission Card -->
          <div class="col-md-6">
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
              <ul class="text-start list-unstyled">
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

    <!-- Core Values Section -->
    <div class="core-values-section py-2">
      <div class="container">
        <h2 class="text-center section-title mb-5 text-primary">
          {{ $t("aboutUs.ourValues") }}
        </h2>
        <div class="row g-4">
          <template v-if="!coreValuesLoading && coreValuesList.length > 0">
            <div class="col-md-3 col-sm-6"
                 v-for="(value, index) in coreValuesList"
                 :key="value.id">
              <div class="value-card">
                <div class="value-icon">
                  <img v-if="value.image" 
                       :src="value.image" 
                       :alt="value.title"
                       class="value-image">
                  <i v-else :class="valueIcons[index % valueIcons.length]"></i>
                </div>
                <h3>{{ value.title }}</h3>
                <p>{{ value.description }}</p>
              </div>
            </div>
          </template>

          <!-- Fallback default content -->
          <template v-else>
            <div class="col-md-3 col-sm-6"
                 v-for="(value, index) in 4"
                 :key="index">
              <div class="value-card">
                <div class="value-icon">
                  <i :class="valueIcons[index]"></i>
                </div>
                <h3>{{ $t(`aboutUs.value${index + 1}Title`) }}</h3>
                <p>{{ $t(`aboutUs.value${index + 1}Text`) }}</p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Impact Section -->
    <div class="impact-section py-4">
      <div class="container">
        <h2 class="text-start section-title mb-5 text-primary">
          {{ $t("aboutUs.ourImpact") }}
        </h2>
        <div class="row g-4">
          <!-- Show API data when available -->
          <template v-if="!impactLoading && impactList.length > 0">
            <div class="col-md-4" 
                 v-for="impact in impactList" 
                 :key="impact.id">
              <div class="impact-card">
                <div class="impact-image-wrapper mb-3" v-if="impact.image">
                  <img :src="impact.image" :alt="impact.title" class="impact-image">
                </div>
                <i v-else class="bi text-danger" :class="impact.icon || 'bi-heart-fill'"></i>
                <h3>{{ impact.title }}</h3>
                <p>{{ impact.description }}</p>
                <div class="impact-stats">
                  <div class="stat">
                    <h4>{{ impact.helped }}+</h4>
                    <p>{{ impact.caption }}</p>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- Fallback default content -->
          <template v-else>
            <div class="col-md-4">
              <div class="impact-card">
                <i class="bi text-danger bi-heart-fill"></i>
                <h3>{{ $t("aboutUs.purpose") }}</h3>
                <p>{{ $t("aboutUs.purposeText") }}</p>
                <div class="impact-stats">
                  <div class="stat">
                    <h4>100+</h4>
                    <p>{{ $t("aboutUs.familiesHelped") }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="impact-card">
                <i class="bi text-danger bi-people-fill"></i>
                <h3>{{ $t("aboutUs.community") }}</h3>
                <p>{{ $t("aboutUs.communityText") }}</p>
                <div class="impact-stats">
                  <div class="stat">
                    <h4>20+</h4>
                    <p>{{ $t("aboutUs.communitiesServed") }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="impact-card">
                <i class="bi text-danger bi-globe"></i>
                <h3>{{ $t("aboutUs.impact") }}</h3>
                <p>{{ $t("aboutUs.impactText") }}</p>
                <div class="impact-stats">
                  <div class="stat">
                    <h4>5+</h4>
                    <p>{{ $t("aboutUs.provincesReached") }}</p>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <TeamSection />

    <!-- Call to Action -->
    <div class="cta-section py-5">
      <div class="container text-center">
        <h2 class="mb-4">{{ $t("aboutUs.joinOurMission") }}</h2>
        <p class="mb-4">{{ $t("aboutUs.ctaText") }}</p>
        <router-link to="/contact-us" class="btn btn-primary btn-lg">
          {{ $t("aboutUs.contactUs") }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import TeamSection from './TeamSection.vue'
import { useImpact } from '../APIs/ImpactAPIs'
import { useCoreValues } from '../APIs/CoreValuesAPIs'
import { useVisionMission } from '../APIs/Vision-missionAPIs'
import { useAbout } from '../APIs/AboutAPIs'
import { useAboutHead } from '../APIs/AboutHeadAPIs'
import foundationWorkImage from '../assets/photos/foundation-work.png'

export default {
  name: "AboutUs",
  components: {
    TeamSection
  },
  setup() {
    const { impactList, loading: impactLoading, error: impactError } = useImpact()
    const { coreValuesList, loading: coreValuesLoading, error: coreValuesError } = useCoreValues()
    const { visionMission, loading: vmLoading, error: vmError } = useVisionMission()
    const { aboutData, loading: aboutLoading, error: aboutError } = useAbout()
    const { headData, loading: headLoading, error: headError } = useAboutHead()
    
    return {
      impactList,
      impactLoading,
      impactError,
      coreValuesList,
      coreValuesLoading,
      coreValuesError,
      visionMission,
      vmLoading,
      vmError,
      aboutData,
      aboutLoading,
      aboutError,
      foundationWorkImage,
      headData,
      headLoading,
      headError,
    }
  },
  data() {
    return {
      valueIcons: [
        "bi bi-heart-fill",
        "bi bi-people-fill",
        "bi bi-shield-fill-check",
        "bi bi-globe2",
      ],
    };
  },
};
</script>

<style scoped>
.hero-section {
  position: relative;
  width: 100vw;
  height: 60vh;
  background-size: cover;
  background-position: center;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
}

.stats-container {
  display: flex;
  justify-content: space-around;
  text-align: center;
}

.stat-item h3 {
  color: #ed207b;
  font-size: 2rem;
  font-weight: bold;
}
.text-danger{
  color: #ed207b !important;
}
.text-primary{
  color: #00adef !important;
}
.vision-card,
.mission-card,
.value-card,
.impact-card,
.team-card {
  padding: 0.5rem;
  border-radius: 15px;
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  height: 100%;
  transition: all 0.3s ease;
}

.card-icon {
  font-size: 2.5rem;
  color: #00adef;
  margin-bottom: 0.5rem;
}
.text-primary {
  color: #00adef !important;
}

.vision-list,
.mission-list {
  list-style: none;
  padding-left: 0;
  margin-top: 1rem;
}

.vision-list li,
.mission-list li {
  margin-bottom: 1rem;
  padding-left: 2rem;
  position: relative;
}

.vision-list li:before,
.mission-list li:before {
  content: "✓";
  color: #00adef;
  position: absolute;
  left: 0;
}

.value-card {
  text-align: center;
  padding: 2rem;
}

.value-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  overflow: hidden;
}

.value-icon i {
  font-size: 2rem;
  color: #ed207b;
}

.impact-card {
  text-align: center;
}

.impact-stats {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.team-card {
  text-align: center;
}

.team-image {
  width: 100%;
  border-radius: 15px;
  height: 300px;
  overflow: hidden;
}

.team-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.team-info {
  padding: 20px;
  text-align: center;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 15px;
}

.social-links a {
  color: #00adef;
  font-size: 1.5rem;
  transition: color 0.3s ease;
}

.social-links a:hover {
  color: white;
}

.btn-primary {
  background: white;
  color: #00adef;
  border: none;
  padding: 1rem 2rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(255, 255, 255, 0.3);
}

.vision-card:hover,
.mission-card:hover,
.value-card:hover,
.impact-card:hover,
.team-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .hero-section {
    height: 40vh;
  }

  .stats-container {
    flex-direction: column;
    gap: 2rem;
  }

  .value-card,
  .impact-card {
    margin-bottom: 2rem;
  }

  .team-image {
    width: 120px;
    height: 120px;
  }
}

/* Add these styles */
.team-slider {
  position: relative;
  overflow: hidden;
  padding: 0 40px;
}

.team-card {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  height: 100%;
  transition: transform 0.3s ease;
  position: relative;
}

.team-image {
  position: relative;
  width: 100%;
  height: 350px;
  overflow: hidden;
  background-color: #f8f9fa;
}

.team-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.social-links {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: 20px;
  display: flex;
  justify-content: center;
  gap: 15px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.team-card:hover .social-links {
  opacity: 1;
  transform: translateY(0);
}

.social-links a {
  color: white;
  font-size: 1.2rem;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.social-links a:hover {
  background: #00adef;
  transform: translateY(-3px);
}

.slider-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 45px;
  height: 45px;
  background: #00adef !important;
  border: none;
  border-radius: 50%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s ease;
}

.slider-nav i {
  color: white;
  font-size: 24px !important;
  display: flex;
  align-items: center;
  justify-content: end;
}

.slider-nav:hover {
  background: #ed207b;
  transform: translateY(-50%) scale(1.1);
}

.slider-nav.prev {
  left: 0;
}

.slider-nav.next {
  right: 0;
}

.team-cards-container {
  transition: transform 0.5s ease;
  width: 100%;
  overflow: visible;
}

.team-info {
  padding: 25px;
  text-align: left;
}

.team-info h3 {
  margin: 0 0 10px 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.team-description {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 15px;
}

.position-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.position-wrapper i {
  color: #00adef;
  font-size: 1.1rem;
}

.position-text {
  color: #666;
  font-size: 0.95rem;
}

/* Navigation styles */
.slider-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 2rem;
  color: #00adef;
  cursor: pointer;
  z-index: 2;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.slider-nav:hover {
  opacity: 1;
}

.slider-nav.prev {
  left: 5px;
}

.slider-nav.next {
  right: 5px;
}

/* Pagination dots */
.slider-pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 25px;
}

.pagination-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ddd;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: background-color 0.3s ease;
}

.pagination-dot.active {
  background: #00adef;
}

/* Vision & Mission Section Styles */
.vision-mission-section {
  background-color: #f8f9fa;
}

.vision-card,
.mission-card {
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

.impact-image-wrapper {
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
}

.impact-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
}

.value-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
}
</style>
