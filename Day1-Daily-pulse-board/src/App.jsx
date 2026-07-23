import { useState } from 'react'
import './App.css'

const moodOptions = [
  { label: 'Happy', className: 'happy' },
  { label: 'Calm', className: 'calm' },
  { label: 'Tired', className: 'tired' },
]

const energyOptions = [
  { label: 'Low', className: 'energy-low' },
  { label: 'Medium', className: 'energy-medium' },
  { label: 'High', className: 'energy-high' },
]

const focusOptions = [
  { label: 'Low', className: 'focus-low' },
  { label: 'Medium', className: 'focus-medium' },
  { label: 'High', className: 'focus-high' },
]

function App() {
  const [mood, setMood] = useState('')
  const [energy, setEnergy] = useState('')
  const [focus, setFocus] = useState('')

  const selectedMood = moodOptions.find((option) => option.label === mood)
  const summaryMoodClass = selectedMood ? selectedMood.className : 'empty'

  return (
    <main className="app">
      <section className="hero">
        <p className="eyebrow">Daily check-in</p>
        <h1>Test Branch Pulse Board</h1>
        <p className="intro">
          Choose your mood, energy, and focus for today.
        </p>
      </section>

      <section className="pulse-section">
        <div>
          <p className="section-label">01</p>
          <h2>Mood</h2>
        </div>
        <div className="button-row">
          {moodOptions.map((option) => (
            <button
              key={option.label}
              className={`pulse-button ${option.className} ${
                mood === option.label ? 'selected' : ''
              }`}
              onClick={() => setMood(option.label)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section className="pulse-section">
        <div>
          <p className="section-label">02</p>
          <h2>Energy</h2>
        </div>
        <div className="button-row">
          {energyOptions.map((option) => (
            <button
              key={option.label}
              className={`pulse-button ${option.className} ${
                energy === option.label ? 'selected' : ''
              }`}
              onClick={() => setEnergy(option.label)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section className="pulse-section">
        <div>
          <p className="section-label">03</p>
          <h2>Focus</h2>
        </div>
        <div className="button-row">
          {focusOptions.map((option) => (
            <button
              key={option.label}
              className={`pulse-button ${option.className} ${
                focus === option.label ? 'selected' : ''
              }`}
              onClick={() => setFocus(option.label)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section className={`summary ${summaryMoodClass}`}>
        <p className="summary-label">Today&apos;s Pulse</p>
        <h2>{mood ? `${mood} mode` : 'Waiting for your check-in'}</h2>
        <div className="summary-grid">
          <p>
            <span>Mood</span>
            {mood || 'Not selected'}
          </p>
          <p>
            <span>Energy</span>
            {energy || 'Not selected'}
          </p>
          <p>
            <span>Focus</span>
            {focus || 'Not selected'}
          </p>
        </div>
      </section>
    </main>
  )
}

export default App
