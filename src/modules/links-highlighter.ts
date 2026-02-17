import type { AccessibilityModule, ModuleState } from '../core/types';
import { ICONS } from '../ui/icons';

const STYLE_ID = 'a11y-links-highlight-styles';

const HIGHLIGHT_CSS = `
  html.a11y-links-highlight a,
  html.a11y-links-highlight button,
  html.a11y-links-highlight [role="button"],
  html.a11y-links-highlight [role="link"] {
    outline: 3px solid #ff6600 !important;
    outline-offset: 2px !important;
    background-color: rgba(255, 102, 0, 0.1) !important;
    font-weight: bold !important;
    text-decoration: underline !important;
  }
`;

export class LinksHighlighterModule implements AccessibilityModule {
  readonly id = 'links-highlighter';
  readonly name = 'הדגשת קישורים';
  readonly icon = ICONS.linksHighlight;

  private enabled = false;
  private styleEl: HTMLStyleElement | null = null;

  init(): void {
    // noop
  }

  activate(): void {
    this.enabled = true;
    this.apply();
  }

  deactivate(): void {
    this.enabled = false;
    this.remove();
  }

  getState(): ModuleState {
    return {
      enabled: this.enabled,
      settings: {},
    };
  }

  setState(state: ModuleState): void {
    this.enabled = state.enabled;
  }

  private apply(): void {
    if (!this.styleEl) {
      this.styleEl = document.createElement('style');
      this.styleEl.id = STYLE_ID;
      document.head.appendChild(this.styleEl);
    }
    this.styleEl.textContent = HIGHLIGHT_CSS;
    document.documentElement.classList.add('a11y-links-highlight');
  }

  private remove(): void {
    document.documentElement.classList.remove('a11y-links-highlight');
    if (this.styleEl) {
      this.styleEl.textContent = '';
    }
  }

  renderControls(_container: HTMLElement): void {
    // Toggle-only module – no extra controls needed
  }
}
