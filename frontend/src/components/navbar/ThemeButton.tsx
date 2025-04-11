'use client';
import React, {useEffect, useState} from 'react';
import {RiMoonClearFill, RiSunFill} from "@remixicon/react";
import Label from "@/components/Label";

const ThemeButton = () => {

  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  function toggleTheme() {
    const newMode = !isDarkMode;
    if (newMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    setIsDarkMode(newMode);
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
      || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    const isDark = savedTheme === 'dark';
    setIsDarkMode(isDark);

    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    }

  }, []);

  return (
    <div className="relative group">
      <button onClick={toggleTheme} className="hover-btn">
        {isDarkMode
          ? <RiSunFill/>
          : <RiMoonClearFill/>
        }
      </button>
      <Label text={"Toggle Theme"}/>
    </div>
  );
};

export default ThemeButton;