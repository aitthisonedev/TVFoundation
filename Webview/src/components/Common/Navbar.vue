<template>
  <div>
  <nav class="navbar navbar-expand-lg navbar-light bg-white fixed-top">
    <div class="container d-flex justify-content-between">
      <div>
        <div class="d-flex align-items-center">
          <a href="/">
            <img
              :src="logo1"
              :onerror="e => e.target.src = '../../assets/logo.png'"
              alt="Meathoayaithongvanh logo"
              class="img-fluid"
            />
          </a>
        </div>
      </div>
      <div>
        <!-- Reorder these elements for better mobile layout -->
        <div class="d-flex align-items-center gap-2">
          <!-- Language Switcher (Mobile Only) -->
          <div class="dropdown d-lg-none">
            <button
              class="btn border-0 dropdown-toggle"
              type="button"
              id="langDropdown"
              data-bs-toggle="dropdown"
            >
              <span :class="`fi fi-${currentLanguage.flag}`"></span>
              {{ currentLanguage.name }}
            </button>
            <ul class="dropdown-menu border-0 bg-white">
              <li>
                <a
                  class="dropdown-item d-flex align-items-center gap-2"
                  href="#"
                  @click="changeLanguage('en')"
                >
                  <span class="fi fi-gb"></span>
                  EN
                </a>
              </li>
              <li>
                <a
                  class="dropdown-item d-flex align-items-center gap-2"
                  href="#"
                  @click="changeLanguage('lo')"
                >
                  <span class="fi fi-la"></span>
                  ລາວ
                </a>
              </li>
            </ul>
          </div>

          <!-- Toggle Button -->
          <button
            class="navbar-toggler border-0 shadow-none ms-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>
      </div>

      <!-- Navigation Items -->
      <div class="collapse navbar-collapse text-dark" id="navbarNav">
        <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
          <!-- Home -->
          <li class="nav-item">
            <router-link
              class="nav-link"
              :to="{ name: 'Home' }"
              active-class="active"
              >{{ $t("nav.home") }}</router-link
            >
          </li>

          <!-- Support -->
          <li class="nav-item">
            <router-link
              class="nav-link"
              :to="{ name: 'support' }"
              active-class="active"
              >{{ $t("nav.support") }}</router-link
            >
          </li>

          <!-- Projects -->
          <li class="nav-item">
            <router-link
              class="nav-link"
              :to="{ name: 'Projects' }"
              active-class="active"
              >{{ $t("nav.projects") }}</router-link
            >
          </li>

          <!-- News -->
          <li class="nav-item">
            <router-link
              class="nav-link"
              :to="{ name: 'news' }"
              active-class="active"
              >{{ $t("nav.news") }}</router-link
            >
          </li>

          <!-- Services -->
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ $t("nav.services") }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  :to="{ name: 'Products' }"
                  active-class="active"
                >
                  {{ $t("nav.products") }}
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  :to="{ name: 'TouristAttractions' }"
                  active-class="active"
                >
                  {{ $t("nav.touristAttractions") }}
                </router-link>
              </li>
            </ul>
          </li>

          <!-- Foundation -->
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ $t("nav.foundation") }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  :to="{ name: 'AboutUs' }"
                  active-class="active"
                >
                  {{ $t("nav.aboutUs") }}
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  :to="{ name: 'ContactUs' }"
                  active-class="active"
                >
                  {{ $t("nav.contactUs") }}
                </router-link>
              </li>
            </ul>
          </li>
        </ul>

        <!-- Right Side Buttons -->
        <div
          class="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-3 mt-3 mt-lg-0"
        >
          <div class="d-flex align-items-center justify-content-start gap-2">
            <!-- Give Support Button -->
            <router-link
              :to="{ name: 'support', hash: '#payment-section' }"
              class="btn btn-primary rounded-pill max-w-100 w-lg-auto shadow"
            >
              {{ $t("nav.giveSupport") }}
            </router-link>
            <!-- Language Switcher (Desktop Only) -->
            <div class="dropdown d-none d-lg-block">
              <button
                class="btn border-0 dropdown-toggle pr-2 d-flex align-items-center gap-1"
                type="button"
                id="langDropdownDesktop"
                data-bs-toggle="dropdown"
              >
                <span :class="`fi fi-${currentLanguage.flag}`"></span>
                {{ currentLanguage.name }}
              </button>
              <ul class="dropdown-menu border-0">
                <li>
                  <a
                    class="dropdown-item d-flex align-items-center gap-2"
                    href="#"
                    @click="changeLanguage('en')"
                  >
                    <span class="fi fi-gb"></span>
                    EN
                  </a>
                </li>
                <li>
                  <a
                    class="dropdown-item d-flex align-items-center gap-2"
                    href="#"
                    @click="changeLanguage('lo')"
                  >
                    <span class="fi fi-la"></span>
                    ລາວ
                  </a>
                </li>
              </ul>
            </div>
            <!-- Search Button -->
            <button
              class="btn border-0 px-3"
              @click="openSearchModal"
              title="Search"
            >
              <i class="fas fa-search search-icon"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Spacer for fixed navbar -->
  <div class="navbar-spacer"></div>

  <!-- SearchModal component -->
  <SearchModal ref="searchModalRef" />
  
  </div>
</template>
<script>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import "flag-icons/css/flag-icons.min.css";
import { setI18nLanguage } from "../../i18n";
import { useLogo } from "../../APIs/LogoAPIs";
import SearchModal from "./SearchModal.vue";
import { Collapse, Dropdown } from 'bootstrap';

export default {
  name: "Navbar",
  components: {
    SearchModal
  },
  setup() {
    const { locale } = useI18n();
    const router = useRouter();
    let navbarCollapse = null;
    let dropdowns = [];
    const { logo1 } = useLogo();
    const searchModalRef = ref(null);
    const isNavbarOpen = ref(false);

    const currentLanguage = computed(() => ({
      name: locale.value === "en" ? "English" : "ລາວ",
      flag: locale.value === "en" ? "gb" : "la",
    }));

    const changeLanguage = (lang) => {
      setI18nLanguage(lang);
    };

    const openSearchModal = () => {
      if (searchModalRef.value) {
        closeNavbar();
        searchModalRef.value.openSearchModal();
      }
    };

    const handleSearchModalClose = () => {
      console.log('Search modal closed');
    };

    const closeDropdowns = () => {
      dropdowns.forEach(dropdown => {
        if (dropdown && dropdown._isShown()) {
          dropdown.hide();
        }
      });
    };

    const closeNavbar = () => {
      if (navbarCollapse && navbarCollapse._isShown) {
        navbarCollapse.hide();
        isNavbarOpen.value = false;
      }
    };

    const handleClickOutside = (event) => {
      const navbar = document.getElementById('navbarNav');
      const togglerButton = document.querySelector('.navbar-toggler');
      
      // Only close navbar when clicking outside
      if (navbar && !navbar.contains(event.target) && 
          togglerButton && !togglerButton.contains(event.target) &&
          isNavbarOpen.value) {
        closeNavbar();
      }
    };

    // Add keyboard shortcut for search
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearchModal();
      }
    };

    onMounted(() => {
      // Initialize Bootstrap components
      import("bootstrap").then((bootstrap) => {
        // Initialize navbar collapse
        const navbarElement = document.getElementById("navbarNav");
        if (navbarElement) {
          navbarCollapse = new bootstrap.Collapse(navbarElement, {
            toggle: false
          });

          // Listen for navbar show/hide events
          navbarElement.addEventListener('show.bs.collapse', () => {
            isNavbarOpen.value = true;
          });
          navbarElement.addEventListener('hide.bs.collapse', () => {
            isNavbarOpen.value = false;
          });
        }

        // Initialize all dropdowns
        document.querySelectorAll('.dropdown-toggle').forEach(dropdownToggle => {
          const dropdown = new bootstrap.Dropdown(dropdownToggle, {
            autoClose: 'outside' // Only close when clicking outside
          });
          dropdowns.push(dropdown);
        });
      });

      // Add click event listener for navigation links only
      const navigationLinks = document.querySelectorAll(
        ".nav-link:not(.dropdown-toggle), .dropdown-item[href]"
      );
      navigationLinks.forEach((link) => {
        link.addEventListener("click", () => {
          // Only close navbar and dropdowns when clicking actual navigation links
          closeNavbar();
          closeDropdowns();
        });
      });

      // Add click outside listener
      document.addEventListener('click', handleClickOutside);

      // Add keyboard shortcut listener
      document.addEventListener('keydown', handleKeyDown);

      // Listen for route changes to close dropdowns
      router.beforeEach((to, from, next) => {
        closeDropdowns();
        next();
      });
    });

    // Clean up event listeners
    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      
      const navbarElement = document.getElementById("navbarNav");
      if (navbarElement) {
        navbarElement.removeEventListener('show.bs.collapse', () => {
          isNavbarOpen.value = true;
        });
        navbarElement.removeEventListener('hide.bs.collapse', () => {
          isNavbarOpen.value = false;
        });
      }

      // Clean up dropdowns
      dropdowns.forEach(dropdown => {
        if (dropdown && dropdown.dispose) {
          dropdown.dispose();
        }
      });
    });

    return {
      currentLanguage,
      changeLanguage,
      logo1,
      openSearchModal,
      searchModalRef,
      handleSearchModalClose,
      closeNavbar
    };
  },
};
</script>

<style scoped>
.navbar {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.navbar-spacer {
  height: 90px; /* Adjust based on your navbar height */
}

.nav-link {
  color: #333 !important;
  font-weight: 500;
  padding: 0.5rem 1rem !important;
  transition: all 0.3s ease;
  position: relative;
  font-size: 20px;
}

.nav-link:hover,
.nav-link.active {
  color: #ed207b !important;
}

.nav-link.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 1rem;
  right: 1rem;
  height: 2px;
  background-color: #ed207b;
}

.btn-primary {
  background-color: #ed207b;
  border: none;
  padding: 0.5rem;
  transition: transform 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.btn-primary::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background-color: #00adef;
  transition: left 0.3s ease;
  z-index: -1;
}

.btn-primary:hover {
  transform: translateY(-2px);
}

.btn-primary:hover::before {
  left: 0;
}

.dropdown-toggle {
  min-width: 120px;
}
.img-fluid {
  max-height: 100px;
  padding: 0;
  margin: 0;
}
@media (max-width: 991.98px) {
  .navbar-collapse {
    padding: 1rem 0;
  }

  .nav-link.active::after {
    left: 0;
    right: 0;
  }
}

.dropdown-menu {
  font-family: inherit;
}

.dropdown {
  position: relative;
  display: inline-block;
}
.navbar-expand-lg.navbar-light 
.dropdown:not(.dropdown-submenu) > 
.dropdown-toggle:after{
  color: #00adef;
}
.dropdown-menu {
  min-width: 120px;
  right: 0;
  left: auto;
}

.dropdown-toggle {
  min-width: 120px;
  white-space: nowrap;
  padding: 0.5rem 1rem;
}

@media (max-width: 991.98px) {
  .dropdown {
    margin-right: 0;
  }

  .dropdown-toggle {
    padding: 0.25rem 0.5rem;
    min-width: auto;
  }

  .dropdown-menu {
    right: 0;
    left: auto;
    min-width: 120px;
  }
}
/* If you want even smaller icons, you could use: */
.fi {
  font-size: 0.875rem;
  line-height: 0.875rem;
  border-radius: 3px;
}

/* Add these new styles */
.navbar-toggler {
  padding: 0.25rem 0.75rem;
  font-size: 1.25rem;
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  transition: box-shadow 0.15s ease-in-out;
}

.navbar-toggler:focus {
  outline: none;
  box-shadow: none;
}

/* Mobile adjustments */
@media (max-width: 991.98px) {
  .dropdown-toggle {
    font-size: 0.9rem;
    padding: 0.25rem 0.5rem;
  }

  .navbar-collapse {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    color: #00adef;
    background: white;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }

  .container {
    padding-right: 1rem;
    padding-left: 1rem;
  }

  /* Adjust language switcher on mobile */
  .dropdown.d-lg-none .dropdown-toggle {
    min-width: auto;
    padding: 0.25rem 0.5rem;
  }
  .dropdown-item.active {
    background-color: #00adef;
    border-radius: 0.25rem;
  }
  .dropdown-item.active a {
    color: #00adef;
  }
  /* Stack menu items vertically on mobile */
  .navbar-nav {
    text-align: left;
    padding: 1rem 0;
  }

  .nav-item {
    padding: 0.5rem 0;
  }

  .nav-link,
  .dropdown-item,
  .nav-item a {
    color: #212529 !important; /* Bootstrap's default dark color */
    font-weight: 500;
  }

  .nav-link:hover,
  .nav-link.active {
    color: #ed207b !important;
  }
}

/* Enhanced dropdown menu styles */
.dropdown-menu {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: none;
  padding: 5px;
}

.dropdown-item {
  padding: 0.6rem 1.2rem;
  color: #333;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: rgba(211, 43, 43, 0.08);
  color: #ed207b;
}

/* Mobile-specific dropdown adjustments */
@media (max-width: 991.98px) {
  .dropdown-menu {
    border: none;
    box-shadow: none;
    padding-left: 1rem;
    background-color: rgba(211, 43, 43, 0.03);
  }

  .dropdown-item {
    padding: 0.5rem 1rem;
  }
}

/* Search Modal Styles */
.modal-content {
  border-radius: 12px;
  border: none;
}

.modal-header {
  padding: 1rem 1.5rem;
}

.modal-body {
  padding: 1rem 1.5rem 1.5rem;
}

.input-group {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.input-group .form-control {
  border-right: none;
  padding: 0.5rem;
  font-size: 16px;
}
.button.btn.btn-primary {
  height: 100%;
}

.input-group .form-control:focus {
  box-shadow: none;
  border-color: #ced4da;
}

.input-group .btn {
  border-left: none;
  padding: 0.75rem 1.5rem;
}

/* Search icon styles */
.search-icon {
  color: #00adef;
  transition: color 0.3s ease;
}

.search-icon:hover {
  color: #ed207b;
}

.navbar-collapse {
  color: #212529 !important; /* Bootstrap's dark text color */
}

/* Make sure links are also dark */
.navbar-collapse .nav-link {
  color: #212529 !important;
}

/* Optional: Style dropdown items */
.navbar-collapse .dropdown-item {
  color: #212529 !important;
}

.navbar-collapse {
  color: #212529 !important;
  font-size: 20px;
}

.navbar-collapse .nav-link {
  color: #212529 !important;
  transition: all 0.3s ease; /* Smooth transition for hover effects */
  border-radius: 8px; /* Default border radius */
  padding: 0.5rem 1rem;
}

/* Hover effect for nav links */
.navbar-collapse .nav-link:hover {
  color: #ed207b !important; /* Light background on hover */
}

/* Style dropdown items */
.navbar-collapse .dropdown-item {
  color: #212529 !important;
}

/* Hover effect for dropdown items */
.navbar-collapse .dropdown-item:hover {
  border-radius: 8px;
}

/* Active link style */
.navbar-collapse .nav-link.active {
  color: #ed207b !important;
}

/* Active dropdown item style */
.navbar-collapse .dropdown-item.active {
  color: #ed207b !important;
}

/* Optional: Keep the danger color when hovering on active items */
.navbar-collapse .nav-link.active:hover {
  color: #ed207b !important;
}
</style>
