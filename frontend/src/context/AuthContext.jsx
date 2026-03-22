import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('crm_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('crm_token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('crm_token');
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      axios
        .get('/api/auth/me')
        .then((res) => setUser(res.data))
        .catch(() => { setToken(null); setUser(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  const loginWithEmail = async (email, name) => {
    const res = await axios.post('/api/auth/login', { email, name });
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => { setToken(null); setUser(null); };

  const refreshUser = async () => {
    const res = await axios.get('/api/auth/me');
    setUser(res.data);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginWithEmail, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
