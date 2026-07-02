function MovieCard({ movie, isShortlisted, onToggleShortlist }) {
  return (
    <article className="movie-card">
      <div>
        <p className="genre">{movie.genre}</p>
        <h2>{movie.title}</h2>
        <p className="synopsis">{movie.synopsis}</p>
      </div>

      <div className="movie-details">
        <span>Rating: {movie.rating}</span>
        <span>Runtime: {movie.runtime}</span>
      </div>

      <button type="button" onClick={() => onToggleShortlist(movie.id)}>
        {isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
      </button>
    </article>
  )
}

export default MovieCard