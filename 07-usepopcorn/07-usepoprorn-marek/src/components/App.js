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
import { useMovies } from "../hooks/useMovies.js";

export const apiKey = "c71825c5";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  // const [watched, setWatched] = useState(parse()); // every render
  const [watched, setWatched] = useState(function () {
    // only mount
    const watchedFromStorage = JSON.parse(localStorage.getItem("watched"));
    if (!watchedFromStorage) return [];
    console.log(
      watchedFromStorage,
      "length",
      watchedFromStorage.length,
      watchedFromStorage[0]
    );
    return watchedFromStorage.length > 0 ? watchedFromStorage : [];
  });
  const [selectedId, setSelectedId] = useState(null);

  const handleMovieAddedToWatched = function (movie) {
    setWatched((movies) => [...movies, movie]);
  };

  const handleDeleteWatched = function (id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  };

  const handleCloseMovie = function () {
    setSelectedId(null);
  };

  const {
    movies = [],
    isLoading,
    error,
  } = useMovies(query, handleCloseMovie, apiKey);

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
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  // useEffect(function () {
  //   const watchedFromStorage = localStorage.getItem("watched");
  //   if (!watchedFromStorage) return;
  //   setWatched(watched);
  // }, []);

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
              apiKey={apiKey}
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
