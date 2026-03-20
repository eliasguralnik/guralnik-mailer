// src/theme/ThemeProvider.tsx
import React, { createContext, useContext } from 'react';
import { ThemeProfile, modernTheme } from './profiles';

// 1. Wir erstellen den leeren Kontext (Fallback ist modernTheme)
const ThemeContext = createContext<ThemeProfile>(modernTheme);

// 2. Ein kleiner Hook, damit unsere Komponenten das Theme super einfach abrufen können
export const useTheme = () => {
  return useContext(ThemeContext);
};

// 3. Der eigentliche Regenschirm (Provider)
export const ThemeProvider = ({ 
  theme, 
  children 
}: { 
  theme: ThemeProfile; 
  children: React.ReactNode 
}) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};