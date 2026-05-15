"use client"

import { useState, Suspense } from "react"

interface ComponentPreviewProps {
  name: string
  title?: string
  className?: string
}

export function ComponentPreview({ name, title, className = "" }: ComponentPreviewProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const webpSrc = `/images/previews/${name}.webp`
  const fallbackSrc = `/images/previews/${name}.jpg`

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setIsLoading(false)
  }

  return (
    <div className={`relative rounded-lg border bg-muted/50 overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}

      {imageError ? (
        // Fallback placeholder for missing previews
        <div className="flex aspect-video items-center justify-center bg-muted text-muted-foreground">
          <div className="text-center p-6">
            <svg
              className="mx-auto h-12 w-12 mb-3 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm font-medium">Preview coming soon</p>
            <p className="text-xs mt-1">Component preview will be added in the next update</p>
          </div>
        </div>
      ) : (
        // Component preview image with WebP and fallback
        <Suspense
          fallback={
            <div className="flex aspect-video items-center justify-center bg-muted">
              <div className="animate-pulse text-muted-foreground text-sm">
                Loading preview...
              </div>
            </div>
          }
        >
          <div className="relative aspect-video w-full">
            <picture>
              <source
                srcSet={webpSrc}
                type="image/webp"
              />
              <img
                src={fallbackSrc}
                alt={`Preview of ${title || name} component`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                className="w-full h-full object-contain bg-background"
                loading="lazy"
              />
            </picture>
          </div>
        </Suspense>
      )}

      {/* Preview badge */}
      <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-muted-foreground border">
        Preview
      </div>
    </div>
  )
}
