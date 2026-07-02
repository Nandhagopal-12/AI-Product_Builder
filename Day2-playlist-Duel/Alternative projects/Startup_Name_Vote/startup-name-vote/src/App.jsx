import { useState } from 'react'
import './App.css'

const nameOptions = [
  {
    id: 1,
    name: 'BrandNest',
    tagline: 'Smart launchpad for modern founders',
    domain: 'brandnest.io',
  },
  {
    id: 2,
    name: 'LaunchLayer',
    tagline: 'Professional tools for business ideas',
    domain: 'launchlayer.com',    
  },
  {
    id: 3,
    name: 'Acumen',
    tagline: 'Success & Strategy Group',
    domain: 'acumengroup.in',
  }
]

function NameCard({ option, votes, onVote }) {
  return (
    <button className="name-card" type="button" onClick={() => onVote(option.id)}>
      <span className="domain">{option.domain}</span>
      <h2>{option.name}</h2>
      <p>{option.tagline}</p>
      <strong>{votes} votes</strong>
    </button>
  )
}

function App() {
  const [votes, setVotes] = useState({
    1: 0,
    2: 0,
    3: 0,
  })
  const totalVotes = votes[1] + votes[2] + votes[3]

  const highestVotes = Math.max(votes[1], votes[2], votes[3])

  const topOptions = nameOptions.filter(
    (option) => votes[option.id] === highestVotes
  )

  const leader =
    highestVotes === 0
      ? 'No votes yet'
      : topOptions.length > 1
        ? 'Tie between top names'
        : topOptions[0].name

  function handleVote(id) {
    setVotes({
      ...votes,
      [id]: votes[id] + 1,
    })
  }

  return (
    <main className="app">
      <section className="intro">
        <p className="eyebrow">Startup Name Vote</p>
        <h1>Which name sounds more professional?</h1>
        <p>
          Click the option that feels more catchy and trustworthy. The app uses
          the votes to show which brand identity is winning.
        </p>
      </section>

      <section className="duel">
        {nameOptions.map((option) => (
          <NameCard
            key={option.id}
            option={option}
            votes={votes[option.id]}
            onVote={handleVote}
          />
        ))}
      </section>

      <section className="result">
        <p>Total votes: {totalVotes}</p>
        <h2>{leader}</h2>
      </section>
    </main>
  )
}

export default App
