import type { AccessibilityModule, ModuleState } from '../core/types';
import { ICONS } from '../ui/icons';

const STYLE_ID = 'a11y-focus-indicator-styles';

const FOCUS_CSS = `
  html.a11y-focus-indicator *:focus {
    outline: 5px solid #FFD700 !important;
    outline-offset: 2px !important;
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.4) !important;
  }
  html.a11y-focus-indicator *:focus:not(:focus-visible) {
    outline: 5px solid #FFD700 !important;
    outline-offset: 2px !important;
  }
`;

export class FocusIndicatorModule implements AccessibilityModule {
  readonly id = 'focus-indicator';
  readonly name = 'מדגיש פוקוס';
  readonly icon = ICONS.focusIndicator;

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
    return { enabled: this.enabled, settings: {} };
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
    this.styleEl.textContent = FOCUS_CSS;
    document.documentElement.classList.add('a11y-focus-indicator');
  }

  private remove(): void {
    document.documentElement.classList.remove('a11y-focus-indicator');
    if (this.styleEl) {
      this.styleEl.textContent = '';
    }
  }

  renderControls(_container: HTMLElement, _onStateChange?: () => void): void {
    // Toggle-only
  }
}
