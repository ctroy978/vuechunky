// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import TeacherView from '../views/TeacherView.vue'

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
