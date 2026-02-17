import type { AccessibilityModule, ModuleState } from '../core/types';
import { ICONS } from '../ui/icons';

type KBLang = 'he' | 'en';

const KB_HOST_ID = 'a11y-virtual-keyboard-host';

const HE_ROWS = [
  ['/', "'", 'ק', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ'],
  ['ש', 'ד', 'ג', 'כ', 'ע', 'י', 'ח', 'ל', 'ך', 'ף'],
  ['ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ', 'ת', 'ץ'],
];

const EN_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

const KB_CSS = `
  :host { all: initial; font-family: Arial, sans-serif; font-size: 16px; }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .kb-container {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2147483647;
    background: #f8f9fa;
    border: 1px solid #dadce0;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    padding: 12px;
    user-select: none;
    cursor: move;
    min-width: 420px;
  }

  .kb-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    padding: 0 4px;
  }

  .kb-lang-btn {
    padding: 4px 12px;
    border-radius: 6px;
    border: 1px solid #dadce0;
    background: #fff;
    color: #202124;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }
  .kb-lang-btn:hover { background: #e8f0fe; }

  .kb-close-btn {
    width: 28px; height: 28px;
    border-radius: 50%; border: none;
    background: transparent; color: #5f6368;
    font-size: 18px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  }
  .kb-close-btn:hover { background: #e8eaed; }

  .kb-row {
    display: flex;
    justify-content: center;
    gap: 4px;
    margin-bottom: 4px;
  }

  .kb-key {
    min-width: 36px;
    height: 40px;
    border-radius: 8px;
    border: 1px solid #dadce0;
    background: #fff;
    color: #202124;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.1s;
  }
  .kb-key:hover { background: #e8f0fe; border-color: #1a73e8; }
  .kb-key:active { background: #1a73e8; color: #fff; }

  .kb-key-wide {
    min-width: 64px;
    font-size: 13px;
  }

  .kb-space {
    flex: 1;
    min-width: 180px;
  }
`;

export class VirtualKeyboardModule implements AccessibilityModule {
  readonly id = 'virtual-keyboard';
  readonly name = 'מקלדת וירטואלית';
  readonly icon = ICONS.virtualKeyboard;

  private enabled = false;
  private lang: KBLang = 'he';
  private hostEl: HTMLElement | null = null;
  private shadow: ShadowRoot | null = null;
  private activeInput: HTMLInputElement | HTMLTextAreaElement | null = null;
  private boundFocusIn: ((e: FocusEvent) => void) | null = null;
  private boundFocusOut: ((e: FocusEvent) => void) | null = null;

  init(): void {
    // noop
  }

  activate(): void {
    this.enabled = true;
    this.createHost();
    this.attachListeners();
  }

  deactivate(): void {
    this.enabled = false;
    this.detachListeners();
    this.destroyHost();
  }

  getState(): ModuleState {
    return { enabled: this.enabled, settings: { lang: this.lang } };
  }

  setState(state: ModuleState): void {
    this.enabled = state.enabled;
    if (typeof state.settings.lang === 'string') {
      this.lang = state.settings.lang as KBLang;
    }
  }

  private createHost(): void {
    if (this.hostEl) return;
    this.hostEl = document.createElement('div');
    this.hostEl.id = KB_HOST_ID;
    document.body.appendChild(this.hostEl);
    this.shadow = this.hostEl.attachShadow({ mode: 'closed' });

    const style = document.createElement('style');
    style.textContent = KB_CSS;
    this.shadow.appendChild(style);
  }

  private destroyHost(): void {
    if (this.hostEl) {
      this.hostEl.remove();
      this.hostEl = null;
      this.shadow = null;
    }
    this.activeInput = null;
  }

  private attachListeners(): void {
    this.boundFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target instanceof HTMLInputElement &&
        ['text', 'search', 'email', 'url', 'tel', 'password'].includes(target.type)
      ) {
        this.activeInput = target;
        this.showKeyboard();
      } else if (target instanceof HTMLTextAreaElement) {
        this.activeInput = target;
        this.showKeyboard();
      }
    };

    this.boundFocusOut = (e: FocusEvent) => {
      // Don't hide if clicking inside the keyboard
      const related = e.relatedTarget as HTMLElement | null;
      if (related && this.hostEl?.contains(related)) return;
      // Small delay to allow keyboard clicks to register
      setTimeout(() => {
        if (
          document.activeElement !== this.activeInput &&
          !this.hostEl?.contains(document.activeElement as HTMLElement)
        ) {
          this.hideKeyboard();
        }
      }, 150);
    };

    document.addEventListener('focusin', this.boundFocusIn);
    document.addEventListener('focusout', this.boundFocusOut);
  }

  private detachListeners(): void {
    if (this.boundFocusIn) {
      document.removeEventListener('focusin', this.boundFocusIn);
      this.boundFocusIn = null;
    }
    if (this.boundFocusOut) {
      document.removeEventListener('focusout', this.boundFocusOut);
      this.boundFocusOut = null;
    }
  }

  private showKeyboard(): void {
    if (!this.shadow) return;
    // Remove old keyboard if exists
    const old = this.shadow.querySelector('.kb-container');
    if (old) old.remove();

    const container = document.createElement('div');
    container.className = 'kb-container';

    // Header: lang toggle + close
    const header = document.createElement('div');
    header.className = 'kb-header';

    const langBtn = document.createElement('button');
    langBtn.className = 'kb-lang-btn';
    langBtn.textContent = this.lang === 'he' ? 'HE → EN' : 'EN → HE';
    langBtn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.lang = this.lang === 'he' ? 'en' : 'he';
      this.showKeyboard();
      this.activeInput?.focus();
    });

    const closeBtn = document.createElement('button');
    closeBtn.className = 'kb-close-btn';
    closeBtn.textContent = '×';
    closeBtn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.hideKeyboard();
    });

    header.append(langBtn, closeBtn);
    container.appendChild(header);

    // Key rows
    const rows = this.lang === 'he' ? HE_ROWS : EN_ROWS;
    for (const row of rows) {
      const rowEl = document.createElement('div');
      rowEl.className = 'kb-row';
      for (const key of row) {
        const keyBtn = document.createElement('button');
        keyBtn.className = 'kb-key';
        keyBtn.textContent = key;
        keyBtn.addEventListener('mousedown', (e) => {
          e.preventDefault();
          this.insertChar(key);
        });
        rowEl.appendChild(keyBtn);
      }
      container.appendChild(rowEl);
    }

    // Bottom row: backspace, space, enter
    const bottomRow = document.createElement('div');
    bottomRow.className = 'kb-row';

    const backspace = document.createElement('button');
    backspace.className = 'kb-key kb-key-wide';
    backspace.textContent = '⌫';
    backspace.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.doBackspace();
    });

    const space = document.createElement('button');
    space.className = 'kb-key kb-space';
    space.textContent = 'רווח';
    space.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.insertChar(' ');
    });

    const enter = document.createElement('button');
    enter.className = 'kb-key kb-key-wide';
    enter.textContent = '↵';
    enter.addEventListener('mousedown', (e) => {
      e.preventDefault();
      if (this.activeInput instanceof HTMLTextAreaElement) {
        this.insertChar('\n');
      }
    });

    bottomRow.append(backspace, space, enter);
    container.appendChild(bottomRow);

    // Make draggable
    this.makeDraggable(container);

    this.shadow.appendChild(container);
  }

  private hideKeyboard(): void {
    if (!this.shadow) return;
    const kb = this.shadow.querySelector('.kb-container');
    if (kb) kb.remove();
  }

  private insertChar(char: string): void {
    if (!this.activeInput) return;
    const start = this.activeInput.selectionStart ?? this.activeInput.value.length;
    const end = this.activeInput.selectionEnd ?? start;
    const val = this.activeInput.value;
    this.activeInput.value = val.slice(0, start) + char + val.slice(end);
    const newPos = start + char.length;
    this.activeInput.setSelectionRange(newPos, newPos);
    this.activeInput.dispatchEvent(new Event('input', { bubbles: true }));
    this.activeInput.focus();
  }

  private doBackspace(): void {
    if (!this.activeInput) return;
    const start = this.activeInput.selectionStart ?? this.activeInput.value.length;
    const end = this.activeInput.selectionEnd ?? start;
    const val = this.activeInput.value;
    if (start === end && start > 0) {
      this.activeInput.value = val.slice(0, start - 1) + val.slice(end);
      this.activeInput.setSelectionRange(start - 1, start - 1);
    } else {
      this.activeInput.value = val.slice(0, start) + val.slice(end);
      this.activeInput.setSelectionRange(start, start);
    }
    this.activeInput.dispatchEvent(new Event('input', { bubbles: true }));
    this.activeInput.focus();
  }

  private makeDraggable(el: HTMLElement): void {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let origLeft = 0;
    let origTop = 0;

    el.addEventListener('pointerdown', (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON') return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = el.getBoundingClientRect();
      origLeft = rect.left;
      origTop = rect.top;
      el.setPointerCapture(e.pointerId);
    });

    el.addEventListener('pointermove', (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      el.style.left = `${origLeft + dx}px`;
      el.style.top = `${origTop + dy}px`;
      el.style.transform = 'none';
      el.style.bottom = 'auto';
    });

    el.addEventListener('pointerup', () => {
      isDragging = false;
    });
  }

  renderControls(_container: HTMLElement, _onStateChange?: () => void): void {
    // Toggle-only — keyboard shows automatically on input focus
  }
}
