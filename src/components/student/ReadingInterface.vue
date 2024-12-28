// src/components/student/ReadingInterface.vue
<template>
  <div class="mb-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- Breadcrumb -->
      <div class="mb-4 text-sm">
        <button @click="$emit('exit')" class="text-blue-500 hover:text-blue-700">
          ← Back to texts
        </button>
      </div>

      <!-- Current Text Info -->
      <div class="mb-6">
        <h2 class="text-xl font-semibold">
          {{ text.title.replace(/<\/?[^>]+(>|$)/g, '') }}
        </h2>
        <p class="text-gray-600">Chunk {{ chunk.sequence_number }}</p>
      </div>

      <!-- Reading Content -->
      <div class="prose max-w-none mb-6">
        <div v-html="chunk.content"></div>
      </div>
    </div>

    <!-- Question Interface -->
    <QuestionInterface
      :key="chunk.chunk_id"
      :question="question || 'Loading question...'"
      :isSubmitting="isSubmittingAnswer"
      @submit="handleAnswerSubmit"
    />

    <!-- Navigation -->
    <div class="mt-4">
      <button
        @click="handleNextClick"
        class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        :disabled="isLoading || !hasAnsweredQuestion"
      >
        {{ isLoading ? 'Loading...' : 'Next Chunk →' }}
      </button>
      <p v-if="!hasAnsweredQuestion" class="text-sm text-gray-600 mt-2">
        Please answer the question before proceeding to the next chunk.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import QuestionInterface from './QuestionInterface.vue'

const props = defineProps({
  text: {
    type: Object,
    required: true,
  },
  chunk: {
    type: Object,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['exit', 'next', 'submit-answer'])

const isSubmittingAnswer = ref(false)
const hasAnsweredQuestion = ref(false)

// Reset answer state when chunk changes
watch(
  () => props.chunk.chunk_id,
  () => {
    hasAnsweredQuestion.value = false
    console.log('Reset hasAnsweredQuestion for new chunk')
  },
)

const handleAnswerSubmit = async (answer) => {
  isSubmittingAnswer.value = true
  try {
    await emit('submit-answer', answer)
    hasAnsweredQuestion.value = true
  } finally {
    isSubmittingAnswer.value = false
  }
}

const handleNextClick = () => {
  if (hasAnsweredQuestion.value) {
    emit('next')
  }
}
</script>
