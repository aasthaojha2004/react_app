import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (err) {
      console.error('Error reading localStorage', err);
      return initialValue;
    }
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (err) {
        console.error('Error writing to localStorage', err);
      }
    }, 300); // debounce writes
    return () => clearTimeout(timeout);
  }, [key, value]);

  return [value, setValue];
};
