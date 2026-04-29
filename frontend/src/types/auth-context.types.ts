export interface AuthUser {
  userId: number;
  email: string;
  roles: string[];
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}