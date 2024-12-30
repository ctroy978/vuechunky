<template>
  <div class="bg-red rounded-lg shadow-md p-6 mt-4" style="margin-left: 200px">
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
import { ref, watch } from 'vue'
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

// Create a debounced submit function
const debouncedSubmit = (e) => {
  // Immediately prevent default behavior
  e?.preventDefault()

  console.log('QuestionInterface: submitAnswer called', Date.now())

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
