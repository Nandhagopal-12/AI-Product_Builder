const express = require('express')
const rentals = require('../data/rentals')
const { findRentalById } = require('../helpers/rentalHelpers')

const router = express.Router()

router.get('/', (request, response) => {
  response.json(rentals)
})

router.get('/:rentalId', (request, response) => {
  const { rentalId } = request.params
  const rental = findRentalById(rentalId)

  if (!rental) {
    return response.status(404).json({
      message: 'Rental not found',
    })
  }

  response.json(rental)
})

module.exports = router
