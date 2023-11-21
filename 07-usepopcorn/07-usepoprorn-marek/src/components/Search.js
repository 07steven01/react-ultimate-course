import { useEffect, useRef } from "react";

export function Search({ query, setQuery }) {
  const inputElement = useRef(null); // reference to...

  useEffect(
    function () {
      function callback(e) {
        if (
          e.code === "Enter" &&
          document.activeElement !== inputElement.current
        ) {
          //focus
          console.log("keydown");
          inputElement.current.focus();
          setQuery("");
        }
      }
      document.addEventListener("keydown", callback);

      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [setQuery]
  );

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
