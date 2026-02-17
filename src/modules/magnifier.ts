import type { AccessibilityModule, ModuleState } from '../core/types';
import { ICONS } from '../ui/icons';

const LENS_ID = 'a11y-magnifier-lens';
const STYLE_ID = 'a11y-magnifier-styles';
const LENS_SIZE = 180;

export class MagnifierModule implements AccessibilityModule {
  readonly id = 'magnifier';
  readonly name = 'זכוכית מגדלת';
  readonly icon = ICONS.magnifier;

  private enabled = false;
  private zoom = 2;
  private lensEl: HTMLDivElement | null = null;
  private cloneEl: HTMLDivElement | null = null;
  private styleEl: HTMLStyleElement | null = null;
  private boundMove: ((e: MouseEvent) => void) | null = null;
  private boundOut: (() => void) | null = null;
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;

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
    return { enabled: this.enabled, settings: { zoom: this.zoom } };
  }

  setState(state: ModuleState): void {
    this.enabled = state.enabled;
    if (typeof state.settings.zoom === 'number') {
      this.zoom = state.settings.zoom;
    }
  }

  private inject(): void {
    if (!this.styleEl) {
      this.styleEl = document.createElement('style');
      this.styleEl.id = STYLE_ID;
      document.head.appendChild(this.styleEl);
    }
    this.styleEl.textContent = `
      #${LENS_ID} {
        position: fixed;
        width: ${LENS_SIZE}px;
        height: ${LENS_SIZE}px;
        border-radius: 50%;
        border: 3px solid #1a73e8;
        box-shadow: 0 4px 20px rgba(0,0,0,0.25), inset 0 0 8px rgba(0,0,0,0.08);
        pointer-events: none;
        z-index: 2147483644;
        overflow: hidden;
        display: none;
        background: #fff;
      }
      #${LENS_ID}.visible { display: block; }
      #${LENS_ID} .a11y-mag-clone {
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
        transform-origin: 0 0;
        will-change: transform;
      }
    `;

    if (!this.lensEl) {
      this.lensEl = document.createElement('div');
      this.lensEl.id = LENS_ID;
      document.body.appendChild(this.lensEl);
    }

    this.buildClone();

    this.boundMove = (e: MouseEvent) => this.onMove(e);
    this.boundOut = () => this.onOut();
    document.addEventListener('mousemove', this.boundMove);
    document.addEventListener('mouseleave', this.boundOut);
  }

  private buildClone(): void {
    if (!this.lensEl) return;

    // Remove old clone
    if (this.cloneEl) {
      this.cloneEl.remove();
      this.cloneEl = null;
    }

    const clone = document.body.cloneNode(true) as HTMLDivElement;
    clone.className = 'a11y-mag-clone';

    // Remove the widget and the lens itself from the clone
    clone.querySelector('#a11y-widget-root')?.remove();
    clone.querySelector(`#${LENS_ID}`)?.remove();

    // Set the clone to match the full page dimensions
    const scrollW = document.documentElement.scrollWidth;
    const scrollH = document.documentElement.scrollHeight;
    clone.style.width = `${scrollW}px`;
    clone.style.minHeight = `${scrollH}px`;
    clone.style.margin = '0';
    clone.style.padding = '0';

    this.cloneEl = clone;
    this.lensEl.appendChild(clone);

    // Schedule a refresh so dynamic content is kept up-to-date
    if (this.refreshTimer) clearTimeout(this.refreshTimer);
    this.refreshTimer = setTimeout(() => {
      if (this.enabled) this.buildClone();
    }, 3000);
  }

  private onMove(e: MouseEvent): void {
    if (!this.lensEl || !this.cloneEl) return;
    const half = LENS_SIZE / 2;

    // Center the lens on the cursor
    this.lensEl.style.left = `${e.clientX - half}px`;
    this.lensEl.style.top = `${e.clientY - half}px`;
    this.lensEl.classList.add('visible');

    // The point on the page the user is hovering over
    const pageX = e.clientX + window.scrollX;
    const pageY = e.clientY + window.scrollY;

    // Scale the clone and offset so the hovered point is at the center of the lens
    const z = this.zoom;
    const tx = -pageX * z + half;
    const ty = -pageY * z + half;
    this.cloneEl.style.transform = `translate(${tx}px, ${ty}px) scale(${z})`;
  }

  private onOut(): void {
    if (this.lensEl) this.lensEl.classList.remove('visible');
  }

  private remove(): void {
    if (this.boundMove) {
      document.removeEventListener('mousemove', this.boundMove);
      this.boundMove = null;
    }
    if (this.boundOut) {
      document.removeEventListener('mouseleave', this.boundOut);
      this.boundOut = null;
    }
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
    if (this.lensEl) {
      this.lensEl.remove();
      this.lensEl = null;
      this.cloneEl = null;
    }
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
    label.textContent = `הגדלה: ${this.zoom.toFixed(1)}x`;

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.className = 'a11y-range';
    slider.min = '1.5';
    slider.max = '4';
    slider.step = '0.5';
    slider.value = String(this.zoom);
    slider.setAttribute('aria-label', 'רמת הגדלה');

    slider.addEventListener('input', () => {
      this.zoom = Number(slider.value);
      label.textContent = `הגדלה: ${this.zoom.toFixed(1)}x`;
      onStateChange?.();
    });

    wrapper.append(label, slider);
    container.appendChild(wrapper);
  }
}
