import { useState, useEffect } from "react";

export function useMovies(searchQuery, onCloseMovie, apiKey) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();

  const query = searchQuery;

  useEffect(
    function () {
      const controller = new AbortController();

      // here!!!
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

      onCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
