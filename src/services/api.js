// src/services/api.js
const API_URL = 'http://localhost:8000' // adjust this to match your FastAPI server

export const requestOTP = async (email) => {
  const response = await fetch(`${API_URL}/auth/request-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
  if (!response.ok) {
    throw new Error('Failed to request OTP')
  }
  return response.json()
}

export const verifyOTP = async (email, otp) => {
  const response = await fetch(`${API_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp }),
  })
  if (!response.ok) {
    throw new Error('Invalid verification code')
  }
  return response.json()
}
