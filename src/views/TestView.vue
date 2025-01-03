<template>
  <div class="container mx-auto p-4">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Final Comprehension Test</h1>
      <h2 class="text-lg text-gray-600 mt-2">{{ textTitle }}</h2>
      <div class="border-blue-500 border-b-2 w-32 mt-2"></div>
    </div>

    <div v-if="isLoading" class="text-center py-8">
      <p class="text-gray-600">Loading test questions...</p>
    </div>

    <div v-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
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
            @click="loadQuestions"
            class="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>

    <div v-if="!isLoading && !error && questions.length > 0" class="max-w-2xl mx-auto">
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <div
          v-for="(question, index) in questions"
          :key="question.sequence"
          class="bg-white rounded-lg shadow-md p-6"
        >
          <div class="mb-4">
            <label :for="'question-' + index" class="block text-lg font-medium text-gray-900 mb-3">
              {{ index + 1 }}. {{ question.question }}
            </label>
            <textarea
              :id="'question-' + index"
              v-model="answers[index]"
              rows="4"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :placeholder="'Enter your answer for question ' + (index + 1)"
            ></textarea>
          </div>
        </div>

        <div class="flex justify-center mt-8">
          <BaseButton
            type="submit"
            variant="primary"
            size="large"
            :disabled="isSubmitting || !isAllAnswered"
          >
            {{ isSubmitting ? 'Submitting...' : 'Submit Test' }}
          </BaseButton>
        </div>
      </form>
    </div>

    <div v-if="!isLoading && !error && questions.length === 0" class="text-center py-8">
      <p class="text-gray-600">No test questions available.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '../components/common/BaseButton.vue'
import { generateTest, submitTest } from '../services/api'

const route = useRoute()
const router = useRouter()

const questions = ref([])
const answers = ref([])
const isLoading = ref(true)
const isSubmitting = ref(false)
const error = ref('')
const textTitle = ref('')

const textId = computed(() => Number(route.params.textId))

const isAllAnswered = computed(() => {
  return answers.value.every((answer) => answer?.trim().length > 0)
})

const loadQuestions = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const response = await generateTest(textId.value)
    questions.value = response.questions
    answers.value = new Array(response.questions.length).fill('')
  } catch (err) {
    error.value = 'Failed to load test questions. Please try again.'
    console.error('Error loading questions:', err)
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  if (!isAllAnswered.value) return

  isSubmitting.value = true
  try {
    const result = await submitTest(textId.value, answers.value)
    localStorage.setItem(
      'testResults',
      JSON.stringify({
        feedback: result.feedback,
        correct: result.correct,
        incorrect: result.incorrect,
        questionsAndAnswers: result.questions_and_answers,
      }),
    )
    router.push(`/test-results/${textId.value}`)
  } catch (err) {
    error.value = 'Failed to submit test. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  try {
    await loadQuestions()
  } catch (err) {
    console.error('Error in initial load:', err)
  }
})
</script>
