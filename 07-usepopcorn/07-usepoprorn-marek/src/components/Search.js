import { useRef } from "react";
import { useKey } from "../hooks/useKey";

export function Search({ query, setQuery }) {
  const inputElement = useRef(null); // reference to...

  const handleEnterPressed = function () {
    if (document.activeElement !== inputElement.current) {
      inputElement.current.focus();
      setQuery("");
    }
  };

  useKey("Enter", handleEnterPressed);

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
