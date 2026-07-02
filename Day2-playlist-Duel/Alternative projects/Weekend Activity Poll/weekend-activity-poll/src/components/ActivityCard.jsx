import './ActivityCard.css'

function ActivityCard({ activity, onVote, isLeader, isTie }) {
  return (
    <article className={`activity-card ${isLeader && !isTie ? 'leader' : ''}`}>
      <div className="card-topline">
        <span className="emoji" aria-hidden="true">
          {activity.emoji}
        </span>
        {isLeader && !isTie && <span className="leader-badge">Leading</span>}
        {isTie && <span className="tie-badge">Tied</span>}
      </div>

      <h2>{activity.title}</h2>
      <p className="vibe">{activity.vibe}</p>

      <dl className="details">
        <div>
          <dt>Cost</dt>
          <dd>{activity.cost}</dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>{activity.location}</dd>
        </div>
      </dl>

      <div className="vote-row">
        <p>
          <span>{activity.votes}</span> votes
        </p>
        <button type="button" onClick={() => onVote(activity.id)}>
          Vote
        </button>
      </div>
    </article>
  )
}

export default ActivityCard
