import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  college: string;
  phone?: string;
  department?: string;
  year?: string;
  bio?: string;
  role: "user" | "admin";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true, loading: false });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },
      setLoading: (val) => set({ loading: val }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
