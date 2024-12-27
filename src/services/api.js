// src/services/api.js
const API_URL = 'http://localhost:8000'

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    console.log('API Error Response:', error) // Debug
    throw new Error(error.detail || 'API request failed')
  }
  return response.json()
}

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    console.warn('No auth token found in localStorage')
    return {}
  }
  console.log('Token being sent:', token) // Debug
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

// Auth endpoints
export const initiateRegistration = async (studentData) => {
  const response = await fetch(`${API_URL}/auth/initiate-registration`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentData),
  })
  return handleResponse(response)
}

export const completeRegistration = async (registrationData) => {
  const response = await fetch(`${API_URL}/auth/complete-registration`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registrationData),
  })
  return handleResponse(response)
}

export const requestOTP = async (email) => {
  const response = await fetch(`${API_URL}/auth/request-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
  return handleResponse(response)
}

export const verifyOTP = async (email, otp) => {
  const response = await fetch(`${API_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp }),
  })
  return handleResponse(response)
}

// Teacher endpoints
export const getTeacherTexts = async () => {
  const response = await fetch(`${API_URL}/addtext/texts/`, {
    headers: {
      ...getAuthHeader(),
    },
  })
  const data = await handleResponse(response)
  return Array.isArray(data) ? data : []
}

export const addText = async ({ title, content }) => {
  const formData = new FormData()
  formData.append('title', title)
  formData.append('content', content)

  const response = await fetch(`${API_URL}/addtext/texts/`, {
    method: 'POST',
    headers: {
      ...getAuthHeader(),
    },
    body: formData,
  })
  return handleResponse(response)
}

export const deleteText = async (textId) => {
  const response = await fetch(`${API_URL}/addtext/texts/${textId}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeader(),
    },
  })
  return handleResponse(response)
}

// Student endpoints
export const getTeachers = async () => {
  const response = await fetch(`${API_URL}/student/teachers/`, {
    headers: {
      ...getAuthHeader(),
    },
  })
  return handleResponse(response)
}

export const getTeacherTextsForStudent = async (teacherId) => {
  const response = await fetch(`${API_URL}/student/teachers/${teacherId}/texts`, {
    headers: {
      ...getAuthHeader(),
    },
  })
  return handleResponse(response)
}

export const getFirstChunk = async (textId) => {
  const response = await fetch(`${API_URL}/student/texts/${textId}/first-chunk`, {
    headers: {
      ...getAuthHeader(),
    },
  })
  return handleResponse(response)
}

export const getNextChunk = async (textId, currentChunkId) => {
  const response = await fetch(`${API_URL}/student/texts/${textId}/next-chunk/${currentChunkId}`, {
    headers: {
      ...getAuthHeader(),
    },
  })
  return handleResponse(response)
}
