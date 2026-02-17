import type { AccessibilityModule, ModuleState } from '../core/types';
import { ICONS } from '../ui/icons';

type CBMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';

const SVG_ID = 'a11y-daltonize-svg';
const STYLE_ID = 'a11y-daltonize-styles';

// Color matrix values for simulating/correcting color blindness
// These matrices shift colors to ranges visible to each type
const FILTERS: Record<Exclude<CBMode, 'none'>, string> = {
  protanopia: `
    <filter id="a11y-protanopia">
      <feColorMatrix type="matrix" values="
        0.567, 0.433, 0,     0, 0
        0.558, 0.442, 0,     0, 0
        0,     0.242, 0.758, 0, 0
        0,     0,     0,     1, 0
      "/>
    </filter>
  `,
  deuteranopia: `
    <filter id="a11y-deuteranopia">
      <feColorMatrix type="matrix" values="
        0.625, 0.375, 0,   0, 0
        0.7,   0.3,   0,   0, 0
        0,     0.3,   0.7, 0, 0
        0,     0,     0,   1, 0
      "/>
    </filter>
  `,
  tritanopia: `
    <filter id="a11y-tritanopia">
      <feColorMatrix type="matrix" values="
        0.95, 0.05,  0,     0, 0
        0,    0.433, 0.567, 0, 0
        0,    0.475, 0.525, 0, 0
        0,    0,     0,     1, 0
      "/>
    </filter>
  `,
};

const FILTER_IDS: Record<Exclude<CBMode, 'none'>, string> = {
  protanopia: 'a11y-protanopia',
  deuteranopia: 'a11y-deuteranopia',
  tritanopia: 'a11y-tritanopia',
};

export class DaltonizationModule implements AccessibilityModule {
  readonly id = 'daltonization';
  readonly name = 'עיוורון צבעים';
  readonly icon = ICONS.daltonize;

  private mode: CBMode = 'none';
  private svgEl: SVGSVGElement | null = null;
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
      this.mode = state.settings.mode as CBMode;
    }
  }

  private ensureSVG(): void {
    if (!this.svgEl) {
      this.svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      this.svgEl.setAttribute('id', SVG_ID);
      this.svgEl.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;';
      document.body.appendChild(this.svgEl);
    }
    // Inject all filter definitions
    this.svgEl.innerHTML = `<defs>${FILTERS.protanopia}${FILTERS.deuteranopia}${FILTERS.tritanopia}</defs>`;
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
    if (this.mode === 'none') return;
    this.ensureSVG();
    const el = this.ensureStyleEl();
    const filterId = FILTER_IDS[this.mode];
    el.textContent = `
      html {
        filter: url(#${filterId}) !important;
      }
    `;
  }

  private clear(): void {
    if (this.styleEl) {
      this.styleEl.textContent = '';
    }
    if (this.svgEl) {
      this.svgEl.remove();
      this.svgEl = null;
    }
  }

  private setMode(mode: CBMode): void {
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
      btnProtan.classList.toggle('a11y-btn-active', this.mode === 'protanopia');
      btnDeuter.classList.toggle('a11y-btn-active', this.mode === 'deuteranopia');
      btnTritan.classList.toggle('a11y-btn-active', this.mode === 'tritanopia');
      onStateChange?.();
    };

    const btnProtan = document.createElement('button');
    btnProtan.className = 'a11y-btn' + (this.mode === 'protanopia' ? ' a11y-btn-active' : '');
    btnProtan.textContent = 'פרוטנופיה';
    btnProtan.setAttribute('aria-label', 'תיקון עיוורון לאדום');
    btnProtan.addEventListener('click', () => {
      this.setMode(this.mode === 'protanopia' ? 'none' : 'protanopia');
      updateButtons();
    });

    const btnDeuter = document.createElement('button');
    btnDeuter.className = 'a11y-btn' + (this.mode === 'deuteranopia' ? ' a11y-btn-active' : '');
    btnDeuter.textContent = 'דויטרנופיה';
    btnDeuter.setAttribute('aria-label', 'תיקון עיוורון לירוק');
    btnDeuter.addEventListener('click', () => {
      this.setMode(this.mode === 'deuteranopia' ? 'none' : 'deuteranopia');
      updateButtons();
    });

    const btnTritan = document.createElement('button');
    btnTritan.className = 'a11y-btn' + (this.mode === 'tritanopia' ? ' a11y-btn-active' : '');
    btnTritan.textContent = 'טריטנופיה';
    btnTritan.setAttribute('aria-label', 'תיקון עיוורון לכחול');
    btnTritan.addEventListener('click', () => {
      this.setMode(this.mode === 'tritanopia' ? 'none' : 'tritanopia');
      updateButtons();
    });

    wrapper.append(btnProtan, btnDeuter, btnTritan);
    container.appendChild(wrapper);
  }
}
