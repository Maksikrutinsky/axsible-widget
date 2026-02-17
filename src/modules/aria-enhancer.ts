import type { AccessibilityModule, ModuleState } from '../core/types';
import { ICONS } from '../ui/icons';

const MARKER_ATTR = 'data-a11y-enhanced';
const MARKER_AGGRESSIVE = 'data-a11y-aggressive';
const DEBOUNCE_MS = 150;

export class AriaEnhancerModule implements AccessibilityModule {
  readonly id = 'aria-enhancer';
  readonly name = 'אופטימיזציה לקורא מסך';
  readonly icon = ICONS.ariaEnhancer;

  private aggressiveEnabled = false;
  private enhanced: Element[] = [];
  private aggressiveEnhanced: Element[] = [];
  private observer: MutationObserver | null = null;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  init(): void {
    this.applyBaseFixes(document);
    this.startObserver();
  }

  activate(): void {
    this.aggressiveEnabled = true;
    this.applyAggressiveFixes(document);
  }

  deactivate(): void {
    this.aggressiveEnabled = false;
    this.revertAggressive();
  }

  getState(): ModuleState {
    return { enabled: this.aggressiveEnabled, settings: {} };
  }

  setState(state: ModuleState): void {
    this.aggressiveEnabled = state.enabled;
  }

  // ─── Base Fixes (auto-applied) ────────────────────────────────

  private applyBaseFixes(root: Document | Element): void {
    this.fixEmptyLinks(root);
    this.fixImagesWithoutAlt(root);
    this.fixButtonsWithoutLabel(root);
    this.fixInputsWithoutLabel(root);
  }

  private mark(el: Element, attr: string, value: string): void {
    el.setAttribute(MARKER_ATTR, '');
    el.setAttribute(`data-a11y-orig-${attr}`, el.getAttribute(attr) ?? '');
    el.setAttribute(attr, value);
    this.enhanced.push(el);
  }

  private fixEmptyLinks(root: Document | Element): void {
    const links = root.querySelectorAll(`a:not([aria-label]):not([${MARKER_ATTR}])`);
    links.forEach((link) => {
      const text = (link.textContent ?? '').trim();
      const hasImg = link.querySelector('img[alt]');
      if (!text && !hasImg) {
        const href = link.getAttribute('href') ?? '';
        const label = href && href !== '#' ? `קישור: ${href}` : 'קישור';
        this.mark(link, 'aria-label', label);
      }
    });
  }

  private fixImagesWithoutAlt(root: Document | Element): void {
    const images = root.querySelectorAll(`img:not([alt]):not([${MARKER_ATTR}])`);
    images.forEach((img) => {
      const src = img.getAttribute('src') ?? '';
      const filename = src.split('/').pop()?.split('?')[0] ?? 'תמונה';
      this.mark(img, 'alt', `תמונה: ${filename}`);
    });
  }

  private fixButtonsWithoutLabel(root: Document | Element): void {
    const buttons = root.querySelectorAll(`button:not([aria-label]):not([${MARKER_ATTR}])`);
    buttons.forEach((btn) => {
      const text = (btn.textContent ?? '').trim();
      if (!text) {
        this.mark(btn, 'aria-label', 'כפתור');
      }
    });
  }

  private fixInputsWithoutLabel(root: Document | Element): void {
    const inputs = root.querySelectorAll(
      `input:not([aria-label]):not([aria-labelledby]):not([id]):not([${MARKER_ATTR}])`
    );
    inputs.forEach((input) => {
      const type = input.getAttribute('type') ?? 'text';
      const placeholder = input.getAttribute('placeholder') ?? '';
      const label = placeholder || `שדה ${type}`;
      this.mark(input, 'aria-label', label);
    });
  }

  // ─── MutationObserver ─────────────────────────────────────────

  private startObserver(): void {
    this.observer = new MutationObserver((mutations) => {
      // Only process if there are actually added nodes
      const hasNewNodes = mutations.some((m) => m.addedNodes.length > 0);
      if (!hasNewNodes) return;

      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node instanceof HTMLElement) {
              this.applyBaseFixes(node);
              if (this.aggressiveEnabled) {
                this.applyAggressiveFixes(node);
              }
            }
          }
        }
      }, DEBOUNCE_MS);
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // ─── Aggressive Fixes (toggle-controlled) ─────────────────────

  private markAggressive(el: Element, attr: string, value: string): void {
    el.setAttribute(MARKER_AGGRESSIVE, '');
    el.setAttribute(`data-a11y-agg-orig-${attr}`, el.getAttribute(attr) ?? '');
    el.setAttribute(attr, value);
    this.aggressiveEnhanced.push(el);
  }

  private applyAggressiveFixes(root: Document | Element): void {
    this.hideDecorativeImages(root);
    this.addLandmarkRoles(root);
    this.fixMissingHeadingHierarchy(root);
  }

  private hideDecorativeImages(root: Document | Element): void {
    const images = root.querySelectorAll(
      `img[alt=""]:not([${MARKER_AGGRESSIVE}]), img[role="presentation"]:not([${MARKER_AGGRESSIVE}])`
    );
    images.forEach((img) => {
      this.markAggressive(img, 'aria-hidden', 'true');
    });
  }

  private addLandmarkRoles(root: Document | Element): void {
    // Only run from document-level to avoid applying to fragments
    const target = root instanceof Document ? root : root.ownerDocument ?? root;
    if (target !== document && root !== document.body) return;

    const mainCandidates = document.querySelectorAll(
      `main:not([role]):not([${MARKER_AGGRESSIVE}]), #main:not([role]):not([${MARKER_AGGRESSIVE}]), .main-content:not([role]):not([${MARKER_AGGRESSIVE}])`
    );
    mainCandidates.forEach((el) => {
      if (!el.getAttribute('role')) {
        this.markAggressive(el, 'role', 'main');
      }
    });

    const navCandidates = document.querySelectorAll(
      `nav:not([role]):not([${MARKER_AGGRESSIVE}])`
    );
    navCandidates.forEach((el) => {
      if (!el.getAttribute('role')) {
        this.markAggressive(el, 'role', 'navigation');
      }
    });
  }

  private fixMissingHeadingHierarchy(root: Document | Element): void {
    const target = root instanceof Document ? root : root.ownerDocument ?? root;
    if (target !== document && root !== document.body) return;

    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;
    headings.forEach((heading) => {
      const level = parseInt(heading.tagName[1], 10);
      if (level - lastLevel > 1 && lastLevel > 0 && !heading.hasAttribute(MARKER_AGGRESSIVE)) {
        this.markAggressive(heading, 'aria-level', String(lastLevel + 1));
      }
      lastLevel = level;
    });
  }

  // ─── Revert (aggressive only – base fixes are permanent) ──────

  private revertAggressive(): void {
    for (const el of this.aggressiveEnhanced) {
      const attrs = Array.from(el.attributes)
        .filter((a) => a.name.startsWith('data-a11y-agg-orig-'));

      for (const attr of attrs) {
        const realAttr = attr.name.replace('data-a11y-agg-orig-', '');
        if (attr.value === '') {
          el.removeAttribute(realAttr);
        } else {
          el.setAttribute(realAttr, attr.value);
        }
        el.removeAttribute(attr.name);
      }

      el.removeAttribute(MARKER_AGGRESSIVE);
    }
    this.aggressiveEnhanced = [];
  }

  renderControls(_container: HTMLElement, _onStateChange?: () => void): void {
    // Toggle-only – the UI toggle now controls aggressive mode
  }
}
