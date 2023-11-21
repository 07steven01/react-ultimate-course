import { useEffect, useRef } from "react";

export function Search({ query, setQuery }) {
  const inputElement = useRef(null); // reference to...

  useEffect(function () {
    console.log(inputElement.current);
    inputElement.current.focus();
  }, []);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputElement} // ... the DOM element
    />
  );
}
