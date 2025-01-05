//src/views/AdminTextsView.vue
<template>
  <div class="container mx-auto p-4">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Text Management</h1>
          <div class="border-blue-500 border-b-2 w-32 mt-2"></div>
        </div>
        <button @click="router.push('/admin')" class="px-4 py-2 text-gray-700 hover:text-gray-900">
          ← Back to Dashboard
        </button>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex gap-4">
        <div class="flex-1">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search texts by title..."
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="handleSearch"
          />
        </div>
      </div>
    </div>

    <!-- Texts List -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div v-if="isLoading" class="text-center py-4">Loading texts...</div>

      <div v-else-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
        <div class="flex">
          <div class="ml-3">
            <p class="text-sm text-red-700">{{ error }}</p>
            <button
              @click="loadTexts"
              class="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>

      <div v-else>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Title
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Teacher
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Created
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="text in filteredTexts" :key="text.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ text.title }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ text.teacher_name }}</div>
                <div class="text-sm text-gray-500">{{ text.teacher_email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ new Date(text.created_at).toLocaleDateString() }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="handleDelete(text)"
                  class="text-red-600 hover:text-red-900"
                  :disabled="isDeletingMap[text.id]"
                >
                  {{ isDeletingMap[text.id] ? 'Deleting...' : 'Delete' }}
                </button>
              </td>
            </tr>
            <tr v-if="filteredTexts.length === 0">
              <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
                No texts found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { adminDeleteText, getAllTexts } from '../services/api'

const router = useRouter()
const texts = ref([])
const isLoading = ref(true)
const error = ref('')
const searchQuery = ref('')
const isDeletingMap = ref({})

// Filter texts based on search query
const filteredTexts = computed(() => {
  if (!searchQuery.value) return texts.value
  const query = searchQuery.value.toLowerCase()
  return texts.value.filter(
    (text) =>
      text.title.toLowerCase().includes(query) || text.teacher_name.toLowerCase().includes(query),
  )
})

// Load all texts
const loadTexts = async () => {
  isLoading.value = true
  error.value = ''
  try {
    const response = await getAllTexts()
    texts.value = response
  } catch (err) {
    error.value = 'Failed to load texts'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

// Handle text deletion
const handleDelete = async (text) => {
  if (!confirm(`Are you sure you want to delete "${text.title}"? This action cannot be undone.`)) {
    return
  }

  isDeletingMap.value[text.id] = true
  try {
    await adminDeleteText(text.id)
    await loadTexts()
  } catch (err) {
    error.value = 'Failed to delete text'
    console.error(err)
  } finally {
    isDeletingMap.value[text.id] = false
  }
}

// Handle search input
const handleSearch = () => {
  // Debouncing could be added here if needed
}

onMounted(() => {
  loadTexts()
})
</script>
