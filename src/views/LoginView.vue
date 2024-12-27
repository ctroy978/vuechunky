Good thinking - let's get the complete, working version of the page with JWT handling all in one
piece: ```javascript // src/views/LoginView.vue
<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-8">Student Reader Login</h2>

      <!-- Email form -->
      <form v-if="!showOTPForm" @submit.prevent="handleEmailSubmit" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <div v-if="errorMessage" class="text-red-500 text-sm">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Sending...' : 'Get Login Code' }}
        </button>
      </form>

      <!-- OTP form -->
      <form v-else @submit.prevent="handleOTPSubmit" class="space-y-6">
        <div>
          <label for="otp" class="block text-sm font-medium text-gray-700 mb-2">
            Enter Login Code
          </label>
          <input
            id="otp"
            v-model="otpCode"
            type="text"
            required
            maxlength="6"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-wider"
            placeholder="Enter code"
          />
          <p class="mt-2 text-sm text-gray-600">Code sent to {{ email }}</p>
        </div>

        <div v-if="errorMessage" class="text-red-500 text-sm">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Verifying...' : 'Verify Code' }}
        </button>

        <button
          type="button"
          @click="resetForm"
          class="w-full mt-4 text-gray-600 hover:text-gray-800"
        >
          Use different email
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { requestOTP, verifyOTP } from '../services/api'

const router = useRouter()
const email = ref('')
const otpCode = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const showOTPForm = ref(false)

const handleEmailSubmit = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    await requestOTP(email.value)
    showOTPForm.value = true
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    isLoading.value = false
  }
}

const handleOTPSubmit = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    const response = await verifyOTP(email.value, otpCode.value)
    localStorage.setItem('token', response.access_token)
    router.push('/')
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  email.value = ''
  otpCode.value = ''
  showOTPForm.value = false
  errorMessage.value = ''
}
</script>
``` The main updates here are in the `handleOTPSubmit` function which now: 1. Stores the JWT token
in localStorage 2. Redirects to the home page after successful login Would you like to test this
complete version before we move on to setting up the home page?
