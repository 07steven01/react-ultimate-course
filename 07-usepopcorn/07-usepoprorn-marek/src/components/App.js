import { useState } from "react";
import { useEffect } from "react";
import { MovieDetails } from "./MovieDetails.js";
import { Loader } from "./Loader.js";
import { ErrorMessage } from "./ErrorMessage.js";
import { NavBar } from "./NavBar.js";
import { Search } from "./Search.js";
import { NumResults } from "./NumResults.js";
import { Main } from "./Main.js";
import { List } from "./List.js";
import { Summary } from "./Summary.js";
import { Box } from "./Box.js";

export const apiKey = "c71825c5";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();

  useEffect(function () {
    function callback(e) {
      if (e.code === "Escape") {
        handleCloseMovie();
        console.log("CLOSING");
      }
    }

    document.addEventListener("keydown", callback);
    return function () {
      document.removeEventListener("keydown", callback);
    };
  }, []);

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setError(null);
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok) {
            throw new Error("Fetching movies failed");
          }
          const data = await res.json();
          setMovies(data.Search ?? []);
          setError(null);
        } catch (err) {
          console.log(err.name);
          if (err.name !== "AbortError") {
            setError(err);
            console.error(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setError(new Error("Query too short"));
        return;
      }

      handleCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  const handleMovieAddedToWatched = function (movie) {
    setWatched((movies) => [...movies, movie]);
  };

  const handleDeleteWatched = function (id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  };

  const handleCloseMovie = function () {
    setSelectedId(null);
  };

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
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
              onCloseMovie={handleCloseMovie}
              onAddWatched={(movie) => handleMovieAddedToWatched(movie)}
              watched={watched}
              onDeleteWatched={(id) => handleDeleteWatched(id)}
            />
          ) : (
            <>
              <Summary movies={watched} />
              <List
                movies={watched}
                isFav={true}
                onItemClick={(x) => {}}
                onDeleteWatched={(id) => handleDeleteWatched(id)}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
