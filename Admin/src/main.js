/* eslint-disable import/order */
import '@/@iconify/icons-bundle';
import App from '@/App.vue';
import vuetify from '@/plugins/vuetify';
import { loadFonts } from '@/plugins/webfontloader';
import router from '@/router';
import '@core/scss/template/index.scss';
import '@layouts/styles/index.scss';
import '@styles/styles.scss';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import store from './store/index';
import 'vuetify/dist/vuetify.min.css';


loadFonts();
// Create Vue app
const app = createApp(App);

// Use plugins
app.use(vuetify);
app.use(createPinia());
app.use(router);
app.use(store);

// Mount Vue app
app.mount('#app');

// Add event listeners for user activity
['click', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(event => {
  window.addEventListener(event, () => {
    store.dispatch('resetInactivityTimer');
  });
});
