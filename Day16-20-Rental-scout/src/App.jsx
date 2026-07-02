import { useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import './App.css'
import BrowsePage from './pages/BrowsePage.jsx'
import DetailPage from './pages/DetailPage.jsx'
import SavedPage from './pages/SavedPage.jsx'
import ApplyPage from './pages/ApplyPage.jsx'

function App() {
  const [savedRentalIds, setSavedRentalIds] = useState([])

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
        <Routes>
          <Route
            path="/"
            element={
              <BrowsePage
                savedRentalIds={savedRentalIds}
                onToggleSaved={handleToggleSaved}
              />
            }
          />

          <Route path="/rentals/:rentalId" element={<DetailPage />} />
          <Route path="/rentals/:rentalId/apply" element={<ApplyPage />} />

          <Route
            path="/saved"
            element={<SavedPage savedRentalIds={savedRentalIds} />}
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
