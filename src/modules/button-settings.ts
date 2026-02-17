import type { AccessibilityModule, ModuleState } from '../core/types';
import { ICONS } from '../ui/icons';

type ButtonPosition = 'right' | 'left';
type ButtonStyleId = 'humanoid' | 'modern-a' | 'wheelchair' | 'tools';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonSettings {
  position: ButtonPosition;
  styleId: ButtonStyleId;
  size: ButtonSize;
}

const SIZE_MAP: Record<ButtonSize, { btn: number; icon: number }> = {
  small: { btn: 44, icon: 26 },
  medium: { btn: 56, icon: 34 },
  large: { btn: 68, icon: 42 },
};

/** Inline SVGs for the 4 trigger button style options */
const TRIGGER_SVGS: Record<ButtonStyleId, string> = {
  humanoid: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" fill="currentColor" class="a11y-trigger-icon"><circle cx="240" cy="80" r="50"/><path d="M195 155h90v130h75l-60 150h-55l35-90H195z"/><circle cx="250" cy="380" r="90" fill="none" stroke="currentColor" stroke-width="40"/></svg>`,
  'modern-a': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="a11y-trigger-icon"><circle cx="12" cy="12" r="10"/><path d="M9 16l3-8 3 8"/><path d="M10 14h4"/></svg>`,
  wheelchair: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="a11y-trigger-icon"><circle cx="10" cy="4" r="2"/><path d="M10 8a4 4 0 1 0 0 8h1l2 4h4l-2-4h-1a4 4 0 0 1-3.46-2H14l1.5-3H10V8z"/><circle cx="10" cy="16" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`,
  tools: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="a11y-trigger-icon"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
};

/** Preview SVGs (smaller, for style cards in the settings UI) */
const PREVIEW_SVGS: Record<ButtonStyleId, string> = {
  humanoid: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" fill="currentColor" width="32" height="32"><circle cx="240" cy="80" r="50"/><path d="M195 155h90v130h75l-60 150h-55l35-90H195z"/><circle cx="250" cy="380" r="90" fill="none" stroke="currentColor" stroke-width="40"/></svg>`,
  'modern-a': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="32" height="32"><circle cx="12" cy="12" r="10"/><path d="M9 16l3-8 3 8"/><path d="M10 14h4"/></svg>`,
  wheelchair: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><circle cx="10" cy="4" r="2"/><path d="M10 8a4 4 0 1 0 0 8h1l2 4h4l-2-4h-1a4 4 0 0 1-3.46-2H14l1.5-3H10V8z"/><circle cx="10" cy="16" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`,
  tools: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="32" height="32"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
};

const STYLE_LABELS: Record<ButtonStyleId, string> = {
  humanoid: 'סטנדרטי',
  'modern-a': 'מודרני',
  wheelchair: 'כיסא גלגלים',
  tools: 'הגדרות',
};

const STYLE_IDS: ButtonStyleId[] = ['humanoid', 'modern-a', 'wheelchair', 'tools'];
const SIZE_IDS: ButtonSize[] = ['small', 'medium', 'large'];
const SIZE_LABELS: Record<ButtonSize, string> = {
  small: 'S',
  medium: 'M',
  large: 'L',
};

export class ButtonSettingsModule implements AccessibilityModule {
  readonly id = 'button-settings';
  readonly name = 'הגדרות כפתור הנגישות';
  readonly icon = ICONS.buttonSettings;

  private settings: ButtonSettings = {
    position: 'right',
    styleId: 'humanoid',
    size: 'medium',
  };

  /** Callback set by widget-ui to apply changes to the trigger button */
  private applyCallback: (() => void) | null = null;

  init(): void {
    // noop — state restored by engine
  }

  activate(): void {
    // noop
  }

  deactivate(): void {
    this.settings = { position: 'right', styleId: 'humanoid', size: 'medium' };
  }

  getState(): ModuleState {
    return {
      enabled: true, // always "enabled" — settings always apply
      settings: { ...this.settings },
    };
  }

  setState(state: ModuleState): void {
    const s = state.settings;
    if (s.position === 'left' || s.position === 'right') {
      this.settings.position = s.position;
    }
    if (
      typeof s.styleId === 'string' &&
      STYLE_IDS.includes(s.styleId as ButtonStyleId)
    ) {
      this.settings.styleId = s.styleId as ButtonStyleId;
    }
    if (
      typeof s.size === 'string' &&
      SIZE_IDS.includes(s.size as ButtonSize)
    ) {
      this.settings.size = s.size as ButtonSize;
    }
  }

  renderControls(
    _container: HTMLElement,
    _onStateChange?: () => void,
  ): void {
    // No inline controls — uses custom section via buildSection()
  }

  /** Called by widget-ui to register a callback for applying trigger changes */
  onApply(cb: () => void): void {
    this.applyCallback = cb;
  }

  getPosition(): ButtonPosition {
    return this.settings.position;
  }

  getStyleId(): ButtonStyleId {
    return this.settings.styleId;
  }

  getSize(): ButtonSize {
    return this.settings.size;
  }

  getTriggerSVG(): string {
    return TRIGGER_SVGS[this.settings.styleId];
  }

  getSizeValues(): { btn: number; icon: number } {
    return SIZE_MAP[this.settings.size];
  }

  /**
   * Builds the full "Button Settings" section into the given container.
   */
  buildSection(
    container: HTMLElement,
    onStateChange: () => void,
  ): void {
    const section = document.createElement('div');
    section.className = 'a11y-btnsettings-section';

    // --- Position Row ---
    section.appendChild(
      this.buildSubsectionTitle('מיקום הכפתור'),
    );
    section.appendChild(
      this.buildPositionRow(onStateChange),
    );

    // --- Style Row ---
    section.appendChild(
      this.buildSubsectionTitle('עיצוב הכפתור'),
    );
    section.appendChild(
      this.buildStyleGrid(onStateChange),
    );

    // --- Size Row ---
    section.appendChild(
      this.buildSubsectionTitle('גודל הכפתור'),
    );
    section.appendChild(
      this.buildSizeRow(onStateChange),
    );

    container.appendChild(section);
  }

  private buildSubsectionTitle(text: string): HTMLElement {
    const el = document.createElement('div');
    el.className = 'a11y-btnsettings-subtitle';
    el.textContent = text;
    return el;
  }

  private buildPositionRow(onStateChange: () => void): HTMLElement {
    const row = document.createElement('div');
    row.className = 'a11y-btnsettings-pos-row';

    const btnRight = document.createElement('button');
    btnRight.className = 'a11y-btnsettings-pos-btn';
    btnRight.textContent = 'ימין';
    btnRight.setAttribute('type', 'button');

    const btnLeft = document.createElement('button');
    btnLeft.className = 'a11y-btnsettings-pos-btn';
    btnLeft.textContent = 'שמאל';
    btnLeft.setAttribute('type', 'button');

    const update = () => {
      btnRight.classList.toggle('active', this.settings.position === 'right');
      btnLeft.classList.toggle('active', this.settings.position === 'left');
      btnRight.setAttribute('aria-pressed', String(this.settings.position === 'right'));
      btnLeft.setAttribute('aria-pressed', String(this.settings.position === 'left'));
    };

    btnRight.addEventListener('click', () => {
      this.settings.position = 'right';
      update();
      this.notifyApply();
      onStateChange();
    });

    btnLeft.addEventListener('click', () => {
      this.settings.position = 'left';
      update();
      this.notifyApply();
      onStateChange();
    });

    update();

    row.append(btnRight, btnLeft);
    return row;
  }

  private buildStyleGrid(onStateChange: () => void): HTMLElement {
    const grid = document.createElement('div');
    grid.className = 'a11y-btnsettings-style-grid';

    const cards: HTMLButtonElement[] = [];

    for (const styleId of STYLE_IDS) {
      const card = document.createElement('button');
      card.className = 'a11y-btnsettings-style-card';
      card.setAttribute('type', 'button');
      card.setAttribute('aria-label', STYLE_LABELS[styleId]);

      const preview = document.createElement('span');
      preview.className = 'a11y-btnsettings-style-preview';
      preview.innerHTML = PREVIEW_SVGS[styleId];

      const label = document.createElement('span');
      label.className = 'a11y-btnsettings-style-label';
      label.textContent = STYLE_LABELS[styleId];

      card.append(preview, label);

      if (this.settings.styleId === styleId) {
        card.classList.add('active');
        card.setAttribute('aria-pressed', 'true');
      } else {
        card.setAttribute('aria-pressed', 'false');
      }

      card.addEventListener('click', () => {
        this.settings.styleId = styleId;
        for (const c of cards) {
          c.classList.remove('active');
          c.setAttribute('aria-pressed', 'false');
        }
        card.classList.add('active');
        card.setAttribute('aria-pressed', 'true');
        this.notifyApply();
        onStateChange();
      });

      cards.push(card);
      grid.appendChild(card);
    }

    return grid;
  }

  private buildSizeRow(onStateChange: () => void): HTMLElement {
    const row = document.createElement('div');
    row.className = 'a11y-btnsettings-size-row';

    const buttons: HTMLButtonElement[] = [];

    for (const sizeId of SIZE_IDS) {
      const btn = document.createElement('button');
      btn.className = 'a11y-btnsettings-size-btn';
      btn.textContent = SIZE_LABELS[sizeId];
      btn.setAttribute('type', 'button');
      btn.setAttribute('aria-label', `גודל ${SIZE_LABELS[sizeId]}`);

      if (this.settings.size === sizeId) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.setAttribute('aria-pressed', 'false');
      }

      btn.addEventListener('click', () => {
        this.settings.size = sizeId;
        for (const b of buttons) {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        }
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        this.notifyApply();
        onStateChange();
      });

      buttons.push(btn);
      row.appendChild(btn);
    }

    return row;
  }

  private notifyApply(): void {
    if (this.applyCallback) this.applyCallback();
  }
}
