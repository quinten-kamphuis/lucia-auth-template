'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type SessionState = {
  isValid: boolean;
  loading: boolean;
  checkSession: () => Promise<void>;
};

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionState, setSessionState] = useState({
    isValid: false,
    loading: true,
  });

  const checkSession = async () => {
    setSessionState(prev => ({ ...prev, loading: true }));
    try {
      const response = await fetch('/api/auth/verify-session');
      const data = await response.json();
      setSessionState({ isValid: data.valid, loading: false });
    } catch (error) {
      console.error('Failed to verify session:', error);
      setSessionState({ isValid: false, loading: false });
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const value = {
    ...sessionState,
    checkSession,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }

  return context;
}
