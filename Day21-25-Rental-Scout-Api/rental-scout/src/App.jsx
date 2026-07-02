import { useEffect, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import './App.css'
import BrowsePage from './pages/BrowsePage.jsx'
import DetailPage from './pages/DetailPage.jsx'
import SavedPage from './pages/SavedPage.jsx'
import ApplyPage from './pages/ApplyPage.jsx'
import { getRentals } from './api/rentalScoutApi.js'

function App() {
  const [savedRentalIds, setSavedRentalIds] = useState([])
  const [rentals, setRentals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadRentals() {
      try {
        const data = await getRentals()
        setRentals(data)
      } catch (error) {
        setErrorMessage(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadRentals()
  }, [])

  function handleToggleSaved(rentalId) {
    if (savedRentalIds.includes(rentalId)) {
      setSavedRentalIds(savedRentalIds.filter((id) => id !== rentalId))
    } else {
      setSavedRentalIds([...savedRentalIds, rentalId])
    }
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div>
          <p className="eyebrow">Rental Scout</p>
          <h1>Find a rental that fits your next move.</h1>
        </div>

        <nav className="site-nav" aria-label="Main navigation">
          <NavLink to="/">Browse</NavLink>
          <NavLink to="/saved">
            Saved ({savedRentalIds.length})
          </NavLink>
        </nav>
      </header>

      <main>
        {isLoading && (
          <section className="empty-state">
            <p className="eyebrow">Loading</p>
            <h2>Loading rentals from the API...</h2>
          </section>
        )}

        {errorMessage && (
          <section className="empty-state">
            <p className="eyebrow">API error</p>
            <h2>{errorMessage}</h2>
            <p>Check that the Express server is running on port 4000.</p>
          </section>
        )}

        {!isLoading && !errorMessage && (
          <Routes>
            <Route
              path="/"
              element={
                <BrowsePage
                  rentals={rentals}
                  savedRentalIds={savedRentalIds}
                  onToggleSaved={handleToggleSaved}
                />
              }
            />

            <Route
              path="/rentals/:rentalId"
              element={<DetailPage rentals={rentals} />}
            />
            <Route
              path="/rentals/:rentalId/apply"
              element={<ApplyPage rentals={rentals} />}
            />

            <Route
              path="/saved"
              element={
                <SavedPage
                  rentals={rentals}
                  savedRentalIds={savedRentalIds}
                />
              }
            />
          </Routes>
        )}
      </main>
    </div>
  )
}

export default App

