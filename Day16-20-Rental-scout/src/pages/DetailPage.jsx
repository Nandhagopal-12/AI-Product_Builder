import { Link, useParams } from 'react-router-dom'
import { rentals } from '../data/rentals.js'

function DetailPage() {
  const { rentalId } = useParams()
  const rental = rentals.find((item) => item.id === rentalId)

  if (!rental) {
    return (
      <section className="page-stack">
        <h2>Rental not found</h2>
        <Link className="button-link" to="/">
          Back to browse
        </Link>
      </section>
    )
  }

  return (
    <section className="detail-layout">
      <img src={rental.image} alt={rental.title} />

      <div className="page-stack">
        <p className="eyebrow">
          {rental.area}, {rental.city}
        </p>
        <h2>{rental.title}</h2>
        <p className="price">Rs. {rental.rent.toLocaleString('en-IN')} / month</p>
        
        <div className="detail-facts">
          <span>{rental.type}</span>
          <span>
            {rental.bedrooms} {rental.bedrooms === 1 ? 'bedroom' : 'bedrooms'}
          </span>
          <span>{rental.furnished ? 'Furnished' : 'Unfurnished'}</span>
        </div>
        <p>{rental.description}</p>

        <ul className="highlight-list">
          {rental.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>

        <Link className="button-link" to={`/rentals/${rental.id}/apply`}>
          Start inquiry
        </Link>
      </div>
    </section>
  )
}

export default DetailPage
