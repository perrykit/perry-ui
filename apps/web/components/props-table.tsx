export function PropsTable({ props }: { props: { name: string; type: string; required: boolean; default?: string; description: string }[] }) {
  if (!props || props.length === 0) return null

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-2 text-left font-medium">Prop</th>
            <th className="px-4 py-2 text-left font-medium">Type</th>
            <th className="px-4 py-2 text-left font-medium">Default</th>
            <th className="px-4 py-2 text-left font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name} className="border-b last:border-0">
              <td className="px-4 py-2 font-mono text-xs">
                {prop.name}
                {prop.required && <span className="text-destructive ml-0.5">*</span>}
              </td>
              <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{prop.type}</td>
              <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{prop.default ?? "-"}</td>
              <td className="px-4 py-2 text-muted-foreground">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
