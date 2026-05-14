import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
  username: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  email?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  profile: UserProfile;
  loginDates: string[];
  login: (username: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setAvatar: (avatar: string) => void;
}

const DEFAULT_AVATARS = [
  '👨', '👩', '👨‍💻', '👩‍💻', '🦸', '🦹', '🧙', '🧚', '🐱', '🐶', 
  '🦊', '🐼', '🐨', '🦁', '🐯', '🔥', '⭐', '🌟', '💫', '🎯'
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      profile: {
        username: '',
        avatar: undefined,
        bio: '',
        phone: '',
        email: '',
      },
      loginDates: [],
      login: (username: string) => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        const dates = state.loginDates.includes(today) ? state.loginDates : [...state.loginDates, today];
        return {
          isLoggedIn: true,
          loginDates: dates,
          profile: {
            username,
            avatar: DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)],
            bio: '',
            phone: '',
            email: ''
          }
        };
      }),
      logout: () => set({ 
        isLoggedIn: false, 
        profile: { 
          username: '', 
          avatar: undefined,
          bio: '',
          phone: '',
          email: '' 
        } 
      }),
      updateProfile: (updates: Partial<UserProfile>) => set((state) => ({
        profile: { ...state.profile, ...updates }
      })),
      setAvatar: (avatar: string) => set((state) => ({
        profile: { ...state.profile, avatar }
      })),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export { DEFAULT_AVATARS };