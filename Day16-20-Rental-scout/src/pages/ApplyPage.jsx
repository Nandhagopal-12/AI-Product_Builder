import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { rentals } from '../data/rentals.js'

function ApplyPage() {
  const { rentalId } = useParams()
  const rental = rentals.find((item) => item.id === rentalId)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    moveInDate: '',
    message: '',
  })

  const [isSubmitted, setIsSubmitted] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitted(true)
  }

  if (!rental) {
    return (
      <section className="empty-state">
        <h2>Rental not found</h2>
        <Link className="button-link" to="/">
          Back to browse
        </Link>
      </section>
    )
  }

  if (isSubmitted) {
    return (
      <section className="empty-state">
        <p className="eyebrow">Inquiry sent</p>
        <h2>Thanks, {formData.name}.</h2>
        <p>
          Your inquiry for {rental.title} has been saved in the frontend demo.
        </p>
        <Link className="button-link" to={`/rentals/${rental.id}`}>
          Back to rental
        </Link>
      </section>
    )
  }

  return (
    <section className="form-page">
      <div>
        <p className="eyebrow">Rental inquiry</p>
        <h2>{rental.title}</h2>
        <p>
          {rental.area}, {rental.city}
        </p>
      </div>

      <form className="inquiry-form" onSubmit={handleSubmit}>
        <label>
          Full name
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Move-in date
          <input
            name="moveInDate"
            type="date"
            value={formData.moveInDate}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Message
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            required
          />
        </label>

        <button className="button-link" type="submit">
          Send inquiry
        </button>
      </form>
    </section>
  )
}

export default ApplyPage