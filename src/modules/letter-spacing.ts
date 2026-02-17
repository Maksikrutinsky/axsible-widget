import type { AccessibilityModule, ModuleState } from '../core/types';
import { ICONS } from '../ui/icons';

const STYLE_ID = 'a11y-letter-spacing-styles';

export class LetterSpacingModule implements AccessibilityModule {
  readonly id = 'letter-spacing';
  readonly name = 'מרווח אותיות';
  readonly icon = ICONS.letterSpacing;

  private enabled = false;
  private value = 0; // px
  private styleEl: HTMLStyleElement | null = null;

  init(): void {
    // noop
  }

  activate(): void {
    this.enabled = true;
    if (this.value === 0) this.value = 1;
    this.apply();
  }

  deactivate(): void {
    this.enabled = false;
    this.value = 0;
    this.clear();
  }

  getState(): ModuleState {
    return { enabled: this.enabled, settings: { value: this.value } };
  }

  setState(state: ModuleState): void {
    this.enabled = state.enabled;
    if (typeof state.settings.value === 'number') {
      this.value = state.settings.value;
    }
  }

  private ensureStyleEl(): HTMLStyleElement {
    if (!this.styleEl) {
      this.styleEl = document.createElement('style');
      this.styleEl.id = STYLE_ID;
      document.head.appendChild(this.styleEl);
    }
    return this.styleEl;
  }

  private apply(): void {
    const el = this.ensureStyleEl();
    el.textContent = `* { letter-spacing: ${this.value}px !important; }`;
  }

  private clear(): void {
    if (this.styleEl) {
      this.styleEl.textContent = '';
    }
  }

  renderControls(container: HTMLElement, onStateChange?: () => void): void {
    container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'a11y-slider-control';

    const label = document.createElement('span');
    label.className = 'a11y-slider-label';
    label.textContent = `מרווח אותיות: ${this.value}px`;

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.className = 'a11y-range';
    slider.min = '0';
    slider.max = '10';
    slider.step = '1';
    slider.value = String(this.value);
    slider.setAttribute('aria-label', 'מרווח אותיות');

    slider.addEventListener('input', () => {
      this.value = Number(slider.value);
      this.enabled = this.value > 0;
      label.textContent = `מרווח אותיות: ${this.value}px`;
      if (this.value > 0) {
        this.apply();
      } else {
        this.clear();
      }
      onStateChange?.();
    });

    wrapper.append(label, slider);
    container.appendChild(wrapper);
  }
}
