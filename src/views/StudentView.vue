// src/views/StudentView.vue
<template>
  <div class="container mx-auto p-4">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Student Reading</h1>
      <div class="border-blue-500 border-b-2 w-32 mt-2"></div>
    </div>

    <!-- Reading Interface -->
    <ReadingInterface
      v-if="currentChunk"
      :text="currentText"
      :chunk="currentChunk"
      :question="currentQuestion"
      :isLoading="isLoading"
      @exit="exitReading"
      @next="loadNextChunk"
      @submit-answer="handleAnswerSubmit"
    />

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

// State
const teachers = ref([])
const selectedTeacher = ref(null)
const texts = ref([])
const currentText = ref(null)
const currentChunk = ref(null)
const currentQuestion = ref('')
const isLoading = ref(false)
const error = ref('')

const loadQuestion = async (chunkId, textId) => {
  try {
    // Handle both id and chunk_id
    const actualChunkId = typeof chunkId === 'object' ? chunkId.chunk_id || chunkId.id : chunkId
    const response = await generateQuestion(actualChunkId, textId)
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

// Load next chunk
const loadNextChunk = async () => {
  if (!currentChunk.value) return

  isLoading.value = true
  try {
    console.log('Current chunk before loading next:', currentChunk.value) // Debug log
    const nextChunk = await getNextChunk(currentText.value.id, currentChunk.value.chunk_id) // Changed from .id to .chunk_id
    console.log('Next chunk received:', nextChunk) // Debug log
    currentChunk.value = nextChunk
    if (nextChunk && (nextChunk.id || nextChunk.chunk_id)) {
      // Check for either id or chunk_id
      await loadQuestion(nextChunk.chunk_id || nextChunk.id, currentText.value.id)
      console.log('Next chunk question loaded:', currentQuestion.value) // Debug log
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

// Exit reading mode
const exitReading = () => {
  currentText.value = null
  currentChunk.value = null
  currentQuestion.value = ''
}

onMounted(loadTeachers)
</script>
