import { Link } from 'react-router-dom'

function RentalCard({ rental, isSaved = false, onToggleSaved }) {
  return (
    <article className="rental-card">
      <img src={rental.image} alt={rental.title} />
      <div className="card-body">
        <p className="meta">
          {rental.area}, {rental.city}
        </p>
        <h3>{rental.title}</h3>
        <p>Rs. {rental.rent.toLocaleString('en-IN')} / month</p>

        {onToggleSaved && (
          <button
            className="save-button"
            type="button"
            onClick={() => onToggleSaved(rental.id)}
          >
            {isSaved ? 'Saved' : 'Save'}
          </button>
        )}

        <Link className="button-link" to={`/rentals/${rental.id}`}>
          View details
        </Link>
      </div>
    </article>
  )
}

export default RentalCard
