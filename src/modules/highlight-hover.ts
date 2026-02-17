import type { AccessibilityModule, ModuleState } from '../core/types';
import { ICONS } from '../ui/icons';

const STYLE_ID = 'a11y-highlight-hover-styles';
const HIGHLIGHT_CLASS = 'a11y-hover-highlight';

const TARGETS = 'p, h1, h2, h3, h4, h5, h6, li, td, th, blockquote, figcaption, div, section, article, aside, details, summary, a, span, label';

const HOVER_CSS = `
  .${HIGHLIGHT_CLASS} {
    outline: 2px solid rgba(26, 115, 232, 0.6) !important;
    outline-offset: 2px !important;
    box-shadow: 0 2px 12px rgba(26, 115, 232, 0.15) !important;
    border-radius: 4px !important;
    transition: outline 0.15s, box-shadow 0.15s !important;
  }
`;

export class HighlightHoverModule implements AccessibilityModule {
  readonly id = 'highlight-hover';
  readonly name = 'הדגשת ריחוף';
  readonly icon = ICONS.highlightHover;

  private enabled = false;
  private styleEl: HTMLStyleElement | null = null;
  private currentEl: Element | null = null;
  private boundEnter: ((e: Event) => void) | null = null;
  private boundLeave: ((e: Event) => void) | null = null;

  init(): void {
    // noop
  }

  activate(): void {
    this.enabled = true;
    this.injectStyles();
    this.attachListeners();
  }

  deactivate(): void {
    this.enabled = false;
    this.removeHighlight();
    this.detachListeners();
    this.clearStyles();
  }

  getState(): ModuleState {
    return { enabled: this.enabled, settings: {} };
  }

  setState(state: ModuleState): void {
    this.enabled = state.enabled;
  }

  private removeHighlight(): void {
    if (this.currentEl) {
      this.currentEl.classList.remove(HIGHLIGHT_CLASS);
      this.currentEl = null;
    }
  }

  private onEnter = (e: Event): void => {
    const target = e.target as Element;
    if (!target.matches(TARGETS)) return;
    // Skip widget elements
    if (target.closest('#a11y-widget-root')) return;

    this.removeHighlight();
    this.currentEl = target;
    target.classList.add(HIGHLIGHT_CLASS);
  };

  private onLeave = (e: Event): void => {
    const target = e.target as Element;
    if (target === this.currentEl) {
      target.classList.remove(HIGHLIGHT_CLASS);
      this.currentEl = null;
    }
  };

  private attachListeners(): void {
    this.boundEnter = this.onEnter;
    this.boundLeave = this.onLeave;
    document.addEventListener('mouseenter', this.boundEnter, true);
    document.addEventListener('mouseleave', this.boundLeave, true);
  }

  private detachListeners(): void {
    if (this.boundEnter) {
      document.removeEventListener('mouseenter', this.boundEnter, true);
      this.boundEnter = null;
    }
    if (this.boundLeave) {
      document.removeEventListener('mouseleave', this.boundLeave, true);
      this.boundLeave = null;
    }
  }

  private injectStyles(): void {
    if (!this.styleEl) {
      this.styleEl = document.createElement('style');
      this.styleEl.id = STYLE_ID;
      document.head.appendChild(this.styleEl);
    }
    this.styleEl.textContent = HOVER_CSS;
  }

  private clearStyles(): void {
    if (this.styleEl) {
      this.styleEl.textContent = '';
    }
  }

  renderControls(_container: HTMLElement, _onStateChange?: () => void): void {
    // Toggle-only
  }
}
