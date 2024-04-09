// Composables
import {createRouter, createWebHistory} from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    redirect: '/home',
    children: [
      {
        path: '/cost-benefit-analyzer',
        name: 'CostBenefitAnalyzer',
        meta: {title: 'Cost benefit analyzer'},
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "cba" */ '@/views/CostBenefitAnalyzer.vue'),
      },
      {
        path: '/simulation',
        name: 'Simulation',
        meta: {title: 'Simulation'},
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "simulation" */ '@/views/Simulation.vue'),
      },
      {
        path: '/home',
        name: 'Home',
        meta: {title: 'Home'},
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "simulation" */ '@/views/Home.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Use '/' or the correct base URL
  routes,
})

export default router
