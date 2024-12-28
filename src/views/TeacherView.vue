// src/views/TeacherView.vue
<template>
  <div class="container mx-auto p-4">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
      <div class="border-blue-500 border-b-2 w-32 mt-2"></div>
    </div>

    <!-- Add New Text Form -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">Add New Text</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1"> Title </label>
          <input
            id="title"
            v-model="newText.title"
            type="text"
            required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter text title"
          />
        </div>

        <div>
          <label for="content" class="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <div class="mb-2 text-sm text-gray-600">
            Wrap each section in &lt;chunk&gt; tags, for example:
            <pre class="bg-gray-100 p-2 mt-1 rounded text-sm">
&lt;chunk&gt;First section of text here...&lt;/chunk&gt;
&lt;chunk&gt;Second section here...&lt;/chunk&gt;</pre
            >
          </div>
          <textarea
            id="content"
            v-model="newText.content"
            required
            rows="6"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter text content with chunk tags..."
          ></textarea>
        </div>

        <div v-if="errorMessage" class="text-red-500 text-sm">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Adding...' : 'Add Text' }}
        </button>
      </form>
    </div>

    <!-- Existing Texts -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">Your Texts</h2>

      <div v-if="isLoadingTexts" class="text-center py-4">Loading...</div>

      <div v-else-if="texts.length === 0" class="text-center py-4 text-gray-600">
        No texts added yet
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="text in texts"
          :key="text.id"
          class="border rounded-md p-4 flex justify-between items-center"
        >
          <div>
            <h3 class="font-medium">{{ text.title.replace(/<\/?[^>]+(>|$)/g, '') }}</h3>
            <p class="text-sm text-gray-600">
              Added {{ new Date(text.created_at).toLocaleDateString() }}
            </p>
          </div>

          <button
            @click="deleteText(text.id)"
            class="text-red-500 hover:text-red-700"
            :disabled="isDeletingText === text.id"
          >
            {{ isDeletingText === text.id ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getTeacherTexts, addText, deleteText as apiDeleteText } from '../services/api'

const texts = ref([])
const isLoadingTexts = ref(true)
const isLoading = ref(false)
const isDeletingText = ref(null)
const errorMessage = ref('')

const newText = ref({
  title: '',
  content: '',
})

const loadTexts = async () => {
  try {
    isLoadingTexts.value = true
    texts.value = await getTeacherTexts()
  } catch (err) {
    console.error('Failed to load texts:', err)
  } finally {
    isLoadingTexts.value = false
  }
}

const handleSubmit = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    await addText(newText.value)
    newText.value = { title: '', content: '' }
    await loadTexts()
  } catch (err) {
    errorMessage.value = err.message || 'Failed to add text'
  } finally {
    isLoading.value = false
  }
}

const deleteText = async (textId) => {
  if (!confirm('Are you sure you want to delete this text?')) {
    return
  }

  isDeletingText.value = textId
  try {
    await apiDeleteText(textId)
    await loadTexts()
  } catch (err) {
    console.error('Failed to delete text:', err)
  } finally {
    isDeletingText.value = null
  }
}

onMounted(loadTexts)
</script>
