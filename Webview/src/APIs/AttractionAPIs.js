import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";

export function useAttractionCategories() {
  const { locale } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;
  const categories = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchCategories = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${apiUrl}/api/tourist-attraction-categories`);
      if (response.data) {
        categories.value = response.data.map((category) => ({
          id: category.id,
          name: locale.value === "en" ? category.name_en : category.name_lo,
          image: category.image,
          createdAt: new Date(category.createdAt).toLocaleDateString(),
          raw: {
            name_en: category.name_en,
            name_lo: category.name_lo,
          }
        }));
      }
    } catch (err) {
      console.error("Error fetching attraction categories:", err);
      error.value = "Failed to fetch categories";
    } finally {
      loading.value = false;
    }
  };

  const refreshCategories = () => {
    fetchCategories();
  };

  watch(locale, () => {
    fetchCategories();
  });

  onMounted(() => {
    fetchCategories();
  });

  return {
    categories,
    loading,
    error,
    refreshCategories
  };
}

export function useAttractions() {
  const { locale } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;
  const attractions = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchAttractions = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${apiUrl}/api/tourist-attractions`);
      if (response.data) {
        attractions.value = response.data.map((attraction) => ({
          id: attraction.attraction_id,
          name: locale.value === "en" ? attraction.name_en : attraction.name_lo,
          name_en: attraction.name_en,
          name_lo: attraction.name_lo,
          description: locale.value === "en" ? attraction.description_en : attraction.description_lo,
          description_en: attraction.description_en,
          description_lo: attraction.description_lo,
          location: locale.value === "en" ? attraction.location_en : attraction.location_lo,
          location_en: attraction.location_en,
          location_lo: attraction.location_lo,
          duration: locale.value === "en" ? attraction.Duration_en : attraction.Duration_lo,
          duration_en: attraction.Duration_en,
          duration_lo: attraction.Duration_lo,
          groupSize: locale.value === "en" ? attraction.GroupSize_en : attraction.GroupSize_lo,
          groupSize_en: attraction.GroupSize_en,
          groupSize_lo: attraction.GroupSize_lo,
          language: locale.value === "en" ? attraction.language_en : attraction.language_lo,
          language_en: attraction.language_en,
          language_lo: attraction.language_lo,
          available: locale.value === "en" ? attraction.Available_en : attraction.Available_lo,
          available_en: attraction.Available_en,
          available_lo: attraction.Available_lo,
          category_id: attraction.category_id,
          image: attraction.image,
          images: attraction.images,
          category: {
            id: attraction.category.id,
            name: locale.value === "en" ? attraction.category.name_en : attraction.category.name_lo,
            name_en: attraction.category.name_en,
            name_lo: attraction.category.name_lo,
            image: attraction.category.image
          },
          content: locale.value === "en" ? attraction.content_en : attraction.content_lo,
          content_en: attraction.content_en,
          content_lo: attraction.content_lo,
          ExpectOne: locale.value === "en" ? attraction.ExpectOne_en : attraction.ExpectOne_lo,
          ExpectOne_en: attraction.ExpectOne_en,
          ExpectOne_lo: attraction.ExpectOne_lo,
          ExpectTwo: locale.value === "en" ? attraction.ExpectTwo_en : attraction.ExpectTwo_lo,
          ExpectTwo_en: attraction.ExpectTwo_en,
          ExpectTwo_lo: attraction.ExpectTwo_lo,
          ExpectThree: locale.value === "en" ? attraction.ExpectThree_en : attraction.ExpectThree_lo,
          ExpectThree_en: attraction.ExpectThree_en,
          ExpectThree_lo: attraction.ExpectThree_lo,
        }));
      }
    } catch (err) {
      console.error("Error fetching attractions:", err);
      error.value = "Failed to fetch attractions";
    } finally {
      loading.value = false;
    }
  };

  const refreshAttractions = () => {
    fetchAttractions();
  };

  watch(locale, () => {
    fetchAttractions();
  });

  onMounted(() => {
    fetchAttractions();
  });

  return {
    attractions,
    loading,
    error,
    refreshAttractions
  };
}

export function useAttractionDetail() {
  const { locale } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;
  const attraction = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchAttractionById = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${apiUrl}/api/tourist-attractions/${id}`);
      if (response.data) {
        attraction.value = {
          id: response.data.attraction_id,
          name: locale.value === "en" ? response.data.name_en : response.data.name_lo,
          name_en: response.data.name_en,
          name_lo: response.data.name_lo,
          description: locale.value === "en" ? response.data.description_en : response.data.description_lo,
          description_en: response.data.description_en,
          description_lo: response.data.description_lo,
          location: locale.value === "en" ? response.data.location_en : response.data.location_lo,
          location_en: response.data.location_en,
          location_lo: response.data.location_lo,
          duration: locale.value === "en" ? response.data.Duration_en : response.data.Duration_lo,
          duration_en: response.data.Duration_en,
          duration_lo: response.data.Duration_lo,
          groupSize: locale.value === "en" ? response.data.GroupSize_en : response.data.GroupSize_lo,
          groupSize_en: response.data.GroupSize_en,
          groupSize_lo: response.data.GroupSize_lo,
          language: locale.value === "en" ? response.data.language_en : response.data.language_lo,
          language_en: response.data.language_en,
          language_lo: response.data.language_lo,
          available: locale.value === "en" ? response.data.Available_en : response.data.Available_lo,
          available_en: response.data.Available_en,
          available_lo: response.data.Available_lo,
          category_id: response.data.category_id,
          image: response.data.image,
          images: response.data.images || [],
          category: {
            id: response.data.category?.id,
            name: locale.value === "en" ? response.data.category?.name_en : response.data.category?.name_lo,
            name_en: response.data.category?.name_en,
            name_lo: response.data.category?.name_lo,
            image: response.data.category?.image
          },
          content: locale.value === "en" ? response.data.content_en : response.data.content_lo,
          content_en: response.data.content_en,
          content_lo: response.data.content_lo,
          ExpectOne: locale.value === "en" ? response.data.ExpectOne_en : response.data.ExpectOne_lo,
          ExpectOne_en: response.data.ExpectOne_en,
          ExpectOne_lo: response.data.ExpectOne_lo,
          ExpectTwo: locale.value === "en" ? response.data.ExpectTwo_en : response.data.ExpectTwo_lo,
          ExpectTwo_en: response.data.ExpectTwo_en,
          ExpectTwo_lo: response.data.ExpectTwo_lo,
          ExpectThree: locale.value === "en" ? response.data.ExpectThree_en : response.data.ExpectThree_lo,
          ExpectThree_en: response.data.ExpectThree_en,
          ExpectThree_lo: response.data.ExpectThree_lo,
        };
      }
    } catch (err) {
      console.error("Error fetching attraction:", err);
      error.value = "Failed to fetch attraction details";
    } finally {
      loading.value = false;
    }
  };

  watch(locale, () => {
    if (attraction.value) {
      attraction.value = {
        ...attraction.value,
        name: locale.value === "en" ? attraction.value.name_en : attraction.value.name_lo,
        description: locale.value === "en" ? attraction.value.description_en : attraction.value.description_lo,
        location: locale.value === "en" ? attraction.value.location_en : attraction.value.location_lo,
        duration: locale.value === "en" ? attraction.value.duration_en : attraction.value.duration_lo,
        groupSize: locale.value === "en" ? attraction.value.groupSize_en : attraction.value.groupSize_lo,
        language: locale.value === "en" ? attraction.value.language_en : attraction.value.language_lo,
        available: locale.value === "en" ? attraction.value.available_en : attraction.value.available_lo,
        category: {
          ...attraction.value.category,
          name: locale.value === "en" ? attraction.value.category.name_en : attraction.value.category.name_lo,
        },
        content: locale.value === "en" ? attraction.value.content_en : attraction.value.content_lo,
        ExpectOne: locale.value === "en" ? attraction.value.ExpectOne_en : attraction.value.ExpectOne_lo,
        ExpectTwo: locale.value === "en" ? attraction.value.ExpectTwo_en : attraction.value.ExpectTwo_lo,
        ExpectThree: locale.value === "en" ? attraction.value.ExpectThree_en : attraction.value.ExpectThree_lo,
      };
    }
  });

  return {
    attraction,
    loading,
    error,
    fetchAttractionById
  };
}

export function useAttractionAds() {
  const { locale } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;
  const ads = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchAds = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${apiUrl}/api/tourist-attraction-ads`);
      if (response.data) {
        ads.value = response.data.map((ad) => ({
          id: ad.id,
          name: locale.value === "en" ? ad.name_en : ad.name_lo,
          image: ad.image,
          createdAt: new Date(ad.createdAt).toLocaleDateString(),
          raw: {
            name_en: ad.name_en,
            name_lo: ad.name_lo,
          }
        }));
      }
    } catch (err) {
      console.error("Error fetching attraction ads:", err);
      error.value = "Failed to fetch ads";
    } finally {
      loading.value = false;
    }
  };

  const refreshAds = () => {
    fetchAds();
  };

  watch(locale, () => {
    fetchAds();
  });

  onMounted(() => {
    fetchAds();
  });

  return {
    ads,
    loading,
    error,
    refreshAds
  };
}

export function useAttractionSlides() {
  const { locale } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;
  const slides = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchSlides = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${apiUrl}/api/tourist-attraction-slides`);
      if (response.data) {
        slides.value = response.data.map((slide) => ({
          id: slide.id,
          name: locale.value === "en" ? slide.name_en : slide.name_lo,
          image: slide.image,
          createdAt: new Date(slide.createdAt).toLocaleDateString(),
          raw: {
            name_en: slide.name_en,
            name_lo: slide.name_lo,
          }
        }));
      }
    } catch (err) {
      console.error("Error fetching attraction slides:", err);
      error.value = "Failed to fetch slides";
    } finally {
      loading.value = false;
    }
  };

  const refreshSlides = () => {
    fetchSlides();
  };

  watch(locale, () => {
    fetchSlides();
  });

  onMounted(() => {
    fetchSlides();
  });

  return {
    slides,
    loading,
    error,
    refreshSlides
  };
} 