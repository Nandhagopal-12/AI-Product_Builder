function PlaceCard({ place, isPlanned, onAddToPlan }) {
  return (
    <article className="place-card">
      <div className="card-topline">
        <span>{place.category}</span>
        <span>{place.price}</span>
      </div>

      <h3>{place.name}</h3>
      <p>{place.description}</p>

      <div className="card-meta">
        <span>{place.area}</span>
        <span>{place.time}</span>
        <button
          type="button"
          onClick={() => onAddToPlan(place.id)}
          disabled={isPlanned}
        >
          {isPlanned ? 'Added to plan' : 'Add to plan'}
        </button>
      </div>
    </article>
  )
}

export default PlaceCard