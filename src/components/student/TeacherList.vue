// src/components/student/TeacherList.vue
<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-8">
    <h2 class="text-xl font-semibold mb-4">Select a Teacher</h2>

    <div v-if="isLoading" class="text-center py-4">Loading teachers...</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <button
        v-for="teacher in teachers"
        :key="teacher.id"
        @click="$emit('select', teacher)"
        class="p-4 border rounded-md hover:bg-gray-50 text-left"
      >
        <h3 class="font-medium">{{ teacher.full_name }}</h3>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  teachers: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['select'])
</script>
