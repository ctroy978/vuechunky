<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="mb-4">
      <BaseButton variant="text" @click="$emit('back')">← Back to teachers</BaseButton>
    </div>

    <h2 class="text-xl font-semibold mb-4">Select a Text from {{ teacher.full_name }}</h2>

    <div v-if="isLoading" class="text-center py-4">Loading texts...</div>

    <div v-else-if="texts.length === 0" class="text-center py-4 text-gray-600">
      No texts available from this teacher
    </div>

    <!-- Added max-w-2xl to constrain width -->
    <div v-else class="space-y-4 max-w-2xl">
      <div
        v-for="text in texts"
        :key="text.id"
        class="border rounded-md hover:bg-gray-50 transition-colors duration-200"
      >
        <button @click="$emit('select', text)" class="p-4 w-full flex flex-col items-start">
          <h3 class="font-medium text-left text-gray-900">
            {{ text.title.replace(/<\/?[^>]+(>|$)/g, '') }}
          </h3>
          <p class="text-sm text-gray-600 mt-1">
            Added {{ new Date(text.created_at).toLocaleDateString() }}
          </p>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseButton from '@/components/common/BaseButton.vue'
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
