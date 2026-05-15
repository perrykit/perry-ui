"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { useMobileNav } from "@/lib/mobile-nav-state"
import { cn } from "@/lib/utils"

interface SlideOverNavProps {
  children: React.ReactNode
}

export function SlideOverNav({ children }: SlideOverNavProps) {
  const { isOpen, close } = useMobileNav()

  // Body scroll lock when nav is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        close()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, close])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={close}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm">
        <div className="flex h-full">
          {/* Touch gesture area for swipe to close */}
          <div
            className="flex-1 cursor-ew-resize"
            onClick={close}
            aria-hidden="true"
          />

          {/* Navigation panel */}
          <div
            className={cn(
              "w-full max-w-sm bg-background border-l shadow-xl",
              "transform transition-transform duration-300 ease-out",
              "translate-x-0" // Slide in from right
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="text-lg font-semibold">Navigation</h2>
              <button
                onClick={close}
                className="rounded-md p-2 hover:bg-accent transition-colors"
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto py-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
