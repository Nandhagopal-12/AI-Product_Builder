import { useState } from 'react'
import MovieCard from './components/MovieCard'
import './App.css'

const movies = [
  {
    id: 1,
    title: 'Interstellar',
    genre: 'Sci-Fi',
    rating: '8.7',
    runtime: '2h 49m',
    synopsis: 'A team travels through space to find a new home for humanity.',
  },
  {
    id: 2,
    title: 'The Parent Trap',
    genre: 'Comedy',
    rating: '6.7',
    runtime: '2h 8m',
    synopsis: 'Twin sisters meet at camp and plan to reunite their parents.',
  },
  {
    id: 3,
    title: 'Coco',
    genre: 'Animation',
    rating: '8.4',
    runtime: '1h 45m',
    synopsis: 'A young musician enters the Land of the Dead to learn his family story.',
  },
  {
    id: 4,
    title: 'Black Panther',
    genre: 'Action',
    rating: '7.3',
    runtime: '2h 14m',
    synopsis: 'A new king protects Wakanda while facing a powerful challenger.',
  },
  {
    id: 5,
    title: 'Knives Out',
    genre: 'Mystery',
    rating: '7.9',
    runtime: '2h 10m',
    synopsis: 'A detective investigates a family after a famous writer is found dead.',
  },
  {
    id: 6,
    title: 'The Princess Bride',
    genre: 'Adventure',
    rating: '8.0',
    runtime: '1h 38m',
    synopsis: 'A farmhand begins a funny and brave quest to rescue his true love.',
  },
  {
    id: 7,
    title: 'Spider-Man: Into the Spider-Verse',
    genre: 'Animation',
    rating: '8.4',
    runtime: '1h 57m',
    synopsis: 'Miles Morales becomes Spider-Man and meets heroes from other worlds.',
  },
  {
    id: 8,
    title: 'Hidden Figures',
    genre: 'Drama',
    rating: '7.8',
    runtime: '2h 7m',
    synopsis: 'Three mathematicians help NASA during the Space Race.',
  },
]

const genres = ['All', 'Action', 'Adventure', 'Animation', 'Comedy', 'Drama', 'Mystery', 'Sci-Fi']

function App() {
  const [searchText, setSearchText] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [shortlist, setShortlist] = useState([])

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch =
      movie.title.toLowerCase().includes(searchText.toLowerCase()) ||
      movie.genre.toLowerCase().includes(searchText.toLowerCase())
    const matchesGenre = selectedGenre === 'All' || movie.genre === selectedGenre

    return matchesSearch && matchesGenre
  })

  const shortlistedMovies = movies.filter((movie) => shortlist.includes(movie.id))

  function handleToggleShortlist(movieId) {
    if (shortlist.includes(movieId)) {
      setShortlist(shortlist.filter((id) => id !== movieId))
    } else {
      setShortlist([...shortlist, movieId])
    }
  }

  function handleClearFilters() {
    setSearchText('')
    setSelectedGenre('All')
  }

  return (
    <main className="app">
      <header className="page-header">
        <p className="eyebrow">Movie Night Planner</p>
        <h1>Pick a movie everyone will enjoy</h1>
        <p>Search the list, filter by genre, and save a shortlist for tonight.</p>
      </header>

      <section className="controls" aria-label="Movie filters">
        <label>
          Search movie
          <input
            type="text"
            placeholder="Try Coco or Spider-Man"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
        </label>

        <label>
          Genre
          <select value={selectedGenre} onChange={(event) => setSelectedGenre(event.target.value)}>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <button type="button" onClick={handleClearFilters}>
            Clear filters
          </button>
        </label>
      </section>

      <section className="summary">
        <p>
          Showing <strong>{filteredMovies.length}</strong> movies
        </p>
        <p>
          Shortlist <strong>{shortlist.length}</strong>
        </p>
      </section>

      <section className="shortlist-panel">
        <h2>Your shortlist</h2>

        {shortlistedMovies.length === 0 ? (
          <p>No movies shortlisted yet.</p>
        ) : (
          shortlistedMovies.map((movie) => (
            <p key={movie.id}>
              {movie.title} - {movie.genre} - {movie.runtime}
            </p>
          ))
        )}
      </section>

      {filteredMovies.length === 0 ? (
        <p className="empty-state">No movies found. Try a different search or genre.</p>
      ) : (
        <section className="movie-grid" aria-label="Movie list">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isShortlisted={shortlist.includes(movie.id)}
              onToggleShortlist={handleToggleShortlist}
            />
          ))}
        </section>
      )}
    </main>
  )
}

export default App
