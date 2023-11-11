import { useState } from "react";
import { useEffect } from "react";
import StarRating from "./StarRating.js";

const apiKey = "c71825c5";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();

  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setError(null);
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`
          );
          if (!res.ok) {
            throw new Error("Fetching movies failed");
          }
          const data = await res.json();
          setMovies(data.Search ?? []);
        } catch (err) {
          setError(err);
          console.error(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setError(new Error("Query too short"));
        return;
      }

      fetchMovies();
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <List movies={movies} isFav={false} />}
           */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <List
              movies={movies}
              isFav={false}
              onItemClick={(item) => {
                setSelectedId((id) =>
                  id === item.imdbID ? null : item.imdbID
                );
                console.log(`item clicked ${item}`);
              }}
            />
          )}
          {!isLoading && !error && movies.length === 0 && "No results"}
          {error && <ErrorMessage message={error.message} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              movieId={selectedId}
              onCloseMovie={(x) => setSelectedId(null)}
            />
          ) : (
            <>
              <Summary movies={watched} />
              <List movies={watched} isFav={true} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function MovieDetails({ movieId, onCloseMovie }) {
  const [details, setDetails] = useState({});
  const [isLoading, setIsLoading] = useState();

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = details;

  console.log(title, year);

  useEffect(
    function () {
      async function fetchMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}`
        );
        if (!res.ok) {
          throw new Error("Fetching movie detail failed");
        }
        const data = await res.json();
        console.log(data);

        setDetails(data ?? null);
        setIsLoading(false);
      }
      fetchMovieDetails();
    },
    [movieId]
  );
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              <StarRating maxRating={10} />
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔️</span>
      {message}
    </p>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function List({ movies, isFav, onItemClick }) {
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
                <span>{movie.imdbRating}</span>
              </p>
              <p>
                <span>🌟</span>
                <span>{movie.userRating}</span>
              </p>
              <p>
                <span>⏳</span>
                <span>{movie.runtime} min</span>
              </p>
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

function Summary({ movies }) {
  const avgImdbRating = average(movies.map((movie) => movie.imdbRating));
  const avgUserRating = average(movies.map((movie) => movie.userRating));
  const avgRuntime = average(movies.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{movies.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "-" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
