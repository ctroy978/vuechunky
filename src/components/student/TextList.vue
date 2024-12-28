// src/components/student/TextList.vue
<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="mb-4">
      <button @click="$emit('back')" class="text-blue-500 hover:text-blue-700">
        ← Back to teachers
      </button>
    </div>

    <h2 class="text-xl font-semibold mb-4">Select a Text from {{ teacher.full_name }}</h2>

    <div v-if="isLoading" class="text-center py-4">Loading texts...</div>

    <div v-else-if="texts.length === 0" class="text-center py-4 text-gray-600">
      No texts available from this teacher
    </div>

    <div v-else class="space-y-4">
      <button
        v-for="text in texts"
        :key="text.id"
        @click="$emit('select', text)"
        class="w-full p-4 border rounded-md hover:bg-gray-50 text-left"
      >
        <h3 class="font-medium">{{ text.title.replace(/<\/?[^>]+(>|$)/g, '') }}</h3>
        <p class="text-sm text-gray-600">
          Added {{ new Date(text.created_at).toLocaleDateString() }}
        </p>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  teacher: {
    type: Object,
    required: true,
  },
  texts: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['back', 'select'])
</script>
