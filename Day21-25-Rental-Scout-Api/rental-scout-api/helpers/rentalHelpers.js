const rentals = require('../data/rentals')

function findRentalById(rentalId) {
  return rentals.find((rental) => rental.id === rentalId)
}

module.exports = {
  findRentalById,
}
