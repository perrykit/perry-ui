import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MobileNavState {
  isOpen: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}

export const useMobileNavStore = create<MobileNavState>()(
  persist(
    (set) => ({
      isOpen: false,
      setOpen: (open) => set({ isOpen: open }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'mobile-nav-storage',
    }
  )
)

// React hooks for easy integration
export function useMobileNav() {
  const { isOpen, setOpen, toggle } = useMobileNavStore()
  return {
    isOpen,
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle,
  }
}

// Sync across tabs using BroadcastChannel
if (typeof window !== 'undefined') {
  const channel = new BroadcastChannel('mobile-nav-sync')

  // Listen for changes from other tabs
  channel.onmessage = (event) => {
    if (event.data.type === 'SYNC_NAV') {
      useMobileNavStore.setState({ isOpen: event.data.isOpen })
    }
  }

  // Broadcast changes when state updates
  useMobileNavStore.subscribe((state) => {
    channel.postMessage({
      type: 'SYNC_NAV',
      isOpen: state.isOpen,
    })
  })
}
