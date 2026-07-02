import { useEffect, useState } from 'react'
import { places } from './data/places'
import { filterPlaces } from './helpers/placeHelpers'
import PlaceCard from './components/PlaceCard'
import PlanItem from './components/PlanItem'
import './App.css'

const categories = ['All', 'Food', 'Culture', 'Outdoors', 'Entertainment', 'Shopping']
const budgets = ['All', 'Free', '$', '$$']

function App() {
  const [searchText, setSearchText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedBudget, setSelectedBudget] = useState('All')
  const [sortOption, setSortOption] = useState('default')
  const [plan, setPlan] = useState(() => {
    const savedPlan = localStorage.getItem('cityWeekendPlan')

    if (savedPlan) {
      return JSON.parse(savedPlan)
    }

    return []
  })
  
  useEffect(() => {
    localStorage.setItem('cityWeekendPlan', JSON.stringify(plan))
  }, [plan])

  const filteredPlaces = filterPlaces(
    places,
    searchText,
    selectedCategory,
    selectedBudget,
    sortOption,
  )

  const plannedPlaces = plan.map((planItem) => {
    const place = places.find((place) => place.id === planItem.placeId)

    return {
      ...place,
      note: planItem.note,
      day: planItem.day || 'Saturday',
      timeOfDay: planItem.timeOfDay || 'Afternoon',
    }
  })

  const saturdayCount = plannedPlaces.filter((place) => place.day === 'Saturday').length
  const sundayCount = plannedPlaces.filter((place) => place.day === 'Sunday').length

  function handleAddToPlan(placeId) {
    const alreadyPlanned = plan.some((item) => item.placeId === placeId)

    if (alreadyPlanned) {
      return
    }
    
    setPlan([
      ...plan,
      {
        placeId: placeId,
        note: '',
        day: 'Saturday',
        timeOfDay: 'Afternoon',
      },
    ])
  }
  
  function handleRemoveFromPlan(placeId) {
    setPlan(plan.filter((item) => item.placeId !== placeId))
  }

  function handleUpdateNote(placeId, newNote) {
    setPlan(
      plan.map((item) => {
        if (item.placeId === placeId) {
          return {
            ...item,
            note: newNote,
          }
        }

        return item
      })
    )
  }

  function handleUpdateDay(placeId, newDay) {
    setPlan(
      plan.map((item) => {
        if (item.placeId === placeId) {
          return {
            ...item,
            day: newDay,
          }
        }

        return item
      })
    )
  }

  function handleUpdateTimeOfDay(placeId, newTimeOfDay) {
    setPlan(
      plan.map((item) => {
        if (item.placeId === placeId) {
          return {
            ...item,
            timeOfDay: newTimeOfDay,
          }
        }

        return item
      })
    )
  }

  function handleResetFilters() {
    setSearchText('')
    setSelectedCategory('All')
    setSelectedBudget('All')
    setSortOption('default')
  }

  return (
    <main className="app">
      <section className="header">
        <p className="eyebrow">Weekend planner</p>
        <h1>Explore city ideas</h1>
        <p className="intro">
          Search places, filter by category, and choose ideas for a simple city weekend.
        </p>
        <p>{plan.length} items in your plan</p>
      </section>

      <section className="toolbar" aria-label="Explore filters">
        <label className="search-field">
          Search
          <input
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Try food, lake, Old Town..."
          />
        </label>

        <label className="search-field">
          Category
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="search-field">
          Budget
          <select
            value={selectedBudget}
            onChange={(event) => setSelectedBudget(event.target.value)}
          >
            {budgets.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
        </label>

        <label className="search-field">
          Sort
          <select value={sortOption} onChange={(event) => setSortOption(event.target.value)}>
            <option value="default">Default</option>
            <option value="name">Name A-Z</option>
            <option value="time">Time</option>
          </select>
        </label>

        <button type="button" onClick={handleResetFilters}>
          Reset filters
        </button>
      </section>

      <section className="results-header">
        <h2>{filteredPlaces.length} options found</h2>
        <p>Showing local data from `src/data/places.js`.</p>
      </section>

      {filteredPlaces.length > 0 ? (
        <section className="place-grid" aria-label="City options">
          {filteredPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              isPlanned={plan.some((item) => item.placeId === place.id)}
              onAddToPlan={handleAddToPlan}
            />
          ))}
        </section>
      ) : (
        <section className="empty-state">
          <h2>No matching options</h2>
          <p>
            No city ideas match your current search, category, and sort choices.
            Reset the filters to see all weekend options again.
          </p>
          <button type="button" onClick={handleResetFilters}>
            Reset filters
          </button>
        </section>
      )}
      <section className="plan-section">
        <h2>Your plan</h2>
        <div className="plan-summary">
          <span>Saturday: {saturdayCount}</span>
          <span>Sunday: {sundayCount}</span>
        </div>

        {plannedPlaces.length > 0 && (
          <button type="button" onClick={() => setPlan([])}>
            Clear plan
          </button>
        )}

        {plannedPlaces.length === 0 ? (
          <p>
            Your plan is empty. Add places from the explore cards, then use notes
            to remember why each stop belongs in your weekend.
          </p>
        ) : (
          <div className="plan-list">
            {plannedPlaces.map((place) => (
              <PlanItem
                key={place.id}
                place={place}
                onUpdateNote={handleUpdateNote}
                onUpdateDay={handleUpdateDay}
                onUpdateTimeOfDay={handleUpdateTimeOfDay}
                onRemoveFromPlan={handleRemoveFromPlan}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default App
