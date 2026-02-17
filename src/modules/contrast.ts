import type { AccessibilityModule, ModuleState } from '../core/types';
import { ICONS } from '../ui/icons';

type ContrastMode = 'none' | 'dark-contrast' | 'light-contrast' | 'inverted';

const STYLE_ID = 'a11y-contrast-styles';

const DARK_CONTRAST_CSS = `
  html.a11y-dark-contrast,
  html.a11y-dark-contrast body {
    background: #000 !important;
    color: #ffff00 !important;
  }
  html.a11y-dark-contrast * {
    background-color: #000 !important;
    color: #ffff00 !important;
    border-color: #ffff00 !important;
  }
  html.a11y-dark-contrast a {
    color: #00ffff !important;
  }
  html.a11y-dark-contrast img {
    filter: brightness(1.2) contrast(1.5) !important;
  }
`;

const LIGHT_CONTRAST_CSS = `
  html.a11y-light-contrast,
  html.a11y-light-contrast body {
    background: #fff !important;
    color: #000 !important;
  }
  html.a11y-light-contrast * {
    background-color: #fff !important;
    color: #000 !important;
    border-color: #000 !important;
  }
  html.a11y-light-contrast a {
    color: #0000cc !important;
    text-decoration: underline !important;
  }
  html.a11y-light-contrast img {
    filter: contrast(1.3) !important;
  }
`;

const INVERTED_CSS = `
  html.a11y-inverted {
    filter: invert(1) hue-rotate(180deg) !important;
  }
  html.a11y-inverted img,
  html.a11y-inverted video,
  html.a11y-inverted canvas,
  html.a11y-inverted svg {
    filter: invert(1) hue-rotate(180deg) !important;
  }
`;

const ALL_CLASSES = ['a11y-dark-contrast', 'a11y-light-contrast', 'a11y-inverted'] as const;

export class ContrastModule implements AccessibilityModule {
  readonly id = 'contrast';
  readonly name = 'ניגודיות';
  readonly icon = ICONS.contrast;

  private mode: ContrastMode = 'none';
  private styleEl: HTMLStyleElement | null = null;

  init(): void {
    // noop
  }

  activate(): void {
    if (this.mode !== 'none') {
      this.applyMode();
    }
  }

  deactivate(): void {
    this.clearMode();
    this.mode = 'none';
  }

  getState(): ModuleState {
    return {
      enabled: this.mode !== 'none',
      settings: { mode: this.mode },
    };
  }

  setState(state: ModuleState): void {
    if (typeof state.settings.mode === 'string') {
      this.mode = state.settings.mode as ContrastMode;
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

  private clearMode(): void {
    document.documentElement.classList.remove(...ALL_CLASSES);
    if (this.styleEl) {
      this.styleEl.textContent = '';
    }
  }

  private applyMode(): void {
    this.clearMode();
    const el = this.ensureStyleEl();

    switch (this.mode) {
      case 'dark-contrast':
        el.textContent = DARK_CONTRAST_CSS;
        document.documentElement.classList.add('a11y-dark-contrast');
        break;
      case 'light-contrast':
        el.textContent = LIGHT_CONTRAST_CSS;
        document.documentElement.classList.add('a11y-light-contrast');
        break;
      case 'inverted':
        el.textContent = INVERTED_CSS;
        document.documentElement.classList.add('a11y-inverted');
        break;
    }
  }

  private setMode(mode: ContrastMode): void {
    this.mode = mode;
    if (mode === 'none') {
      this.clearMode();
    } else {
      this.applyMode();
    }
  }

  renderControls(container: HTMLElement, onStateChange?: () => void): void {
    container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'a11y-module-controls';

    const updateButtons = () => {
      btnDark.classList.toggle('a11y-btn-active', this.mode === 'dark-contrast');
      btnLight.classList.toggle('a11y-btn-active', this.mode === 'light-contrast');
      btnInvert.classList.toggle('a11y-btn-active', this.mode === 'inverted');
      onStateChange?.();
    };

    const btnDark = document.createElement('button');
    btnDark.className = 'a11y-btn' + (this.mode === 'dark-contrast' ? ' a11y-btn-active' : '');
    btnDark.textContent = 'ניגודיות כהה';
    btnDark.addEventListener('click', () => {
      this.setMode(this.mode === 'dark-contrast' ? 'none' : 'dark-contrast');
      updateButtons();
    });

    const btnLight = document.createElement('button');
    btnLight.className = 'a11y-btn' + (this.mode === 'light-contrast' ? ' a11y-btn-active' : '');
    btnLight.textContent = 'ניגודיות בהירה';
    btnLight.addEventListener('click', () => {
      this.setMode(this.mode === 'light-contrast' ? 'none' : 'light-contrast');
      updateButtons();
    });

    const btnInvert = document.createElement('button');
    btnInvert.className = 'a11y-btn' + (this.mode === 'inverted' ? ' a11y-btn-active' : '');
    btnInvert.textContent = 'צבעים הפוכים';
    btnInvert.addEventListener('click', () => {
      this.setMode(this.mode === 'inverted' ? 'none' : 'inverted');
      updateButtons();
    });

    wrapper.append(btnDark, btnLight, btnInvert);
    container.appendChild(wrapper);
  }
}
