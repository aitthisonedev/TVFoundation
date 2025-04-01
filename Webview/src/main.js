import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import pinia from './stores/index'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import '@fortawesome/fontawesome-free/css/all.css'
import 'flag-icons/css/flag-icons.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { createMetaManager } from 'vue-meta'

const app = createApp(App)
app.use(router)
app.use(i18n)
app.use(pinia)
app.use(createMetaManager())
app.mount('#app')
