import { create } from 'zustand';
import authSlice from './slices/authSlice';
import themeSlice from './slices/themeSlice';
interface ThemeStore {
  isBlack: boolean;
  isOpen: string;

  setIsBlack: (input: boolean) => void;
  setIsOpen: (input: string) => void;
}

const useAuthStore = create<ReturnType<any>>()((set, get) => ({
  ...authSlice(set, get),
}));
const useThemeStore = create<ThemeStore>((set, get) => ({
  ...themeSlice(set, get),
}));

export { useAuthStore, useThemeStore };
