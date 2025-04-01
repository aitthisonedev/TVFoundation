import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";
import defaultAvatar from "../assets/Teams/image.png";

export function useNewsContent() {
  const { locale } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;
  const newsList = ref([]);
  const categories = ref([]);
  const loading = ref(false);

  const fetchNewsContent = async () => {
    loading.value = true;
    try {
      // First fetch all news
      const newsResponse = await axios.get(`${apiUrl}/api/news`);
      console.log('News Response:', newsResponse.data);
      
      // Get unique user IDs from news items
      const userIds = [...new Set(newsResponse.data
        .filter(item => item.userId)
        .map(item => item.userId))];
      console.log('Unique User IDs:', userIds);

      // Fetch user profiles for all authors
      const userProfiles = await Promise.all(
        userIds.map(async id => {
          try {
            const res = await axios.get(`${apiUrl}/api/users/getById/${id}`);
            console.log(`User Profile for ID ${id}:`, {
              ...res.data,
              profile_image: res.data.profile_image?.substring(0, 50) + '...' // Truncate for logging
            });
            
            let profileImage = null;
            if (res.data.profile_image) {
              // If it's a base64 image, use it directly
              if (res.data.profile_image.startsWith('data:')) {
                profileImage = res.data.profile_image;
              }
              // If it's a regular image path, construct the URL
              else {
                profileImage = `${apiUrl}/ImageUpload/profile/${res.data.profile_image}`;
              }
            }

            return {
              id: res.data.id,
              name: res.data.name,
              lastname: res.data.lastname,
              profile_image: profileImage
            };
          } catch (error) {
            console.error(`Error fetching user ${id}:`, error);
            return null;
          }
        })
      );

      // Create a map of user profiles by ID
      const userMap = new Map(
        userProfiles
          .filter(profile => profile)
          .map(profile => [profile.id, profile])
      );

      // Log user map with truncated image data
      console.log('User Map:', Object.fromEntries(
        Array.from(userMap.entries()).map(([id, profile]) => [
          id,
          {
            ...profile,
            profile_image: profile.profile_image?.substring(0, 50) + '...'
          }
        ])
      ));

      if (newsResponse.data) {
        newsList.value = newsResponse.data.map((newsItem) => {
          // Get the matching user profile
          const userProfile = userMap.get(newsItem.userId);
          console.log(`Matching user for news ${newsItem.news_id}:`, {
            userId: newsItem.userId,
            userProfile
          });
          
          return {
            news_id: newsItem.news_id,
            userId: newsItem.userId,
            title: locale.value === "en" ? newsItem.name_en : newsItem.name_lo,
            description: locale.value === "en" ? newsItem.description_en : newsItem.description_lo,
            content: locale.value === "en" ? newsItem.content_en : newsItem.content_lo,
            location: locale.value === "en" ? newsItem.location_en : newsItem.location_lo,
            caption: locale.value === "en" ? newsItem.caption_en : newsItem.caption_lo,
            tags: locale.value === "en" ? newsItem.tags_en : newsItem.tags_lo,
            image: newsItem.image ? `${apiUrl}/ImageUpload/${newsItem.image}` : null,
            coverImage: newsItem.image ? `${apiUrl}/ImageUpload/${newsItem.image}` : null,
            images: newsItem.images?.map(img => `${apiUrl}/ImageUpload/${img}`) || [],
            category: newsItem.category ? {
              id: newsItem.category.id,
              name: locale.value === "en" ? newsItem.category.name_en : newsItem.category.name_lo
            } : null,
            author: userProfile ? {
              id: userProfile.id,
              name: userProfile.name,
              lastname: userProfile.lastname,
              profile_image: userProfile.profile_image
            } : {
              id: newsItem.userId || null,
              name: 'Admin',
              lastname: '',
              profile_image: null
            },
            createdAt: newsItem.createdAt,
            date: newsItem.createdAt,
            updatedAt: newsItem.updatedAt
          };
        });

        // Process categories
        const categoryMap = new Map();
        newsResponse.data.forEach((newsItem) => {
          if (newsItem.category) {
            const categoryId = newsItem.category.id;
            if (!categoryMap.has(categoryId)) {
              categoryMap.set(categoryId, {
                id: categoryId,
                name: locale.value === "en" ? newsItem.category.name_en : newsItem.category.name_lo,
                image: newsItem.category.image ? `${apiUrl}/ImageUpload/${newsItem.category.image}` : null,
                count: 0
              });
            }
            categoryMap.get(categoryId).count++;
          }
        });

        categories.value = Array.from(categoryMap.values());
      }
    } catch (error) {
      console.error("Error fetching news content:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchNewsContent();
  });

  watch(locale, () => {
    fetchNewsContent();
  });

  return { newsList, categories, loading };
}

export function useNewsDetail() {
  const { locale } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;
  const newsDetail = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchNewsById = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${apiUrl}/api/news/${id}`);
      if (response.data) {
        newsDetail.value = {
          news_id: response.data.news_id,
          userId: response.data.userId,
          title: locale.value === "en" ? response.data.name_en : response.data.name_lo,
          description: locale.value === "en" ? response.data.description_en : response.data.description_lo,
          content: locale.value === "en" ? response.data.content_en : response.data.content_lo,
          location: locale.value === "en" ? response.data.location_en : response.data.location_lo,
          caption: locale.value === "en" ? response.data.caption_en : response.data.caption_lo,
          tags: locale.value === "en" ? response.data.tags_en : response.data.tags_lo,
          image: response.data.image ? `${apiUrl}/ImageUpload/${response.data.image}` : null,
          coverImage: response.data.image ? `${apiUrl}/ImageUpload/${response.data.image}` : null,
          images: response.data.images?.map(img => `${apiUrl}/ImageUpload/${img}`) || [],
          category: response.data.category ? {
            id: response.data.category.id,
            name: locale.value === "en" ? response.data.category.name_en : response.data.category.name_lo
          } : null,
          author: response.data.author ? {
            id: response.data.userId,
            name: response.data.author.name,
            lastname: response.data.author.lastname,
            profile_image: response.data.author.profile_image ? 
              `${apiUrl}/ImageUpload/${response.data.author.profile_image}` : null
          } : null,
          createdAt: response.data.createdAt,
          date: response.data.createdAt,
          updatedAt: response.data.updatedAt
        };
      }
    } catch (err) {
      error.value = err;
      console.error('Error fetching news detail:', err);
    } finally {
      loading.value = false;
    }
  };

  // Watch for language changes
  watch(locale, () => {
    if (newsDetail.value?.news_id) {
      fetchNewsById(newsDetail.value.news_id);
    }
  });

  return {
    newsDetail,
    loading,
    error,
    fetchNewsById
  };
}

// Search functionality
export function useNewsSearch() {
  const { locale } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;
  const searchResults = ref([]);
  const isSearching = ref(false);
  const searchError = ref(null);

  const searchNews = async (query) => {
    if (!query?.trim()) {
      searchResults.value = [];
      return;
    }
    
    isSearching.value = true;
    searchError.value = null;

    try {
      const response = await axios.get(`${apiUrl}/api/news/search`, {
        params: { query }
      });

      searchResults.value = response.data.map(item => ({
        news_id: item.news_id,
        title: locale.value === "en" ? item.name_en : item.name_lo,
        description: locale.value === "en" ? item.description_en : item.description_lo,
        image: item.image ? `${apiUrl}/ImageUpload/${item.image}` : null,
        category: item.category ? {
          id: item.category.id,
          name: locale.value === "en" ? item.category.name_en : item.category.name_lo
        } : null,
        createdAt: item.createdAt
      }));

      return searchResults.value;
    } catch (error) {
      console.error("Error searching news:", error);
      searchError.value = error;
      throw error;
    } finally {
      isSearching.value = false;
    }
  };

  return {
    searchResults,
    isSearching,
    searchError,
    searchNews
  };
}

export function getProfile() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const profile = ref({
    name: "",
    lastname: "",
    email: "",
    phone: "",
    profile_image: "",
    blog_description_en: "",
    blog_description_lo: "",
  });
  const errorMessage = ref("");

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/api/users/getProfile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      profile.value = response.data;
    } catch (error) {
      errorMessage.value = "Failed to fetch profile.";
      console.error("Fetch profile error", error);
    }
  };

  return { profile, fetchProfile, errorMessage };
} 