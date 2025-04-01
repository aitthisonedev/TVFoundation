<template>
  <div
    class="modal fade"
    id="searchModal"
    tabindex="-1"
    aria-labelledby="searchModalLabel"
    aria-hidden="true"
    @click.self="closeModal"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content rounded-3 border-0">
        <div class="modal-header border-0">
          <div class="input-group shadow-sm w-100">
            <input
              type="text"
              class="form-control border-0"
              :placeholder="$t('search.placeholder')"
              v-model="searchQuery"
              ref="searchInput"
              @keyup.enter="handleSearch"
              @keydown.esc.prevent="closeModal"
              autofocus
            />
            <span 
              class="input-group-text bg-white border-0" 
              @click="handleSearch" 
              role="button"
              aria-label="Search"
              style="cursor: pointer;"
            >
              <i class="fas fa-search text-muted text-primary"></i>
            </span>
            <span v-if="searchQuery" class="input-group-text bg-white border-0" @click="clearSearch" role="button">
              <i class="fas fa-times text-muted"></i>
            </span>
            <span class="input-group-text bg-white me-4 border-0">
              [esc]
              <button
                type="button"
                @click="closeModal"
                class="btn-close ms-2"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </span>
          </div>
        </div>
        <div class="modal-body p-4" @click.stop>
          <div class="row">
            <div class="col-md-6">
              <div class="search-links">
                <router-link :to="{ name: 'Home' }" class="search-link" @click="closeModal">
                  <i class="fas fa-home text-primary"></i>
                  <span>{{ $t("nav.home") }}</span>
                </router-link>
                <router-link :to="{ name: 'support' }" class="search-link" @click="closeModal">
                  <i class="fas fa-hands-helping text-primary"></i>
                  <span>{{ $t("nav.support") }}</span>
                </router-link>
                <router-link :to="{ name: 'Projects' }" class="search-link" @click="closeModal">
                  <i class="fas fa-project-diagram text-primary"></i>
                  <span>{{ $t("nav.projects") }}</span>
                </router-link>
                <router-link :to="{ name: 'news' }" class="search-link" @click="closeModal">
                  <i class="fas fa-newspaper text-primary"></i>
                  <span>{{ $t("nav.news") }}</span>
                </router-link>
              </div>
            </div>
            <div class="col-md-6">
              <div class="search-links">
                <router-link :to="{ name: 'Products' }" class="search-link" @click="closeModal">
                  <i class="fas fa-box-open text-primary"></i>
                  <span>{{ $t("nav.products") }}</span>
                </router-link>
                <router-link :to="{ name: 'TouristAttractions' }" class="search-link" @click="closeModal">
                  <i class="fas fa-map-marked-alt text-primary"></i>
                  <span>{{ $t("nav.touristAttractions") }}</span>
                </router-link>
                <router-link :to="{ name: 'AboutUs' }" class="search-link" @click="closeModal">
                  <i class="fas fa-info-circle text-primary"></i>
                  <span>{{ $t("nav.aboutUs") }}</span>
                </router-link>
                <router-link :to="{ name: 'ContactUs' }" class="search-link" @click="closeModal">
                  <i class="fas fa-envelope text-primary"></i>
                  <span>{{ $t("nav.contactUs") }}</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { Modal } from "bootstrap";

export default {
  name: "SearchModal",
  emits: ['close'],
  setup(props, { emit }) {
    const router = useRouter();
    const searchQuery = ref("");
    const searchInput = ref(null);
    let searchModal = null;

    const initModal = async () => {
      try {
        const bootstrap = await import("bootstrap");
        const modalElement = document.getElementById("searchModal");
        if (!modalElement) {
          console.error('Search modal element not found');
          return;
        }
        searchModal = new bootstrap.Modal(modalElement, {
          keyboard: true,
          backdrop: 'static'
        });

        // Add click outside listener
        modalElement.addEventListener('click', (e) => {
          if (e.target === modalElement) {
            closeModal();
          }
        });
      } catch (error) {
        console.error('Error initializing modal:', error);
      }
    };

    const openSearchModal = async () => {
      try {
        if (!searchModal) {
          await initModal();
        }
        if (searchModal) {
          searchModal.show();
          await focusSearchInput();
        }
      } catch (error) {
        console.error('Error opening search modal:', error);
      }
    };

    const closeModal = () => {
      try {
        if (searchModal) {
          searchModal.hide();
          clearSearch();
          emit('close');
        }
      } catch (error) {
        console.error('Error closing modal:', error);
      }
    };

    const clearSearch = () => {
      searchQuery.value = "";
      nextTick(() => {
        searchInput.value?.focus();
      });
    };

    const focusSearchInput = async () => {
      await nextTick();
      if (searchInput.value) {
        searchInput.value.focus();
      }
    };

    const handleSearch = async () => {
      const query = searchQuery.value.trim();
      if (query) {
        try {
          // Close modal first to prevent UI issues
          closeModal();
          
          // Navigate to search results page
          await router.push({
            name: 'SearchResults',
            query: { q: query }
          });
        } catch (error) {
          console.error('Navigation error:', error);
        }
      }
    };

    onMounted(async () => {
      await initModal();

      // Handle modal events
      const modalEl = document.getElementById('searchModal');
      if (modalEl) {
        modalEl.addEventListener('shown.bs.modal', focusSearchInput);
        modalEl.addEventListener('hidden.bs.modal', () => {
          clearSearch();
          emit('close');
        });
      }

      // Add escape key listener
      document.addEventListener('keydown', handleEscKey);
    });

    // Clean up event listeners
    onBeforeUnmount(() => {
      document.removeEventListener('keydown', handleEscKey);
      const modalEl = document.getElementById('searchModal');
      if (modalEl) {
        modalEl.removeEventListener('shown.bs.modal', focusSearchInput);
        modalEl.removeEventListener('hidden.bs.modal', () => {
          clearSearch();
          emit('close');
        });
      }
    });

    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    return {
      searchQuery,
      searchInput,
      openSearchModal,
      handleSearch,
      closeModal,
      clearSearch
    };
  }
};
</script>

<style scoped>
/* Search Modal Styles */
.modal-content {
  border-radius: 12px;
  border: none;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 1rem 1.5rem;
}

.modal-body {
  padding: 1.5rem;
}

.input-group {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.input-group .form-control {
  padding: 0.75rem;
  font-size: 16px;
}

.input-group .form-control:focus {
  box-shadow: none;
  border-color: #00adef;
}

.search-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: #333;
  padding: 0.75rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.search-link:hover {
  background-color: #f8f9fa;
  color: #00adef;
}

.search-link i {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
  color: #00adef;
}

.text-primary {
  color: #00adef !important;
}

h6 {
  color: #6c757d;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modal-dialog-centered.modal-lg {
  max-width: 800px;
}

/* Keyboard shortcut styles */
.input-group-text {
  cursor: pointer;
  transition: all 0.2s ease;
}

.input-group-text:hover {
  color: #00adef !important;
}

.input-group-text:hover i {
  color: #00adef !important;
}

.btn-close {
  font-size: 0.875rem;
}

/* Add specific styles for the search button */
.input-group-text[role="button"] {
  cursor: pointer;
  transition: all 0.2s ease;
}

.input-group-text[role="button"]:hover {
  background-color: #f8f9fa !important;
}

.input-group-text[role="button"]:hover i {
  color: #00adef !important;
}
</style> 