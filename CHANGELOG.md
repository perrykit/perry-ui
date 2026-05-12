# Perry UI - Release Changelog

**Version:** 0.2.0 (based on 0.1.0)
**Date:** 2026-05-12

---

## Summary

Expanded from 7 to 20 components, added 267 tests (1736 assertions), implemented accessibility wiring, and added Input error variant. All 20 components pass registry validation with full metadata.

---

## New Components (13 added)

| Component | File | Description |
|-----------|------|-------------|
| Dialog | `packages/registry/components/dialog/` | Modal overlay with sheet-based open/close, header, content, footer sections |
| Toast | `packages/registry/components/toast/` | Notification with default/success/destructive variants, auto-dismiss, live region a11y |
| Select | `packages/registry/components/select/` | Native dropdown using Perry's Picker widget, options array, onChange callback |
| Tabs | `packages/registry/components/tabs/` | Tab navigation with active state tracking, tab triggers, and content panels |
| Tooltip | `packages/registry/components/tooltip/` | Hover tooltip using widgetSetTooltip + ZStack visual overlay |
| Checkbox | `packages/registry/components/checkbox/` | Boolean selection with Toggle widget, optional label, checked state |
| Avatar | `packages/registry/components/avatar/` | User avatar with image or initials fallback, sm/md/lg sizes |
| Progress | `packages/registry/components/progress/` | Horizontal progress bar with label, percentage display, value/max range |
| Skeleton | `packages/registry/components/skeleton/` | Loading placeholder with text/circular/rectangular variants |
| Sheet | `packages/registry/components/sheet/` | Sliding panel overlay (left/right/top/bottom sides), header/content/footer |
| Switch | `packages/registry/components/switch/` | Toggle control for immediate settings with label |
| Textarea | `packages/registry/components/textarea/` | Multiline text input with error state support |
| Radio | `packages/registry/components/radio/` | Mutually exclusive option group with radio items |

Each new component includes:
- Source file: `files/<name>.ts`
- Registry metadata: `registry.json` with schemaVersion, props, variants, examples, docs, platformNotes, agent metadata

---

## Modified Components (3 changed)

### Button (`packages/registry/components/button/`)
- Wired `accessibilityLabel` to `setAccessibilityLabel` (tooltip fallback)
- Added `setAccessibilityRole(button, "button")`
- Cleaned up unused imports (`buttonSetBordered`, `applyButtonBg`, `applyButtonTextColor`, `ThemeTokens`)

### Input (`packages/registry/components/input/`)
- Added `error` boolean prop — renders destructive border and foreground color
- Replaced manual styling with `createVariants()` pattern (matches Button, Badge, etc.)
- Wired `accessibilityLabel` to `setAccessibilityLabel`
- Added `setAccessibilityRole(field, "input")`
- Updated `registry.json` with error prop definition and error variant

### Separator (`packages/registry/components/separator/`)
- No functional changes (existing component untouched)

---

## Core System Changes

### Accessibility (`packages/core/src/accessibility.ts`)
- **Before:** Two stub functions with commented-out bodies and no-op `void` statements
- **After:**
  - `setAccessibilityLabel(widget, label)` — calls `widgetSetTooltip` as fallback, with try/catch
  - `setAccessibilityRole(widget, role)` — accepts typed `A11yRole` union (18 role values), falls back to tooltip
  - `setLiveRegion(widget, politeness)` — new helper for aria-live behavior ("polite" | "assertive")
  - `A11yRole` type exported: button, link, heading, label, input, checkbox, radio, switch, tab, tabpanel, dialog, alert, status, navigation, list, listitem, separator, progressbar, img

### Core Index (`packages/core/src/index.ts`)
- Added export of `A11yRole` type
- Added export of `setLiveRegion` function

---

## Tests Added

### Core Tests (`packages/core/src/__tests__/variants.test.ts`)
26 tests, 149 assertions covering:
- `createVariants`: base styles, variant matching, defaults, compound variants, empty definition
- `resolveRadius`: named tokens, numeric passthrough, undefined
- `resolveFontSize`: named tokens, numeric passthrough, undefined
- `resolveColor`: semantic tokens, transparent, none, Color objects, undefined
- Theme system: all 19 required color tokens present in zinc/dark, light/dark inversion, radius/spacing ordering
- `composeStyles`: merging, `withPadding`, `withPaddingXY`

### Registry Tests (`packages/registry/__tests__/registry.test.ts`)
241 tests, 1587 assertions covering:
- Root registry.json validity
- All 20 components: required fields, compatiblePerry, files with source existence, docs, props, examples, agent metadata, registryDependencies, source file content
- All 5 themes: required fields, 19 color tokens with RGBA validation, radius/spacing/typography tokens
- 1 block: type validation, registryDependencies, agent metadata
- Cross-cutting: all registryDependencies reference existing components, no duplicate names, all source files export PascalCase function

**Total: 267 tests, 1736 assertions, all passing**

---

## Registry Build Output

```
Themes: 5 (graphite, midnight, neutral, slate, zinc)
Components: 20 (alert, avatar, badge, button, card, checkbox, dialog, input, label, progress, radio, select, separator, sheet, skeleton, switch, tabs, textarea, toast, tooltip)
Blocks: 1 (settings-window)
Total: 26 items → dist/
```

---

## Files to Update in Other Repos

When preparing the 0.2.0 release, update these external repos:

### `perry-ui-cli`
- Component list for `bunx perry-ui list` command
- Add support for new component names in `add` command
- Update `doctor` command to validate new component dependencies

### `perry-ui-docs`
- Add documentation pages for all 13 new components
- Update homepage component count (7 → 20)
- Add sidebar navigation entries for new components
- Update component comparison table
- Each page should pull from the component's `registry.json` docs/examples

### `perry-ui-examples`
- Create example apps using the new components:
  - Form example: Input + Select + Checkbox + Radio + Textarea + Button
  - Feedback example: Toast + Dialog + Alert
  - Settings example: Sheet + Switch + Tabs
  - Profile example: Avatar + Progress + Skeleton
  - Navigation example: Tabs + Tooltip

### `package.json` (this repo)
- Bump version from `0.1.0` to `0.2.0`
- Update description if needed

### `packages/registry/registry.json`
- Update version to `0.2.0`
- Update `items` array (auto-populated by build)
- Update `compatiblePerry.notes`

---

## Commit History

```
cc04232 docs: update README with all 20 components
ac82495 test: add 241 registry validation tests
4759cb4 feat: add Skeleton, Sheet, Switch, Textarea, Radio components
3ee8174 feat: add Progress component
259acf7 feat: add Avatar component
dba046f feat: add Checkbox component
e1bdd83 feat: add Tooltip component
31aa831 feat: add Tabs component
cd42958 feat: add Select component
06d234f feat: add Toast component
1c6694c feat: add Dialog component
a588a74 test: add 26 unit tests for core variant, theme, and compose systems
bde0f51 feat: wire accessibility labels and add Input error variant
ff2e620 Initial commit: Perry UI v0.1.0 component registry
```
