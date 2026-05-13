const platformLabels: Record<string, string> = {
  macos: "macOS",
  ios: "iOS",
  android: "Android",
  linux: "Linux",
  windows: "Windows",
  web: "Web",
}

export function PlatformNotes({ notes }: { notes?: Record<string, string> }) {
  if (!notes || Object.keys(notes).length === 0) return null

  return (
    <div className="space-y-2">
      {Object.entries(notes).map(([platform, note]) => (
        <div key={platform} className="flex gap-3 text-sm">
          <span className="w-20 shrink-0 font-medium">{platformLabels[platform] ?? platform}</span>
          <span className="text-muted-foreground">{note}</span>
        </div>
      ))}
    </div>
  )
}
