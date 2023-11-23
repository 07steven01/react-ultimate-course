import { useRef, useState } from "react";
import { useEffect } from "react";
import StarRating from "./StarRating.js";
import { apiKey } from "./App.js";
import { Loader } from "./Loader.js";

export function MovieDetails({ movieId, onCloseMovie, onAddWatched, watched }) {
  const [details, setDetails] = useState({});
  const [userRating, setUserRating] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const countRef = useRef(0);
  // let count = 0;  // wouldn't work, would be reset on every rerender

  useEffect(
    function () {
      // do not increment on mount
      if (userRating) {
        countRef.current += 1;
        console.log("countRef", countRef.current);
      }
    },
    [userRating]
  );

  const watchedRating = watched.find(
    (watched) => watched.imdbID === movieId
  )?.userRating;

  const {
    Title,
    Year: year,
    Poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = details;

  console.log(Title, year);

  const handleAddWatched = function (userRating) {
    const watchedMovie = {
      imdbID: movieId,
      Title,
      year,
      Poster,
      imdbRating: Number(imdbRating),
      userRating,
      runtime: Number(runtime.split(" ").at(0)),
      countRatingDecisions: countRef.current,
    };
    console.log("watched ", watchedMovie);
    onAddWatched(watchedMovie);
  };

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

  useEffect(
    function () {
      if (!Title) return;
      document.title = `Movie | ${Title}`;

      return function () {
        document.title = "usePopcorn";
        console.log(`Cleanup function called for ${Title}`);
      };
    },
    [Title]
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
            <img src={Poster} alt={`Poster of ${Title}`} />
            <div className="details-overview">
              <h2>{Title}</h2>
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
              {!watchedRating ? (
                <>
                  <StarRating maxRating={10} onSetRating={setUserRating} />

                  <button
                    className="btn-add"
                    onClick={() => handleAddWatched(userRating)}
                  >
                    Add to watched
                  </button>
                </>
              ) : (
                <span>You rated this movie with {watchedRating}</span>
              )}
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
