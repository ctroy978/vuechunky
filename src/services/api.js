// src/services/api.js
const API_URL = 'http://localhost:8000'

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      detail: `HTTP error! status: ${response.status}`,
    }))
    console.log('API Error Response:', {
      status: response.status,
      statusText: response.statusText,
      error: error,
    })
    throw new Error(error.detail || `API request failed with status ${response.status}`)
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

  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  const response = await fetch(`${API_URL}/addtext/texts/`, {
    method: 'POST',
    headers: headers,
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Server error response:', errorText)
    throw new Error(errorText)
  }

  return response.json()
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
  console.log('Getting next chunk with:', { textId, currentChunkId }) // Debug log
  const response = await fetch(`${API_URL}/student/texts/${textId}/next-chunk/${currentChunkId}`, {
    headers: {
      ...getAuthHeader(),
    },
  })
  return handleResponse(response)
}

// Utility function to get user email from JWT token
export const getUserEmailFromToken = () => {
  const token = localStorage.getItem('token')
  if (!token) return null

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.sub // email is stored in the 'sub' claim
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

export const generateQuestion = async (chunkId, textId) => {
  const userEmail = getUserEmailFromToken()
  if (!userEmail) {
    throw new Error('User not authenticated')
  }

  try {
    const response = await fetch(`${API_URL}/questions/generate`, {
      method: 'POST',
      credentials: 'include', // Add this line
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        accept: 'application/json',
      },
      body: JSON.stringify({
        chunk_id: chunkId,
        text_id: textId,
        user_email: userEmail,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Question generation failed:', errorText)
      throw new Error('Failed to generate question')
    }

    return response.json()
  } catch (error) {
    console.error('Error in generateQuestion:', error)
    throw error
  }
}

//submit button for submitting answers
export const evaluateAnswer = async (answerData) => {
  const response = await fetch(`${API_URL}/questions/evaluate-answer`, {
    method: 'POST',
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(answerData),
  })
  return handleResponse(response)
}

export const generateTest = async (textId) => {
  try {
    const response = await fetch(`${API_URL}/test/generate`, {
      method: 'POST',
      credentials: 'include', // Add this
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        accept: 'application/json',
      },
      body: JSON.stringify({ text_id: textId }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Server error response:', errorText)
      throw new Error(errorText || `Failed to generate test (${response.status})`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error generating test:', error)
    throw error
  }
}
export const submitTest = async (textId, answers) => {
  const response = await fetch(`${API_URL}/test/submit`, {
    method: 'POST',
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text_id: textId,
      answers: answers, // Now sending the structured answers array with sequence and question
    }),
  })
  return handleResponse(response)
}

// Add to src/services/api.js

export const getCompletions = async (params = {}) => {
  // Convert params to URL search params
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, value)
    }
  })

  const response = await fetch(`${API_URL}/completions?${searchParams.toString()}`, {
    headers: {
      ...getAuthHeader(),
    },
  })
  return handleResponse(response)
}

export const getCompletionsByStudent = async (studentName, skip = 0, limit = 100) => {
  const response = await fetch(
    `${API_URL}/completions/by-student/${encodeURIComponent(studentName)}?skip=${skip}&limit=${limit}`,
    {
      headers: {
        ...getAuthHeader(),
      },
    },
  )
  return handleResponse(response)
}

export const getCompletionsByText = async (textId, skip = 0, limit = 100) => {
  const response = await fetch(
    `${API_URL}/completions/by-text/${textId}?skip=${skip}&limit=${limit}`,
    {
      headers: {
        ...getAuthHeader(),
      },
    },
  )
  return handleResponse(response)
}
