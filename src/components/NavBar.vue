//src/components/NavBar.vue
<template>
  <nav class="bg-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between h-16">
        <!-- Logo and Brand -->
        <div class="flex items-center">
          <router-link
            to="/"
            class="text-xl font-bold"
            :class="{
              'text-blue-700': currentRoute === '/',
              'text-blue-600 hover:text-blue-700': currentRoute !== '/',
            }"
          >
            uMa
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-4">
          <template v-if="isAuthenticated">
            <router-link to="/student" :class="getLinkClasses('/student')">
              Student View
            </router-link>
            <div class="flex items-center space-x-2 text-gray-700 px-3 py-2">
              <UserIcon class="w-5 h-5" />
              <span>{{ userData.full_name || userData.username }}</span>
            </div>
            <button
              @click="handleLogout"
              class="flex items-center space-x-1 text-red-600 hover:text-red-700 px-3 py-2"
            >
              <LogOutIcon class="w-5 h-5" />
              <span>Logout</span>
            </button>
          </template>
          <template v-else>
            <router-link to="/login" :class="getLinkClasses('/login')"> Login </router-link>
            <router-link
              to="/register"
              :class="[
                'px-4 py-2 rounded-md transition-colors duration-200',
                currentRoute === '/register'
                  ? 'bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white',
              ]"
            >
              Register
            </router-link>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden flex items-center">
          <button @click="isOpen = !isOpen" class="text-gray-700">
            <template v-if="isOpen">
              <XIcon class="w-6 h-6" />
            </template>
            <template v-else>
              <MenuIcon class="w-6 h-6" />
            </template>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isOpen" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <template v-if="isAuthenticated">
          <router-link to="/student" :class="getMobileLinkClasses('/student')">
            Student View
          </router-link>
          <div class="flex items-center space-x-2 text-gray-700 px-3 py-2">
            <UserIcon class="w-5 h-5" />
            <span>{{ userData.full_name || userData.username }}</span>
          </div>
          <button
            @click="handleLogout"
            class="flex items-center space-x-1 text-red-600 hover:text-red-700 px-3 py-2 w-full"
          >
            <LogOutIcon class="w-5 h-5" />
            <span>Logout</span>
          </button>
        </template>
        <template v-else>
          <router-link to="/login" :class="getMobileLinkClasses('/login')"> Login </router-link>
          <router-link to="/register" :class="getMobileLinkClasses('/register')">
            Register
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Menu as MenuIcon,
  X as XIcon,
  User as UserIcon,
  LogOut as LogOutIcon,
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const isOpen = ref(false)
const isAuthenticated = ref(false)
const userData = ref({
  username: '',
  email: '',
  full_name: '',
})

const currentRoute = computed(() => route.path)

const checkAuthStatus = () => {
  const token = localStorage.getItem('token')

  if (!token) {
    isAuthenticated.value = false
    userData.value = {
      username: '',
      email: '',
      full_name: '',
    }
    return
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    isAuthenticated.value = true
    userData.value = {
      username: payload.username || '',
      email: payload.sub || '',
      full_name: payload.full_name || '',
    }
  } catch (error) {
    console.error('Error decoding token:', error)
    handleLogout()
  }
}

const handleLogout = () => {
  localStorage.removeItem('token')
  isAuthenticated.value = false
  userData.value = {
    username: '',
    email: '',
    full_name: '',
  }
  router.push('/login')
}

const getLinkClasses = (path) => {
  const baseClasses = 'px-3 py-2 transition-colors duration-200'
  const isActive = currentRoute.value === path

  return isActive
    ? `${baseClasses} text-blue-600 font-medium bg-blue-50 rounded-md`
    : `${baseClasses} text-gray-700 hover:text-blue-600`
}

const getMobileLinkClasses = (path) => {
  const baseClasses = 'block px-3 py-2 rounded-md'
  const isActive = currentRoute.value === path

  return isActive
    ? `${baseClasses} text-blue-600 font-medium bg-blue-50`
    : `${baseClasses} text-gray-700 hover:text-blue-600 hover:bg-gray-50`
}

// Check auth status when component mounts
onMounted(() => {
  checkAuthStatus()
})
</script>
