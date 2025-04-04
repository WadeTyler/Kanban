'use client';
import React, {useEffect, useState} from 'react';
import {RiMoonClearFill, RiSunFill} from "@remixicon/react";
import Label from "@/components/Label";

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
    <div className="relative group">
      <button onClick={toggleTheme} className="hover-btn">
        {isDarkMode
          ? <RiSunFill />
          : <RiMoonClearFill />
        }
      </button>
      <Label text={"Toggle Theme"} />
    </div>
  );
};

export default ThemeButton;