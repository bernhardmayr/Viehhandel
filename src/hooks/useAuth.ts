import { useAppStore } from './useAppStore';
import type { User, UserRole } from '../types/models';
import { uid } from '../lib/util';

export function useAuth() {
  const { state, dispatch } = useAppStore();
  const currentUser = state.users.find((u) => u.id === state.currentUserId) ?? null;

  function login(email: string, password: string): User | null {
    const user = state.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (user) {
      dispatch({ type: 'LOGIN', userId: user.id });
      return user;
    }
    return null;
  }

  function register(input: {
    email: string;
    password: string;
    displayName: string;
    role: UserRole;
    betriebsnummer?: string;
    plz?: string;
    ort?: string;
  }): User | null {
    if (state.users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
      return null; // E-Mail bereits vergeben
    }
    const user: User = {
      id: uid('u'),
      email: input.email,
      password: input.password,
      displayName: input.displayName,
      role: input.role,
      verified: false,
      ratingAvg: 0,
      ratingCount: 0,
      betriebsnummer: input.betriebsnummer,
      plz: input.plz,
      ort: input.ort,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'REGISTER', user });
    return user;
  }

  function logout() {
    dispatch({ type: 'LOGOUT' });
  }

  return { currentUser, login, register, logout };
}
