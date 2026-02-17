import { AccessibilityEngine } from '../core/engine';
import { ProfileManager } from '../core/profile-manager';
import type { AccessibilityModule } from '../core/types';
import type { AdvancedColorModule } from '../modules/advanced-colors';
import type { ButtonSettingsModule } from '../modules/button-settings';
import type { IssueReportingModule } from '../modules/issue-reporting';
import { ICONS } from './icons';
import { widgetStyles } from './styles';

/** Category definition for accordion sections */
interface Category {
  id: string;
  title: string;
  icon: string;
  moduleIds: string[];
}

const CATEGORIES: Category[] = [
  {
    id: 'content',
    title: 'תוכן וקריאות',
    icon: ICONS.catContent,
    moduleIds: [
      'text-resizer',
      'line-height',
      'word-spacing',
      'letter-spacing',
      'readable-font',
      'text-alignment',
      'highlight-hover',
      'reading-guide',
      'hide-images',
    ],
  },
  {
    id: 'vision',
    title: 'צבעים וראייה',
    icon: ICONS.catVision,
    moduleIds: [
      'contrast',
      'saturation',
      'daltonization',
      'links-highlighter',
      'big-cursor',
      'magnifier',
    ],
  },
  {
    id: 'navigation',
    title: 'ניווט ופוקוס',
    icon: ICONS.catNavigation,
    moduleIds: [
      'virtual-keyboard',
      'focus-indicator',
      'skip-to-content',
      'animation-stopper',
      'screen-reader',
      'aria-enhancer',
    ],
  },
];

export class WidgetUI {
  private shadow!: ShadowRoot;
  private host!: HTMLElement;
  private panel!: HTMLElement;
  private backdrop!: HTMLElement;
  private trigger!: HTMLElement;
  private bodyEl!: HTMLElement;
  private profileGrid!: HTMLElement;
  private isOpen = false;

  // Modal elements
  private modalOverlay!: HTMLElement;
  private modalDialog!: HTMLElement;
  private modalBody!: HTMLElement;
  private modalTitleEl!: HTMLElement;

  // Track currently expanded controls card (only one at a time)
  private expandedModuleId: string | null = null;

  private engine: AccessibilityEngine;
  private profileManager: ProfileManager;

  constructor(engine: AccessibilityEngine, profileManager: ProfileManager) {
    this.engine = engine;
    this.profileManager = profileManager;

    // When a profile changes externally, rebuild UI
    this.profileManager.onChange(() => this.rebuildBody());
  }

  mount(): void {
    // Create host element
    this.host = document.createElement('div');
    this.host.id = 'a11y-widget-root';
    document.body.appendChild(this.host);

    // Attach Shadow DOM
    this.shadow = this.host.attachShadow({ mode: 'closed' });

    // Inject scoped styles
    const style = document.createElement('style');
    style.textContent = widgetStyles;
    this.shadow.appendChild(style);

    this.buildBackdrop();
    this.buildModal();
    this.buildPanel();
    this.buildTrigger();

    // Wire up button settings apply callback
    const btnMod = this.engine.getModule('button-settings') as
      | ButtonSettingsModule
      | undefined;
    if (btnMod) {
      btnMod.onApply(() => this.applyTriggerSettings());
      this.applyTriggerSettings();
    }

    // Always-on keyboard navigation enhancement
    this.injectKeyboardNav();
  }

  /* ====== Backdrop ====== */
  private buildBackdrop(): void {
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'a11y-backdrop';
    this.backdrop.addEventListener('click', () => this.close());
    this.shadow.appendChild(this.backdrop);
  }

  /* ====== Reusable Modal ====== */
  private buildModal(): void {
    this.modalOverlay = document.createElement('div');
    this.modalOverlay.className = 'a11y-modal-overlay';
    this.modalOverlay.addEventListener('click', (e) => {
      if (e.target === this.modalOverlay) this.closeModal();
    });

    this.modalDialog = document.createElement('div');
    this.modalDialog.className = 'a11y-modal';
    this.modalDialog.setAttribute('role', 'dialog');
    this.modalDialog.setAttribute('aria-modal', 'true');

    // Modal header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'a11y-modal-header';

    this.modalTitleEl = document.createElement('h3');
    this.modalTitleEl.className = 'a11y-modal-title';

    const modalCloseBtn = document.createElement('button');
    modalCloseBtn.className = 'a11y-close-btn';
    modalCloseBtn.innerHTML = '&times;';
    modalCloseBtn.setAttribute('aria-label', 'סגור');
    modalCloseBtn.addEventListener('click', () => this.closeModal());

    modalHeader.append(this.modalTitleEl, modalCloseBtn);

    // Modal body
    this.modalBody = document.createElement('div');
    this.modalBody.className = 'a11y-modal-body';

    this.modalDialog.append(modalHeader, this.modalBody);
    this.modalOverlay.appendChild(this.modalDialog);
    this.shadow.appendChild(this.modalOverlay);
  }

  private openModal(title: string): HTMLElement {
    this.modalTitleEl.textContent = title;
    this.modalBody.innerHTML = '';
    this.modalOverlay.classList.add('visible');
    this.modalDialog.setAttribute('aria-label', title);

    // Focus trap: focus the modal dialog
    this.modalDialog.setAttribute('tabindex', '-1');
    this.modalDialog.focus();

    return this.modalBody;
  }

  private closeModal(): void {
    this.modalOverlay.classList.remove('visible');
    this.modalBody.innerHTML = '';
  }

  /* ====== Side Panel ====== */
  private buildPanel(): void {
    this.panel = document.createElement('aside');
    this.panel.className = 'a11y-panel';
    this.panel.setAttribute('role', 'dialog');
    this.panel.setAttribute('aria-label', 'Accessibility settings');

    // Header
    const header = document.createElement('div');
    header.className = 'a11y-panel-header';

    const title = document.createElement('h2');
    title.className = 'a11y-panel-title';
    title.textContent = 'נגישות';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'a11y-close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'סגור');
    closeBtn.addEventListener('click', () => this.close());

    header.append(title, closeBtn);

    // Body
    this.bodyEl = document.createElement('div');
    this.bodyEl.className = 'a11y-panel-body';

    this.buildBodyContent();

    // Footer – reset all
    const footer = document.createElement('div');
    footer.className = 'a11y-panel-footer';
    const resetBtn = document.createElement('button');
    resetBtn.className = 'a11y-reset-all';
    resetBtn.textContent = 'איפוס הכל';
    resetBtn.addEventListener('click', () => {
      this.profileManager.clearAll();
      this.expandedModuleId = null;
      this.rebuildBody();
    });
    footer.appendChild(resetBtn);

    this.panel.append(header, this.bodyEl, footer);
    this.shadow.appendChild(this.panel);
  }

  /* ====== Body Content ====== */
  private buildBodyContent(): void {
    // --- Smart Profiles Section ---
    const profilesSection = document.createElement('div');
    profilesSection.className = 'a11y-profiles-section';

    const profilesTitle = document.createElement('h3');
    profilesTitle.className = 'a11y-section-title';
    profilesTitle.textContent = 'פרופילים חכמים';
    profilesSection.appendChild(profilesTitle);

    this.profileGrid = document.createElement('div');
    this.profileGrid.className = 'a11y-profile-grid';
    this.buildProfileButtons();
    profilesSection.appendChild(this.profileGrid);

    this.bodyEl.appendChild(profilesSection);

    // --- Divider ---
    this.bodyEl.appendChild(this.createDivider());

    // --- Categorized Accordion Sections ---
    for (const cat of CATEGORIES) {
      this.bodyEl.appendChild(this.buildAccordionSection(cat));
    }

    // --- Divider ---
    this.bodyEl.appendChild(this.createDivider());

    // --- Advanced Color Settings Section (collapsible) ---
    this.bodyEl.appendChild(this.buildColorSettingsSection());

    // --- Divider ---
    this.bodyEl.appendChild(this.createDivider());

    // --- Button Settings Section (collapsible) ---
    this.bodyEl.appendChild(this.buildButtonSettingsSection());

    // --- Divider ---
    this.bodyEl.appendChild(this.createDivider());

    // --- Legal & Support Section ---
    this.bodyEl.appendChild(this.buildLegalSection());
  }

  /* ====== Profile Buttons ====== */
  private buildProfileButtons(): void {
    this.profileGrid.innerHTML = '';
    const activeId = this.profileManager.getActiveProfileId();

    for (const profile of this.profileManager.getProfiles()) {
      const btn = document.createElement('button');
      btn.className = 'a11y-profile-btn';
      if (profile.id === activeId) {
        btn.classList.add('active');
      }

      const icon = document.createElement('span');
      icon.className = 'a11y-profile-icon';
      icon.innerHTML = profile.icon;

      const name = document.createElement('span');
      name.className = 'a11y-profile-name';
      name.textContent = profile.name;

      btn.append(icon, name);
      btn.setAttribute('aria-label', profile.name);
      btn.setAttribute('aria-pressed', String(profile.id === activeId));

      btn.addEventListener('click', () => {
        this.profileManager.activateProfile(profile.id);
        this.expandedModuleId = null;
        this.rebuildBody();
      });

      this.profileGrid.appendChild(btn);
    }
  }

  /* ====== Accordion Section ====== */
  private buildAccordionSection(cat: Category): HTMLElement {
    const section = document.createElement('div');
    section.className = 'a11y-accordion';

    // Count active modules in this category
    const activeCount = cat.moduleIds.reduce((n, id) => {
      const mod = this.engine.getModule(id);
      return mod && mod.getState().enabled ? n + 1 : n;
    }, 0);

    // Header button
    const headerBtn = document.createElement('button');
    headerBtn.className = 'a11y-accordion-header';
    headerBtn.setAttribute('aria-expanded', 'false');

    const headerLeft = document.createElement('span');
    headerLeft.className = 'a11y-accordion-title';
    headerLeft.innerHTML = `<span class="a11y-accordion-icon">${cat.icon}</span> ${cat.title}`;

    const headerRight = document.createElement('span');
    headerRight.className = 'a11y-accordion-meta';

    if (activeCount > 0) {
      const badge = document.createElement('span');
      badge.className = 'a11y-active-count';
      badge.textContent = String(activeCount);
      headerRight.appendChild(badge);
    }

    const chevron = document.createElement('span');
    chevron.className = 'a11y-accordion-chevron';
    chevron.innerHTML = '&#9660;';
    headerRight.appendChild(chevron);

    headerBtn.append(headerLeft, headerRight);

    // Content panel — now uses feature grid
    const content = document.createElement('div');
    content.className = 'a11y-accordion-content';
    content.style.display = 'none';

    const grid = document.createElement('div');
    grid.className = 'a11y-feature-grid';

    for (const modId of cat.moduleIds) {
      const mod = this.engine.getModule(modId);
      if (!mod) continue;
      grid.appendChild(this.buildFeatureCard(mod, grid));
    }

    content.appendChild(grid);

    // Toggle accordion
    headerBtn.addEventListener('click', () => {
      const isExpanded = content.style.display !== 'none';
      content.style.display = isExpanded ? 'none' : 'block';
      headerBtn.setAttribute('aria-expanded', String(!isExpanded));
      section.classList.toggle('open', !isExpanded);
    });

    section.append(headerBtn, content);
    return section;
  }

  /* ====== Check if module has sub-controls ====== */
  private moduleHasControls(mod: AccessibilityModule): boolean {
    const probe = document.createElement('div');
    mod.renderControls(probe);
    return probe.children.length > 0;
  }

  /* ====== Feature Card (Grid "Cube") ====== */
  private buildFeatureCard(mod: AccessibilityModule, grid: HTMLElement): HTMLElement {
    const isAriaEnhancer = mod.id === 'aria-enhancer';
    const isEnabled = mod.getState().enabled;
    const hasControls = this.moduleHasControls(mod);

    const card = document.createElement('button');
    card.className = 'a11y-feature-card';
    card.setAttribute('type', 'button');
    card.setAttribute('aria-pressed', String(isEnabled));
    card.setAttribute('aria-label', mod.name);

    if (isEnabled) card.classList.add('active');
    if (isAriaEnhancer) card.classList.add('a11y-aria-card');

    // ARIA badge (always-active indicator)
    if (isAriaEnhancer) {
      const badge = document.createElement('span');
      badge.className = 'a11y-aria-badge';
      badge.textContent = 'פעיל';
      badge.title = 'תיקוני נגישות בסיסיים פועלים אוטומטית';
      card.appendChild(badge);
    }

    // Icon
    const iconEl = document.createElement('span');
    iconEl.className = 'a11y-feature-card-icon';
    iconEl.innerHTML = mod.icon;

    // Label
    const labelEl = document.createElement('span');
    labelEl.className = 'a11y-feature-card-label';
    labelEl.textContent = mod.name;

    card.append(iconEl, labelEl);

    card.addEventListener('click', () => {
      // Always toggle the module on/off on card click
      this.engine.toggleModule(mod.id);
      this.profileManager.markCustom();
      const nowEnabled = mod.getState().enabled;
      card.classList.toggle('active', nowEnabled);
      card.setAttribute('aria-pressed', String(nowEnabled));

      // If the module has sub-controls, also open/close the controls panel
      if (hasControls) {
        if (nowEnabled) {
          // Open controls when activating (if not already open)
          if (this.expandedModuleId !== mod.id) {
            this.toggleExpandedControls(mod, card, grid);
          }
        } else {
          // Close controls when deactivating
          if (this.expandedModuleId === mod.id) {
            const existingPanel = grid.querySelector('.a11y-expanded-controls');
            if (existingPanel) existingPanel.remove();
            this.expandedModuleId = null;
          }
        }
      }
    });

    return card;
  }

  /* ====== Toggle Expanded Controls Panel ====== */
  private toggleExpandedControls(
    mod: AccessibilityModule,
    card: HTMLElement,
    grid: HTMLElement,
  ): void {
    // Remove any existing expanded panel
    const existingPanel = grid.querySelector('.a11y-expanded-controls');
    if (existingPanel) existingPanel.remove();

    // If same module clicked again — just collapse
    if (this.expandedModuleId === mod.id) {
      this.expandedModuleId = null;
      return;
    }

    // Build expanded controls panel
    this.expandedModuleId = mod.id;

    const panel = document.createElement('div');
    panel.className = 'a11y-expanded-controls';

    // Header row: title + close button
    const header = document.createElement('div');
    header.className = 'a11y-expanded-header';

    const title = document.createElement('span');
    title.className = 'a11y-expanded-title';
    title.innerHTML = `<span class="a11y-expanded-title-icon">${mod.icon}</span> ${mod.name}`;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'a11y-expanded-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'סגור הגדרות');
    closeBtn.addEventListener('click', () => {
      panel.remove();
      this.expandedModuleId = null;
    });

    header.append(title, closeBtn);
    panel.appendChild(header);

    // ARIA hint for aria-enhancer
    if (mod.id === 'aria-enhancer') {
      const hint = document.createElement('div');
      hint.className = 'a11y-aria-hint';
      hint.textContent =
        'תיקוני נגישות בסיסיים פועלים אוטומטית. לחצן זה מפעיל אופטימיזציה מבנית מתקדמת.';
      panel.appendChild(hint);
    }

    // Controls container — sub-controls update card active state on change
    const controlsContainer = document.createElement('div');
    const syncState = () => {
      this.engine.saveModuleState(mod.id);
      const nowEnabled = mod.getState().enabled;
      card.classList.toggle('active', nowEnabled);
      card.setAttribute('aria-pressed', String(nowEnabled));
    };
    mod.renderControls(controlsContainer, syncState);
    panel.appendChild(controlsContainer);

    // Insert expanded panel into grid — it spans full width via CSS grid-column: 1 / -1
    // Place it after the last card in this card's row
    const cards = Array.from(grid.querySelectorAll('.a11y-feature-card'));
    const cardIndex = cards.indexOf(card);

    if (cardIndex >= 0) {
      const columnsCount = 3;
      const rowEnd = Math.ceil((cardIndex + 1) / columnsCount) * columnsCount;
      const insertAfterIndex = Math.min(rowEnd - 1, cards.length - 1);
      const insertAfterCard = cards[insertAfterIndex];

      if (insertAfterCard && insertAfterCard.nextSibling) {
        grid.insertBefore(panel, insertAfterCard.nextSibling);
      } else {
        grid.appendChild(panel);
      }
    } else {
      grid.appendChild(panel);
    }
  }

  /* ====== Collapsible Section Helper ====== */
  private buildCollapsible(
    title: string,
    icon: string,
    buildContent: (body: HTMLElement) => void,
  ): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'a11y-collapsible';

    const headerBtn = document.createElement('button');
    headerBtn.className = 'a11y-collapsible-header';
    headerBtn.setAttribute('aria-expanded', 'false');

    const titleSpan = document.createElement('span');
    titleSpan.className = 'a11y-collapsible-title';
    titleSpan.innerHTML = `<span class="a11y-collapsible-title-icon">${icon}</span> ${title}`;

    const chevron = document.createElement('span');
    chevron.className = 'a11y-collapsible-chevron';
    chevron.innerHTML = '&#9660;';

    headerBtn.append(titleSpan, chevron);

    const body = document.createElement('div');
    body.className = 'a11y-collapsible-body';
    body.style.display = 'none';

    buildContent(body);

    headerBtn.addEventListener('click', () => {
      const isExpanded = body.style.display !== 'none';
      body.style.display = isExpanded ? 'none' : 'block';
      headerBtn.setAttribute('aria-expanded', String(!isExpanded));
      wrapper.classList.toggle('open', !isExpanded);
    });

    wrapper.append(headerBtn, body);
    return wrapper;
  }

  /* ====== Advanced Color Settings Section ====== */
  private buildColorSettingsSection(): HTMLElement {
    return this.buildCollapsible(
      'הגדרות צבעים מתקדמות',
      ICONS.colorPalette,
      (body) => {
        const colorMod = this.engine.getModule('advanced-colors') as
          | AdvancedColorModule
          | undefined;
        if (colorMod) {
          colorMod.buildSection(body, () => {
            this.engine.saveModuleState('advanced-colors');
            this.profileManager.markCustom();
          });
        }
      },
    );
  }

  /* ====== Button Settings Section ====== */
  private buildButtonSettingsSection(): HTMLElement {
    return this.buildCollapsible(
      'הגדרות כפתור הנגישות',
      ICONS.buttonSettings,
      (body) => {
        const btnMod = this.engine.getModule('button-settings') as
          | ButtonSettingsModule
          | undefined;
        if (btnMod) {
          btnMod.buildSection(body, () => {
            this.engine.saveModuleState('button-settings');
          });
        }
      },
    );
  }

  /* ====== Legal & Support Section ====== */
  private buildLegalSection(): HTMLElement {
    const section = document.createElement('div');
    section.className = 'a11y-legal-section';

    const title = document.createElement('h3');
    title.className = 'a11y-section-title';
    title.textContent = 'משפטי וסיוע';
    section.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'a11y-legal-grid';

    // Accessibility Statement button
    const statementMod = this.engine.getModule('accessibility-statement');
    if (statementMod) {
      const statementBtn = document.createElement('button');
      statementBtn.className = 'a11y-legal-btn';
      statementBtn.setAttribute('aria-label', statementMod.name);
      statementBtn.innerHTML =
        `<span class="a11y-legal-icon">${statementMod.icon}</span>` +
        `<span class="a11y-legal-label">${statementMod.name}</span>`;
      statementBtn.addEventListener('click', () => {
        statementMod.activate();
        // Immediately deactivate since it's a one-shot action
        statementMod.deactivate();
      });
      grid.appendChild(statementBtn);
    }

    // Issue Reporting button
    const reportMod = this.engine.getModule('issue-reporting') as IssueReportingModule | undefined;
    if (reportMod) {
      const reportBtn = document.createElement('button');
      reportBtn.className = 'a11y-legal-btn a11y-legal-btn-report';
      reportBtn.setAttribute('aria-label', reportMod.name);
      reportBtn.innerHTML =
        `<span class="a11y-legal-icon">${reportMod.icon}</span>` +
        `<span class="a11y-legal-label">${reportMod.name}</span>`;
      reportBtn.addEventListener('click', () => {
        const body = this.openModal('דיווח על תקלת נגישות');
        reportMod.buildForm(body, () => this.closeModal());
      });
      grid.appendChild(reportBtn);
    }

    section.appendChild(grid);
    return section;
  }

  /* ====== Helpers ====== */
  private createDivider(): HTMLElement {
    const divider = document.createElement('div');
    divider.className = 'a11y-section-divider';
    return divider;
  }

  private rebuildBody(): void {
    this.bodyEl.innerHTML = '';
    this.buildBodyContent();
  }

  /* ====== Floating Trigger Button (draggable) ====== */
  private buildTrigger(): void {
    this.trigger = document.createElement('button');
    this.trigger.className = 'a11y-trigger';
    this.trigger.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" fill="currentColor" class="a11y-trigger-icon"><circle cx="240" cy="80" r="50"/><path d="M195 155h90v130h75l-60 150h-55l35-90H195z"/><circle cx="250" cy="380" r="90" fill="none" stroke="currentColor" stroke-width="40"/></svg>`;
    this.trigger.setAttribute('aria-label', 'Open accessibility menu');

    let isDragging = false;
    let hasMoved = false;
    let startX = 0;
    let startY = 0;
    let origX = 0;
    let origY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      hasMoved = false;
      startX = e.clientX;
      startY = e.clientY;
      const rect = this.trigger.getBoundingClientRect();
      origX = rect.left;
      origY = rect.top;
      this.trigger.classList.add('dragging');
      this.trigger.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) hasMoved = true;
      if (!hasMoved) return;

      const newX = origX + dx;
      const newY = origY + dy;

      this.trigger.style.right = 'auto';
      this.trigger.style.bottom = 'auto';
      this.trigger.style.left = `${newX}px`;
      this.trigger.style.top = `${newY}px`;
    };

    const onPointerUp = () => {
      isDragging = false;
      this.trigger.classList.remove('dragging');
      if (!hasMoved) {
        this.toggle();
      }
    };

    this.trigger.addEventListener('pointerdown', onPointerDown);
    this.trigger.addEventListener('pointermove', onPointerMove);
    this.trigger.addEventListener('pointerup', onPointerUp);

    this.shadow.appendChild(this.trigger);
  }

  /* ====== Always-on Keyboard Navigation ====== */
  private injectKeyboardNav(): void {
    // Inject global styles for keyboard focus visibility into the HOST page (not shadow DOM)
    const styleId = 'a11y-keyboard-nav-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Show clear focus outlines when navigating with keyboard */
      html.a11y-keyboard-user *:focus-visible {
        outline: 3px solid #1a73e8 !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 4px rgba(26, 115, 232, 0.2) !important;
      }
      /* Ensure common interactive elements are reachable via Tab */
      a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]),
      summary, details, [role="button"], [role="link"], [role="tab"] {
        outline-color: #1a73e8;
      }
    `;
    document.head.appendChild(style);

    // Detect keyboard vs mouse usage to toggle focus styles
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.documentElement.classList.add('a11y-keyboard-user');
      }
    });

    document.addEventListener('mousedown', () => {
      document.documentElement.classList.remove('a11y-keyboard-user');
    });
  }

  /* ====== Apply Trigger Button Settings ====== */
  private applyTriggerSettings(): void {
    const btnMod = this.engine.getModule('button-settings') as
      | ButtonSettingsModule
      | undefined;
    if (!btnMod) return;

    // Position
    const pos = btnMod.getPosition();
    if (pos === 'left') {
      this.trigger.style.right = 'auto';
      this.trigger.style.left = '24px';
    } else {
      this.trigger.style.left = 'auto';
      this.trigger.style.right = '24px';
    }

    // Style (SVG)
    this.trigger.innerHTML = btnMod.getTriggerSVG();

    // Size
    const { btn, icon } = btnMod.getSizeValues();
    this.trigger.style.width = `${btn}px`;
    this.trigger.style.height = `${btn}px`;
    const iconEl = this.trigger.querySelector('.a11y-trigger-icon') as
      | SVGElement
      | null;
    if (iconEl) {
      iconEl.style.width = `${icon}px`;
      iconEl.style.height = `${icon}px`;
    }
  }

  /* ====== Open / Close ====== */
  private toggle(): void {
    this.isOpen ? this.close() : this.open();
  }

  private open(): void {
    this.isOpen = true;
    this.panel.classList.add('open');
    this.backdrop.classList.add('visible');
  }

  private close(): void {
    this.isOpen = false;
    this.panel.classList.remove('open');
    this.backdrop.classList.remove('visible');
  }
}
