//src/components/student/QuestionInterface.vue
<template>
  <div class="bg-white rounded-lg shadow-md p-6 mt-4" style="margin-left: 200px">
    <div class="mb-6">
      <template v-if="hasFeedback">
        <h3 class="text-lg font-semibold mb-2">Feedback</h3>
        <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <p class="text-blue-700">{{ feedback }}</p>
        </div>

        <h3 class="text-lg font-semibold mb-2">Next Question</h3>
        <div class="bg-gray-50 p-4 rounded-md">
          <p class="text-gray-800">{{ nextQuestion }}</p>
        </div>
      </template>
      <template v-else>
        <h3 class="text-lg font-semibold mb-2">Comprehension Question</h3>
        <div class="bg-gray-50 p-4 rounded-md">
          <p class="text-gray-800">{{ question }}</p>
        </div>
      </template>
    </div>

    <div class="mb-4">
      <label for="answer" class="block text-sm font-medium text-gray-700 mb-2"> Your Answer </label>
      <textarea
        id="answer"
        v-model="answerText"
        rows="4"
        maxlength="600"
        class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type your answer here..."
        :disabled="props.isSubmitting"
      ></textarea>
    </div>

    <div v-if="error" class="text-red-500 text-sm mb-4">
      {{ error }}
    </div>

    <BaseButton
      variant="success"
      @mousedown.prevent="debouncedSubmit"
      :disabled="props.isSubmitting || !answerText.trim()"
    >
      {{ props.isSubmitting ? 'Submitting...' : 'Submit Answer' }}
    </BaseButton>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'

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
const localSubmitting = ref(false)

// Parse feedback and question from the combined string
const hasFeedback = computed(() => props.question.includes('Feedback:'))
const feedback = computed(() => {
  if (!hasFeedback.value) return ''
  const match = props.question.match(/Feedback: (.*?)\n\nAnswer the Following:/)
  return match ? match[1].trim() : ''
})
const nextQuestion = computed(() => {
  if (!hasFeedback.value) return ''
  const match = props.question.match(/Answer the Following: (.*)$/)
  return match ? match[1].trim() : ''
})

// Create a debounced submit function
const debouncedSubmit = (e) => {
  // Immediately prevent default behavior
  e?.preventDefault()

  if (localSubmitting.value) {
    console.log('QuestionInterface: Prevented duplicate submission')
    return
  }

  localSubmitting.value = true

  if (!answerText.value.trim()) {
    error.value = 'Please provide an answer'
    localSubmitting.value = false
    return
  }

  error.value = ''
  emit('submit', answerText.value)

  // Longer delay to ensure we don't get bounced clicks
  setTimeout(() => {
    localSubmitting.value = false
  }, 250)
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
