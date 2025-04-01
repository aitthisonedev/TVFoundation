import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";

export function useProductCategories() {
  const { locale } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;
  const categories = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchCategories = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${apiUrl}/api/product-categories`);
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
      console.error("Error fetching categories:", err);
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

export function useProducts() {
  const { locale } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;
  const products = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchProducts = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${apiUrl}/api/products`);
      if (response.data) {
        products.value = response.data.map((product) => ({
          id: product.product_id,
          name: locale.value === "en" ? product.name_en : product.name_lo,
          name_en: product.name_en,
          name_lo: product.name_lo,
          price: product.price,
          originalPrice: product.originalPrice,
          discount: product.discount,
          description: locale.value === "en" ? product.description_en : product.description_lo,
          description_en: product.description_en,
          description_lo: product.description_lo,
          location: locale.value === "en" ? product.location_en : product.location_lo,
          location_en: product.location_en,
          location_lo: product.location_lo,
          shippingFee: product.shippingFee,
          available: product.available,
          category_id: product.category_id,
          coverImage: product.coverImage,
          subImages: product.subImages,
          category: {
            id: product.category.id,
            name: locale.value === "en" ? product.category.name_en : product.category.name_lo,
            name_en: product.category.name_en,
            name_lo: product.category.name_lo,
            image: product.category.image
          }
        }));
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      error.value = "Failed to fetch products";
    } finally {
      loading.value = false;
    }
  };

  const refreshProducts = () => {
    fetchProducts();
  };

  watch(locale, () => {
    fetchProducts();
  });

  onMounted(() => {
    fetchProducts();
  });

  return {
    products,
    loading,
    error,
    refreshProducts
  };
}

export function useProductDetail() {
  const product = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchProductById = async (id) => {
    loading.value = true;
    try {
      const response = await axios.get(`${apiUrl}/api/products/${id}`);
      product.value = response.data;
    } catch (err) {
      error.value = err;
      console.error('Error fetching product detail:', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    product,
    loading,
    error,
    fetchProductById
  };
}

export function useProductAds() {
  const { locale } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;
  const ads = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchAds = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${apiUrl}/api/product-ads`);
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
      console.error("Error fetching product ads:", err);
      error.value = "Failed to fetch product ads";
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

export function useProductSlides() {
  const { locale } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;
  const slides = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchSlides = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${apiUrl}/api/product-slides`);
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
      console.error("Error fetching product slides:", err);
      error.value = "Failed to fetch product slides";
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