export function List({ movies, isFav, onItemClick, onDeleteWatched }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <li key={movie.imdbID} onClick={() => onItemClick(movie)}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          {isFav && (
            <div>
              <p>
                <span>⭐️</span>
                <span>{movie.imdbRating?.toFixed(1)}</span>
              </p>
              <p>
                <span>🌟</span>
                <span>{movie.userRating?.toFixed(1)}</span>
              </p>
              <p>
                <span>⏳</span>
                <span>{movie.runtime} min</span>
              </p>
              <div className="btn-delete">
                <span onClick={() => onDeleteWatched(movie.imdbID)}>🚫</span>
              </div>
            </div>
          )}
          {!isFav && (
            <div>
              <p>
                <span>🗓</span>
                <span>{movie.Year}</span>
              </p>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
