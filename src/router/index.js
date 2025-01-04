// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import StudentView from '../views/StudentView.vue'
import TeacherView from '../views/TeacherView.vue'
import TeacherCompletionsView from '../views/TeacherCompletionsView.vue'
import TestView from '../views/TestView.vue'
import TestResultView from '../views/TestResultView.vue'

// Helper function to check if user is logged in
const isAuthenticated = () => {
  return !!localStorage.getItem('token')
}

// Helper function to check if user is a teacher
const isTeacher = () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return false
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.is_teacher === true
  } catch (error) {
    console.error('Error checking teacher status:', error)
    return false
  }
}

// Debug helper - log navigation attempts
const logNavigation = (to, from, requiresTeacher = false) => {
  console.log('Navigation Debug:', {
    to: to.path,
    from: from.path,
    requiresTeacher,
    isAuthenticated: isAuthenticated(),
    isTeacher: isTeacher(),
    token: localStorage.getItem('token'),
  })
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/register',
    component: () => import('../views/StudentRegisterView.vue'),
  },
  {
    path: '/student',
    name: 'student',
    component: StudentView,
    meta: { requiresAuth: true },
  },
  {
    path: '/teacher',
    name: 'teacher',
    component: TeacherView,
    meta: { requiresAuth: true, requiresTeacher: true },
  },
  {
    path: '/teacher/completions',
    name: 'teacher-completions',
    component: TeacherCompletionsView,
    meta: { requiresAuth: true, requiresTeacher: true },
  },
  {
    path: '/test/:textId',
    name: 'test',
    component: TestView,
    meta: { requiresAuth: true },
  },
  {
    path: '/test-results/:textId',
    name: 'test-results',
    component: TestResultView,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard
router.beforeEach((to, from, next) => {
  // Add debug logging
  logNavigation(
    to,
    from,
    to.matched.some((record) => record.meta.requiresTeacher),
  )
  // Check if route requires authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      })
      return
    }

    // Check if route requires teacher role
    if (to.matched.some((record) => record.meta.requiresTeacher)) {
      if (!isTeacher()) {
        next({ path: '/' }) // Redirect to home if not a teacher
        return
      }
    }
  }

  // If logged in and trying to access login page, redirect to home
  if (to.path === '/login' && isAuthenticated()) {
    next({ path: '/' })
    return
  }

  next()
})

export default router
