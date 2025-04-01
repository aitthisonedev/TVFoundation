<script>
import Navbar from './components/Common/Navbar.vue'
import Footer from './components/Common/Footer.vue'
import './style.css'

export default {
  name: 'App',
  components: {
    Navbar,
    Footer
  }
}
</script>

<template>
  <div class="app-container" :lang="$i18n.locale">
    <Navbar />
    <main>
      <router-view></router-view>
    </main>
    <Footer />
  </div>
</template>

<style>
/* Remove 'scoped' to make these styles global */
:root {
  --font-en: 'Montserrat', sans-serif;
  --font-lo: 'Phetsarath', serif;
}

/* Base font settings */
#app {
  font-family: var(--font-en);
}

/* Language-specific font settings */
[lang="en"] {
  font-family: var(--font-en) !important;
}

[lang="lo"] {
  font-family: var(--font-lo) !important;
}

/* Class-based font settings */
.en {
  font-family: var(--font-en) !important;
}

.lo {
  font-family: var(--font-lo) !important;
}

/* Apply fonts to common Bootstrap components */
.dropdown-menu,
.dropdown-item,
.nav-link,
.btn,
.navbar-nav {
  font-family: inherit;
}
</style>
