// Composables
import {createRouter, createWebHistory} from 'vue-router'
import {useAuth} from "@/mixins/authStatus";
import {apiUrl} from "@/mixins/app";

const { checkStatus } = useAuth();

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    redirect: '/home',
    children: [
      {
        path: '/cost-benefit-analyzer',
        name: 'CostBenefitAnalyzer',
        meta: {title: 'Cost benefit analyzer', requiresAuth: true},
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "cba" */ '@/views/CostBenefitAnalyzer.vue'),
      },
      {
        path: '/assessment',
        name: 'PerformanceAssessment',
        meta: {title: 'Performance Assessment', requiresAuth: true},
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "assessment" */ '@/views/PerformanceAssessment.vue'),
      },
      {
        path: '/home',
        name: 'Home',
        meta: {title: 'Home', requiresAuth: false},
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      },
      {
        path: '/recommender',
        name: 'Recommender',
        meta: {title: 'Recommender', requiresAuth: true},
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "recommender" */ '@/views/Recommender.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Use '/' or the correct base URL
  routes,
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth) {
    try {
      const authStatus = await checkStatus();
      if (authStatus) {
        next();
      } else {
        window.location.href = apiUrl + "/invest4nature/auth/login"; // Redirect to login
      }
    } catch (error) {
      console.error('Error during authentication check:', error);
      next(false);
    }
  } else {
    next();
  }
});

export default router
