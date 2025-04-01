<template>
  <div class="news-card" @click="$emit('click')">
    <div class="news-image-container">
      <img
        :src="news.image || news.coverImage"
        :alt="news.title"
        class="news-image"
        @error="handleImageError"
      />
      <div class="image-overlay"></div>
    </div>
    <div class="news-content">
      <h3 class="text-start">{{ truncateTitle(news.title) }}</h3>
      <p class="news-description text-start">
        {{ truncateDescription(news.description) }}
      </p>
      <AuthorProfile
        :author="news.author"
        :date="news.createdAt || news.date"
      />
      <p class="news-date text-end p-0 m-0">{{ formatDate(news.date) }}</p>
    </div>
  </div>
</template>

<script setup>
import defaultAvatar from "../../assets/Teams/image.png";
import AuthorProfile from "../Common/AuthorProfile.vue";

const apiUrl = import.meta.env.VITE_API_URL;

const props = defineProps({
  news: {
    type: Object,
    required: true,
  },
});

console.log('News data:', props.news);
console.log('Author:', props.news.author);

const handleImageError = (event) => {
  event.target.src = defaultAvatar;
};

const formatDate = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString(undefined, options);
};

const truncateTitle = (title) => {
  if (!title) return "";
  return (
    title.split(" ").slice(0, 3).join(" ") +
    (title.split(" ").length > 3 ? "..." : "")
  );
};

const truncateDescription = (description) => {
  if (!description) return "";
  return (
    description.split(" ").slice(0, 10).join(" ") +
    (description.split(" ").length > 10 ? "..." : "")
  );
};
</script>

<style scoped>
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

/* Hover Effects */
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

.text-start {
  text-align: left;
}

.news-content h3 {
  font-size: 20px;
  color: #00adef;
  transition: color 0.3s ease;
}

.news-date {
  color: #ed207b;
  font-size: 0.9rem;
}

.news-description {
  font-size: 0.9rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-author {
  color: #00adef;
  font-size: 0.9rem;
}
.text-primary {
  color: #00adef !important;
}

/* Add these new styles for author profile */
.author-profile {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
}

.profile-image {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 0.9rem;
  color: #00adef;
  font-weight: 500;
}

.bi-person-fill {
  font-size: 1.2rem;
}
</style>
