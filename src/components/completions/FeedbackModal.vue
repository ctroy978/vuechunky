//src/components/completions/FeedbackModal.vue
<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" role="dialog">
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
      @click="$emit('close')"
    ></div>

    <!-- Modal -->
    <div class="flex items-center justify-center min-h-screen p-4">
      <div
        class="relative bg-white rounded-lg max-w-2xl w-full shadow-xl transform transition-all"
        @click.stop
      >
        <!-- Header -->
        <div class="border-b px-6 py-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">AI Feedback</h3>
            <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
              <span class="sr-only">Close</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="px-6 py-4">
          <!-- Student Info -->
          <div class="mb-4">
            <h4 class="text-sm font-medium text-gray-500">Student</h4>
            <p class="text-gray-900">{{ completion.student_name }}</p>
          </div>

          <!-- Text Info -->
          <div class="mb-4">
            <h4 class="text-sm font-medium text-gray-500">Text</h4>
            <p class="text-gray-900">{{ completion.text_title }}</p>
          </div>

          <!-- Score -->
          <div class="mb-4">
            <h4 class="text-sm font-medium text-gray-500">Score</h4>
            <div class="flex items-center space-x-2">
              <span
                :class="[
                  'px-2 py-1 text-sm font-semibold rounded-full',
                  completion.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                ]"
              >
                {{ completion.passed ? 'Passed' : 'Failed' }}
              </span>
              <span class="text-gray-900">{{ completion.correct_answers }}/5</span>
            </div>
          </div>

          <!-- Feedback -->
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-2">AI Feedback</h4>
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-gray-700 whitespace-pre-wrap">{{ completion.ai_feedback }}</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t px-6 py-4">
          <div class="flex justify-end">
            <button
              @click="$emit('close')"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  completion: {
    type: Object,
    required: true,
  },
})

defineEmits(['close'])
</script>
