<template>
  <div class="metadata text-white text-start">
    <span class="me-4 d-flex align-items-center">
      <div class="author-profile me-3">
        <img 
          :src="authorImage" 
          :alt="authorName"
          class="profile-image rounded-circle"
          @error="handleImageError"
        />
      </div>
      <span class="text-primary d-flex align-items-start">{{ authorName }}</span>
    </span>
    <span>
      <i class="bi bi-calendar3 me-2"></i>
      {{ formatDate(date) }}
    </span>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import defaultAvatar from "../../assets/Teams/image.png";

const imageError = ref(false);

const props = defineProps({
  author: {
    type: Object,
    required: true
  },
  date: {
    type: String,
    required: true
  }
});

// Debug logs
onMounted(() => {
  console.log('Author Profile Props:', {
    author: props.author,
    date: props.date
  });
});

watch(() => props.author, (newAuthor) => {
  console.log('Author Profile Updated:', newAuthor);
  // Reset error state when author changes
  imageError.value = false;
}, { deep: true });

const authorImage = computed(() => {
  console.log('Computing author image:', {
    author: props.author?.name,
    has_profile_image: !!props.author?.profile_image,
    image_type: props.author?.profile_image?.startsWith('data:') ? 'base64' :
               props.author?.profile_image?.startsWith('http') ? 'url' : 'none'
  });
  
  // If no profile image or error occurred, use default avatar
  if (!props.author?.profile_image || imageError.value) {
    console.log('Using default avatar');
    return defaultAvatar;
  }

  // The profile_image should already be properly formatted from the API
  // It will either be a base64 string or a full URL
  return props.author.profile_image;
});

const authorName = computed(() => {
  if (props.author?.name) {
    return `${props.author.name}`.trim();
  }
  return 'Admin';
});

const handleImageError = () => {
  console.log('Image load error, using default avatar');
  imageError.value = true;
};

const formatDate = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString(undefined, options);
};
</script>

<style scoped>
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
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rounded-circle {
  border-radius: 50%;
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

.text-primary {
  color: #00adef !important;
}

/* Loading spinner styles */
.spinner-border {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}
</style> 