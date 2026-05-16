import Link from "next/link"

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 text-center">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Page not found</h2>
      <p className="text-muted-foreground mt-2 mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Back to home
      </Link>
    </div>
  )
}
