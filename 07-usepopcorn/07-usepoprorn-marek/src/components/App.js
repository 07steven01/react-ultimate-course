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
import { useKey } from "../hooks/useKey.js";
import { useLocalStorageState } from "../hooks/useLocalStorageState.js";

export const apiKey = "c71825c5";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [watched, setWatched] = useLocalStorageState([], "watched");
  const [selectedId, setSelectedId] = useState(null);

  useKey("Escape", () => handleCloseMovie());

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
