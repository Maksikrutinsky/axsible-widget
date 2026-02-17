import type { AccessibilityModule, ModuleState } from '../core/types';
import { ICONS } from '../ui/icons';

const STYLE_ID = 'a11y-animation-stop-styles';

const STOP_CSS = `
  html.a11y-no-animations *,
  html.a11y-no-animations *::before,
  html.a11y-no-animations *::after {
    animation: none !important;
    animation-duration: 0s !important;
    transition: none !important;
    transition-duration: 0s !important;
    scroll-behavior: auto !important;
  }
  html.a11y-no-animations marquee {
    -moz-binding: none !important;
    overflow: hidden !important;
  }
`;

export class AnimationStopperModule implements AccessibilityModule {
  readonly id = 'animation-stopper';
  readonly name = 'עצירת אנימציות';
  readonly icon = ICONS.animationStopper;

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
    this.styleEl.textContent = STOP_CSS;
    document.documentElement.classList.add('a11y-no-animations');
  }

  private remove(): void {
    document.documentElement.classList.remove('a11y-no-animations');
    if (this.styleEl) {
      this.styleEl.textContent = '';
    }
  }

  renderControls(_container: HTMLElement): void {
    // Toggle-only module – no extra controls needed
  }
}
