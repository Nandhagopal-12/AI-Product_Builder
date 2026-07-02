function validateInquiry(inquiryData) {
  const { rentalId, name, email, moveInDate, message } = inquiryData

  if (!rentalId || !name || !email || !moveInDate || !message) {
    return 'Please fill all required fields.'
  }

  if (!email.includes('@')) {
    return 'Please enter a valid email address.'
  }

  return ''
}

function createInquiry(inquiryData) {
  const { rentalId, name, email, moveInDate, message } = inquiryData

  return {
    id: `inquiry-${Date.now()}`,
    rentalId,
    name,
    email,
    moveInDate,
    message,
  }
}

module.exports = {
  validateInquiry,
  createInquiry,
}
