import { toHaveFormValues } from "@testing-library/jest-dom/matchers";
import { useState } from "react";

const messages = [
  "Learn React *",
  "Apply for jobs 🫥",
  "Invest your new income 😱",
];

export default function App() {
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(true);

  function handlePrevious() {
    setStep((step) => (step <= 1 ? 1 : step - 1));
  }

  function handleNext() {
    setStep((step) => (step >= 3 ? 3 : step + 1));
  }

  return (
    <>
      <button className="close" onClick={() => setIsOpen((isOpen) => !isOpen)}>
        &times;
      </button>
      {isOpen && (
        <div className="steps">
          <div className="numbers">
            <div className={step >= 1 ? "active" : ""}>1</div>
            <div className={step >= 2 ? "active" : ""}>2</div>
            <div className={step >= 3 ? "active" : ""}>3</div>
          </div>

          <StepMessage step={step}>
            {messages[step - 1]}
            <div className="buttons">
              <Button
                backgroundColor="#e7e7e7"
                textColor="#333"
                onClick={() => alert(`Learn how to ${messages[step - 1]}`)}
              >
                Learn How
              </Button>
            </div>
          </StepMessage>

          <div className="buttons">
            <Button
              backgroundColor="#7950f2"
              textColor="#fff"
              onClick={() => handlePrevious()}
            >
              👈 Previous
            </Button>
            <Button
              backgroundColor="#7950f2"
              textColor="#fff"
              text="Next"
              emoji="👉"
              onClick={() => handleNext()}
            >
              Next 👉
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

function Button({ textColor, backgroundColor, onClick, children }) {
  return (
    <button
      style={{ backgroundColor: backgroundColor, color: textColor }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function StepMessage({ step, children }) {
  return (
    <div className="message">
      <h3>Step {step}</h3>
      {children}
    </div>
  );
}
