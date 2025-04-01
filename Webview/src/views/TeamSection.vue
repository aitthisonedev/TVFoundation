<template>
  <div class="team-section py-5">
    <div class="container">
      <h2 class="text-center text-primary section-title mb-5">
        {{ $t("aboutUs.ourTeam") }}
      </h2>
      <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-else-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>
      <div v-else class="team-slider position-relative">
        <!-- Navigation Buttons -->
        <button
          class="slider-nav prev"
          @click="prevSlide"
          v-if="currentSlide > 0"
        >
          <i class="bi bi-arrow-left-circle-fill"></i>
        </button>
        <button
          class="slider-nav next"
          @click="nextSlide"
          v-if="currentSlide < maxSlide"
        >
          <i class="bi bi-arrow-right-circle-fill"></i>
        </button>

        <div
          class="team-cards-container"
          :style="{ transform: `translateX(-${currentSlide * 33.333}%)` }"
        >
          <div class="row g-4 flex-nowrap">
            <div
              class="col-md-4"
              v-for="team in teamList"
              :key="team.id"
            >
              <div class="team-card">
                <div class="team-image">
                  <img
                    :src="team.image"
                    :alt="team.name"
                  />
                  <div class="social-links">
                    <a
                      :href="team.facebook"
                      target="_blank"
                      v-if="team.facebook"
                    >
                      <i class="bi bi-facebook"></i>
                    </a>
                    <a
                      :href="team.whatsapp"
                      target="_blank"
                      v-if="team.whatsapp"
                    >
                      <i class="bi bi-whatsapp"></i>
                    </a>
                    <a :href="team.phone" target="_blank" v-if="team.phone">
                      <i class="bi bi-line"></i>
                    </a>
                  </div>
                </div>
                <div class="team-info">
                  <h4>{{ team.name }}</h4>
                  <div class="position-wrapper">
                    <span class="position-text">{{ team.position }}</span>
                  </div>
                  <div class="position-wrapper">
                    <span class="position-text">{{ team.description }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination Dots -->
        <div class="slider-pagination">
          <button
            v-for="n in maxSlide + 1"
            :key="n"
            @click="goToSlide(n - 1)"
            :class="['pagination-dot', { active: currentSlide === n - 1 }]"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useTeamData } from '@/APIs/TeamAPIs';

export default {
  name: "TeamSection",
  setup() {
    const { teamList, loading, error } = useTeamData();
    return { teamList, loading, error };
  },
  data() {
    return {
      currentSlide: 0,
    };
  },
  computed: {
    maxSlide() {
      return Math.max(0, Math.ceil(this.teamList.length / 3) - 1);
    },
  },
  methods: {
    prevSlide() {
      if (this.currentSlide > 0) {
        this.currentSlide--;
      }
    },
    nextSlide() {
      if (this.currentSlide < this.maxSlide) {
        this.currentSlide++;
      }
    },
    goToSlide(index) {
      this.currentSlide = index;
    },
  },
};
</script>

<style scoped>
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
}

.slider-nav:hover {
  background: #ed207b !important;
  transform: translateY(-50%) scale(1.1);
}

.slider-nav.prev { left: 0; }
.slider-nav.next { right: 0; }

.team-cards-container {
  transition: transform 0.5s ease;
  width: 100%;
  overflow: visible;
}
.text-primary{
  color: #00adef !important;
}
.team-info {
  padding: 25px;
  text-align: left;
}

.team-info h4 {
  margin: 0 0 10px 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.position-wrapper {
  display: flex;
  align-items: center;
  margin-top: 10px;
  gap: 8px;
}

.position-text {
  color: #666;
  font-size: 0.95rem;
}

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

@media (max-width: 768px) {
  .team-image {
    width: 120px;
    height: 120px;
  }
}
</style>