<template>
  <div v-if="isOpen" class="modal-overlay">
    <!-- Backdrop -->
    <div class="modal-backdrop" @click="$emit('close')"></div>

    <!-- Modal -->
    <div class="modal-container">
      <!-- Header -->
      <div class="modal-header">
        <h2 class="text-xl font-bold">Previous Reading</h2>
        <button @click="$emit('close')" class="p-2 hover:bg-gray-100 rounded-full">✕</button>
      </div>

      <!-- Scrollable Content -->
      <div class="modal-content">
        <div v-if="previousChunks.length === 0" class="text-gray-500 text-center py-4">
          No previous chunks available yet.
        </div>
        <div v-else class="chunks-container">
          <div v-for="chunk in previousChunks" :key="chunk.chunk_id" class="chunk-item">
            <div class="flex items-center mb-2">
              <span class="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                Chunk {{ chunk.sequence_number }}
              </span>
            </div>
            <div class="prose max-w-none" v-html="chunk.content"></div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button
          @click="$emit('close')"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  previousChunks: {
    type: Array,
    required: true,
  },
})

defineEmits(['close'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
}

.modal-container {
  position: relative;
  background-color: white;
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  border-radius: 0.5rem;
  z-index: 51;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1.5rem;
  max-height: calc(80vh - 8rem); /* Account for header and footer */
}

.chunks-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.chunk-item {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.chunk-item:last-child {
  border-bottom: none;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
}

/* Custom scrollbar styles */
.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: transparent;
}

.modal-content::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}
</style>
