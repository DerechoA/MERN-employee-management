import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem('token'));
      setUserEmail(localStorage.getItem('userEmail'));
      setUserRole(localStorage.getItem('userRole'));
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return {
    token,
    userEmail,
    userRole,
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');
      setToken(null);
      setUserEmail(null);
      setUserRole(null);
    }
  };
};
