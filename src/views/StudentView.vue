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
        @exit="exitReading"
        @next="loadNextChunk"
        @submit-answer="handleAnswerSubmit"
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
import {
  getTeachers,
  getTeacherTextsForStudent,
  getFirstChunk,
  getNextChunk,
  generateQuestion,
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

// Load question for current chunk
const loadQuestion = async (chunkId, textId) => {
  try {
    const response = await generateQuestion(chunkId, textId)
    console.log('Question loaded:', response) // Debug log
    currentQuestion.value = response.question
  } catch (err) {
    console.error('Failed to load question:', err)
    currentQuestion.value = 'What is the main idea of this passage?' // Fallback question
  }
  console.log('Current question value:', currentQuestion.value) // Debug log
}

// Handle answer submission
const handleAnswerSubmit = async (answer) => {
  // TODO: Implement answer validation/feedback
  // For now, we'll just console.log the answer
  console.log('Student answer:', answer)
  return true // Simulate successful submission
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

const loadNextChunk = async () => {
  if (!currentChunk.value) return

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
      alert('You have completed this text!')
      exitReading()
    } else {
      error.value = 'Failed to load next chunk'
      console.error('Error details:', err)
    }
  } finally {
    isLoading.value = false
  }
}

const exitReading = () => {
  currentText.value = null
  currentChunk.value = null
  currentQuestion.value = ''
  previousChunks.value = []
  showReviewModal.value = false
}

onMounted(loadTeachers)
</script>
