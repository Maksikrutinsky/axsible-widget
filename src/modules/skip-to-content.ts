import type { AccessibilityModule, ModuleState } from '../core/types';
import { ICONS } from '../ui/icons';

const LINK_ID = 'a11y-skip-to-content';
const STYLE_ID = 'a11y-skip-to-content-styles';

const SKIP_CSS = `
  #${LINK_ID} {
    position: fixed;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2147483647;
    padding: 12px 28px;
    background: #1a73e8;
    color: #fff !important;
    font-size: 16px;
    font-weight: 600;
    font-family: Arial, sans-serif;
    text-decoration: none;
    border-radius: 0 0 10px 10px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    transition: top 0.25s ease;
    white-space: nowrap;
    direction: rtl;
  }
  #${LINK_ID}:focus,
  #${LINK_ID}:focus-visible {
    top: 0;
    outline: 3px solid #FFD700;
    outline-offset: 2px;
  }
`;

export class SkipToContentModule implements AccessibilityModule {
  readonly id = 'skip-to-content';
  readonly name = 'דלג לתוכן';
  readonly icon = ICONS.skipToContent;

  private enabled = false;
  private linkEl: HTMLAnchorElement | null = null;
  private styleEl: HTMLStyleElement | null = null;

  init(): void {
    // noop
  }

  activate(): void {
    this.enabled = true;
    this.inject();
  }

  deactivate(): void {
    this.enabled = false;
    this.remove();
  }

  getState(): ModuleState {
    return { enabled: this.enabled, settings: {} };
  }

  setState(state: ModuleState): void {
    this.enabled = state.enabled;
  }

  private findMainContent(): HTMLElement | null {
    // Try common main content selectors in order of specificity
    return (
      document.querySelector('main') as HTMLElement ??
      document.getElementById('main-content') ??
      document.getElementById('content') ??
      document.querySelector('[role="main"]') as HTMLElement ??
      document.querySelector('article') as HTMLElement ??
      null
    );
  }

  private ensureTarget(): string {
    const main = this.findMainContent();
    if (main) {
      if (!main.id) {
        main.id = 'a11y-main-content';
      }
      // Ensure the target is focusable
      if (!main.hasAttribute('tabindex')) {
        main.setAttribute('tabindex', '-1');
      }
      return `#${main.id}`;
    }
    // Fallback: scroll to top of body
    return '#';
  }

  private inject(): void {
    if (!this.styleEl) {
      this.styleEl = document.createElement('style');
      this.styleEl.id = STYLE_ID;
      document.head.appendChild(this.styleEl);
    }
    this.styleEl.textContent = SKIP_CSS;

    if (!this.linkEl) {
      this.linkEl = document.createElement('a');
      this.linkEl.id = LINK_ID;
      this.linkEl.textContent = 'דלג לתוכן הראשי';

      // Insert as the very first focusable element in the page
      document.body.insertBefore(this.linkEl, document.body.firstChild);

      this.linkEl.addEventListener('click', (e) => {
        e.preventDefault();
        const main = this.findMainContent();
        if (main) {
          main.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Focus the main content for screen reader users
          if (!main.hasAttribute('tabindex')) {
            main.setAttribute('tabindex', '-1');
          }
          main.focus({ preventScroll: true });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }

    this.linkEl.href = this.ensureTarget();
  }

  private remove(): void {
    if (this.linkEl) {
      this.linkEl.remove();
      this.linkEl = null;
    }
    if (this.styleEl) {
      this.styleEl.textContent = '';
    }
  }

  renderControls(_container: HTMLElement, _onStateChange?: () => void): void {
    // Toggle-only
  }
}
