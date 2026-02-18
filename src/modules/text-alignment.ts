import type { AccessibilityModule, ModuleState } from '../core/types';
import { ICONS } from '../ui/icons';

type Alignment = 'none' | 'left' | 'center' | 'right';

const STYLE_ID = 'a11y-text-alignment-styles';

export class TextAlignmentModule implements AccessibilityModule {
  readonly id = 'text-alignment';
  readonly name = 'יישור טקסט';
  readonly icon = ICONS.textAlignment;

  private enabled = false;
  private alignment: Alignment = 'none';
  private styleEl: HTMLStyleElement | null = null;

  init(): void {
    // noop
  }

  activate(): void {
    this.enabled = true;
    if (this.alignment !== 'none') {
      this.apply();
    }
  }

  deactivate(): void {
    this.enabled = false;
    this.alignment = 'none';
    this.clear();
  }

  getState(): ModuleState {
    return { enabled: this.enabled, settings: { alignment: this.alignment } };
  }

  setState(state: ModuleState): void {
    this.enabled = state.enabled;
    if (typeof state.settings.alignment === 'string') {
      this.alignment = state.settings.alignment as Alignment;
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
    el.textContent = `
      p, h1, h2, h3, h4, h5, h6, li, td, th, span, div, label, a {
        text-align: ${this.alignment} !important;
      }
    `;
  }

  private clear(): void {
    if (this.styleEl) {
      this.styleEl.textContent = '';
    }
  }

  private setAlignment(align: Alignment): void {
    this.alignment = align;
    this.enabled = align !== 'none';
    if (align === 'none') {
      this.clear();
    } else {
      this.apply();
    }
  }

  renderControls(container: HTMLElement, onStateChange?: () => void): void {
    container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'a11y-module-controls';

    const updateButtons = () => {
      btnRight.classList.toggle('a11y-btn-active', this.alignment === 'right');
      btnCenter.classList.toggle('a11y-btn-active', this.alignment === 'center');
      btnLeft.classList.toggle('a11y-btn-active', this.alignment === 'left');
      onStateChange?.();
    };

    const btnRight = document.createElement('button');
    btnRight.className = 'a11y-btn' + (this.alignment === 'right' ? ' a11y-btn-active' : '');
    btnRight.textContent = 'ימין';
    btnRight.setAttribute('aria-label', 'יישור טקסט לימין');
    btnRight.addEventListener('click', () => {
      this.setAlignment(this.alignment === 'right' ? 'none' : 'right');
      updateButtons();
    });

    const btnCenter = document.createElement('button');
    btnCenter.className = 'a11y-btn' + (this.alignment === 'center' ? ' a11y-btn-active' : '');
    btnCenter.textContent = 'מרכז';
    btnCenter.setAttribute('aria-label', 'יישור טקסט למרכז');
    btnCenter.addEventListener('click', () => {
      this.setAlignment(this.alignment === 'center' ? 'none' : 'center');
      updateButtons();
    });

    const btnLeft = document.createElement('button');
    btnLeft.className = 'a11y-btn' + (this.alignment === 'left' ? ' a11y-btn-active' : '');
    btnLeft.textContent = 'שמאל';
    btnLeft.setAttribute('aria-label', 'יישור טקסט לשמאל');
    btnLeft.addEventListener('click', () => {
      this.setAlignment(this.alignment === 'left' ? 'none' : 'left');
      updateButtons();
    });

    const btnDefault = document.createElement('button');
    btnDefault.className = 'a11y-btn a11y-btn-reset';
    btnDefault.textContent = 'ברירת מחדל';
    btnDefault.setAttribute('aria-label', 'חזור ליישור ברירת מחדל');
    btnDefault.addEventListener('click', () => {
      this.setAlignment('none');
      updateButtons();
    });

    wrapper.append(btnRight, btnCenter, btnLeft, btnDefault);
    container.appendChild(wrapper);
  }
}
