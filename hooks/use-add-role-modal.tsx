import { create } from "zustand";

interface useAddRoleModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useAddRoleModal = create<useAddRoleModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
