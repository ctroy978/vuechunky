<template>
  <div class="container mx-auto p-4">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Student Reading</h1>
      <div class="border-blue-500 border-b-2 w-32 mt-2"></div>
    </div>

    <!-- Reading Interface -->
    <div v-if="currentChunk">
      <!-- Review Previous Button -->
      <div class="flex justify-end mb-4" style="margin-left: 200px">
        <button
          @click="
            () => {
              console.log('Opening modal, previousChunks:', previousChunks)
              showReviewModal = true
            }
          "
          class="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          :disabled="previousChunks.length === 0"
        >
          Review Previous Chunks
        </button>
      </div>

      <ReadingInterface
        :text="currentText"
        :chunk="currentChunk"
        :question="currentQuestion"
        :isLoading="isLoading"
        :totalChunks="currentText?.total_chunks || 1"
        :hasAnsweredQuestion="hasAnsweredQuestion"
        :onSubmitAnswer="handleAnswerSubmit"
        @exit="exitReading"
        @next="loadNextChunk"
        @retry="handleRetry"
      />

      <!-- Review Modal -->
      <ReviewModal
        :isOpen="showReviewModal"
        :previousChunks="previousChunks"
        @close="showReviewModal = false"
      />
    </div>

    <!-- Teacher and Text Selection -->
    <template v-else>
      <TeacherList
        v-if="!selectedTeacher"
        :teachers="teachers"
        :isLoading="isLoading"
        @select="selectTeacher"
      />

      <TextList
        v-else
        :teacher="selectedTeacher"
        :texts="texts"
        :isLoading="isLoading"
        @back="selectedTeacher = null"
        @select="startReading"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  getTeachers,
  getTeacherTextsForStudent,
  getFirstChunk,
  getNextChunk,
  generateQuestion,
  evaluateAnswer,
  getUserEmailFromToken,
} from '../services/api'
import TeacherList from '../components/student/TeacherList.vue'
import TextList from '../components/student/TextList.vue'
import ReadingInterface from '../components/student/ReadingInterface.vue'
import ReviewModal from '../components/student/ReviewModal.vue'

// State
const teachers = ref([])
const selectedTeacher = ref(null)
const texts = ref([])
const currentText = ref(null)
const currentChunk = ref(null)
const currentQuestion = ref('')
const isLoading = ref(false)
const error = ref('')
const showReviewModal = ref(false)
const previousChunks = ref([])
const hasAnsweredQuestion = ref(false) // Add this line here
const router = useRouter()

//emit to readinginterface
const emit = defineEmits(['updateHasAnsweredQuestion'])

// Load question for current chunk
const loadQuestion = async (chunkId, textId) => {
  try {
    const response = await generateQuestion(chunkId, textId)
    currentQuestion.value = response.question
  } catch (err) {
    console.error('Failed to load question:', err)
    currentQuestion.value = 'The AI is not responding properly. Please retry or contact Admin.' // Fallback question
  }
}

const handleAnswerSubmit = async (answer) => {
  if (isLoading.value) {
    return { can_proceed: false }
  }

  isLoading.value = true

  try {
    const response = await evaluateAnswer({
      chunk_id: currentChunk.value.chunk_id,
      text_id: currentText.value.id,
      user_email: getUserEmailFromToken(),
      answer: answer,
      current_question: currentQuestion.value,
    })

    // If we get a response, format it appropriately
    if (response.message) {
      currentQuestion.value = response.question
        ? `Feedback: ${response.message}\n\nAnswer the Following: ${response.question}`
        : `Feedback: ${response.message}`
    }

    hasAnsweredQuestion.value = response.can_proceed

    return response
  } catch (err) {
    console.error('Error evaluating answer:', err)
    return {
      can_proceed: false,
      message: 'Failed to evaluate answer. Please try again.',
    }
  } finally {
    setTimeout(() => {
      isLoading.value = false
    }, 100)
  }
}

const handleRetry = async (action) => {
  if (action === 'next') {
    await loadNextChunk()
  } else if (action === 'submit') {
    // Re-submit last answer if needed
  }
}

// Load initial teachers list
const loadTeachers = async () => {
  isLoading.value = true
  try {
    teachers.value = await getTeachers()
  } catch (err) {
    error.value = 'Failed to load teachers'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

// Select a teacher and load their texts
const selectTeacher = async (teacher) => {
  selectedTeacher.value = teacher
  isLoading.value = true
  try {
    texts.value = await getTeacherTextsForStudent(teacher.id)
  } catch (err) {
    error.value = 'Failed to load texts'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const startReading = async (text) => {
  currentText.value = text
  previousChunks.value = [] // Reset previous chunks
  hasAnsweredQuestion.value = false
  isLoading.value = true
  try {
    const chunk = await getFirstChunk(text.id)
    currentChunk.value = chunk
    if (chunk && (chunk.id || chunk.chunk_id)) {
      await loadQuestion(chunk.chunk_id || chunk.id, text.id)
    } else {
      console.error('Invalid chunk data:', chunk)
    }
  } catch (err) {
    error.value = 'Failed to load text chunk'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

// In StudentView.vue, modify this section:

const loadNextChunk = async () => {
  if (!currentChunk.value) return
  hasAnsweredQuestion.value = false
  isLoading.value = true
  try {
    // Store current chunk in previousChunks before loading next, avoiding duplicates
    const chunkExists = previousChunks.value.some(
      (chunk) =>
        chunk.chunk_id === currentChunk.value.chunk_id ||
        chunk.sequence_number === currentChunk.value.sequence_number,
    )
    if (!chunkExists) {
      previousChunks.value.push({ ...currentChunk.value })
    }

    const nextChunk = await getNextChunk(currentText.value.id, currentChunk.value.chunk_id)
    currentChunk.value = nextChunk
    if (nextChunk && (nextChunk.id || nextChunk.chunk_id)) {
      await loadQuestion(nextChunk.chunk_id || nextChunk.id, currentText.value.id)
    } else {
      console.error('Invalid next chunk data:', nextChunk)
    }
  } catch (err) {
    if (err.message === 'No more chunks available') {
      // Remove the textTitle parameter here
      router.push({
        name: 'test',
        params: {
          textId: currentText.value.id,
        },
      })
    } else {
      error.value = 'Failed to load next chunk'
      console.error('Error details:', err)
    }
  } finally {
    isLoading.value = false
  }
}

const exitReading = () => {
  // Show confirmation only if user hasn't answered current question
  if (
    currentChunk.value &&
    !confirm('Are you sure you want to exit? Your progress on this chunk will be lost.')
  ) {
    return
  }

  currentText.value = null
  currentChunk.value = null
  currentQuestion.value = ''
  previousChunks.value = []
  showReviewModal.value = false
  hasAnsweredQuestion.value = false // Add this line
}

onMounted(loadTeachers)
</script>
