import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail'));

  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem('token'));
      setUserEmail(localStorage.getItem('userEmail'));
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return {
    token,
    userEmail,
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      setToken(null);
      setUserEmail(null);
    }
  };
};
