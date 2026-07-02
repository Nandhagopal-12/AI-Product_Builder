import { useState } from 'react'
import './App.css'

const emptyForm = {
  fullName: '',
  email: '',
  workshop: '',
  ticketType: '',
  company: '',
}

function App() {
  const [formData, setFormData] = useState(emptyForm)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value,
    })
    setError('')
    setSuccess(false)
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (formData.fullName.trim() === '' || formData.email.trim() === '') {
      setError('Please enter your name and email.')
      setSuccess(false)
      return
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address.')
      setSuccess(false)
      return
    }

    setSuccess(true)
    setError('')
    setFormData(emptyForm)
  }

  return (
    <main className="app">
      <section className="form-panel">
        <p className="eyebrow">Day 3 form practice</p>
        <h1>Workshop RSVP</h1>
        <p className="intro">
          Fill the form and watch the ticket update while you type.
        </p>

        {success && (
          <p className="message success" role="status">
            RSVP saved successfully. The form is ready for the next attendee.
          </p>
        )}

        <form onSubmit={handleSubmit} className="rsvp-form">
          <label>
            Full name
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Aarav Kumar"
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="aarav@example.com"
            />
          </label>

          <label>
            Company
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Freshworks"
            />
          </label>

          <label>
            Workshop
            <select
              name="workshop"
              value={formData.workshop}
              onChange={handleChange}
            >
              <option value="">Choose a workshop</option>
              <option>React Basics</option>
              <option>Design with CSS</option>
              <option>Build Your First App</option>
            </select>
          </label>

          <label>
            Ticket type
            <select
              name="ticketType"
              value={formData.ticketType}
              onChange={handleChange}
            >
              <option value="">Choose ticket type</option>
              <option>General</option>
              <option>Student</option>
              <option>VIP</option>
            </select>
          </label>

          {error && <p className="message error">{error}</p>}

          <button type="submit">Submit RSVP</button>
        </form>
      </section>

      <section className="ticket-panel">
        <article className="ticket">
          <div className="ticket-top">
            <p>AI Product Workshop</p>
            <span>{formData.ticketType || 'Ticket type'}</span>
          </div>

          <div className="ticket-body">
            <p className="ticket-label">Attendee</p>
            <h2>{formData.fullName || 'Your Name'}</h2>

            <p className="ticket-label">Email</p>
            <p>{formData.email || 'your@email.com'}</p>

            <p className="ticket-label">Company</p>
            <p>{formData.company || 'Your company'}</p>

            <p className="ticket-label">Session</p>
            <p>{formData.workshop || 'Choose a workshop'}</p>
          </div>

          <div className="ticket-footer">
            <span>DAY 3</span>
            <span>SEAT A12</span>
          </div>
        </article>
      </section>
    </main>
  )
}

export default App
