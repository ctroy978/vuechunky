//src/components/completions/CompletionsTable.vue
<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="header in headers"
            :key="header.key"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ header.label }}
          </th>
          <th
            class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="completion in completions" :key="completion.id">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">{{ completion.student_name }}</div>
            <div class="text-sm text-gray-500">{{ completion.student_email }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">{{ completion.text_title }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">
              {{ new Date(completion.completed_at).toLocaleDateString() }}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span
              :class="[
                'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                completion.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
              ]"
            >
              {{ completion.passed ? 'Passed' : 'Failed' }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ completion.correct_answers }}/5
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button
              @click="$emit('view-feedback', completion)"
              class="text-blue-600 hover:text-blue-900"
            >
              View Feedback
            </button>
          </td>
        </tr>
        <tr v-if="completions.length === 0">
          <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
            No completions found
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  completions: {
    type: Array,
    required: true,
  },
})

defineEmits(['view-feedback'])

const headers = ref([
  { key: 'student', label: 'Student' },
  { key: 'text', label: 'Text' },
  { key: 'date', label: 'Completed' },
  { key: 'status', label: 'Status' },
  { key: 'score', label: 'Score' },
])
</script>
