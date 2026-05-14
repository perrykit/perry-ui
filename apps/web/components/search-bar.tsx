"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { getRootRegistry } from "@/lib/registry"
import { useRouter } from "next/navigation"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const registry = getRootRegistry()

  const results = useMemo(() => {
    if (!query.trim()) return []

    const q = query.toLowerCase()
    return registry.items.filter((item) => {
      const matchName = item.name.toLowerCase().includes(q)
      const matchTitle = item.title?.toLowerCase().includes(q)
      const matchDesc = item.description?.toLowerCase().includes(q)
      const matchType = item.type?.toLowerCase().includes(q)

      return matchName || matchTitle || matchDesc || matchType
    }).slice(0, 8) // Limit to 8 results
  }, [query, registry.items])

  const handleSelect = (item: typeof results[0]) => {
    if (item.type === "component") {
      router.push(`/components/${item.name}`)
    } else if (item.type === "block") {
      router.push(`/blocks/${item.name}`)
    } else if (item.type === "theme") {
      router.push(`/docs/theming`)
    }
    setIsOpen(false)
    setQuery("")
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search components, blocks..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      {isOpen && query.trim() && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-2 bg-popover border rounded-md shadow-lg max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">
                No results found for "{query}"
              </div>
            ) : (
              <ul className="py-2">
                {results.map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={() => handleSelect(item)}
                      className="w-full px-4 py-2 text-left hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{item.title || item.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {item.description?.slice(0, 60)}...
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground capitalize px-2 py-1 rounded bg-secondary">
                          {item.type}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  )
}
