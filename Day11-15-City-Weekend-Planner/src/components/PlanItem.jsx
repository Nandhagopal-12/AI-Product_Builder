function PlanItem({
  place,
  onUpdateNote,
  onUpdateDay,
  onUpdateTimeOfDay,
  onRemoveFromPlan,
}) {
  return (
    <article className="plan-item">
      <h3>{place.name}</h3>
      <p>{place.area} - {place.time}</p>

      <div className="plan-select-row">
        <label>
          Day
          <select
            value={place.day}
            onChange={(event) => onUpdateDay(place.id, event.target.value)}
          >
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
        </label>

        <label>
          Time of day
          <select
            value={place.timeOfDay}
            onChange={(event) => onUpdateTimeOfDay(place.id, event.target.value)}
          >
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
          </select>
        </label>
      </div>

      <label>
        Plan note
        <textarea
          value={place.note}
          onChange={(event) => onUpdateNote(place.id, event.target.value)}
          placeholder="Add a note for this stop"
        />
      </label>

      <button type="button" onClick={() => onRemoveFromPlan(place.id)}>
        Remove
      </button>
    </article>
  )
}

export default PlanItem