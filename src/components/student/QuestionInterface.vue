// src/components/student/QuestionInterface.vue
<template>
  <div class="bg-white rounded-lg shadow-md p-6 mt-4" style="margin-left: 200px">
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-2">Comprehension Question</h3>
      <p class="text-gray-800">{{ question }}</p>
    </div>

    <div class="mb-4">
      <label for="answer" class="block text-sm font-medium text-gray-700 mb-2"> Your Answer </label>
      <textarea
        id="answer"
        v-model="answerText"
        rows="4"
        class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type your answer here..."
        :disabled="isSubmitting"
      ></textarea>
    </div>

    <div v-if="error" class="text-red-500 text-sm mb-4">
      {{ error }}
    </div>

    <button
      @click="submitAnswer"
      class="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
      :disabled="isSubmitting || !answerText.trim()"
    >
      {{ isSubmitting ? 'Submitting...' : 'Submit Answer' }}
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  question: {
    type: String,
    required: true,
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit'])

const answerText = ref('')
const error = ref('')

const submitAnswer = () => {
  if (!answerText.value.trim()) {
    error.value = 'Please provide an answer'
    return
  }
  error.value = ''
  emit('submit', answerText.value)
}

// Reset answer when question changes
watch(
  () => props.question,
  () => {
    answerText.value = ''
    error.value = ''
  },
)
</script>
