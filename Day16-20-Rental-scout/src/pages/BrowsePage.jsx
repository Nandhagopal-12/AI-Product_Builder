import { useState } from 'react'
import RentalCard from '../components/RentalCard.jsx'
import { rentals } from '../data/rentals.js'

function BrowsePage({ savedRentalIds, onToggleSaved }) {
  const [cityFilter, setCityFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [searchText, setSearchText] = useState('')

  const filteredRentals = rentals.filter((rental) => {
    const searchValue = searchText.toLowerCase()

    const matchesSearch =
      rental.title.toLowerCase().includes(searchValue) ||
      rental.city.toLowerCase().includes(searchValue) ||
      rental.area.toLowerCase().includes(searchValue)

    const matchesCity = cityFilter === 'All' || rental.city === cityFilter
    const matchesType = typeFilter === 'All' || rental.type === typeFilter

    return matchesSearch && matchesCity && matchesType
  })

  return (
    <section className="page-stack">
      <div className="section-heading">
        <p className="eyebrow">Browse homes</p>
        <h2>Compare rentals by city and home type.</h2>
        <p>
          {filteredRentals.length}{' '}
          {filteredRentals.length === 1 ? 'rental' : 'rentals'} found
        </p>
      </div>

      <div className="filters">
        <label>
          Search
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search by title, city, or area"
          />
        </label>

        <label>
          City
          <select value={cityFilter} onChange={(event) => setCityFilter(event.target.value)}>
            <option>All</option>
            <option>Chennai</option>
            <option>Bengaluru</option>
            <option>Hyderabad</option>
            <option>Ladakh</option>
            <option>Rishikesh</option>
            <option>Udaipur</option>
            <option>Kashmir Valley</option>
            <option>Amritsar</option>
          </select>
        </label>

        <label>
          Type
          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
            <option>All</option>
            <option>Studio</option>
            <option>Apartment</option>
            <option>Shared</option>
          </select>
        </label>

        <button
          className="reset-button"
          type="button"
          onClick={() => {
            setSearchText('')
            setCityFilter('All')
            setTypeFilter('All')
          }}
        >
          Reset
        </button>
      </div>

      {filteredRentals.length === 0 && (
        <div className="empty-state">
          <h3>No rentals found</h3>
          <p>Try a different search word, city, or type.</p>
        </div>
      )}

      <div className="rental-grid">
        {filteredRentals.map((rental) => (
          <RentalCard
            key={rental.id}
            rental={rental}
            isSaved={savedRentalIds.includes(rental.id)}
            onToggleSaved={onToggleSaved}
          />
        ))}
      </div>
    </section>
  )
}

export default BrowsePage
