// src/views/AdminUsersView.vue
<template>
  <div class="container mx-auto p-4">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">User Management</h1>
          <div class="border-blue-500 border-b-2 w-32 mt-2"></div>
        </div>
        <button @click="router.push('/admin')" class="px-4 py-2 text-gray-700 hover:text-gray-900">
          ← Back to Dashboard
        </button>
      </div>
    </div>

    <!-- User List -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div v-if="isLoading" class="text-center py-4">Loading users...</div>

      <div v-else-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
        <div class="flex">
          <div class="ml-3">
            <p class="text-sm text-red-700">{{ error }}</p>
            <button
              @click="loadUsers"
              class="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              User
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Role
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div>
                  <div class="text-sm font-medium text-gray-900">
                    {{ user.full_name }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ user.email }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  user.is_teacher ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800',
                ]"
              >
                {{ user.is_teacher ? 'Teacher' : 'Student' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  user.is_admin ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800',
                ]"
              >
                {{ user.is_admin ? 'Admin' : 'Regular User' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                v-if="!user.is_admin"
                @click="grantAdmin(user)"
                class="text-blue-600 hover:text-blue-900 mr-4"
              >
                Grant Admin
              </button>
              <button
                v-else
                @click="revokeAdmin(user)"
                class="text-red-600 hover:text-red-900 mr-4"
              >
                Revoke Admin
              </button>
              <button @click="toggleTeacher(user)" class="text-purple-600 hover:text-purple-900">
                {{ user.is_teacher ? 'Remove Teacher' : 'Make Teacher' }}
              </button>
              <button @click="handleUserDelete(user)" class="text-red-600 hover:text-red-900 ml-4">
                Delete User
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { deleteUser } from '../services/api'
import {
  getUsers,
  grantAdminPrivileges,
  revokeAdminPrivileges,
  toggleTeacherStatus,
} from '../services/api'

const router = useRouter()
const users = ref([])
const isLoading = ref(true)
const error = ref('')

const loadUsers = async () => {
  isLoading.value = true
  error.value = ''
  try {
    const response = await getUsers()
    users.value = response
  } catch (err) {
    error.value = 'Failed to load users'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const grantAdmin = async (user) => {
  try {
    const reason = prompt('Please provide a reason for granting admin privileges:', 'Admin duties')
    if (!reason) return // User cancelled

    await grantAdminPrivileges(user.id, reason)
    await loadUsers() // Refresh the list
  } catch (err) {
    console.error('Failed to grant admin privileges:', err)
    alert('Failed to grant admin privileges: ' + err.message)
  }
}

const revokeAdmin = async (user) => {
  try {
    if (!confirm('Are you sure you want to revoke admin privileges?')) return

    await revokeAdminPrivileges(user.id)
    await loadUsers() // Refresh the list
  } catch (err) {
    console.error('Failed to revoke admin privileges:', err)
    alert('Failed to revoke admin privileges: ' + err.message)
  }
}

const toggleTeacher = async (user) => {
  try {
    await toggleTeacherStatus(user.id)
    await loadUsers() // Refresh the list
  } catch (err) {
    console.error('Failed to toggle teacher status:', err)
    alert('Failed to update teacher status: ' + err.message)
  }
}

const handleUserDelete = async (user) => {
  if (
    !confirm(`Are you sure you want to delete ${user.full_name}? This action cannot be undone.`)
  ) {
    return
  }

  try {
    await deleteUser(user.id)
    await loadUsers() // Refresh the list
  } catch (err) {
    console.error('Failed to delete user:', err)
    alert('Failed to delete user: ' + err.message)
  }
}

onMounted(() => {
  loadUsers()
})
</script>
