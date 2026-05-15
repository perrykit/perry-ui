"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Moon, Sun, Menu } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { SearchBar } from "@/components/search-bar"
import { SlideOverNav } from "@/components/slide-over-nav"
import { useMobileNav } from "@/lib/mobile-nav-state"
import { MobileNavLinks } from "@/components/mobile-nav-links"

const navLinks = [
  { href: "/docs/installation", label: "Guides" },
]

export function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { open, close } = useMobileNav()

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-6 gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-lg">Perry UI</span>
          </Link>

          <div className="hidden md:block flex-1 max-w-md">
            <SearchBar />
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname?.startsWith(link.href) ? "text-foreground" : "text-foreground/60"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground/60 hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>
            <button
              onClick={open}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground/60 hover:text-foreground transition-colors md:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-over navigation */}
      <SlideOverNav>
        <div className="px-4 space-y-4">
          <div>
            <SearchBar />
          </div>
          <MobileNavLinks onClose={close} />
        </div>
      </SlideOverNav>
    </>
  )
}
