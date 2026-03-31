import React, { createContext, useContext, useState, useEffect } from 'react';

const WelcomeContext = createContext();

export const WelcomeProvider = ({ children }) => {
  const [hasSeenWelcome, setHasSeenWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on first mount
    const welcomeShown = localStorage.getItem('welcomeShown') === 'true';
    setHasSeenWelcome(welcomeShown);
    setIsLoading(false);
  }, []);

  const markWelcomeAsSeen = () => {
    localStorage.setItem('welcomeShown', 'true');
    setHasSeenWelcome(true);
  };

  return (
    <WelcomeContext.Provider value={{ hasSeenWelcome, isLoading, markWelcomeAsSeen }}>
      {children}
    </WelcomeContext.Provider>
  );
};

export const useWelcome = () => {
  const context = useContext(WelcomeContext);
  if (!context) {
    throw new Error('useWelcome must be used within WelcomeProvider');
  }
  return context;
};
