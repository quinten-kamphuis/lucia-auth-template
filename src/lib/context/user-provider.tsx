'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { TUser } from '@/lib/types/auth';

type UserContextType = {
  user: TUser | null;
  loading: boolean;
  error: string | null;
};

const UserContext = createContext<UserContextType | null>(null);

type UserProviderProps = {
  children: React.ReactNode;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/auth/get-user');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data: TUser = await response.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();

    return () => {};
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};
