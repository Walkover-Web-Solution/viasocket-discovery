import React, { useState, useEffect } from "react";
import styles from "./Loader.module.scss"; // Assume you have appropriate CSS here

const steps = [
  "Initializing blog creation...",
  "Collecting relevant data...",
  "Analyzing user preferences...",
  "Researching best practices...",
  "Generating high-quality content...",
  "Enhancing readability...",
  "Optimizing blog layout and design...",
  "Checking for grammar and clarity...",
  "Finalizing blog structure...",
];
const totalCharacters = steps.join("").length; 

const Loader = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [typedCharacters, setTypedCharacters] = useState(0);

  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {

    const currentMessage = steps[currentStep];

    if (currentMessage && charIndex < currentMessage?.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + currentMessage[charIndex]);
        setCharIndex(charIndex + 1);
        setTypedCharacters((prev) => prev + 1);
      }, 80);
      return () => clearTimeout(timeoutId);
    } else {
        const pauseTimeout = setTimeout(() => {
          setCurrentStep((prev) => prev + 1);
          setDisplayedText("");
          setCharIndex(0);
        }, 1000);
        if(currentStep == steps.length) setShowSpinner(true);

        return () => clearTimeout(pauseTimeout);
    }
  }, [currentStep, charIndex]);

  return (
    <div className={styles.loaderWrapper}>
      <h3 className={`${styles.loaderMessage} ${showSpinner ? styles.removeBorderRight : ' '}`}>
        {displayedText || (showSpinner ? 'Finalizing blog structure...' : '|')}
        {showSpinner && <span className={styles.spinner}></span>}
      </h3>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${((typedCharacters) / totalCharacters) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default Loader;
