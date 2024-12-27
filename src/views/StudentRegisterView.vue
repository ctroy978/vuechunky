//src/views/StudentRegisterView.vue
<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-8">Student Registration</h2>

      <!-- Initial Registration Form -->
      <form v-if="!showVerificationForm" @submit.prevent="handleInitialSubmit" class="space-y-6">
        <!-- Username -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            id="username"
            v-model="formData.username"
            type="text"
            required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Choose a username"
          />
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <!-- Full Name -->
        <div>
          <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            id="fullName"
            v-model="formData.full_name"
            type="text"
            required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
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
          {{ isLoading ? 'Sending...' : 'Register' }}
        </button>
      </form>

      <!-- Verification Form -->
      <form v-else @submit.prevent="handleVerificationSubmit" class="space-y-6">
        <div>
          <label for="verificationCode" class="block text-sm font-medium text-gray-700 mb-2">
            Verification Code
          </label>
          <input
            id="verificationCode"
            v-model="verificationCode"
            type="text"
            required
            maxlength="6"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-wider"
            placeholder="Enter code"
          />
          <p class="mt-2 text-sm text-gray-600">
            Enter the verification code sent to {{ formData.email }}
          </p>
        </div>

        <div v-if="errorMessage" class="text-red-500 text-sm">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Verifying...' : 'Complete Registration' }}
        </button>

        <button
          type="button"
          @click="showVerificationForm = false"
          class="w-full text-gray-600 hover:text-gray-800"
        >
          Back to registration
        </button>
      </form>

      <div class="text-center text-sm text-gray-600 mt-6">
        Already have an account?
        <router-link to="/login" class="text-blue-500 hover:text-blue-700">
          Login here
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { initiateRegistration, completeRegistration } from '../services/api'

const router = useRouter()
const isLoading = ref(false)
const errorMessage = ref('')
const showVerificationForm = ref(false)
const verificationCode = ref('')

const formData = ref({
  username: '',
  email: '',
  full_name: '',
})

const handleInitialSubmit = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    await initiateRegistration(formData.value)
    showVerificationForm.value = true
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    isLoading.value = false
  }
}

const handleVerificationSubmit = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    await completeRegistration({
      ...formData.value,
      verification_code: verificationCode.value,
    })
    router.push('/login')
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    isLoading.value = false
  }
}
</script>
