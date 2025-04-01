import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Shop from '../views/Shop.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Home' }
  },
  {
    path: '/about-us',
    name: 'AboutUs',
    component: () => import('../views/AboutUs.vue'),
    meta: { title: 'About Us' }
  },
  {
    path: '/support',
    name: 'support',
    component: () => import('../views/Support.vue'),
    meta: { title: 'Support' }
  },
  {
    path: '/news',
    name: 'news',
    component: () => import('../views/News.vue'),
    meta: { title: 'News' }
  },
  {
    path: '/services',
    name: 'services',
    component: () => import('../views/Services.vue'),
    meta: { title: 'Services' }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('../views/Projects.vue'),
    meta: { title: 'Projects' }
  },
  {
    path: '/projects/:id',
    name: 'ProjectDetail',
    component: () => import('../components/project/ProjectDetail.vue'),
    meta: { title: 'Project Detail' }
  },
  {
    path: '/contact-us',
    name: 'ContactUs',
    component: () => import('../views/ContactUs.vue'),
    meta: { title: 'Contact Us' }
  },
  {
    path: '/services/products',
    name: 'Products',
    component: () => import('../views/Shop.vue'),
    meta: { title: 'Products' }
  },
  {
    path: '/services/tourist-attractions',
    name: 'TouristAttractions',
    component: () => import('../views/TouristAttractions.vue'),
    meta: { title: 'Tourist Attractions' }
  },
  {
    path: '/services/products/:id',
    name: 'ProductDetail',
    component: () => import('../components/shop/ProductDetail.vue'),
    meta: { title: 'Product Detail' }
  },
  {
    path: '/tourist/:id',
    name: 'TouristDetail',
    component: () => import('../components/Tourist/TouristDetail.vue'),
    meta: { title: 'Tourist Detail' }
  },
  {
    path: '/tourist',
    name: 'TouristList',
    component: () => import('../components/Tourist/TouristList.vue'),
    meta: { title: 'Tourist Attractions' }
  },
  {
    path: '/news/:id',
    name: 'NewsCardDetail',
    component: () => import('../components/News/NewsCardDetail.vue')
  },
  {
    path: '/shop',
    name: 'Shop',
    component: Shop
  },
  {
    path: '/search',
    name: 'SearchResults',
    component: () => import('@/views/SearchResults.vue'),
    meta: {
      title: 'Search Results'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { title: '404 Not Found' }
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Add error handling to navigation guard
router.beforeEach((to, from, next) => {
  const followTitle = '|| Mea Thao Yai Thongvanh Foundation'
  const defaultTitle = 'Mea Thao Yai Thongvanh Foundation'
  
  try {
    if (to.name === 'ProjectDetail' && to.params.id) {
      document.title = `Project ${to.params.id} ${followTitle}`
    } else {
      document.title = to.meta.title ? `${to.meta.title} ${followTitle}` : defaultTitle
    }
    next()
  } catch (error) {
    console.error('Navigation error:', error)
    next('/')
  }
})

export default router 