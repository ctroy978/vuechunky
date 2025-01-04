//src/views/TeacherCompletionsView.vue
<template>
  <div class="container mx-auto p-4">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Student Reading Completions</h1>
      <div class="border-blue-500 border-b-2 w-32 mt-2"></div>
    </div>

    <!-- Search Filters -->
    <CompletionFilters
      v-model:studentName="filters.studentName"
      v-model:textTitle="filters.textTitle"
      v-model:fromDate="filters.fromDate"
      v-model:toDate="filters.toDate"
      v-model:passStatus="filters.passStatus"
      @filter="loadCompletions"
      @clear="clearFilters"
    />

    <!-- Results Table -->
    <div class="bg-white rounded-lg shadow-md mt-6">
      <div v-if="isLoading" class="p-8 text-center">
        <p class="text-gray-600">Loading completions...</p>
      </div>

      <div v-else-if="error" class="p-8">
        <div class="bg-red-50 border-l-4 border-red-400 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">{{ error }}</p>
              <button
                @click="loadCompletions"
                class="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <CompletionsTable :completions="completions" @view-feedback="openFeedbackModal" />

        <!-- Pagination -->
        <div class="px-6 py-4 border-t">
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-700">Showing {{ completions.length }} results</p>
            <div class="flex items-center space-x-2">
              <button
                @click="loadPreviousPage"
                :disabled="currentPage === 1"
                class="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span class="text-sm text-gray-600">Page {{ currentPage }}</span>
              <button
                @click="loadNextPage"
                :disabled="completions.length < pageSize"
                class="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Feedback Modal -->
    <FeedbackModal
      v-if="selectedCompletion"
      :isOpen="!!selectedCompletion"
      :completion="selectedCompletion"
      @close="selectedCompletion = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CompletionFilters from '../components/completions/CompletionFilters.vue'
import CompletionsTable from '../components/completions/CompletionsTable.vue'
import FeedbackModal from '../components/completions/FeedbackModal.vue'
import { getCompletions } from '../services/api'

// State
const completions = ref([])
const isLoading = ref(false)
const error = ref('')
const selectedCompletion = ref(null)
const currentPage = ref(1)
const pageSize = 50

// Filters state
const filters = ref({
  studentName: '',
  textTitle: '',
  fromDate: null,
  toDate: null,
  passStatus: null,
})

// In TeacherCompletionsView.vue, modify loadCompletions:
const loadCompletions = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const params = {
      skip: (currentPage.value - 1) * pageSize,
      limit: pageSize,
    }

    // Handle each filter properly
    if (filters.value.studentName?.trim()) {
      params.student_name = filters.value.studentName.trim()
    }

    if (filters.value.textTitle?.trim()) {
      params.text_title = filters.value.textTitle.trim()
    }

    if (filters.value.passStatus) {
      params.passed = filters.value.passStatus === 'true'
    }

    // Handle dates
    if (filters.value.fromDate) {
      params.from_date = new Date(filters.value.fromDate).toISOString()
    }

    if (filters.value.toDate) {
      params.to_date = new Date(filters.value.toDate).toISOString()
    }

    // Remove any undefined or null values
    Object.keys(params).forEach((key) => {
      if (params[key] === null || params[key] === undefined || params[key] === '') {
        delete params[key]
      }
    })

    const response = await getCompletions(params)
    completions.value = response
  } catch (err) {
    error.value = err.message || 'Failed to load completions'
  } finally {
    isLoading.value = false
  }
}

// Pagination handlers
const loadNextPage = () => {
  if (completions.value.length === pageSize) {
    currentPage.value++
    loadCompletions()
  }
}

const loadPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadCompletions()
  }
}

// Modal handlers
const openFeedbackModal = (completion) => {
  selectedCompletion.value = completion
}

// Filter handlers
const clearFilters = () => {
  filters.value = {
    studentName: '',
    textTitle: '',
    fromDate: null,
    toDate: null,
    passStatus: null,
  }
  currentPage.value = 1
  loadCompletions()
}

onMounted(() => {
  loadCompletions()
})
</script>
