<template>
  <div class="container mx-auto p-4 max-w-4xl">
    <h1 class="text-2xl font-bold text-gray-800 mb-8">Test Results</h1>

    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="font-semibold text-lg mb-4">Overall Feedback</h2>
      <p class="text-gray-700">{{ feedback }}</p>

      <div class="mt-4 flex gap-4">
        <div class="bg-green-50 p-4 rounded-md">
          <span class="block text-sm text-green-700">Correct</span>
          <span class="text-2xl font-bold text-green-700">{{ correct }}</span>
        </div>
        <div class="bg-red-50 p-4 rounded-md">
          <span class="block text-sm text-red-700">Incorrect</span>
          <span class="text-2xl font-bold text-red-700">{{ incorrect }}</span>
        </div>
      </div>

      <!-- Questions and Answers Review -->
      <div class="mt-8">
        <h3 class="font-semibold text-lg mb-4">Questions and Answers Review</h3>
        <div class="space-y-6">
          <div v-for="(qa, index) in questionsAndAnswers" :key="index" class="border-b pb-4">
            <p class="font-medium mb-2">Question {{ index + 1 }}: {{ qa.question }}</p>
            <p class="text-gray-700">Your Answer: {{ qa.student_answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const feedback = ref('')
const correct = ref(0)
const incorrect = ref(0)
const questionsAndAnswers = ref([])

onMounted(() => {
  const results = JSON.parse(localStorage.getItem('testResults'))
  if (!results) {
    router.push('/student')
    return
  }

  feedback.value = results.feedback
  correct.value = results.correct
  incorrect.value = results.incorrect
  questionsAndAnswers.value = results.questionsAndAnswers

  localStorage.removeItem('testResults')
})
</script>
