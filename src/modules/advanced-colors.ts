import type { AccessibilityModule, ModuleState } from '../core/types';
import { ICONS } from '../ui/icons';

const STYLE_ID = 'a11y-advanced-colors-styles';

type ColorCategory = 'background' | 'headers' | 'text' | 'links';

interface ColorSettings {
  background: string | null;
  headers: string | null;
  text: string | null;
  links: string | null;
}

const COLOR_PALETTE = [
  { id: 'purple', hex: '#8B5CF6', light: false },
  { id: 'yellow', hex: '#EAB308', light: true },
  { id: 'orange', hex: '#F97316', light: false },
  { id: 'red', hex: '#EF4444', light: false },
  { id: 'blue', hex: '#3B82F6', light: false },
  { id: 'green', hex: '#22C55E', light: false },
  { id: 'white', hex: '#FFFFFF', light: true },
  { id: 'black', hex: '#000000', light: false },
] as const;

const CATEGORY_SELECTORS: Record<ColorCategory, string> = {
  background:
    'body, main, section, article, div, aside, nav, footer, header',
  headers: 'h1, h2, h3, h4, h5, h6',
  text: 'p, span, li, td, th, blockquote, label, figcaption, dt, dd',
  links: 'a, a:visited, a:hover',
};

const CATEGORY_PROPERTY: Record<ColorCategory, string> = {
  background: 'background-color',
  headers: 'color',
  text: 'color',
  links: 'color',
};

const ROWS: ReadonlyArray<{
  key: ColorCategory;
  label: string;
  iconKey: keyof typeof ICONS;
}> = [
  { key: 'background', label: 'צבעי רקע', iconKey: 'colorBackground' },
  { key: 'headers', label: 'צבעי כותרות', iconKey: 'colorHeaders' },
  { key: 'text', label: 'צבעי טקסט', iconKey: 'colorText' },
  { key: 'links', label: 'צבעי קישור', iconKey: 'colorLinks' },
];

export class AdvancedColorModule implements AccessibilityModule {
  readonly id = 'advanced-colors';
  readonly name = 'הגדרות צבעים מתקדמות';
  readonly icon = ICONS.colorPalette;

  private settings: ColorSettings = {
    background: null,
    headers: null,
    text: null,
    links: null,
  };

  private styleEl: HTMLStyleElement | null = null;

  init(): void {
    // noop
  }

  activate(): void {
    this.applyStyles();
  }

  deactivate(): void {
    this.settings = {
      background: null,
      headers: null,
      text: null,
      links: null,
    };
    this.clearStyles();
  }

  getState(): ModuleState {
    const hasAny = Object.values(this.settings).some((v) => v !== null);
    return {
      enabled: hasAny,
      settings: { ...this.settings },
    };
  }

  setState(state: ModuleState): void {
    const s = state.settings;
    this.settings = {
      background:
        typeof s.background === 'string' ? s.background : null,
      headers: typeof s.headers === 'string' ? s.headers : null,
      text: typeof s.text === 'string' ? s.text : null,
      links: typeof s.links === 'string' ? s.links : null,
    };
  }

  renderControls(
    _container: HTMLElement,
    _onStateChange?: () => void,
  ): void {
    // No inline controls — uses custom section via buildSection()
  }

  /**
   * Builds the full "Advanced Color Settings" rows into the given container.
   * Called directly from widget-ui.ts.
   */
  buildSection(
    container: HTMLElement,
    onStateChange: () => void,
  ): void {
    const section = document.createElement('div');
    section.className = 'a11y-color-section';

    for (const row of ROWS) {
      section.appendChild(
        this.buildRow(row.key, row.label, row.iconKey, onStateChange),
      );
    }

    container.appendChild(section);
  }

  private buildRow(
    category: ColorCategory,
    label: string,
    iconKey: keyof typeof ICONS,
    onStateChange: () => void,
  ): HTMLElement {
    const row = document.createElement('div');
    row.className = 'a11y-color-row';

    // Label side (icon + text)
    const labelWrap = document.createElement('div');
    labelWrap.className = 'a11y-color-row-label';

    const iconEl = document.createElement('span');
    iconEl.className = 'a11y-color-row-icon';
    iconEl.innerHTML = ICONS[iconKey];

    const textEl = document.createElement('span');
    textEl.className = 'a11y-color-row-text';
    textEl.textContent = label;

    labelWrap.append(iconEl, textEl);

    // Swatches side
    const swatchesWrap = document.createElement('div');
    swatchesWrap.className = 'a11y-color-swatches';

    const swatchButtons: HTMLButtonElement[] = [];

    for (const color of COLOR_PALETTE) {
      const btn = document.createElement('button');
      btn.className = 'a11y-color-swatch';
      btn.setAttribute('type', 'button');
      btn.setAttribute('aria-label', `${label} - ${color.id}`);
      btn.style.backgroundColor = color.hex;

      if (color.light) {
        btn.classList.add('a11y-color-swatch-light');
      }
      if (color.id === 'white') {
        btn.classList.add('a11y-color-swatch-bordered');
      }
      if (this.settings[category] === color.hex) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.setAttribute('aria-pressed', 'false');
      }

      btn.addEventListener('click', () => {
        // Toggle: clicking active swatch deselects
        if (this.settings[category] === color.hex) {
          this.settings[category] = null;
        } else {
          this.settings[category] = color.hex;
        }

        // Update active states on all swatches in this row
        for (const sb of swatchButtons) {
          sb.classList.remove('active');
          sb.setAttribute('aria-pressed', 'false');
        }
        if (this.settings[category] !== null) {
          btn.classList.add('active');
          btn.setAttribute('aria-pressed', 'true');
        }

        this.applyStyles();
        onStateChange();
      });

      swatchButtons.push(btn);
      swatchesWrap.appendChild(btn);
    }

    row.append(labelWrap, swatchesWrap);
    return row;
  }

  // ── CSS Injection ──

  private ensureStyleEl(): HTMLStyleElement {
    if (!this.styleEl) {
      this.styleEl = document.createElement('style');
      this.styleEl.id = STYLE_ID;
      document.head.appendChild(this.styleEl);
    }
    return this.styleEl;
  }

  private applyStyles(): void {
    const el = this.ensureStyleEl();
    let css = '';

    for (const cat of Object.keys(CATEGORY_SELECTORS) as ColorCategory[]) {
      const hex = this.settings[cat];
      if (hex) {
        css += `${CATEGORY_SELECTORS[cat]} { ${CATEGORY_PROPERTY[cat]}: ${hex} !important; }\n`;
      }
    }

    el.textContent = css;
  }

  private clearStyles(): void {
    if (this.styleEl) {
      this.styleEl.textContent = '';
    }
  }
}
