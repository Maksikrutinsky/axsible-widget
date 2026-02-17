import type { AccessibilityModule, ModuleState } from '../core/types';
import { ICONS } from '../ui/icons';

const GUIDE_ID = 'a11y-reading-guide';
const STYLE_ID = 'a11y-reading-guide-styles';

const GUIDE_CSS = `
  #${GUIDE_ID} {
    position: fixed;
    left: 0;
    width: 100%;
    height: 12px;
    background: rgba(255, 215, 0, 0.35);
    border-top: 2px solid rgba(255, 215, 0, 0.7);
    border-bottom: 2px solid rgba(255, 215, 0, 0.7);
    pointer-events: none;
    z-index: 2147483644;
    transition: top 0.05s linear;
    display: none;
  }
  #${GUIDE_ID}.visible {
    display: block;
  }
`;

export class ReadingGuideModule implements AccessibilityModule {
  readonly id = 'reading-guide';
  readonly name = 'סרגל קריאה';
  readonly icon = ICONS.readingGuide;

  private enabled = false;
  private guideEl: HTMLDivElement | null = null;
  private styleEl: HTMLStyleElement | null = null;
  private onMouseMove: ((e: MouseEvent) => void) | null = null;

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

  private inject(): void {
    if (!this.styleEl) {
      this.styleEl = document.createElement('style');
      this.styleEl.id = STYLE_ID;
      document.head.appendChild(this.styleEl);
    }
    this.styleEl.textContent = GUIDE_CSS;

    if (!this.guideEl) {
      this.guideEl = document.createElement('div');
      this.guideEl.id = GUIDE_ID;
      document.body.appendChild(this.guideEl);
    }

    this.onMouseMove = (e: MouseEvent) => {
      if (this.guideEl) {
        this.guideEl.style.top = `${e.clientY - 6}px`;
        this.guideEl.classList.add('visible');
      }
    };

    document.addEventListener('mousemove', this.onMouseMove);
  }

  private remove(): void {
    if (this.onMouseMove) {
      document.removeEventListener('mousemove', this.onMouseMove);
      this.onMouseMove = null;
    }
    if (this.guideEl) {
      this.guideEl.remove();
      this.guideEl = null;
    }
    if (this.styleEl) {
      this.styleEl.textContent = '';
    }
  }

  renderControls(_container: HTMLElement, _onStateChange?: () => void): void {
    // Toggle-only
  }
}
