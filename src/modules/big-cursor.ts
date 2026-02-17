import type { AccessibilityModule, ModuleState } from '../core/types';
import { ICONS } from '../ui/icons';

type CursorMode = 'none' | 'dark' | 'light';

const STYLE_ID = 'a11y-big-cursor-styles';

// Dark cursor: black fill, white stroke
const DARK_CURSOR = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M4 2 L4 28 L10 22 L16 30 L20 28 L14 20 L22 20 Z' fill='%23000' stroke='%23fff' stroke-width='1.5'/%3E%3C/svg%3E`;
const DARK_POINTER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M8 4 C8 4 8 22 8 22 L12 18 L16 26 L20 24 L16 16 L22 16 Z' fill='%23000' stroke='%23fff' stroke-width='1.5'/%3E%3C/svg%3E`;

// Light cursor: white fill, black stroke
const LIGHT_CURSOR = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M4 2 L4 28 L10 22 L16 30 L20 28 L14 20 L22 20 Z' fill='%23fff' stroke='%23000' stroke-width='1.5'/%3E%3C/svg%3E`;
const LIGHT_POINTER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M8 4 C8 4 8 22 8 22 L12 18 L16 26 L20 24 L16 16 L22 16 Z' fill='%23fff' stroke='%23000' stroke-width='1.5'/%3E%3C/svg%3E`;

function buildCSS(cursor: string, pointer: string): string {
  return `
    * {
      cursor: url("${cursor}") 4 2, auto !important;
    }
    a, button, [role="button"], [role="link"],
    input[type="submit"], input[type="button"],
    select, label, summary, [onclick] {
      cursor: url("${pointer}") 8 4, pointer !important;
    }
  `;
}

export class BigCursorModule implements AccessibilityModule {
  readonly id = 'big-cursor';
  readonly name = 'סמן גדול';
  readonly icon = ICONS.bigCursor;

  private mode: CursorMode = 'none';
  private styleEl: HTMLStyleElement | null = null;

  init(): void {
    // noop
  }

  activate(): void {
    if (this.mode !== 'none') {
      this.apply();
    }
  }

  deactivate(): void {
    this.mode = 'none';
    this.clear();
  }

  getState(): ModuleState {
    return { enabled: this.mode !== 'none', settings: { mode: this.mode } };
  }

  setState(state: ModuleState): void {
    if (typeof state.settings.mode === 'string') {
      this.mode = state.settings.mode as CursorMode;
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
    if (this.mode === 'dark') {
      el.textContent = buildCSS(DARK_CURSOR, DARK_POINTER);
    } else if (this.mode === 'light') {
      el.textContent = buildCSS(LIGHT_CURSOR, LIGHT_POINTER);
    }
  }

  private clear(): void {
    if (this.styleEl) {
      this.styleEl.textContent = '';
    }
  }

  private setMode(mode: CursorMode): void {
    this.mode = mode;
    if (mode === 'none') {
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
      btnDark.classList.toggle('a11y-btn-active', this.mode === 'dark');
      btnLight.classList.toggle('a11y-btn-active', this.mode === 'light');
      onStateChange?.();
    };

    const btnDark = document.createElement('button');
    btnDark.className = 'a11y-btn' + (this.mode === 'dark' ? ' a11y-btn-active' : '');
    btnDark.textContent = 'סמן כהה';
    btnDark.setAttribute('aria-label', 'סמן גדול כהה');
    btnDark.addEventListener('click', () => {
      this.setMode(this.mode === 'dark' ? 'none' : 'dark');
      updateButtons();
    });

    const btnLight = document.createElement('button');
    btnLight.className = 'a11y-btn' + (this.mode === 'light' ? ' a11y-btn-active' : '');
    btnLight.textContent = 'סמן בהיר';
    btnLight.setAttribute('aria-label', 'סמן גדול בהיר');
    btnLight.addEventListener('click', () => {
      this.setMode(this.mode === 'light' ? 'none' : 'light');
      updateButtons();
    });

    wrapper.append(btnDark, btnLight);
    container.appendChild(wrapper);
  }
}
