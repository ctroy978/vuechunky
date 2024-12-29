// src/components/common/BaseButton.vue
<template>
  <button
    :class="[
      'font-medium transition-colors duration-200',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      variantClasses[variant],
      sizeClasses[size]
    ]"
    :disabled="disabled"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'text'].includes(value)
  },
  size: {
    type: String,
    default: 'normal',
    validator: (value) => ['small', 'normal', 'large'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const variantClasses = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white rounded-lg',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg',
  success: 'bg-green-600 hover:bg-green-700 text-white rounded-lg',
  danger: 'bg-red-600 hover:bg-red-700 text-white rounded-lg',
  text: 'text-blue-600 hover:text-blue-800'
}

const sizeClasses = {
  small: 'py-1 px-3 text-sm',
  normal: 'py-2 px-4',
  large: 'py-3 px-6 text-lg'
}
</script
