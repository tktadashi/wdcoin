import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeMode } from '../types';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isLight: boolean;
  isPurple: boolean;
  isRed: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
  isDark: true,
  isLight: false,
  isPurple: false,
  isRed: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('wd_theme') as ThemeMode;
    if (saved === 'light' || saved === 'purple') return 'light';
    return 'dark'; // Modo Escuro Premium padrão
  });

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    localStorage.setItem('wd_theme', theme);
    const root = document.documentElement;
    const body = document.body;

    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
      body.style.backgroundColor = '#111214';
      body.style.color = '#F4F1EC';
      body.className = 'bg-[#111214] text-[#F4F1EC] antialiased selection:bg-[#A78AB8]/30 selection:text-[#F4F1EC] transition-colors duration-200';
    } else {
      root.setAttribute('data-theme', 'light');
      root.classList.remove('dark');
      body.style.backgroundColor = '#F5F3EF';
      body.style.color = '#202124';
      body.className = 'bg-[#F5F3EF] text-[#202124] antialiased selection:bg-[#E9DFEE] selection:text-[#80658F] transition-colors duration-200';
    }
  }, [theme]);

  const isDark = theme === 'dark';
  const isLight = !isDark;

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark,
    isLight,
    isPurple: theme === 'purple',
    isRed: theme === 'red',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
