import type { AccessibilityModule, ModuleState } from '../core/types';
import { ICONS } from '../ui/icons';

const STYLE_ID = 'a11y-readable-font-styles';

const READABLE_CSS = `
  html.a11y-readable-font * {
    font-family: Arial, Helvetica, 'Segoe UI', sans-serif !important;
    line-height: 1.8 !important;
    letter-spacing: 0.03em !important;
    word-spacing: 0.1em !important;
  }
`;

export class ReadableFontModule implements AccessibilityModule {
  readonly id = 'readable-font';
  readonly name = 'פונט קריא';
  readonly icon = ICONS.readableFont;

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
    this.styleEl.textContent = READABLE_CSS;
    document.documentElement.classList.add('a11y-readable-font');
  }

  private remove(): void {
    document.documentElement.classList.remove('a11y-readable-font');
    if (this.styleEl) {
      this.styleEl.textContent = '';
    }
  }

  renderControls(_container: HTMLElement): void {
    // Toggle-only module – no extra controls needed
  }
}
