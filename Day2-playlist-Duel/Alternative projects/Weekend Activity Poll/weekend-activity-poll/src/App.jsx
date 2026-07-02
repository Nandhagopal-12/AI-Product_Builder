import { useState } from 'react'
import { initialActivities } from './data/activities'
import ActivityCard from './components/ActivityCard'
import './App.css'

function App() {
  const [activities, setActivities] = useState(initialActivities)

  function handleVote(activityId) {
    const updatedActivities = activities.map((activity) => {
      if (activity.id === activityId) {
        return {
          ...activity,
          votes: activity.votes + 1,
        }
      }

      return activity
    })

    setActivities(updatedActivities)
  }

  const firstActivity = activities[0]
  const secondActivity = activities[1]
  const isTie = firstActivity.votes === secondActivity.votes
  const leader =
    firstActivity.votes > secondActivity.votes ? firstActivity : secondActivity

  const bannerText = isTie
    ? "It's a tie. Keep voting!"
    : `Official plan so far: ${leader.title} ${leader.emoji}`

  return (
    <main className="app">
      <section className="app-header">
        <p className="eyebrow">Weekend Activity Poll</p>
        <h1>Settle the weekend plan</h1>
        <p className="intro">
          Compare the two options, vote with one click, and let the majority
          decide the plan.
        </p>
        <div className="result-banner">{bannerText}</div>
      </section>

      <section className="activity-grid" aria-label="Weekend activity options">
        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onVote={handleVote}
            isLeader={activity.id === leader.id}
            isTie={isTie}
          />
        ))}
      </section>
    </main>
  )
}

export default App
