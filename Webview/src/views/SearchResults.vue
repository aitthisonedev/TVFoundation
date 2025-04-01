<template>
  <div class="search-results container py-5">
    <h2 class="mb-4">{{ $t('search.results') }} "{{ searchQuery }}"</h2>
    
    <!-- Add search input and button -->
    <div class="search-input-container mb-4">
      <div class="input-group">
        <input 
          type="text" 
          class="form-control"
          v-model="searchInput"
          :placeholder="$t('search.placeholder')"
          @keyup.enter="handleSearch"
        >
        <button 
          class="btn btn-primary" 
          @click="handleSearch"
        >
          <i class="fas fa-search"></i>
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="!hasResults" class="no-results-container text-center py-5">
      <i class="fas fa-search fa-3x text-muted mb-3"></i>
      <h3 class="text-muted">{{ $t('search.noResults') }}</h3>
      <div class="search-input-container mt-4">
        <div class="input-group">
          <input 
            type="text" 
            class="form-control"
            v-model="searchInput"
            :placeholder="$t('search.placeholder')"
            @keyup.enter="handleSearch"
          >
          <button 
            class="btn btn-primary" 
            @click="handleSearch"
          >
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>
    </div>

    <div v-else class="search-results-container">
      <!-- Top Matches Section -->
      <div v-if="getTopMatches().length" class="result-section mb-5">
        <h3 class="h5 mb-3">
          <i class="fas fa-star me-2"></i>
          {{ $t('search.topMatches') }}
        </h3>
        <div class="list-group">
          <router-link
            v-for="item in getTopMatches()"
            :key="item.id"
            :to="item.link"
            class="list-group-item list-group-item-action"
          >
            <div class="d-flex align-items-center">
              <img v-if="getItemImage(item)" 
                   :src="getImageUrl(getItemImage(item))" 
                   class="search-result-image me-3" 
                   :alt="item.title">
              <div class="search-result-placeholder me-3" v-else>
                <i :class="getItemIcon(item)"></i>
              </div>
              <div>
                <div class="d-flex align-items-center mb-1">
                  <h5 class="mb-0">{{ item.title }}</h5>
                  <span class="badge bg-secondary ms-2">{{ item.type }}</span>
                </div>
                <p class="mb-1 text-muted">{{ item.description }}</p>
                <div class="matched-terms" v-if="item.highlights && item.highlights.length">
                  <small class="text-primary">
                    <i class="fas fa-search me-1"></i>
                    {{ item.highlights.map(h => h.text).join(' | ') }}
                  </small>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- News Results -->
      <div v-if="results.news.length" class="result-section mb-5">
        <h3 class="h5 mb-3">
          <i class="fas fa-newspaper me-2"></i>
          {{ $t('nav.news') }}
        </h3>
        <div class="list-group">
          <router-link
            v-for="item in results.news"
            :key="item.id"
            :to="item.link"
            class="list-group-item list-group-item-action"
          >
            <div class="d-flex align-items-center">
              <img v-if="item.image" :src="getImageUrl(item.image)" class="search-result-image me-3" :alt="item.title">
              <div>
                <h5 class="mb-1">{{ item.title }}</h5>
                <p class="mb-1 text-muted">{{ item.description }}</p>
                <small class="text-muted">{{ formatDate(item.createdAt) }}</small>
                <template v-if="item.matchedInEnglish && !isEnglish">
                  <small class="d-block text-muted mt-1">
                    <i class="fas fa-language me-1"></i>
                    {{ item.altTitle }}
                  </small>
                  <small class="d-block text-muted">
                    {{ item.altDescription }}
                  </small>
                </template>
                <template v-if="item.matchedInLao && isEnglish">
                  <small class="d-block text-muted mt-1">
                    <i class="fas fa-language me-1"></i>
                    {{ item.altTitle }}
                  </small>
                  <small class="d-block text-muted">
                    {{ item.altDescription }}
                  </small>
                </template>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Projects Results -->
      <div v-if="results.projects.length" class="result-section mb-5">
        <h3 class="h5 mb-3">
          <i class="fas fa-project-diagram me-2"></i>
          {{ $t('nav.projects') }}
        </h3>
        <div class="list-group">
          <router-link
            v-for="item in results.projects"
            :key="item.id"
            :to="item.link"
            class="list-group-item list-group-item-action"
          >
            <div class="d-flex align-items-center">
              <img v-if="item.coverImage" :src="getImageUrl(item.coverImage)" class="search-result-image me-3" :alt="item.title">
              <div>
                <h5 class="mb-1">{{ item.title }}</h5>
                <p class="mb-1 text-muted">{{ item.description }}</p>
                <small v-if="item.location" class="text-muted">
                  <i class="fas fa-map-marker-alt me-1"></i>
                  {{ item.location }}
                </small>
                <template v-if="item.matchedInEnglish && !isEnglish">
                  <small class="d-block text-muted mt-1">
                    <i class="fas fa-language me-1"></i>
                    {{ item.altTitle }}
                  </small>
                  <small class="d-block text-muted">
                    {{ item.altDescription }}
                  </small>
                </template>
                <template v-if="item.matchedInLao && isEnglish">
                  <small class="d-block text-muted mt-1">
                    <i class="fas fa-language me-1"></i>
                    {{ item.altTitle }}
                  </small>
                  <small class="d-block text-muted">
                    {{ item.altDescription }}
                  </small>
                </template>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Products Results -->
      <div v-if="results.products.length" class="result-section mb-5">
        <h3 class="h5 mb-3">
          <i class="fas fa-box-open me-2"></i>
          {{ $t('nav.products') }}
        </h3>
        <div class="list-group">
          <router-link
            v-for="item in results.products"
            :key="item.id"
            :to="item.link"
            class="list-group-item list-group-item-action"
          >
            <div class="d-flex align-items-center">
              <img v-if="item.coverImage" :src="getImageUrl(item.coverImage)" class="search-result-image me-3" :alt="item.title">
              <div>
                <h5 class="mb-1">{{ item.title }}</h5>
                <p class="mb-1 text-muted">{{ item.description }}</p>
                <div class="d-flex align-items-center">
                  <span class="badge bg-primary me-2">{{ formatPrice(item.price) }}</span>
                  <small v-if="item.category" class="text-muted">
                    <i class="fas fa-tag me-1"></i>
                    {{ item.category.name }}
                  </small>
                </div>
                <template v-if="item.matchedInEnglish && !isEnglish">
                  <small class="d-block text-muted mt-1">
                    <i class="fas fa-language me-1"></i>
                    {{ item.altTitle }}
                  </small>
                  <small class="d-block text-muted">
                    {{ item.altDescription }}
                  </small>
                </template>
                <template v-if="item.matchedInLao && isEnglish">
                  <small class="d-block text-muted mt-1">
                    <i class="fas fa-language me-1"></i>
                    {{ item.altTitle }}
                  </small>
                  <small class="d-block text-muted">
                    {{ item.altDescription }}
                  </small>
                </template>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Tourist Attractions Results -->
      <div v-if="results.attractions.length" class="result-section mb-5">
        <h3 class="h5 mb-3">
          <i class="fas fa-map-marked-alt me-2"></i>
          {{ $t('nav.touristAttractions') }}
        </h3>
        <div class="list-group">
          <router-link
            v-for="item in results.attractions"
            :key="item.id"
            :to="item.link"
            class="list-group-item list-group-item-action"
          >
            <div class="d-flex align-items-center">
              <img v-if="item.coverImage" :src="getImageUrl(item.coverImage)" class="search-result-image me-3" :alt="item.title">
              <div>
                <h5 class="mb-1">{{ item.title }}</h5>
                <p class="mb-1 text-muted">{{ item.description }}</p>
                <small v-if="item.location" class="text-muted">
                  <i class="fas fa-map-marker-alt me-1"></i>
                  {{ item.location }}
                </small>
                <template v-if="item.matchedInEnglish && !isEnglish">
                  <small class="d-block text-muted mt-1">
                    <i class="fas fa-language me-1"></i>
                    {{ item.altTitle }}
                  </small>
                  <small class="d-block text-muted">
                    {{ item.altDescription }}
                  </small>
                </template>
                <template v-if="item.matchedInLao && isEnglish">
                  <small class="d-block text-muted mt-1">
                    <i class="fas fa-language me-1"></i>
                    {{ item.altTitle }}
                  </small>
                  <small class="d-block text-muted">
                    {{ item.altDescription }}
                  </small>
                </template>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Team Results -->
      <div v-if="results.team.length" class="result-section mb-5">
        <h3 class="h5 mb-3">
          <i class="fas fa-users me-2"></i>
          {{ $t('nav.team') }}
        </h3>
        <div class="list-group">
          <router-link
            v-for="item in results.team"
            :key="item.id"
            :to="item.link"
            class="list-group-item list-group-item-action"
          >
            <div class="d-flex align-items-center">
              <img v-if="item.image" :src="getImageUrl(item.image)" class="search-result-image me-3" :alt="item.title">
              <div>
                <h5 class="mb-1">{{ item.title }}</h5>
                <p class="mb-1 text-muted">{{ item.description }}</p>
                <template v-if="item.matchedInEnglish && !isEnglish">
                  <small class="d-block text-muted mt-1">
                    <i class="fas fa-language me-1"></i>
                    {{ item.altTitle }}
                  </small>
                  <small class="d-block text-muted">
                    {{ item.altDescription }}
                  </small>
                </template>
                <template v-if="item.matchedInLao && isEnglish">
                  <small class="d-block text-muted mt-1">
                    <i class="fas fa-language me-1"></i>
                    {{ item.altTitle }}
                  </small>
                  <small class="d-block text-muted">
                    {{ item.altDescription }}
                  </small>
                </template>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Other Content Results -->
      <template v-for="(items, category) in otherResults">
        <div v-if="items.length" :key="category" class="result-section mb-5">
          <h3 class="h5 mb-3">
            <i class="fas fa-file-alt me-2"></i>
            {{ getCategoryTitle(category) }}
          </h3>
          <div class="list-group">
            <router-link
              v-for="item in items"
              :key="item.id"
              :to="item.link"
              class="list-group-item list-group-item-action"
            >
              <div class="d-flex align-items-center">
                <img v-if="getItemImage(item)" 
                     :src="getImageUrl(getItemImage(item))" 
                     class="search-result-image me-3" 
                     :alt="item.title">
                <div class="search-result-placeholder me-3" v-else>
                  <i :class="getItemIcon(item)"></i>
                </div>
                <div class="flex-grow-1">
                  <h5 class="mb-1">{{ item.title }}</h5>
                  <p class="mb-1 text-muted">{{ item.description }}</p>
                  
                  <!-- Display location if available -->
                  <small v-if="item.location" class="text-muted d-block">
                    <i class="fas fa-map-marker-alt me-1"></i>
                    {{ item.location }}
                  </small>

                  <!-- Display price for products -->
                  <div v-if="category === 'products' && item.price" class="d-flex align-items-center mt-1">
                    <span class="badge bg-primary me-2">{{ formatPrice(item.price) }}</span>
                    <small v-if="item.category" class="text-muted">
                      <i class="fas fa-tag me-1"></i>
                      {{ item.category.name }}
                    </small>
                  </div>

                  <!-- Display matched fields -->
                  <div v-if="item.highlights && item.highlights.length" class="matched-fields mt-2">
                    <div v-for="(highlight, index) in item.highlights" :key="index" class="matched-field">
                      <small class="text-success">
                        <i class="fas fa-search me-1"></i>
                        {{ getFieldName(highlight.field) }}:
                      </small>
                      <div class="matched-text-container">
                        <span v-html="highlightSearchTerm(highlight.text, highlight.searchTerm)"></span>
                      </div>
                    </div>
                  </div>

                  <!-- Display alternate language matches -->
                  <template v-if="item.matchedInEnglish && !isEnglish">
                    <small class="d-block text-muted mt-1">
                      <i class="fas fa-language me-1"></i>
                      {{ item.altTitle }}
                    </small>
                    <small class="d-block text-muted">
                      {{ item.altDescription }}
                    </small>
                  </template>
                  <template v-if="item.matchedInLao && isEnglish">
                    <small class="d-block text-muted mt-1">
                      <i class="fas fa-language me-1"></i>
                      {{ item.altTitle }}
                    </small>
                    <small class="d-block text-muted">
                      {{ item.altDescription }}
                    </small>
                  </template>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { searchData } from '@/services/searchService';
import { Modal } from 'bootstrap';

export default {
  name: 'SearchResults',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { t, locale } = useI18n();
    const searchQuery = ref('');
    const results = ref({
      news: [],
      projects: [],
      products: [],
      attractions: [],
      team: [],
      contentOne: [],
      contentTwo: [],
      contentThree: [],
      performance: [],
      coreValues: []
    });
    const isLoading = ref(true);
    const searchInput = ref('');
    const noResultsModal = ref(null);

    const hasResults = computed(() => {
      if (!results.value) return false;
      return Object.values(results.value).some(category => Array.isArray(category) && category.length > 0);
    });

    const otherResults = computed(() => {
      const { news, projects, products, attractions, team, ...others } = results.value;
      return others;
    });

    const performSearch = async (query) => {
      if (!query?.trim()) {
        results.value = {
          news: [],
          projects: [],
          products: [],
          attractions: [],
          team: [],
          contentOne: [],
          contentTwo: [],
          contentThree: [],
          performance: [],
          coreValues: []
        };
        isLoading.value = false;
        return;
      }

      isLoading.value = true;
      try {
        console.log('Performing search with query:', query);
        const searchResults = await searchData(query, locale.value === 'en');
        console.log('Search results:', searchResults);
        results.value = searchResults;
        console.log('Has results:', hasResults.value);
        console.log('Results categories:', Object.keys(results.value).map(key => `${key}: ${results.value[key]?.length || 0} items`));
      } catch (error) {
        console.error('Search error:', error);
        results.value = {
          news: [],
          projects: [],
          products: [],
          attractions: [],
          team: [],
          contentOne: [],
          contentTwo: [],
          contentThree: [],
          performance: [],
          coreValues: []
        };
      } finally {
        isLoading.value = false;
      }
    };

    const getImageUrl = (image) => {
      if (!image) return '';
      const apiUrl = import.meta.env.VITE_API_URL;
      return image.startsWith('http') ? image : `${apiUrl}/ImageUpload/${image}`;
    };

    const formatDate = (date) => {
      if (!date) return '';
      return new Date(date).toLocaleDateString(locale.value === 'en' ? 'en-US' : 'lo-LA');
    };

    const formatPrice = (price) => {
      if (!price) return '';
      return new Intl.NumberFormat(locale.value === 'en' ? 'en-US' : 'lo-LA', {
        style: 'currency',
        currency: 'LAK'
      }).format(price);
    };

    const getCategoryTitle = (category) => {
      const titles = {
        contentOne: t('nav.content'),
        contentTwo: t('nav.content'),
        contentThree: t('nav.content'),
        performance: t('nav.performance'),
        coreValues: t('nav.coreValues')
      };
      return titles[category] || category;
    };

    const isEnglish = computed(() => {
      return locale.value === 'en';
    });

    const highlightSearchTerm = (text, searchTerm) => {
      if (!text || !searchTerm) return text;
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    };

    const getFieldName = (field) => {
      const fieldNames = {
        'name_en': t('search.englishName'),
        'name_lo': t('search.laoName'),
        'title_en': t('search.englishTitle'),
        'title_lo': t('search.laoTitle'),
        'description_en': t('search.englishDescription'),
        'description_lo': t('search.laoDescription'),
        'content_en': t('search.englishContent'),
        'content_lo': t('search.laoContent'),
        'location_en': t('search.englishLocation'),
        'location_lo': t('search.laoLocation'),
        'position_en': t('search.englishPosition'),
        'position_lo': t('search.laoPosition'),
        'ExpectOne_en': t('search.expectOneEn'),
        'ExpectOne_lo': t('search.expectOneLo'),
        'ExpectTwo_en': t('search.expectTwoEn'),
        'ExpectTwo_lo': t('search.expectTwoLo'),
        'ExpectThree_en': t('search.expectThreeEn'),
        'ExpectThree_lo': t('search.expectThreeLo')
      };
      // Handle array indices in field names
      const baseField = field.replace(/\[\d+\]/, '');
      return fieldNames[baseField] || baseField;
    };

    // Watch for route query changes
    watch(
      () => route.query.q,
      (newQuery) => {
        searchQuery.value = newQuery || '';
        performSearch(searchQuery.value);
      },
      { immediate: true }
    );

    // Watch for language changes
    watch(
      () => locale.value,
      (newLocale) => {
        console.log('Language changed to:', newLocale);
        performSearch(searchQuery.value);
      }
    );

    onMounted(() => {
      searchQuery.value = route.query.q || '';
      if (searchQuery.value) {
        performSearch(searchQuery.value);
      } else {
        isLoading.value = false;
      }
    });

    const handleSearch = async () => {
      if (!searchInput.value.trim()) return;

      try {
        // Update URL with search query
        await router.push({
          name: 'SearchResults',
          query: { q: searchInput.value }
        });

        // Perform search
        await performSearch(searchInput.value);
      } catch (error) {
        console.error('Search error:', error);
        results.value = {
          news: [],
          projects: [],
          products: [],
          attractions: [],
          team: [],
          contentOne: [],
          contentTwo: [],
          contentThree: [],
          performance: [],
          coreValues: []
        };
      }
    };

    const getTopMatches = () => {
      // Combine all results into a single array
      const allResults = [
        ...results.value.news || [],
        ...results.value.projects || [],
        ...results.value.products || [],
        ...results.value.attractions || [],
        ...results.value.team || [],
        ...results.value.contentOne || [],
        ...results.value.contentTwo || [],
        ...results.value.contentThree || [],
        ...results.value.performance || [],
        ...results.value.coreValues || []
      ];

      // Group results by search term matches
      const searchTerms = searchQuery.value.toLowerCase().split(/\s+/);
      
      // Filter and sort the results
      return allResults
        .filter(item => {
          // Ensure item has highlights
          return item.highlights && item.highlights.length > 0;
        })
        .sort((a, b) => {
          // Sort by exact matches first
          if (a.titleMatchFound !== b.titleMatchFound) {
            return a.titleMatchFound ? -1 : 1;
          }
          
          // Then by match score
          if (a.matchScore !== b.matchScore) {
            return b.matchScore - a.matchScore;
          }
          
          // Finally alphabetically
          return a.title.localeCompare(b.title);
        })
        .slice(0, 5); // Show top 5 matches
    };

    const getItemImage = (item) => {
      switch (item.type) {
        case 'news':
          return item.image;
        case 'projects':
        case 'products':
        case 'attractions':
          return item.coverImage;
        case 'team':
          return item.profileImage;
        case 'contentOne':
        case 'contentTwo':
        case 'contentThree':
        case 'performance':
        case 'coreValues':
          return item.imageUrl;
        case 'about':
        case 'impact':
        case 'visionMission':
          return item.image || item.imageUrl;
        case 'supporters':
          return item.logo;
        case 'homeSliders':
        case 'newsSliders':
        case 'projectSliders':
        case 'supportSliders':
        case 'productSlides':
        case 'attractionSlides':
          return item.image || item.slideImage;
        case 'productAds':
        case 'attractionAds':
          return item.adImage;
        case 'bankAccounts':
          return item.qrCode;
        default:
          return null;
      }
    };

    const getItemIcon = (item) => {
      switch (item.type) {
        case 'news':
          return 'fas fa-newspaper';
        case 'projects':
          return 'fas fa-project-diagram';
        case 'products':
          return 'fas fa-box-open';
        case 'attractions':
          return 'fas fa-map-marked-alt';
        case 'team':
          return 'fas fa-user';
        case 'contentOne':
        case 'contentTwo':
        case 'contentThree':
          return 'fas fa-file-alt';
        case 'performance':
          return 'fas fa-chart-line';
        case 'coreValues':
          return 'fas fa-star';
        case 'about':
          return 'fas fa-info-circle';
        case 'supporters':
          return 'fas fa-hands-helping';
        case 'headContent':
          return 'fas fa-heading';
        case 'impact':
          return 'fas fa-chart-bar';
        case 'visionMission':
          return 'fas fa-bullseye';
        case 'bankAccounts':
          return 'fas fa-university';
        case 'productCategories':
        case 'attractionCategories':
        case 'newsCategories':
          return 'fas fa-tags';
        case 'projectStatus':
          return 'fas fa-tasks';
        case 'homeSliders':
        case 'newsSliders':
        case 'projectSliders':
        case 'supportSliders':
        case 'productSlides':
        case 'attractionSlides':
          return 'fas fa-images';
        case 'productAds':
        case 'attractionAds':
          return 'fas fa-ad';
        default:
          return 'fas fa-file';
      }
    };

    return {
      searchQuery,
      results,
      isLoading,
      hasResults,
      otherResults,
      getImageUrl,
      formatDate,
      formatPrice,
      getCategoryTitle,
      isEnglish,
      getFieldName,
      searchInput,
      handleSearch,
      highlightSearchTerm,
      getTopMatches,
      getItemImage,
      getItemIcon
    };
  }
};
</script>

<style scoped>
.search-results {
  min-height: 60vh;
}

.search-results-container {
  max-width: 900px;
  margin: 0 auto;
}

.result-section {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.list-group-item-action {
  border: none;
  border-bottom: 1px solid #f0f0f0;
}

.list-group-item-action:last-child {
  border-bottom: none;
}

.list-group-item-action:hover {
  background-color: #f8f9fa;
}

.search-result-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.list-group-item h5 {
  color: #00adef;
  margin-bottom: 0.5rem;
}

.text-primary {
  color: #00adef !important;
}

.badge {
  font-weight: 500;
  padding: 0.5em 1em;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.text-muted {
  color: #6c757d !important;
}

.result-section h3 {
  padding: 1rem;
  margin: 0;
  background: #f8f9fa;
  border-bottom: 1px solid #f0f0f0;
}

.result-section .list-group {
  padding: 1rem;
}

.matched-fields {
  background-color: #f8f9fa;
  padding: 0.5rem;
  border-radius: 4px;
  margin-top: 0.5rem;
}

.matched-field {
  margin: 0.25rem 0;
}

.matched-text {
  background-color: #e3f2fd;
  padding: 0.1rem 0.3rem;
  border-radius: 2px;
}

.search-input-container {
  max-width: 600px;
  margin: 0 auto;
}

.modal-header .btn-close {
  padding: 0.5rem;
  margin: -0.5rem -0.5rem -0.5rem auto;
}

.no-results-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.no-results-container i {
  color: #fff;
}
.text-primary {
  color: #00adef !important;
}
.btn-primary {
  background-color: #00adef !important;
  border-color: #00adef !important;
}
.no-results-container h3 {
  margin: 1rem 0;
  font-weight: 500;
}

.matched-text-container {
  background-color: #f8f9fa;
  padding: 0.5rem;
  border-radius: 4px;
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

mark {
  background-color: #fff3cd;
  padding: 0.1rem 0.2rem;
  border-radius: 2px;
}

.matched-field {
  margin: 0.5rem 0;
}

.matched-field small {
  display: block;
  margin-bottom: 0.25rem;
}

.search-result-placeholder {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border-radius: 4px;
  color: #00adef;
}

.search-result-placeholder i {
  font-size: 2rem;
}
</style> 