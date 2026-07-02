const API_BASE_URL = 'http://localhost:4000/api'

export async function getRentals() {
  const response = await fetch(`${API_BASE_URL}/rentals`)

  if (!response.ok) {
    throw new Error('Could not load rentals')
  }

  return response.json()
}

export async function submitInquiry(inquiryData) {
  const response = await fetch(`${API_BASE_URL}/inquiries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(inquiryData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message)
  }

  return data
}
