//src/components/completions/CompletionFilters.vue
<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Student Name Filter -->
      <div>
        <label for="studentName" class="block text-sm font-medium text-gray-700 mb-1">
          Student Name
        </label>
        <input
          id="studentName"
          type="text"
          :value="studentName"
          @input="$emit('update:studentName', $event.target.value)"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by name..."
        />
      </div>

      <!-- Text Title Filter -->
      <div>
        <label for="textTitle" class="block text-sm font-medium text-gray-700 mb-1">
          Text Title
        </label>
        <input
          id="textTitle"
          type="text"
          :value="textTitle"
          @input="$emit('update:textTitle', $event.target.value)"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by title..."
        />
      </div>

      <!-- Pass Status Filter -->
      <div>
        <label for="passStatus" class="block text-sm font-medium text-gray-700 mb-1">
          Pass Status
        </label>
        <select
          id="passStatus"
          :value="passStatus"
          @change="$emit('update:passStatus', $event.target.value)"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All</option>
          <option value="true">Passed</option>
          <option value="false">Failed</option>
        </select>
      </div>

      <!-- Date Range Filter -->
      <div>
        <label for="dateRange" class="block text-sm font-medium text-gray-700 mb-1">
          Date Range
        </label>
        <div class="flex gap-2">
          <input
            type="date"
            :value="fromDate"
            @input="$emit('update:fromDate', $event.target.value)"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            :value="toDate"
            @input="$emit('update:toDate', $event.target.value)"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end mt-4 space-x-2">
      <button
        @click="$emit('clear')"
        class="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
      >
        Clear Filters
      </button>
      <button
        @click="$emit('filter')"
        class="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Apply Filters
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  studentName: {
    type: String,
    default: '',
  },
  textTitle: {
    type: String,
    default: '',
  },
  fromDate: {
    type: String,
    default: null,
  },
  toDate: {
    type: String,
    default: null,
  },
  passStatus: {
    type: String,
    default: '',
  },
})

defineEmits([
  'update:studentName',
  'update:textTitle',
  'update:fromDate',
  'update:toDate',
  'update:passStatus',
  'filter',
  'clear',
])
</script>
