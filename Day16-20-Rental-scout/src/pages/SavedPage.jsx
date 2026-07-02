import { Link } from 'react-router-dom'
import RentalCard from '../components/RentalCard.jsx'
import { rentals } from '../data/rentals.js'

function SavedPage({ savedRentalIds }) {
  const savedRentals = rentals.filter((rental) =>
    savedRentalIds.includes(rental.id),
  )

  if (savedRentals.length === 0) {
    return (
      <section className="empty-state">
        <p className="eyebrow">Saved rentals</p>
        <h2>No saved rentals yet.</h2>
        <p>Save rentals from the Browse page to compare them here.</p>
        <Link className="button-link" to="/">
          Browse rentals
        </Link>
      </section>
    )
  }

  return (
    <section className="page-stack">
      <div className="section-heading">
        <p className="eyebrow">Saved rentals</p>
        <h2>Your shortlist</h2>
      </div>

      <div className="rental-grid">
        {savedRentals.map((rental) => (
          <RentalCard key={rental.id} rental={rental} />
        ))}
      </div>
    </section>
  )
}

export default SavedPage
