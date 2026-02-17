import type { AccessibilityModule, ModuleState } from '../core/types';
import { ICONS } from '../ui/icons';

const STYLE_ID = 'a11y-hide-images-styles';
const MARKER_ATTR = 'data-a11y-img-hidden';
const PLACEHOLDER_CLASS = 'a11y-img-placeholder';

const HIDE_CSS = `
  img[${MARKER_ATTR}],
  svg[${MARKER_ATTR}],
  video[${MARKER_ATTR}] {
    visibility: hidden !important;
    position: relative !important;
  }

  [${MARKER_ATTR}][data-a11y-alt]::after {
    content: attr(data-a11y-alt);
    visibility: visible;
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f0f0 !important;
    color: #555 !important;
    font-size: 13px !important;
    font-family: Arial, sans-serif !important;
    border: 2px dashed #ccc !important;
    border-radius: 4px !important;
    padding: 8px !important;
    text-align: center !important;
    word-break: break-word !important;
    box-sizing: border-box !important;
  }

  .${PLACEHOLDER_CLASS} {
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
    background: #f0f0f0 !important;
    color: #555 !important;
    font-size: 13px !important;
    font-family: Arial, sans-serif !important;
    border: 2px dashed #ccc !important;
    border-radius: 4px !important;
    padding: 8px !important;
    text-align: center !important;
    min-height: 40px !important;
  }

  *[${MARKER_ATTR}][data-a11y-bg] {
    background-image: none !important;
  }
`;

export class HideImagesModule implements AccessibilityModule {
  readonly id = 'hide-images';
  readonly name = 'הסתרת תמונות';
  readonly icon = ICONS.hideImages;

  private enabled = false;
  private styleEl: HTMLStyleElement | null = null;
  private markedElements: Element[] = [];
  private placeholders: HTMLElement[] = [];

  init(): void {
    // noop
  }

  activate(): void {
    this.enabled = true;
    this.injectStyles();
    this.hideAll();
  }

  deactivate(): void {
    this.enabled = false;
    this.showAll();
    this.clearStyles();
  }

  getState(): ModuleState {
    return { enabled: this.enabled, settings: {} };
  }

  setState(state: ModuleState): void {
    this.enabled = state.enabled;
  }

  private injectStyles(): void {
    if (!this.styleEl) {
      this.styleEl = document.createElement('style');
      this.styleEl.id = STYLE_ID;
      document.head.appendChild(this.styleEl);
    }
    this.styleEl.textContent = HIDE_CSS;
  }

  private clearStyles(): void {
    if (this.styleEl) {
      this.styleEl.textContent = '';
    }
  }

  private hideAll(): void {
    // Hide img, svg, video
    const media = document.querySelectorAll('img, svg, video');
    media.forEach((el) => {
      // Skip our own widget elements
      if (el.closest('#a11y-widget-root')) return;

      el.setAttribute(MARKER_ATTR, '');
      this.markedElements.push(el);

      // For images with alt text, show a placeholder
      if (el.tagName === 'IMG') {
        const alt = el.getAttribute('alt');
        if (alt && alt.trim()) {
          el.setAttribute('data-a11y-alt', alt);
        } else {
          el.setAttribute('data-a11y-alt', 'תמונה');
        }
      }
    });

    // Hide background-image elements
    const allElements = document.querySelectorAll('*');
    allElements.forEach((el) => {
      if (el.closest('#a11y-widget-root')) return;
      if (el.hasAttribute(MARKER_ATTR)) return;

      const computed = window.getComputedStyle(el);
      if (computed.backgroundImage && computed.backgroundImage !== 'none') {
        el.setAttribute(MARKER_ATTR, '');
        el.setAttribute('data-a11y-bg', 'true');
        this.markedElements.push(el);
      }
    });
  }

  private showAll(): void {
    for (const el of this.markedElements) {
      el.removeAttribute(MARKER_ATTR);
      el.removeAttribute('data-a11y-alt');
      el.removeAttribute('data-a11y-bg');
    }
    this.markedElements = [];

    for (const ph of this.placeholders) {
      ph.remove();
    }
    this.placeholders = [];
  }

  renderControls(_container: HTMLElement, _onStateChange?: () => void): void {
    // Toggle-only
  }
}
