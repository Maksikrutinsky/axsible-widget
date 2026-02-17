/**
 * Clean, minimal SVG icons for the accessibility widget.
 * All icons are 24×24 viewBox, stroke-based, in currentColor.
 */

const svg = (d: string, extra = ''): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"${extra}>${d}</svg>`;

const svgFill = (d: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">${d}</svg>`;

export const ICONS = {
  // ── Content & Readability ──
  textResize: svg(
    '<path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/>',
  ),
  lineHeight: svg(
    '<path d="M11 6h9"/><path d="M11 12h9"/><path d="M11 18h9"/><path d="M4 10l2-4 2 4"/><path d="M4 18l2-4 2 4"/>',
  ),
  wordSpacing: svg(
    '<path d="M7 8l-4 4 4 4"/><path d="M17 8l4 4-4 4"/><path d="M3 12h18"/>',
  ),
  letterSpacing: svg(
    '<path d="M9 13l3-8 3 8"/><path d="M10 11h4"/><path d="M2 16l2 2 2-2"/><path d="M18 16l2 2 2-2"/>',
  ),
  readableFont: svg(
    '<path d="M4 7V4h16v3"/><path d="M8 20h8"/><path d="M12 4v16"/><path d="M6 12h12"/>',
  ),
  textAlignment: svg(
    '<path d="M4 6h16"/><path d="M4 10h10"/><path d="M4 14h16"/><path d="M4 18h10"/>',
  ),
  highlightHover: svg(
    '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 12h8"/><path d="M8 8h8"/><path d="M8 16h5"/>',
  ),
  readingGuide: svg(
    '<path d="M3 12h18"/><path d="M3 6h18" opacity="0.3"/><path d="M3 18h18" opacity="0.3"/>',
  ),
  hideImages: svg(
    '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/><path d="M2 2l20 20" stroke-width="2"/>',
  ),

  // ── Colors & Vision ──
  contrast: svg(
    '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/>',
  ),
  saturation: svg(
    '<path d="M12 2.7C6.5 7.1 4 10.3 4 14a8 8 0 0 0 16 0c0-3.7-2.5-6.9-8-11.3z"/>',
  ),
  daltonize: svg(
    '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
  ),
  linksHighlight: svg(
    '<path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.1"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.1"/>',
  ),
  bigCursor: svg(
    '<path d="M5 3l14 8-6 1-3 6z" fill="currentColor" stroke="currentColor"/><path d="M14 17l3 5"/>',
  ),
  magnifier: svg(
    '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6"/><path d="M8 11h6"/>',
  ),

  // ── Navigation & Focus ──
  virtualKeyboard: svg(
    '<rect x="2" y="4" width="20" height="14" rx="2"/><path d="M6 8h.01"/><path d="M10 8h.01"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M6 12h.01"/><path d="M10 12h.01"/><path d="M14 12h.01"/><path d="M18 12h.01"/><path d="M8 16h8"/>',
  ),
  focusIndicator: svg(
    '<path d="M3 3h4"/><path d="M3 3v4"/><path d="M21 3h-4"/><path d="M21 3v4"/><path d="M3 21h4"/><path d="M3 21v-4"/><path d="M21 21h-4"/><path d="M21 21v-4"/><circle cx="12" cy="12" r="3"/>',
  ),
  skipToContent: svg(
    '<path d="M5 4l10 8-10 8z" fill="currentColor"/><path d="M19 5v14"/>',
  ),
  animationStopper: svg(
    '<circle cx="12" cy="12" r="9"/><path d="M10 8v8"/><path d="M14 8v8"/>',
  ),
  screenReader: svg(
    '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v4"/><path d="M8 23h8"/>',
  ),
  ariaEnhancer: svg(
    '<path d="M9 3H5a2 2 0 0 0-2 2v4"/><path d="M15 3h4a2 2 0 0 1 2 2v4"/><path d="M9 21H5a2 2 0 0 1-2-2v-4"/><path d="M15 21h4a2 2 0 0 0 2-2v-4"/><path d="M12 7v5l3 3"/>',
  ),

  // ── Legal & Support ──
  accessibilityStatement: svg(
    '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  ),
  issueReport: svgFill(
    '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>',
  ),

  // ── Profiles ──
  profileBrain: svg(
    '<path d="M12 2a7 7 0 0 1 5 2.1A5 5 0 0 1 21 9a5 5 0 0 1-3 4.6V17a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4v-3.4A5 5 0 0 1 3 9a5 5 0 0 1 4-4.9A7 7 0 0 1 12 2z"/>',
  ),
  profileEye: svg(
    '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  ),
  profileBolt: svg(
    '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
  ),
  profileBook: svg(
    '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  ),
  profileSpeaker: svg(
    '<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.08"/>',
  ),
  profileHand: svg(
    '<path d="M18 11V6a2 2 0 0 0-4 0"/><path d="M14 10V4a2 2 0 0 0-4 0v7"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8H12a8 8 0 0 1-6-2.7"/>',
  ),

  // ── Category Headers ──
  catContent: svg(
    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h8"/><path d="M8 9h2"/>',
  ),
  catVision: svg(
    '<circle cx="12" cy="12" r="9"/><path d="M12 3v18"/><path d="M3 12h18"/><path d="M12 3a15.3 15.3 0 0 1 4 9 15.3 15.3 0 0 1-4 9"/>',
  ),
  catNavigation: svg(
    '<rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 18l4 4 4-4"/>',
  ),

  // ── Advanced Color Settings ──
  colorPalette: svg(
    '<circle cx="7.5" cy="7.5" r="2.5" fill="currentColor" stroke="none"/><circle cx="16.5" cy="7.5" r="2.5" fill="currentColor" stroke="none"/><circle cx="7.5" cy="16.5" r="2.5" fill="currentColor" stroke="none"/><circle cx="16.5" cy="16.5" r="2.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" opacity="0.4"/>',
  ),
  colorBackground: svg(
    '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 15l5-5 4 4 3-3 6 6"/>',
  ),
  colorHeaders: svg(
    '<path d="M4 4v16"/><path d="M20 4v16"/><path d="M4 12h16"/>',
  ),
  colorText: svg(
    '<path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/>',
  ),
  colorLinks: svg(
    '<path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.1"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.1"/>',
  ),

  // ── Button Settings ──
  buttonSettings: svg(
    '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  ),
} as const;
