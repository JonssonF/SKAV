import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType, AuthUser } from '../types/auth-context.types';

const AuthContext = createContext<AuthContextType | null>(null);

function parseToken(token: string): AuthUser | null {
  try {
    // JWT har tre delar separerade med punkt: header.payload.signature
    // Vi vill åt payload (del 2) som är base64-kodad JSON
    const payload = JSON.parse(atob(token.split('.')[1]));

    return {
      userId: Number(
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
      ),
      email:
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ?? '',
      roles: Array.isArray(
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      )
        ? payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
        : [payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']].filter(
            Boolean
          ),
    };
  } catch {
    return null;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('token');
    return saved ? parseToken(saved) : null;
  });

  const login = useCallback((newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(parseToken(newToken));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  // Kolla om token har gått ut
  useEffect(() => {
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // exp är i sekunder, JS vill millisekunder
      if (Date.now() > expiry) {
        logout();
      }
    } catch {
      logout();
    }
  }, [token, logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: user !== null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — gör det enkelt att använda auth i vilken komponent som helst
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth måste användas inom AuthProvider');
  }
  return context;
}