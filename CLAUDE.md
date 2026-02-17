# Accessibility Widget — Full Project Reference

> This file is the single source of truth for any AI model working on this project.
> Read this instead of scanning all files. It covers architecture, every module, data flow, persistence, UI structure, and build system.

---

## Project Overview

A **browser-based accessibility widget** providing 25+ accessibility features via a floating panel. Built in **TypeScript** with **Vite**, compiled to a single ES module bundle embeddable in any website.

**Key characteristics:**
- Hebrew-first UI (RTL), direction: rtl throughout
- Shadow DOM isolation (closed mode) — no style leakage
- localStorage persistence for all user preferences
- 6 smart accessibility profiles
- Modular architecture — each feature is a standalone module implementing `AccessibilityModule`
- Professional "Tech Blue" design system (#3B82F6 primary)

---

## File Tree

```
acces-new/
├── package.json                        # Build config (vite + typescript)
├── tsconfig.json                       # ES2022 target, strict, bundler mode
├── vite.config.ts                      # Library build: 2 entry points
├── index.html                          # Demo/test page
│
├── src/
│   ├── main.ts                         # Entry point — registers all modules, mounts UI
│   ├── loader.ts                       # 429-byte loader script for external sites
│   │
│   ├── core/
│   │   ├── types.ts                    # AccessibilityModule interface, ModuleState, StoreData
│   │   ├── state-store.ts              # localStorage read/write (key: 'a11y-widget-state')
│   │   ├── engine.ts                   # Module registry, toggle, persist, resetAll
│   │   └── profile-manager.ts          # 6 profiles, activation/deactivation, localStorage
│   │
│   ├── ui/
│   │   ├── widget-ui.ts               # Main UI: Shadow DOM, panel, trigger, modals (~700 lines)
│   │   ├── styles.ts                  # All CSS-in-JS (~1330 lines)
│   │   └── icons.ts                   # 28 SVG icons (24x24, stroke-based, currentColor)
│   │
│   └── modules/                        # 25 accessibility modules
│       ├── text-resizer.ts
│       ├── contrast.ts
│       ├── links-highlighter.ts
│       ├── readable-font.ts
│       ├── animation-stopper.ts
│       ├── focus-indicator.ts
│       ├── skip-to-content.ts
│       ├── reading-guide.ts
│       ├── aria-enhancer.ts
│       ├── letter-spacing.ts
│       ├── word-spacing.ts
│       ├── line-height.ts
│       ├── text-alignment.ts
│       ├── big-cursor.ts
│       ├── screen-reader.ts
│       ├── hide-images.ts
│       ├── saturation.ts
│       ├── magnifier.ts
│       ├── virtual-keyboard.ts
│       ├── daltonization.ts
│       ├── highlight-hover.ts
│       ├── advanced-colors.ts
│       ├── button-settings.ts
│       ├── accessibility-statement.ts
│       └── issue-reporting.ts
│
└── dist/                               # Build output
    ├── a11y-widget.js                  # Main bundle (~73 KB minified)
    └── a11y-loader.js                  # Loader (~429 bytes)
```

---

## Core Architecture

### types.ts — Interface Contracts

```typescript
interface AccessibilityModule {
  readonly id: string;           // e.g. 'text-resizer'
  readonly name: string;         // Hebrew display name
  readonly icon: string;         // SVG HTML string
  readonly category?: 'content' | 'vision' | 'navigation';

  init(): void;                  // Called once on registration
  activate(): void;              // Enable the feature
  deactivate(): void;            // Disable the feature
  getState(): ModuleState;       // { enabled, settings }
  setState(state: ModuleState): void;  // Restore persisted state
  renderControls(container: HTMLElement, onStateChange?: () => void): void;
}

interface ModuleState {
  enabled: boolean;
  settings: Record<string, unknown>;
}

interface StoreData {
  modules: Record<string, ModuleState>;
}
```

### state-store.ts — Persistence

- **localStorage key**: `'a11y-widget-state'`
- Shape: `{ modules: { [moduleId]: { enabled, settings } } }`
- Methods: `getModuleState(id)`, `setModuleState(id, state)`, `resetAll()`
- Graceful fallback on corrupted data

### engine.ts — Module Lifecycle

```
registerModule(mod) → mod.init() → restore persisted state → activate if was enabled
toggleModule(id)    → deactivate if enabled, activate if disabled → persist
saveModuleState(id) → persist current state to localStorage
resetAll()          → deactivate all → clear localStorage
getModule(id)       → returns module instance
```

### profile-manager.ts — Smart Profiles

**localStorage key**: `'a11y-widget-active-profile'`

6 profiles, each specifying module IDs + optional preset settings:

| ID | Name | Modules |
|----|------|---------|
| `adhd-cognitive` | ADHD / קוגניטיבי | animation-stopper, reading-guide, hide-images |
| `vision-impaired` | לקויי ראייה | contrast (dark), text-resizer (130%), big-cursor (dark) |
| `seizure-safe` | בטוח להתקפים | animation-stopper, saturation (0) |
| `cognitive` | קוגניטיבי | highlight-hover, readable-font, line-height (2.0) |
| `blind-users` | עיוורים | screen-reader (1.0), aria-enhancer, skip-to-content |
| `motor-impaired` | מוגבלות מוטורית | virtual-keyboard, focus-indicator, big-cursor (dark) |

**Key methods**: `activateProfile(id)`, `deactivateCurrentProfile()`, `markCustom()`, `clearAll()`, `onChange(cb)`

When a user manually changes any module, `markCustom()` breaks the active profile lock.

---

## UI Architecture (widget-ui.ts)

### Shadow DOM Structure

```
<div id="a11y-widget-root">
  #shadow-root (closed)
    ├── <style>             ← all widget CSS
    ├── .a11y-backdrop      ← click-to-close overlay
    ├── .a11y-modal-overlay  ← modal system (issue reporting)
    ├── .a11y-panel         ← side panel (slides from right)
    │   ├── .a11y-panel-header  (blue bar: title + close)
    │   ├── .a11y-panel-body    (scrollable content)
    │   └── .a11y-panel-footer  (reset all button)
    └── .a11y-trigger       ← floating button (draggable)
```

### Panel Body Layout (top to bottom)

```
Profiles Section         ← 3-column grid of 6 profile buttons
─── divider ───
Accordion: תוכן וקריאות  ← Content & Readability (9 modules)
Accordion: צבעים וראייה  ← Colors & Vision (6 modules)
Accordion: ניווט ופוקוס  ← Navigation & Focus (6 modules)
─── divider ───
Collapsible: הגדרות צבעים מתקדמות  ← Advanced Color Settings
─── divider ───
Collapsible: הגדרות כפתור הנגישות  ← Button Settings
─── divider ───
Legal Section            ← Accessibility Statement + Issue Reporting
```

### Accordion Sections — Module Categories

Each accordion contains a **3-column feature card grid**. Each card is a toggle button showing an icon + label. Clicking a card:
1. **Always** toggles the module on/off via `engine.toggleModule()`
2. If the module has sub-controls (slider, buttons), also opens/closes an **expanded controls panel** inline below the card row

The expanded controls panel spans the full grid width and contains module-specific UI rendered by `mod.renderControls()`.

### Module Category Assignments

**Content & Readability** (`content`):
`text-resizer`, `line-height`, `word-spacing`, `letter-spacing`, `readable-font`, `text-alignment`, `highlight-hover`, `reading-guide`, `hide-images`

**Colors & Vision** (`vision`):
`contrast`, `saturation`, `daltonization`, `links-highlighter`, `big-cursor`, `magnifier`

**Navigation & Focus** (`navigation`):
`virtual-keyboard`, `focus-indicator`, `skip-to-content`, `animation-stopper`, `screen-reader`, `aria-enhancer`

### Special Modules (not in accordions)

- **`advanced-colors`** — rendered via `buildSection()` inside a collapsible wrapper
- **`button-settings`** — rendered via `buildSection()` inside a collapsible wrapper
- **`accessibility-statement`** — one-shot button in legal section (opens URL)
- **`issue-reporting`** — button in legal section, opens modal with form

### Trigger Button

- Floating fixed position, draggable via pointer events
- Customizable: position (left/right), style (4 SVGs), size (S/M/L)
- Settings applied by `applyTriggerSettings()` reading from `button-settings` module
- Default: bottom-right, 56px, humanoid icon

### Always-on Keyboard Navigation

Injected into the **host page** (not shadow DOM) by `injectKeyboardNav()`:
- Detects Tab key → adds `html.a11y-keyboard-user` class
- Detects mouse → removes class
- CSS: `html.a11y-keyboard-user *:focus-visible { outline: 3px solid #1a73e8 }`

---

## All 25 Modules — Quick Reference

### Content & Readability

| Module | ID | State Shape | Controls | Mechanism |
|--------|----|-------------|----------|-----------|
| **גודל טקסט** | `text-resizer` | `{ size: 80-200 }` | A-/label/A+/reset buttons | `document.documentElement.style.fontSize` |
| **גובה שורה** | `line-height` | `{ value: 1.0-3.0 }` | Slider | `* { line-height: X !important }` |
| **מרווח מילים** | `word-spacing` | `{ value: 0-20 }` | Slider | `* { word-spacing: Xpx !important }` |
| **מרווח אותיות** | `letter-spacing` | `{ value: 0-10 }` | Slider | `* { letter-spacing: Xpx !important }` |
| **פונט קריא** | `readable-font` | `{}` | Toggle-only | Class `a11y-readable-font` on html, forces Arial + spacing |
| **יישור טקסט** | `text-alignment` | `{ alignment: none/left/center/right }` | 4 buttons | CSS text-align on text elements |
| **הדגשת ריחוף** | `highlight-hover` | `{}` | Toggle-only | mouseenter/leave + blue outline class |
| **סרגל קריאה** | `reading-guide` | `{}` | Toggle-only | Yellow bar (#a11y-reading-guide) follows mouse Y |
| **הסתרת תמונות** | `hide-images` | `{}` | Toggle-only | CSS hides img/svg/video, shows alt text placeholder |

### Colors & Vision

| Module | ID | State Shape | Controls | Mechanism |
|--------|----|-------------|----------|-----------|
| **ניגודיות** | `contrast` | `{ mode: none/dark-contrast/light-contrast/inverted }` | 3 toggle buttons | CSS classes on html + filter: invert() |
| **רוויה** | `saturation` | `{ value: 0-300 }` | Slider | `html { filter: saturate(X%) }` |
| **עיוורון צבעים** | `daltonization` | `{ mode: none/protanopia/deuteranopia/tritanopia }` | 3 toggle buttons | SVG feColorMatrix filters |
| **הדגשת קישורים** | `links-highlighter` | `{}` | Toggle-only | Orange outline on a, button, [role] |
| **סמן גדול** | `big-cursor` | `{ mode: none/dark/light }` | 2 toggle buttons | Custom cursor SVG (32x32) |
| **זכוכית מגדלת** | `magnifier` | `{ zoom: 1.5-4.0 }` | Slider | Circular lens with scaled body clone following cursor |

### Navigation & Focus

| Module | ID | State Shape | Controls | Mechanism |
|--------|----|-------------|----------|-----------|
| **מקלדת וירטואלית** | `virtual-keyboard` | `{ lang: he/en }` | Language toggle | On-screen keyboard in separate Shadow DOM host |
| **מדגיש פוקוס** | `focus-indicator` | `{}` | Toggle-only | 5px gold outline on *:focus |
| **דלג לתוכן** | `skip-to-content` | `{}` | Toggle-only | Hidden anchor, shows on focus, scrolls to main |
| **עצירת אנימציות** | `animation-stopper` | `{}` | Toggle-only | `animation: none !important; transition: none` |
| **קורא מסך** | `screen-reader` | `{ rate: 0.5-2.0 }` | Slider | Web Speech API TTS on hover + blue highlight |
| **ARIA אופטימיזציה** | `aria-enhancer` | `{}` | Toggle-only | Base fixes always-on (init), aggressive on toggle |

### Special Modules

| Module | ID | State Shape | Special |
|--------|----|-------------|---------|
| **הגדרות צבעים מתקדמות** | `advanced-colors` | `{ background, headers, text, links }` | Custom `buildSection()`, 8-color palette, CSS injection |
| **הגדרות כפתור** | `button-settings` | `{ position, styleId, size }` | Custom `buildSection()`, `onApply()` callback to widget-ui |
| **הצהרת נגישות** | `accessibility-statement` | `{}` | One-shot: opens URL in new tab |
| **דיווח תקלה** | `issue-reporting` | N/A | Modal form, POST to `/api/a11y-report` |

---

## Module Implementation Patterns

### Simple Toggle Module (no controls)

```typescript
// e.g., readable-font, animation-stopper, links-highlighter
activate()   → inject <style> + add class to <html>
deactivate() → remove class + clear style content
getState()   → { enabled, settings: {} }
renderControls() → empty (no UI)
```

### Module with Slider Control

```typescript
// e.g., line-height, word-spacing, letter-spacing, saturation
activate()   → set enabled=true, inject styles
deactivate() → set enabled=false, clear styles, reset value
renderControls(container, onStateChange) → builds slider input
  - slider.addEventListener('input', () => { update value; apply; onStateChange() })
```

### Module with Button Controls

```typescript
// e.g., contrast, text-alignment, big-cursor, daltonization
activate()   → apply current mode
deactivate() → reset mode to 'none', clear
renderControls(container, onStateChange) → builds button group
  - Each button toggles its mode; updates active state
```

### Module with Custom Section

```typescript
// e.g., advanced-colors, button-settings
renderControls() → empty (no inline controls)
buildSection(container, onStateChange) → builds full custom UI
  - Called directly from widget-ui.ts, not through the standard card system
```

---

## CSS Architecture (styles.ts)

### Design System Variables

```css
--brand-primary: #3B82F6          /* Blue */
--brand-primary-hover: #2563EB
--brand-primary-light: #DBEAFE
--brand-light: #EFF6FF
--bg-main: #F8FAFC                /* Panel background */
--bg-card: #FFFFFF
--text-dark: #1E293B
--text-muted: #64748B
--text-light: #94A3B8
--border-color: #E2E8F0
--border-radius: 12px
--border-radius-sm: 8px
--danger: #EF4444
--success: #22C55E
--warning-border: #FBBF24
--transition-fast: 0.15s ease
--transition-normal: 0.2s ease
```

### Key CSS Class Prefixes

- `.a11y-trigger*` — floating button
- `.a11y-panel*` — side panel shell
- `.a11y-profile*` — profile buttons grid
- `.a11y-accordion*` — category accordions
- `.a11y-feature-card*` — module toggle cards
- `.a11y-expanded-*` — expanded controls panel
- `.a11y-btn*` — generic buttons inside controls
- `.a11y-range` — slider input
- `.a11y-toggle*` — switch toggle
- `.a11y-color-*` — advanced color settings
- `.a11y-btnsettings-*` — button settings
- `.a11y-collapsible*` — collapsible section wrapper
- `.a11y-legal-*` — legal section
- `.a11y-modal*` — modal overlay + dialog
- `.a11y-form-*` — form elements
- `.a11y-section-*` — section titles & dividers

---

## Data Flow

### Initialization

```
DOM ready → bootstrap()
  → StateStore(localStorage)
  → AccessibilityEngine(store)
  → registerModule() x25
    → mod.init()
    → restore persisted state
    → activate() if was enabled
  → ProfileManager(engine)
    → load persisted active profile
  → WidgetUI(engine, profileManager)
    → mount()
      → Shadow DOM (closed)
      → inject styles
      → build backdrop, modal, panel, trigger
      → wire button-settings callback
      → inject keyboard nav styles into host page
```

### User Clicks Feature Card

```
card click
  → engine.toggleModule(id)        // activate or deactivate
  → profileManager.markCustom()    // break profile lock
  → update card UI (active class, aria-pressed)
  → if hasControls && nowEnabled:
      → open expanded controls panel
  → if hasControls && !nowEnabled:
      → close expanded controls panel
```

### User Activates Profile

```
profile button click
  → profileManager.activateProfile(id)
    → deactivate previous profile modules
    → for each module in profile:
        → setState with preset settings
        → activate()
        → saveModuleState()
    → persist profile ID
    → notifyChange() → rebuildBody()
```

### Reset All

```
reset button click
  → profileManager.clearAll()
    → activeProfileId = null
    → engine.resetAll()
      → deactivate all modules
      → clear localStorage
    → notifyChange()
  → expandedModuleId = null
  → rebuildBody()
```

---

## Build & Deployment

### Build

```bash
npm run build    # tsc && vite build
npm run dev      # vite dev server
```

**Vite config**: Library mode, 2 entry points:
- `a11y-widget` → `src/main.ts` → `dist/a11y-widget.js`
- `a11y-loader` → `src/loader.ts` → `dist/a11y-loader.js`

### Integration on External Sites

```html
<script src="https://cdn.example.com/a11y-loader.js"></script>
<!-- OR with custom URL: -->
<script src="loader.js" data-src="https://cdn.example.com/a11y-widget.js"></script>
```

### Global Configuration

```javascript
window.a11yConfig = {
  statementUrl: "https://example.com/accessibility",   // accessibility statement page
  reportEndpoint: "https://api.example.com/reports"     // issue report POST endpoint
};
```

---

## localStorage Schema

**Key: `'a11y-widget-state'`**
```json
{
  "modules": {
    "text-resizer": { "enabled": true, "settings": { "size": 120 } },
    "contrast": { "enabled": false, "settings": { "mode": "none" } },
    "advanced-colors": {
      "enabled": true,
      "settings": { "background": null, "headers": "#3B82F6", "text": null, "links": null }
    },
    "button-settings": {
      "enabled": true,
      "settings": { "position": "right", "styleId": "humanoid", "size": "medium" }
    }
  }
}
```

**Key: `'a11y-widget-active-profile'`**
```
"vision-impaired"    // string or absent
```

---

## Important Implementation Notes

1. **Shadow DOM is closed** — the widget's internal DOM cannot be accessed from outside. All styles are scoped inside.

2. **Modules inject styles into the HOST page** (document.head), not into the shadow DOM. This is intentional — modules need to affect the host page's content.

3. **aria-enhancer runs automatically on init()** — base fixes (empty links, missing alt, unlabeled buttons/inputs) are applied immediately and permanently. The toggle only controls "aggressive" fixes.

4. **button-settings is always "enabled"** — its `getState()` always returns `enabled: true` because trigger button settings always apply.

5. **Modules with controls** — clicking the card toggles the module AND opens/closes the controls panel. The module activates immediately on card click, not when adjusting the controls.

6. **Virtual keyboard** has its own Shadow DOM host (separate from the main widget).

7. **Magnifier** clones the entire body into a lens div and refreshes every 3 seconds.

8. **Screen reader** uses Web Speech API with async voice loading (Chrome `voiceschanged` event).

9. **Profile activation** deactivates the previous profile's modules first, then activates the new profile's modules with preset settings.

10. **The `resetAll()` flow**: profile manager clears profile → engine deactivates all modules + clears localStorage → UI rebuilds.

---

## Adding a New Module

1. Create `src/modules/my-module.ts` implementing `AccessibilityModule`
2. Add an icon to `src/ui/icons.ts` if needed
3. Import and register in `src/main.ts`: `engine.registerModule(new MyModule())`
4. Add the module ID to the appropriate category in `CATEGORIES` array in `widget-ui.ts`
5. If it needs custom section UI (like advanced-colors), add a `buildSection()` method and wire it in `widget-ui.ts`
6. If it needs CSS, add styles to `src/ui/styles.ts`
7. Run `npx tsc --noEmit` to verify
