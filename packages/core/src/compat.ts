/**
 * Perry UI Compatibility Layer
 *
 * Centralizes Perry version feature checks and compatibility notes.
 */

export const COMPAT = {
  minPerryVersion: "0.5.0",
  testedVersions: ["0.5.x"],

  features: {
    inlineStyles: true,
    freeFunctionAPI: true,
    stateReactivity: true,
    canvas: "web-only",
    camera: "ios-android-only",
    table: "macos-web-only",
    menuBar: "macos-only",
    hoverEvents: "desktop-only",
    vibrancy: "macos-only",
  },
} as const

/**
 * Check if a feature is available on the current platform.
 * Returns a boolean for universal features, or a string note for platform-specific ones.
 */
export function checkFeature(feature: keyof typeof COMPAT.features): boolean | string {
  return COMPAT.features[feature]
}
