const express = require('express')

const router = express.Router()

router.get('/', (request, response) => {
  response.json({
    message: 'Rental Scout API',
    routes: [
      'GET /api/health',
      'GET /api/rentals',
      'GET /api/rentals/:rentalId',
      'GET /api/inquiries',
      'POST /api/inquiries',
    ],
  })
})

router.get('/health', (request, response) => {
  response.json({
    status: 'ok',
    service: 'rental-scout-api',
  })
})

module.exports = router
