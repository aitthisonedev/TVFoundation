<template>
  <!-- Hero Section -->
  <div class="news container">
    <Hero />
    <h2 class="text-start text-primary my-4">{{ $t('news.pageTitle') }}</h2>
    <p class="text-start my-4">
      {{ $t('news.pageDescription') }}
    </p>

    <!-- News Cards Section -->
    <div class="news-container">
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else>
        <div class="news-grid">
          <NewsCard
            v-for="news in paginatedNews"
            :key="news.news_id || news.id"
            :news="{
              title: news.title,
              description: news.description,
              coverImage: news.image || news.coverImage,
              author: news.author,
              date: news.createdAt || news.date
            }"
            @click="goToDetail(news.news_id || news.id)"
          />
        </div>

        <div v-if="paginatedNews.length === 0" class="text-center py-5">
          {{ $t('news.noNews') }}
        </div>

        <Pagination
          v-model="currentPage"
          :total-pages="totalPages"
        />
      </div>
    </div>
    
    <div class="partner-logo mt-5">
      <PartnerLogo />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import NewsCard from "../components/News/NewsCard.vue";
import { newsData } from "../data/News.js";
import Hero from "../components/News/Hero.vue";
import PartnerLogo from "./PartnerLogo.vue";
import Pagination from "../components/Common/Pagination.vue";
import { useNewsContent } from '../APIs/NewsAPIs';

const router = useRouter();
const { locale } = useI18n();
const currentPage = ref(1);
const itemsPerPage = ref(6);
const newsItems = ref([]);
const isLoading = ref(true);
const apiUrl = import.meta.env.VITE_API_URL;

// Get news from API
const { newsList, categories } = useNewsContent();

// Add this function to properly format author data
const formatAuthorData = (news) => {
  if (!news.author) return { name: 'Admin', lastname: '', profile_image: null };
  return {
    name: news.author.name || 'Admin',
    lastname: news.author.lastname || '',
    profile_image: news.author.profile_image // Use the profile_image directly
  };
};

// Watch for language changes
watch(locale, async () => {
  isLoading.value = true;
  try {
    // Reset to first page when language changes
    currentPage.value = 1;
    
    // Wait for API to update with new language
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (newsList.value && newsList.value.length > 0) {
      newsItems.value = newsList.value;
    } else {
      console.log('Falling back to static news data');
      // Transform static data based on current locale
      newsItems.value = newsData.map(news => ({
        ...news,
        title: locale.value === 'lo' ? news.title_lo || news.title : news.title,
        description: locale.value === 'lo' ? news.description_lo || news.description : news.description,
        author: locale.value === 'lo' ? news.author_lo || news.author : news.author,
      }));
    }
  } catch (error) {
    console.error('Error updating news with new language:', error);
    newsItems.value = newsData;
  } finally {
    isLoading.value = false;
  }
});

// Watch for API data updates
watch(newsList, (newValue) => {
  if (newValue && newValue.length > 0) {
    newsItems.value = newValue.map(news => ({
      ...news,
      author: formatAuthorData(news)
    }));
  }
});

const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return newsItems.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(newsItems.value.length / itemsPerPage.value);
});

const goToDetail = (id) => {
  router.push(`/news/${id}`);
};

// Initial data load
onMounted(async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (newsList.value && newsList.value.length > 0) {
      newsItems.value = newsList.value.map(news => ({
        ...news,
        author: formatAuthorData(news)
      }));
    } else {
      newsItems.value = newsData.map(news => ({
        ...news,
        title: locale.value === 'lo' ? news.title_lo || news.title : news.title,
        description: locale.value === 'lo' ? news.description_lo || news.description : news.description,
        author: formatAuthorData(news)
      }));
    }
  } catch (error) {
    console.error('Error loading news:', error);
    newsItems.value = newsData.map(news => ({
      ...news,
      author: formatAuthorData(news)
    }));
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.news {
  width: 100%;
}

.hero-section {
  height: 400px;
  background: linear-gradient(rgba(45, 118, 187, 0.8), rgba(211, 43, 43, 0.8)),
    url("/path/to/your/hero-image.jpg") center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  margin-bottom: 2rem;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero-content p {
  font-size: 1.2rem;
}

.text-primary {
  color: #00adef !important;
}

.news-container {
  max-width: 1400px;
  margin: 0 auto;
}

.partner-logo {
  position: relative;
  width: 100vw;
  height: auto;
  margin-top: 20px;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
}

.news-grid {
  display: grid;
  gap: 2rem;
  margin-bottom: 2rem;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .news-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .news-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .news-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-section {
    height: 300px;
  }

  .hero-content h1 {
    font-size: 2rem;
  }

  .hero-content p {
    font-size: 1rem;
  }
}

@media (max-width: 640px) {
  .news-container {
    padding: 0 0.5rem;
  }
}
</style>
