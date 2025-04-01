<template>
  <div class="blog-detail container my-4">
    <Hero />
    <!-- Hero Section with Cover Image -->
    <div class="hero position-relative mb-4">
      <img
        :src="newsDetail?.image || newsDetail?.coverImage"
        :alt="newsDetail?.title"
        class="cover-image rounded-3"
      />
      <div class="overlay position-absolute top-0 start-0 end-0 bottom-0 rounded-3"></div>
      <div class="hero-content position-absolute bottom-0 start-0 end-0 p-5">
        <div class="container">
          <div class="row">
            <div class="col-lg-12">
              <div class="category-badge mb-3 text-start">
                <span class="badge bg-primary text-uppercase">
                  {{ newsDetail?.category?.name || 'News' }}
                </span>
              </div>
              <h1 class="display-5 fw-bold text-white mb-3 text-start">
                {{ newsDetail?.title }}
              </h1>
              <AuthorProfile 
                :author="newsDetail?.author"
                :date="newsDetail?.createdAt || newsDetail?.date"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="row mb-4">
      <div class="col-lg-8">
        <div class="text-start">
          <!-- Description -->
          <p class="text-start">{{ newsDetail?.description }}</p>

          <!-- Image Gallery Grid -->
          <div class="mb-3" v-if="newsDetail?.images?.length">
            <div class="image-grid">
              <div
                v-for="(image, index) in newsDetail.images"
                :key="index"
                class="image-grid-item"
              >
                <div class="image-card">
                  <img
                    :src="typeof image === 'string' ? image : image.url"
                    :alt="typeof image === 'string' ? '' : image.caption"
                    class="grid-image"
                  />
                  <div class="image-overlay">
                    <p class="image-caption">
                      {{ typeof image === 'string' ? '' : image.caption }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="content mb-4">{{ newsDetail?.content }}</div>

          <!-- Tags -->
          <div class="tags d-flex flex-wrap" v-if="newsDetail?.tags">
            <h5 class="mb-3">{{ $t("newsCardDetail.contentSection.tags") }}:</h5>
            <span
              v-for="tag in parsedTags"
              :key="tag"
              class="tag badge bg-light text-primary me-2 mb-2 px-3 py-2"
            >
              #{{ tag }}
            </span>
          </div>

          <!-- Share Section -->
          <ShareSection 
            :title="newsDetail?.title"
            :description="newsDetail?.description"
            :url="currentUrl"
            :image="shareImage"
          />
        </div>
      </div>

      <!-- Sidebar -->
      <div class="col-lg-4">
        <div class="sidebar-widget bg-white p-4 mb-4 rounded-3 shadow-sm">
          <h4 class="widget-title mb-4 text-start">
            {{ $t("newsCardDetail.sidebar.categories") }}
          </h4>
          <ul class="categories-list list-unstyled">
            <li
              v-for="category in categories"
              :key="category.id"
              class="d-flex justify-content-between align-items-center mb-3"
            >
              <span>{{ category.name }}</span>
              <span class="badge bg-light text-primary">{{ category.count }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Related News Section -->
    <div class="container-fluid mt-5">
      <div class="row">
        <div class="col-12">
          <h3 class="text-start mb-4">
            {{ $t("newsCardDetail.relatedNews.title") }}
          </h3>
        </div>
      </div>
      <div class="row g-4">
        <div
          v-for="news in relatedNews"
          :key="news.news_id || news.id"
          class="col-12 col-md-4"
        >
          <NewsCard
            :news="{
              title: news.title,
              description: news.description,
              coverImage: news.image || news.coverImage,
              author: {
                name: news.author?.name || 'Admin',
                lastname: news.author?.lastname || '',
                profile_image: news.author?.profile_image || null
              },
              date: news.createdAt || news.date
            }"
            @click="navigateToNews(news.news_id || news.id)"
          />
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="navigation-buttons d-flex gap-3 my-3">
      <button @click="router.push('/news')" class="btn btn-primary">
        <i class="bi bi-arrow-left me-2"></i>
        {{ $t("newsCardDetail.navigationButtons.backToNews") }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useNewsContent, useNewsDetail } from '../../APIs/NewsAPIs';
import { newsData } from "../../data/News.js";
import Hero from "./Hero.vue";
import NewsCard from "./NewsCard.vue";
import ShareSection from '../Common/ShareSection.vue';
import AuthorProfile from '../Common/AuthorProfile.vue';

const router = useRouter();
const route = useRoute();

// Get news data from API with fallback to static data
const { newsList, categories } = useNewsContent();
const { newsDetail, loading, error, fetchNewsById } = useNewsDetail();

// Related news computation
const relatedNews = computed(() => {
  if (!newsDetail.value) return [];
  
  const currentCategory = newsDetail.value.category?.id;
  const currentTags = parsedTags.value;
  
  return (newsList.value || newsData)
    .filter(news => {
      if (news.news_id === newsDetail.value.news_id) return false;
      
      const sameCategory = news.category?.id === currentCategory;
      const hasSimilarTags = currentTags.some(tag => 
        news.tags?.includes(tag)
      );
      
      return sameCategory || hasSimilarTags;
    })
    .slice(0, 3);
});

// Parse tags from string to array
const parsedTags = computed(() => {
  if (!newsDetail.value?.tags) return [];
  return typeof newsDetail.value.tags === 'string' 
    ? newsDetail.value.tags.split(',').map(tag => tag.trim())
    : newsDetail.value.tags;
});

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const navigateToNews = (id) => {
  router.push(`/news/${id}`);
  window.scrollTo(0, 0);
};

// Computed property for current URL
const currentUrl = computed(() => window.location.href);

// Computed property for share image
const shareImage = computed(() => {
  if (!newsDetail.value?.image) return null;
  return newsDetail.value.image.startsWith('http') 
    ? newsDetail.value.image 
    : `${window.location.origin}${newsDetail.value.image}`;
});

// Watch for route changes
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await fetchNewsById(newId);
    }
  }
);

onMounted(async () => {
  if (route.params.id) {
    await fetchNewsById(route.params.id);
  }
});
</script>

<style scoped>
/* Keep existing styles and add these updates */
.hero {
  height: 400px !important;
  min-height: auto !important;
  max-height: 400px !important;
}

.cover-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.image-grid-item {
  position: relative;
  width: 100%;
  height: 100%;
}

.image-card {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.grid-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  padding: 1rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.image-card:hover .image-overlay {
  transform: translateY(0);
}

.image-card:hover .grid-image {
  transform: scale(1.05);
}

.bg-primary {
  background-color: #00adef !important;
}

.btn-primary {
  background-color: #00adef !important;
}

.text-primary {
  color: #00adef !important;
}

.image-caption {
  color: white;
  margin: 0;
  font-size: 0.9rem;
  text-align: center;
}

.sidebar-widget {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.widget-title::after {
  content: "";
  display: block;
  width: 50px;
  height: 3px;
  background: #00adef;
  margin-top: 8px;
}

/* Responsive styles */
@media (max-width: 768px) {
  .hero {
    height: 300px !important;
  }

  .cover-image {
    height: 300px;
  }

  .image-grid {
    grid-template-columns: 1fr;
  }

  .image-card {
    height: 200px;
  }
}

.author-profile {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.2);
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-profile i {
  font-size: 1.2rem;
  color: white;
}

.metadata {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
}

.metadata span {
  display: flex;
  align-items: center;
}
</style>
