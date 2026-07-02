const express = require('express')
const inquiries = require('../data/inquiries')
const { findRentalById } = require('../helpers/rentalHelpers')
const { createInquiry, validateInquiry } = require('../helpers/inquiryHelpers')

const router = express.Router()

router.get('/', (request, response) => {
  response.json(inquiries)
})

router.post('/', (request, response) => {
  const validationMessage = validateInquiry(request.body)

  if (validationMessage) {
    return response.status(400).json({
      message: validationMessage,
    })
  }

  const rental = findRentalById(request.body.rentalId)

  if (!rental) {
    return response.status(404).json({
      message: 'Rental not found',
    })
  }

  const inquiry = createInquiry(request.body)
  inquiries.push(inquiry)

  response.status(201).json({
    message: 'Inquiry submitted successfully.',
    inquiry,
  })
})

module.exports = router
