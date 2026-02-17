import type { AccessibilityModule, ModuleState } from '../core/types';
import { ICONS } from '../ui/icons';

const STYLE_ID = 'a11y-screen-reader-styles';
const HIGHLIGHT_CLASS = 'a11y-sr-highlight';
const TARGETS = 'p, h1, h2, h3, h4, h5, h6, span, a, li, td, th, label, blockquote, figcaption';

const HIGHLIGHT_CSS = `
  .${HIGHLIGHT_CLASS} {
    background-color: rgba(26, 115, 232, 0.15) !important;
    outline: 2px solid rgba(26, 115, 232, 0.4) !important;
    outline-offset: 2px !important;
    border-radius: 4px !important;
    transition: background-color 0.15s !important;
  }
`;

export class ScreenReaderModule implements AccessibilityModule {
  readonly id = 'screen-reader';
  readonly name = 'קורא מסך';
  readonly icon = ICONS.screenReader;

  private enabled = false;
  private rate = 1.0;
  private styleEl: HTMLStyleElement | null = null;
  private currentEl: Element | null = null;
  private boundEnter: ((e: Event) => void) | null = null;
  private boundLeave: ((e: Event) => void) | null = null;
  private voicesReady = false;

  init(): void {
    // Pre-load voices so they're available when the module is activated
    this.ensureVoices();
  }

  activate(): void {
    this.enabled = true;
    this.ensureVoices();
    this.injectStyles();
    this.attachListeners();
  }

  deactivate(): void {
    this.enabled = false;
    window.speechSynthesis.cancel();
    this.removeHighlight();
    this.detachListeners();
    this.clearStyles();
  }

  getState(): ModuleState {
    return { enabled: this.enabled, settings: { rate: this.rate } };
  }

  setState(state: ModuleState): void {
    this.enabled = state.enabled;
    if (typeof state.settings.rate === 'number') {
      this.rate = state.settings.rate;
    }
  }

  /** Ensure voices are loaded (they load async in most browsers) */
  private ensureVoices(): void {
    if (this.voicesReady) return;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      this.voicesReady = true;
      return;
    }
    // Chrome loads voices asynchronously
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      this.voicesReady = true;
    }, { once: true });
  }

  private getLang(): string {
    const lang = (document.documentElement.lang || 'he').toLowerCase();
    if (lang.startsWith('he')) return 'he-IL';
    if (lang.startsWith('en')) return 'en-US';
    if (lang.startsWith('ar')) return 'ar-SA';
    return lang;
  }

  private speak(text: string): void {
    window.speechSynthesis.cancel();
    const clean = text.trim();
    if (!clean) return;

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = this.rate;
    utterance.lang = this.getLang();

    // Try to find a matching voice
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = utterance.lang.split('-')[0];
    const match = voices.find((v) => v.lang.startsWith(langPrefix));
    if (match) {
      utterance.voice = match;
    }

    // Chrome bug workaround: speechSynthesis can get stuck in a paused state
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    window.speechSynthesis.speak(utterance);
  }

  private removeHighlight(): void {
    if (this.currentEl) {
      this.currentEl.classList.remove(HIGHLIGHT_CLASS);
      this.currentEl = null;
    }
  }

  private onEnter = (e: Event): void => {
    const target = e.target as Element;
    if (!target || !target.matches || !target.matches(TARGETS)) return;

    const text = (target.textContent ?? '').trim();
    if (!text) return;

    this.removeHighlight();
    this.currentEl = target;
    target.classList.add(HIGHLIGHT_CLASS);
    this.speak(text);
  };

  private onLeave = (e: Event): void => {
    const target = e.target as Element;
    if (target === this.currentEl) {
      target.classList.remove(HIGHLIGHT_CLASS);
      this.currentEl = null;
    }
  };

  private attachListeners(): void {
    this.boundEnter = this.onEnter;
    this.boundLeave = this.onLeave;
    document.addEventListener('mouseenter', this.boundEnter, true);
    document.addEventListener('mouseleave', this.boundLeave, true);
  }

  private detachListeners(): void {
    if (this.boundEnter) {
      document.removeEventListener('mouseenter', this.boundEnter, true);
      this.boundEnter = null;
    }
    if (this.boundLeave) {
      document.removeEventListener('mouseleave', this.boundLeave, true);
      this.boundLeave = null;
    }
  }

  private injectStyles(): void {
    if (!this.styleEl) {
      this.styleEl = document.createElement('style');
      this.styleEl.id = STYLE_ID;
      document.head.appendChild(this.styleEl);
    }
    this.styleEl.textContent = HIGHLIGHT_CSS;
  }

  private clearStyles(): void {
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
    label.textContent = `מהירות דיבור: ${this.rate.toFixed(1)}x`;

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.className = 'a11y-range';
    slider.min = '0.5';
    slider.max = '2.0';
    slider.step = '0.1';
    slider.value = String(this.rate);
    slider.setAttribute('aria-label', 'מהירות דיבור');

    slider.addEventListener('input', () => {
      this.rate = Number(slider.value);
      label.textContent = `מהירות דיבור: ${this.rate.toFixed(1)}x`;
      onStateChange?.();
    });

    wrapper.append(label, slider);
    container.appendChild(wrapper);
  }
}
