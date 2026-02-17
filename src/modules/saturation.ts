import type { AccessibilityModule, ModuleState } from '../core/types';
import { ICONS } from '../ui/icons';

const STYLE_ID = 'a11y-saturation-styles';

export class SaturationModule implements AccessibilityModule {
  readonly id = 'saturation';
  readonly name = 'רוויה';
  readonly icon = ICONS.saturation;

  private enabled = false;
  private value = 100; // percent
  private styleEl: HTMLStyleElement | null = null;

  init(): void {
    // noop
  }

  activate(): void {
    this.enabled = true;
    if (this.value === 100) this.value = 0; // default to grayscale on first toggle
    this.apply();
  }

  deactivate(): void {
    this.enabled = false;
    this.value = 100;
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
    // Apply on html element; combine with any existing invert filter
    // by using a separate selector that adds saturate to the filter chain.
    // For the inverted case (html.a11y-inverted), we combine both filters.
    el.textContent = `
      html:not(.a11y-inverted) {
        filter: saturate(${this.value}%) !important;
      }
      html.a11y-inverted {
        filter: invert(1) hue-rotate(180deg) saturate(${this.value}%) !important;
      }
      /* Preserve media in inverted mode */
      html.a11y-inverted img,
      html.a11y-inverted video,
      html.a11y-inverted canvas,
      html.a11y-inverted svg {
        filter: invert(1) hue-rotate(180deg) saturate(${this.value}%) !important;
      }
    `;
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
    label.textContent = `רוויה: ${this.value}%`;

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.className = 'a11y-range';
    slider.min = '0';
    slider.max = '300';
    slider.step = '10';
    slider.value = String(this.value);
    slider.setAttribute('aria-label', 'רוויית צבעים');

    slider.addEventListener('input', () => {
      this.value = Number(slider.value);
      this.enabled = this.value !== 100;
      label.textContent = `רוויה: ${this.value}%`;
      if (this.value !== 100) {
        this.apply();
      } else {
        this.clear();
      }
      onStateChange?.();
    });

    const resetBtn = document.createElement('button');
    resetBtn.className = 'a11y-btn a11y-btn-reset';
    resetBtn.textContent = 'איפוס';
    resetBtn.setAttribute('aria-label', 'איפוס רוויה');
    resetBtn.addEventListener('click', () => {
      this.value = 100;
      this.enabled = false;
      slider.value = '100';
      label.textContent = 'רוויה: 100%';
      this.clear();
      onStateChange?.();
    });

    wrapper.append(label, slider, resetBtn);
    container.appendChild(wrapper);
  }
}
