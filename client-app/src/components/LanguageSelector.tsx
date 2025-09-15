"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

const LanguageSelector: React.FC = () => {
  const { currentLang, setLanguage } = useLanguage();

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang); // Update the context state
  };

  return (
    <div className="language-selector">
      <button
        onClick={() => handleLanguageChange("en")}
        className={`px-2 py-1 ${currentLang === "en" ? "font-bold" : ""}`}
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange("hi")}
        className={`px-2 py-1 ${currentLang === "hi" ? "font-bold" : ""}`}
      >
        HI
      </button>
    </div>
  );
};

export default LanguageSelector;

