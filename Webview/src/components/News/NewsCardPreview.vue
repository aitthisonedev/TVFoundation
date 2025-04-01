<template>
  <section class="news-section py-5">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4 slide-from-left">
        <h2 class="text-primary">{{ $t("home.latestNews") }}</h2>
        <router-link :to="{ name: 'news' }" class="btn btn-link text-primary">
          {{ $t("home.viewAll") }}
          <i class="fas fa-arrow-right"></i>
        </router-link>
      </div>
      <div class="row">
        <div class="col-md-4 slide-from-bottom" v-for="(news, index) in latestNews" :key="index"
             :style="{ transitionDelay: index * 0.2 + 's' }">
          <NewsCard 
            :news="{
              title: news.title || news.name_en,
              description: news.description || news.description_en,
              coverImage: getImageUrl(news),
              author: news.author,
              userId: news.userId,
              createdAt: news.createdAt,
              date: news.date
            }" 
            @click="goToNewsDetail(news.news_id || news.id)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import NewsCard from './NewsCard.vue';
import AuthorProfile from '../Common/AuthorProfile.vue';
import { newsData } from '../../data/News';
import { useNewsContent } from '../../APIs/NewsAPIs';
import defaultAvatar from "../../assets/Teams/image.png";

const router = useRouter();
const { locale } = useI18n();
const apiUrl = import.meta.env.VITE_API_URL;
const { newsList } = useNewsContent();

const getImageUrl = (news) => {
  if (news.image && typeof news.image === 'string') {
    return news.image.startsWith('http') ? 
      news.image : 
      `${apiUrl}/ImageUpload/${news.image}`;
  }
  return news.coverImage || '/images/news-placeholder.jpg';
};

const handleImageError = (event) => {
  event.target.src = defaultAvatar;
};

const truncateTitle = (title) => {
  if (!title) return "";
  return title.split(" ").slice(0, 3).join(" ") + 
    (title.split(" ").length > 3 ? "..." : "");
};

const truncateDescription = (description) => {
  if (!description) return "";
  return description.split(" ").slice(0, 10).join(" ") + 
    (description.split(" ").length > 10 ? "..." : "");
};

const latestNews = computed(() => {
  if (newsList.value && newsList.value.length > 0) {
    return newsList.value.slice(0, 3);
  }
  return newsData.slice(0, 3);
});

const goToNewsDetail = (id) => {
  router.push(`/news/${id}`);
};

const formatAuthorData = (author) => {
  if (!author) return { name: 'Admin', lastname: '', profile_image: null };
  return {
    name: author.name || 'Admin',
    lastname: author.lastname || '',
    profile_image: author.profile_image ? 
      `${apiUrl}/ImageUpload/${author.profile_image}` : null
  };
};
</script>

<style scoped>
.news-section {
  background-color: #f8f9fa;
}

.news-section h2 {
  color: #00adef;
  font-weight: 600;
}

.text-primary {
  color: #00adef !important;
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

.news-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(0);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 173, 239, 0.2);
}

.news-image-container {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.news-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease, filter 0.5s ease;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 173, 239, 0.2);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.news-card:hover .news-image {
  transform: scale(1.1);
  filter: brightness(0.9);
}

.news-card:hover .image-overlay {
  opacity: 1;
}

.news-content {
  padding: 1rem;
}

.news-content h3 {
  font-size: 20px;
  color: #00adef;
  margin-bottom: 0.5rem;
}

.news-description {
  font-size: 0.9rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 1rem;
}

.slide-from-left {
  opacity: 0;
  transform: translateX(-100px);
  transition: all 0.8s ease-out;
}

.slide-from-bottom {
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s ease-out;
}

.slide-from-left.visible,
.slide-from-bottom.visible {
  opacity: 1;
  transform: translate(0);
}

[style*="transition-delay"] {
  transition-property: all;
  transition-duration: 0.8s;
  transition-timing-function: ease-out;
}
</style> 