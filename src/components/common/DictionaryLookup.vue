<!-- src/components/common/DictionaryLookup.vue -->
<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      class="fixed bg-white rounded-lg shadow-lg p-4 max-w-sm z-50"
      :style="popupStyle"
      @mousedown.stop
    >
      <!-- Header -->
      <div class="flex justify-between items-center mb-2">
        <h3 class="font-bold text-lg">{{ selectedWord }}</h3>
        <button @click="closePopup" class="text-gray-500 hover:text-gray-700">×</button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-gray-600">Loading...</div>

      <!-- Error State -->
      <div v-if="error" class="text-red-500">
        {{ error }}
      </div>

      <!-- Definition Content -->
      <div v-if="definition && !isLoading && !error" class="text-sm">
        <div v-for="(meaning, index) in definition.meanings" :key="index" class="mb-2">
          <div class="font-medium text-gray-700">
            {{ meaning.partOfSpeech }}
          </div>
          <ul class="list-disc list-inside">
            <li
              v-for="(def, idx) in meaning.definitions.slice(0, 2)"
              :key="idx"
              class="text-gray-600"
            >
              {{ def.definition }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

// State variables
const selectedWord = ref('')
const definition = ref(null)
const position = ref({ x: 0, y: 0 })
const isVisible = ref(false)
const isLoading = ref(false)
const error = ref(null)

// Computed style for popup positioning
const popupStyle = computed(() => ({
  left: `${position.value.x}px`,
  top: `${position.value.y}px`,
}))

// Function to fetch definition from API
async function fetchDefinition(word) {
  try {
    isLoading.value = true
    error.value = null
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    if (!response.ok) {
      throw new Error('Word not found')
    }
    const data = await response.json()
    definition.value = data[0]
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

// Function to handle double-click
function handleDoubleClick(e) {
  const selection = window.getSelection()
  const word = selection.toString().trim().toLowerCase()

  if (word) {
    selectedWord.value = word

    // Get selection coordinates
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    // Calculate popup position
    const viewportWidth = window.innerWidth
    const popupWidth = 320 // max-w-sm is typically 24rem = 384px

    let xPosition = rect.left
    if (xPosition + popupWidth > viewportWidth) {
      xPosition = viewportWidth - popupWidth - 20 // 20px padding from viewport edge
    }

    position.value = {
      x: xPosition,
      y: rect.top + window.scrollY - 10, // 10px above selection
    }

    isVisible.value = true
    fetchDefinition(word)
  }
}

// Function to close popup
function closePopup() {
  isVisible.value = false
  selectedWord.value = ''
  definition.value = null
  error.value = null
}

// Function to handle clicks outside popup
function handleClickOutside(e) {
  if (isVisible.value && !e.target.closest('.popup')) {
    closePopup()
  }
}

// Function to handle window resize
function handleResize() {
  if (isVisible.value) {
    const viewportWidth = window.innerWidth
    const popupWidth = 320

    position.value = {
      x: Math.min(position.value.x, viewportWidth - popupWidth - 20),
      y: position.value.y,
    }
  }
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('dblclick', handleDoubleClick)
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  document.removeEventListener('dblclick', handleDoubleClick)
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', handleResize)
})
</script>
