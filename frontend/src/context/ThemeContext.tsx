import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (event?: React.MouseEvent) => void;
  isRippleActive: boolean;
  ripplePos: { x: number; y: number };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('spotfix-theme');
    return (saved as Theme) || 'light';
  });

  const [isRippleActive, setIsRippleActive] = useState(false);
  const [ripplePos, setRipplePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('spotfix-theme', theme);
  }, [theme]);

  const toggleTheme = (event?: React.MouseEvent) => {
    if (event) {
      setRipplePos({ x: event.clientX, y: event.clientY });
      setIsRippleActive(true);
      
      // Delay the actual theme switch to middle of ripple
      setTimeout(() => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
      }, 500);

      // Reset ripple
      setTimeout(() => {
        setIsRippleActive(false);
      }, 1000);
    } else {
      setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isRippleActive, ripplePos }}>
      {children}
      {isRippleActive && (
        <div 
          className="fixed inset-0 z-[10000] pointer-events-none overflow-hidden"
        >
          <div 
            className="absolute rounded-full transition-all duration-1000 ease-in-out bg-navy dark:bg-white"
            style={{
              left: ripplePos.x,
              top: ripplePos.y,
              width: isRippleActive ? '300vmax' : '0',
              height: isRippleActive ? '300vmax' : '0',
              transform: 'translate(-50%, -50%)',
              opacity: isRippleActive ? [0, 1, 0][1] : 0, // Simplified conceptual
              backgroundColor: theme === 'light' ? '#0A0A0C' : '#F5F5F7'
            }}
          />
        </div>
      )}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
