// src/views/AdminView.vue
<template>
  <div class="container mx-auto p-4">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
      <div class="border-blue-500 border-b-2 w-32 mt-2"></div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Total Users</h3>
        <p class="text-3xl font-bold text-blue-600">{{ stats.totalUsers || 0 }}</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Active Admins</h3>
        <p class="text-3xl font-bold text-green-600">{{ stats.activeAdmins || 0 }}</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Total Texts</h3>
        <p class="text-3xl font-bold text-purple-600">{{ stats.totalTexts || 0 }}</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">Quick Actions</h2>
      <div class="flex flex-wrap gap-4">
        <button
          @click="router.push('/admin/users')"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Manage Users
        </button>
        <button
          @click="router.push('/admin/texts')"
          class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Manage Texts
        </button>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">Recent Activity</h2>
      <div v-if="recentActivity.length === 0" class="text-gray-500 text-center py-4">
        No recent activity to display
      </div>
      <ul v-else class="space-y-4">
        <li v-for="activity in recentActivity" :key="activity.id" class="border-b pb-4">
          <p class="text-gray-800">{{ activity.description }}</p>
          <span class="text-sm text-gray-500">{{ formatDate(activity.timestamp) }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Placeholder data structure
const stats = ref({
  totalUsers: 0,
  activeAdmins: 0,
  totalTexts: 0,
})

const recentActivity = ref([])

const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

// This will be implemented later to fetch actual data
const fetchDashboardData = async () => {
  try {
    // API calls will go here
    // For now using placeholder data
    stats.value = {
      totalUsers: 0,
      activeAdmins: 0,
      totalTexts: 0,
    }
    recentActivity.value = []
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>
