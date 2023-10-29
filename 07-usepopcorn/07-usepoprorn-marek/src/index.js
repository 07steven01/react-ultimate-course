import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import StarRating from "./StarRating";
import { useState } from "react";

function Test() {
  const [movieRating, setMovieRating] = useState(0);
  return (
    <div>
      <StarRating color="blue" onSetRating={setMovieRating} />
      <p>This movie is rated {movieRating} stars</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <StarRating
      maxRating={10}
      color={"#ff0000"}
      size={60}
      className="test"
      mapping={[
        "Terrible",
        "Ugly",
        "Bad",
        "Mediocre",
        "So so",
        "Not bad",
        "Quite good",
        "Good",
        "Very good",
        "Brilliant",
        "Masterpiece",
      ]}
      defaultRating={3}
    />
    <StarRating />
    <Test />
  </React.StrictMode>
);
