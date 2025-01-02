// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import TeacherView from '../views/TeacherView.vue'
import TestResultView from '@/views/TestResultView.vue'

const routes = [
  {
    path: '/',
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    component: LoginView,
  },
  {
    path: '/register',
    component: () => import('../views/StudentRegisterView.vue'),
  },
  {
    path: '/teacher',
    component: TeacherView,
    meta: { requiresAuth: true },
  },
  {
    path: '/student',
    component: () => import('../views/StudentView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/test/:textId',
    name: 'test',
    component: () => import('../views/TestView.vue'),
    props: true,
    meta: { requiresAuth: true },
  },
  // src/router/index.js
  {
    path: '/test-results/:textId',
    name: 'test-results',
    component: () => import('../views/TestResultView.vue'),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
