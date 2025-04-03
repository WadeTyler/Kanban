'use client';
import React, {useEffect, useState} from 'react';
import {RiMoonClearFill, RiSunFill} from "@remixicon/react";

const ThemeButton = () => {

  const [isDarkMode, setIsDarkMode] = useState<boolean>();

  function toggleTheme() {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsDarkMode(savedTheme === 'dark');

    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  return (
    <button onClick={toggleTheme} className="hover-btn">
      {isDarkMode
        ? <RiSunFill />
        : <RiMoonClearFill />
      }
    </button>
  );
};

export default ThemeButton;