import type { AccessibilityModule, ModuleState } from '../core/types';
import { ICONS } from '../ui/icons';

const DEFAULT_STEP = 10; // percent
const MIN_SIZE = 80;
const MAX_SIZE = 200;

export class TextResizer implements AccessibilityModule {
  readonly id = 'text-resizer';
  readonly name = 'גודל טקסט';
  readonly icon = ICONS.textResize;

  private currentSize = 100; // percentage of original

  init(): void {
    // nothing extra needed on first load
  }

  activate(): void {
    this.applySize();
  }

  deactivate(): void {
    this.currentSize = 100;
    this.applySize();
  }

  getState(): ModuleState {
    return {
      enabled: this.currentSize !== 100,
      settings: { size: this.currentSize },
    };
  }

  setState(state: ModuleState): void {
    if (typeof state.settings.size === 'number') {
      this.currentSize = state.settings.size;
    }
  }

  increase(): void {
    this.currentSize = Math.min(MAX_SIZE, this.currentSize + DEFAULT_STEP);
    this.applySize();
  }

  decrease(): void {
    this.currentSize = Math.max(MIN_SIZE, this.currentSize - DEFAULT_STEP);
    this.applySize();
  }

  reset(): void {
    this.currentSize = 100;
    this.applySize();
  }

  private applySize(): void {
    document.documentElement.style.fontSize = `${this.currentSize}%`;
  }

  renderControls(container: HTMLElement): void {
    container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'a11y-module-controls';

    const label = document.createElement('span');
    label.className = 'a11y-size-label';
    label.textContent = `${this.currentSize}%`;

    const btnDecrease = document.createElement('button');
    btnDecrease.className = 'a11y-btn';
    btnDecrease.textContent = 'A-';
    btnDecrease.setAttribute('aria-label', 'הקטן טקסט');
    btnDecrease.addEventListener('click', () => {
      this.decrease();
      label.textContent = `${this.currentSize}%`;
    });

    const btnIncrease = document.createElement('button');
    btnIncrease.className = 'a11y-btn';
    btnIncrease.textContent = 'A+';
    btnIncrease.setAttribute('aria-label', 'הגדל טקסט');
    btnIncrease.addEventListener('click', () => {
      this.increase();
      label.textContent = `${this.currentSize}%`;
    });

    const btnReset = document.createElement('button');
    btnReset.className = 'a11y-btn a11y-btn-reset';
    btnReset.textContent = 'איפוס';
    btnReset.setAttribute('aria-label', 'אפס גודל טקסט');
    btnReset.addEventListener('click', () => {
      this.reset();
      label.textContent = `${this.currentSize}%`;
    });

    wrapper.append(btnDecrease, label, btnIncrease, btnReset);
    container.appendChild(wrapper);
  }
}
