import { create } from 'zustand'

interface MobileNavState {
  isOpen: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}

export const useMobileNavStore = create<MobileNavState>()((set) => ({
  isOpen: false,
  setOpen: (open) => set({ isOpen: open }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}))

export function useMobileNav() {
  const { isOpen, setOpen, toggle } = useMobileNavStore()
  return {
    isOpen,
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle,
  }
}
