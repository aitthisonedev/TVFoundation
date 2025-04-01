import store from "@/store";
import { createRouter, createWebHistory } from "vue-router";
import About from '@/pages/About/About.vue';
import Content from '@/pages/Content/Content.vue';
import BankAccounts from '@/pages/BankAccounts.vue'

const routes = [
  { path: "/", redirect: "/login" },
  {
    path: "/",
    component: () => import("../layouts/default.vue"),
    children: [
      {
        path: "dashboard",
        component: () => import("../pages/dashboard.vue"),
        meta: { title: "Dashboard", requiresAuth: true },
      },
      {
        path: "settings",
        component: () => import("../pages/settings.vue"),
        meta: { title: "Settings", requiresAuth: true },
      },
      {
        path: "users",
        component: () => import("../pages/users.vue"),
        meta: { title: "Users", requiresAuth: true },
      },
      {
        path: "account",
        component: () => import("../pages/account.vue"),
        meta: { title: "Account", requiresAuth: true },
      },
      {
        path: "slider",
        component: () => import("../pages/Slider/Slider.vue"),
        meta: { title: "Slider", requiresAuth: true },
      },
      {
        path: "profile",
        component: () => import("../pages/Profile.vue"),
        meta: { title: "Profile", requiresAuth: true },
      },
      {
        path: "project",
        component: () => import("../pages/Project/Project.vue"),
        meta: { title: "Project", requiresAuth: true },
      },
      {
        path: "teams",
        component: () => import("../pages/TeamManagement.vue"),
        meta: { title: "Teams", requiresAuth: true },
      },
      {
        path: "projectStatus",
        component: () => import("../pages/Project/ProjectStatus.vue"),
        meta: { title: "Project Status", requiresAuth: true },
      },
      {
        path: "groupCompany",
        component: () => import("../pages/SupportCompany.vue"),
        meta: { title: "Group Company Management", requiresAuth: true },
      },
      {
        path: "/about/:tab?",
        name: 'About',
        component: About,
        meta: { title: "About", requiresAuth: true },
      },
      {
        path: "/content/:tab?",
        name: 'Content',
        component: Content,
        meta: { title: "Content", requiresAuth: true },
      },
      {
        path: "businessPartner",
        component: () => import("../pages/BusinessPartner.vue"),
        meta: { title: "Business Partner", requiresAuth: true },
      },
      {
        path: '/products',
        name: 'Products',
        component: () => import('@/pages/Produsts/Product.vue'),
        meta: {
          requiresAuth: true,
          layout: 'Product'
        }
      },
      {
        path: '/product-ads',
        name: 'ProductAds',
        component: () => import('@/pages/Produsts/ProductsAds.vue'),
        meta: {
          requiresAuth: true,
          layout: 'Product'
        }
      },
      {
        path: '/product-categories',
        name: 'ProductCategories',
        component: () => import('@/pages/Produsts/ProductCategories.vue'),
        meta: {
          requiresAuth: true,
          layout: 'Product'
        }
      },
      {
        path: '/tourist-attractions',
        name: 'TouristAttractions',
        component: () => import('@/pages/TouristAttractions/TouristAttraction.vue'),
        meta: {
          requiresAuth: true,
          layout: 'TouristAttraction'
        }
      },
      {
        path: '/tourist-attraction-categories',
        name: 'TouristAttractionCategories',
        component: () => import('@/pages/TouristAttractions/TouristAttractionCategories.vue'),
        meta: {
          requiresAuth: true,
          layout: 'TouristAttraction'
        }
      },
      {
        path: "/tourist-attraction-ads/:tab?",
        name: 'TouristAttractionAds',
        component: () => import('@/pages/TouristAttractions/TouristAttractionAds.vue'),
        meta: { 
          title: "Tourist Attraction Ads", 
          requiresAuth: true,
          layout: 'default'
        },
        props: true
      },
      {
        path: '/news',
        name: 'News',
        component: () => import('@/pages/ືNews/News.vue'),
        meta: {
          requiresAuth: true,
          layout: 'News'
        }
      },
      {
        path: '/news-categories',
        name: 'NewsCategories',
        component: () => import('@/pages/ືNews/NewsCategories.vue'),
        meta: {
          requiresAuth: true,
          layout: 'News'
        }
      },
      {
        path: '/bank-accounts',
        name: 'BankAccounts',
        component: BankAccounts,
        meta: {
          title: 'Bank Accounts',
          requiresAuth: true
        }
      }
    ],
  },
  {
    path: "/",
    component: () => import("../layouts/blank.vue"),
    children: [
      {
        path: "login",
        component: () => import("../pages/login.vue"),
        meta: { title: "Login" },
      },
      {
        path: "register",
        component: () => import("../pages/register.vue"),
        meta: { title: "Register" },
      },
      {
        path: "password-reset",
        component: () => import("../pages/PasswordResetRequest.vue"),
        meta: { title: "Password Reset" },
      },
      {
        path: "reset-password",
        component: () => import("../pages/ResetPassword.vue"),
        meta: { title: "Reset Password" },
      },
      {
        path: "/:pathMatch(.*)*",
        component: () => import("../pages/[...all].vue"),
        meta: { title: "404 - Page Not Found" },
      },
    ],
  },
];

const setTitle = (pageName) => {
  console.log("Setting title for page:", pageName);
  return pageName
    ? `${pageName} | Mea Thao Yai Thong Vanh`
    : "| Mea Thao Yai Thong Vanh";
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const title = to.meta.title || 'Default Title';
  document.title = setTitle(title);

  const isAuthenticated = store.getters.isAuthenticated;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated) {
    next({ path: '/login' });
  } else {
    next();
  }
});

export default router;
