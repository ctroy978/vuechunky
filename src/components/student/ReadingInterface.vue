// src/components/student/ReadingInterface.vue
<template>
  <div class="mb-8">
    <!-- Error Alert -->
    <div v-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
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
          <p class="text-sm text-red-700">
            {{ error }}
            <button @click="retryLastAction" class="ml-2 font-medium text-red-700 underline">
              Retry
            </button>
          </p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6" style="margin-left: 200px">
      <!-- Progress Bar -->
      <div class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm text-gray-600">Progress</span>
          <span class="text-sm font-medium text-gray-900">
            Chunk {{ chunk.sequence_number }} of {{ totalChunks }}
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div
            class="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            :style="{ width: `${(chunk.sequence_number / totalChunks) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Breadcrumb -->
      <div class="mb-4 text-sm">
        <BaseButton variant="text" @click="handleExit"> ← Back to texts </BaseButton>
      </div>

      <!-- Current Text Info -->
      <div class="mb-6">
        <h2 class="text-xl font-semibold">
          {{ text.title.replace(/<\/?[^>]+(>|$)/g, '') }}
        </h2>
        <p class="text-gray-600">Chunk {{ chunk.sequence_number }} of {{ totalChunks }}</p>
      </div>

      <!-- Reading Content -->
      <div style="max-width: 65ch">
        <div class="mb-6">
          <div
            v-html="chunk.content"
            class="text-xl leading-relaxed text-gray-900 font-readable max-w-prose"
            style="max-width: 65ch"
          ></div>
        </div>
      </div>
    </div>

    <QuestionInterface
      :key="chunk.chunk_id"
      :question="question || 'Loading question...'"
      :isSubmitting="isSubmittingAnswer"
      :onSubmit="handleAnswerSubmit"
      :error="questionError"
    />

    <!-- Navigation -->
    <div class="mt-4">
      <BaseButton
        variant="primary"
        @click="handleNextClick"
        :disabled="isLoading || !hasAnsweredQuestion"
      >
        {{ isLoading ? 'Loading...' : 'Next Chunk →' }}
      </BaseButton>
      <p v-if="!hasAnsweredQuestion" class="text-sm text-gray-600 mt-2">
        Please answer the question before proceeding to the next chunk.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import QuestionInterface from './QuestionInterface.vue'
import BaseButton from '@/components/common/BaseButton.vue'

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
  totalChunks: {
    type: Number,
    required: true,
  },
  hasAnsweredQuestion: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['exit', 'next', 'submit-answer', 'retry'])

const isSubmittingAnswer = ref(false)
const error = ref('')
const questionError = ref('')
const lastAction = ref(null)

// Reset states when chunk changes
watch(
  () => props.chunk.chunk_id,
  () => {
    error.value = ''
    questionError.value = ''
    console.log('Reset states for new chunk')
  },
)

// ReadingInterface.vue
const handleAnswerSubmit = async (answer) => {
  console.log('ReadingInterface: handleAnswerSubmit called', Date.now())

  // Add submission guard
  if (isSubmittingAnswer.value) {
    console.log('ReadingInterface: Prevented duplicate submission')
    return
  }

  isSubmittingAnswer.value = true
  questionError.value = ''
  lastAction.value = 'submit'

  try {
    // Change to single emit without await
    emit('submit-answer', answer)
  } catch (err) {
    questionError.value = 'Failed to submit answer. Please try again.'
  } finally {
    // Add slight delay before allowing new submissions
    setTimeout(() => {
      isSubmittingAnswer.value = false
    }, 100)
  }
}

const handleNextClick = () => {
  if (props.hasAnsweredQuestion) {
    error.value = ''
    lastAction.value = 'next'
    emit('next')
  }
}

const handleExit = () => {
  // If they've answered the question, just exit without confirmation
  if (props.hasAnsweredQuestion) {
    emit('exit')
    return
  }

  // Otherwise emit exit - the parent component can handle confirmation if needed
  emit('exit')
}

const retryLastAction = () => {
  error.value = ''
  emit('retry', lastAction.value)
}
</script>
