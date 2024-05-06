import { create } from 'zustand';

type SettingsStore = {
    isOpen: boolean;
    onOpen: () => void; 
    onClose: () => void;
}

/**
 * Custom hook for managing settings.
 * @returns An object with isOpen, onOpen, and onClose properties.
 */
export const useSettings = create<SettingsStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
