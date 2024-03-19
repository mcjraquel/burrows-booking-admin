import { create } from "zustand";

interface useAddBranchModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useAddBranchModal = create<useAddBranchModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))