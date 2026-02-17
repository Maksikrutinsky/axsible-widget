export const widgetStyles = /* css */ `
  /* ============================================
     Design System: Professional Tech Blue
     ============================================ */
  :host {
    all: initial;
    --brand-primary: #3B82F6;
    --brand-primary-hover: #2563EB;
    --brand-primary-light: #DBEAFE;
    --brand-light: #EFF6FF;
    --bg-main: #F8FAFC;
    --bg-card: #FFFFFF;
    --text-dark: #1E293B;
    --text-muted: #64748B;
    --text-light: #94A3B8;
    --border-color: #E2E8F0;
    --border-radius: 12px;
    --border-radius-sm: 8px;
    --shadow-subtle: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
    --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    --shadow-hover: 0 8px 16px -4px rgba(59, 130, 246, 0.15);
    --transition-fast: 0.15s ease;
    --transition-normal: 0.2s ease;
    --danger: #EF4444;
    --danger-light: #FEE2E2;
    --success: #22C55E;
    --success-light: #DCFCE7;
    --warning-border: #FBBF24;
    --warning-light: #FFFBEB;

    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, sans-serif;
    font-size: 16px;
    direction: rtl;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* ============================================
     Floating Trigger Button
     ============================================ */
  .a11y-trigger {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 2147483647;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: none;
    background: var(--brand-primary);
    color: #fff;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(59, 130, 246, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform var(--transition-normal), box-shadow var(--transition-normal);
    user-select: none;
    touch-action: none;
    padding: 0;
    overflow: hidden;
  }

  .a11y-trigger-icon {
    width: 34px;
    height: 34px;
  }

  .a11y-trigger:hover {
    transform: scale(1.08);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.45);
  }

  .a11y-trigger:focus-visible {
    outline: 3px solid #fff;
    outline-offset: 3px;
  }

  .a11y-trigger.dragging {
    cursor: grabbing;
    transition: none;
  }

  /* ============================================
     Side Panel Shell
     ============================================ */
  .a11y-panel {
    position: fixed;
    top: 0;
    right: -440px;
    z-index: 2147483646;
    width: 420px;
    height: 100vh;
    background: var(--bg-main);
    box-shadow: -4px 0 24px rgba(0, 0, 0, 0.08);
    transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    direction: rtl;
  }

  .a11y-panel.open {
    right: 0;
  }

  /* ============================================
     Panel Header (Solid Blue)
     ============================================ */
  .a11y-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: var(--brand-primary);
    color: #fff;
    flex-shrink: 0;
  }

  .a11y-panel-title {
    font-size: 17px;
    font-weight: 600;
    color: #fff;
    letter-spacing: 0.01em;
  }

  .a11y-close-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.15);
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    transition: background var(--transition-fast);
    line-height: 1;
  }

  .a11y-close-btn:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  .a11y-close-btn:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }

  /* ============================================
     Panel Body (Scrollable Area)
     ============================================ */
  .a11y-panel-body {
    padding: 16px;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    background: var(--bg-main);
  }

  /* ============================================
     Section Titles & Dividers
     ============================================ */
  .a11y-section-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 10px;
    padding: 0 4px;
  }

  .a11y-section-divider {
    height: 1px;
    background: var(--border-color);
    margin: 16px 0;
  }

  /* ============================================
     Profiles Section
     ============================================ */
  .a11y-profiles-section {
    margin-bottom: 4px;
  }

  .a11y-profile-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .a11y-profile-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 12px 4px;
    border-radius: var(--border-radius);
    border: 2px solid var(--border-color);
    background: var(--bg-card);
    cursor: pointer;
    transition: all var(--transition-normal);
    min-height: 72px;
  }

  .a11y-profile-btn:hover {
    border-color: var(--brand-primary);
    background: var(--brand-light);
    transform: translateY(-1px);
    box-shadow: var(--shadow-hover);
  }

  .a11y-profile-btn:focus-visible {
    outline: 2px solid var(--brand-primary);
    outline-offset: 2px;
  }

  .a11y-profile-btn.active {
    background: var(--brand-primary);
    border-color: var(--brand-primary);
    color: #fff;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  .a11y-profile-btn.active:hover {
    background: var(--brand-primary-hover);
    border-color: var(--brand-primary-hover);
  }

  .a11y-profile-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    color: var(--text-dark);
  }

  .a11y-profile-icon svg {
    width: 24px;
    height: 24px;
  }

  .a11y-profile-btn.active .a11y-profile-icon {
    color: #fff;
  }

  .a11y-profile-name {
    font-size: 10px;
    font-weight: 600;
    text-align: center;
    line-height: 1.2;
  }

  /* ============================================
     Accordion (Category Sections)
     ============================================ */
  .a11y-accordion {
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    margin-bottom: 8px;
    overflow: hidden;
    background: var(--bg-card);
    box-shadow: var(--shadow-subtle);
  }

  .a11y-accordion-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px;
    border: none;
    background: var(--bg-card);
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-dark);
    transition: background var(--transition-fast);
    text-align: right;
  }

  .a11y-accordion-header:hover {
    background: var(--brand-light);
  }

  .a11y-accordion-header:focus-visible {
    outline: 2px solid var(--brand-primary);
    outline-offset: -2px;
  }

  .a11y-accordion-title {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .a11y-accordion-meta {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .a11y-active-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: 10px;
    background: var(--brand-primary);
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    line-height: 1;
  }

  .a11y-accordion-chevron {
    font-size: 9px;
    color: var(--text-light);
    transition: transform var(--transition-normal);
  }

  .a11y-accordion.open .a11y-accordion-chevron {
    transform: rotate(180deg);
  }

  .a11y-accordion-content {
    padding: 4px 8px 8px;
    background: var(--bg-main);
  }

  /* ============================================
     Feature Card Grid (The "Cubes")
     ============================================ */
  .a11y-feature-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .a11y-feature-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 4px;
    aspect-ratio: 1 / 0.85;
    border-radius: var(--border-radius);
    border: 2px solid transparent;
    background: var(--bg-card);
    cursor: pointer;
    transition: all var(--transition-normal);
    box-shadow: var(--shadow-subtle);
    position: relative;
    text-align: center;
    min-width: 0;
  }

  .a11y-feature-card:hover {
    border-color: var(--brand-primary);
    box-shadow: var(--shadow-hover);
    transform: translateY(-2px);
  }

  .a11y-feature-card:focus-visible {
    outline: 2px solid var(--brand-primary);
    outline-offset: 2px;
  }

  .a11y-feature-card.active {
    border-color: var(--brand-primary);
    background: var(--brand-light);
    box-shadow: var(--shadow-hover);
  }

  .a11y-feature-card-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    color: var(--text-dark);
    transition: color var(--transition-fast);
  }

  .a11y-feature-card-icon svg {
    width: 28px;
    height: 28px;
  }

  .a11y-feature-card.active .a11y-feature-card-icon {
    color: var(--brand-primary);
  }

  .a11y-feature-card-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-dark);
    line-height: 1.3;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ARIA Enhancer special card */
  .a11y-feature-card.a11y-aria-card {
    border-color: var(--success);
    background: var(--success-light);
  }

  .a11y-feature-card.a11y-aria-card .a11y-feature-card-icon {
    color: var(--success);
  }

  /* Accordion category header icon */
  .a11y-accordion-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    color: var(--text-muted);
  }

  .a11y-accordion-icon svg {
    width: 18px;
    height: 18px;
  }

  /* Expanded controls title icon */
  .a11y-expanded-title-icon {
    display: inline-flex;
    align-items: center;
    width: 18px;
    height: 18px;
    color: var(--brand-primary);
  }

  .a11y-expanded-title-icon svg {
    width: 16px;
    height: 16px;
  }

  .a11y-aria-badge {
    position: absolute;
    top: 6px;
    left: 6px;
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 2px 6px;
    border-radius: 8px;
    background: var(--success);
    color: #fff;
    font-size: 9px;
    font-weight: 700;
    line-height: 1;
  }

  .a11y-aria-badge::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #fff;
  }

  /* ============================================
     Expanded Controls (below grid, full-width)
     ============================================ */
  .a11y-expanded-controls {
    grid-column: 1 / -1;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 14px;
    box-shadow: var(--shadow-subtle);
    overflow: hidden;
    min-width: 0;
  }

  .a11y-expanded-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .a11y-expanded-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-dark);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .a11y-expanded-close {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: none;
    background: var(--bg-main);
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    transition: background var(--transition-fast);
    line-height: 1;
  }

  .a11y-expanded-close:hover {
    background: var(--border-color);
  }

  /* ARIA hint text */
  .a11y-aria-hint {
    font-size: 11px;
    color: var(--text-muted);
    line-height: 1.5;
    padding: 0 2px;
    margin-top: 4px;
  }

  /* ============================================
     Module Controls (inside expanded area)
     ============================================ */
  .a11y-module-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    max-width: 100%;
  }

  .a11y-btn {
    padding: 6px 12px;
    border-radius: var(--border-radius-sm);
    border: 1px solid var(--border-color);
    background: var(--bg-card);
    color: var(--text-dark);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .a11y-btn:hover {
    background: var(--brand-light);
    border-color: var(--brand-primary);
  }

  .a11y-btn-active {
    background: var(--brand-primary);
    color: #fff;
    border-color: var(--brand-primary);
  }

  .a11y-btn-active:hover {
    background: var(--brand-primary-hover);
    border-color: var(--brand-primary-hover);
  }

  .a11y-btn-reset {
    margin-right: auto;
    color: var(--danger);
    border-color: var(--danger);
  }

  .a11y-btn-reset:hover {
    background: var(--danger-light);
  }

  .a11y-size-label {
    font-size: 14px;
    font-weight: 700;
    color: var(--brand-primary);
    min-width: 44px;
    text-align: center;
  }

  /* ============================================
     Slider Controls
     ============================================ */
  .a11y-slider-control {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .a11y-slider-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-muted);
  }

  .a11y-range {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 6px;
    background: var(--border-color);
    border-radius: 3px;
    outline: none;
    cursor: pointer;
  }

  .a11y-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--brand-primary);
    border: 2px solid #fff;
    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
    cursor: pointer;
    transition: transform var(--transition-fast);
  }

  .a11y-range::-webkit-slider-thumb:hover {
    transform: scale(1.15);
  }

  .a11y-range::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--brand-primary);
    border: 2px solid #fff;
    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
    cursor: pointer;
  }

  .a11y-range:focus-visible {
    outline: 2px solid var(--brand-primary);
    outline-offset: 2px;
  }

  /* ============================================
     Toggle Switch (used in expanded controls)
     ============================================ */
  .a11y-toggle {
    position: relative;
    width: 40px;
    height: 22px;
    flex-shrink: 0;
  }

  .a11y-toggle input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .a11y-toggle-slider {
    position: absolute;
    cursor: pointer;
    inset: 0;
    background: var(--text-light);
    border-radius: 22px;
    transition: background var(--transition-normal);
  }

  .a11y-toggle-slider::before {
    content: '';
    position: absolute;
    height: 16px;
    width: 16px;
    left: 3px;
    bottom: 3px;
    background: #fff;
    border-radius: 50%;
    transition: transform var(--transition-normal);
  }

  .a11y-toggle input:checked + .a11y-toggle-slider {
    background: var(--brand-primary);
  }

  .a11y-toggle input:checked + .a11y-toggle-slider::before {
    transform: translateX(18px);
  }

  .a11y-toggle input:focus-visible + .a11y-toggle-slider {
    outline: 2px solid var(--brand-primary);
    outline-offset: 2px;
  }

  /* ============================================
     Panel Footer
     ============================================ */
  .a11y-panel-footer {
    padding: 12px 16px;
    border-top: 1px solid var(--border-color);
    flex-shrink: 0;
    background: var(--bg-card);
  }

  .a11y-reset-all {
    width: 100%;
    padding: 10px;
    border-radius: var(--border-radius-sm);
    border: 1px solid var(--danger);
    background: var(--bg-card);
    color: var(--danger);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background var(--transition-fast);
  }

  .a11y-reset-all:hover {
    background: var(--danger-light);
  }

  .a11y-reset-all:focus-visible {
    outline: 2px solid var(--danger);
    outline-offset: 2px;
  }

  /* ============================================
     Legal & Support Section
     ============================================ */
  .a11y-legal-section {
    margin-top: 4px;
  }

  .a11y-legal-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .a11y-legal-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 8px;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    background: var(--bg-card);
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    color: var(--text-dark);
    transition: all var(--transition-fast);
    box-shadow: var(--shadow-subtle);
  }

  .a11y-legal-btn:hover {
    background: var(--brand-light);
    border-color: var(--brand-primary);
    transform: translateY(-1px);
  }

  .a11y-legal-btn:focus-visible {
    outline: 2px solid var(--brand-primary);
    outline-offset: 2px;
  }

  .a11y-legal-btn-report {
    border-color: var(--warning-border);
    background: var(--warning-light);
  }

  .a11y-legal-btn-report:hover {
    background: #FEF3C7;
    border-color: #F59E0B;
  }

  .a11y-legal-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    color: var(--text-dark);
  }

  .a11y-legal-icon svg {
    width: 24px;
    height: 24px;
  }

  .a11y-legal-label {
    text-align: center;
    line-height: 1.3;
  }

  /* ============================================
     Modal
     ============================================ */
  .a11y-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    background: rgba(15, 23, 42, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s;
    direction: rtl;
  }

  .a11y-modal-overlay.visible {
    opacity: 1;
    pointer-events: auto;
  }

  .a11y-modal {
    background: var(--bg-card);
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    width: 90%;
    max-width: 480px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transform: translateY(20px) scale(0.98);
    transition: transform 0.25s;
  }

  .a11y-modal-overlay.visible .a11y-modal {
    transform: translateY(0) scale(1);
  }

  .a11y-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-color);
    background: var(--brand-primary);
  }

  .a11y-modal-title {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
  }

  .a11y-modal-body {
    padding: 20px;
    overflow-y: auto;
    flex: 1;
  }

  /* ============================================
     Report Form
     ============================================ */
  .a11y-report-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .a11y-form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .a11y-form-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-dark);
  }

  .a11y-form-input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    font-size: 14px;
    font-family: inherit;
    color: var(--text-dark);
    background: var(--bg-card);
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
    direction: rtl;
  }

  .a11y-form-input:focus {
    outline: none;
    border-color: var(--brand-primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  }

  .a11y-form-textarea {
    resize: vertical;
    min-height: 80px;
  }

  .a11y-form-error {
    font-size: 12px;
    color: var(--danger);
    min-height: 16px;
  }

  .a11y-form-submit {
    width: 100%;
    padding: 11px;
    border-radius: var(--border-radius-sm);
    border: none;
    background: var(--brand-primary);
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background var(--transition-fast);
  }

  .a11y-form-submit:hover {
    background: var(--brand-primary-hover);
  }

  .a11y-form-submit:focus-visible {
    outline: 2px solid var(--brand-primary);
    outline-offset: 2px;
  }

  /* ============================================
     Thank You Message
     ============================================ */
  .a11y-report-thanks {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 24px 16px;
    gap: 12px;
  }

  .a11y-report-thanks-icon {
    font-size: 48px;
    line-height: 1;
  }

  .a11y-report-thanks-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-dark);
  }

  .a11y-report-thanks-msg {
    font-size: 14px;
    color: var(--text-muted);
    line-height: 1.5;
  }

  /* ============================================
     Backdrop
     ============================================ */
  .a11y-backdrop {
    position: fixed;
    inset: 0;
    z-index: 2147483645;
    background: rgba(15, 23, 42, 0.3);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
  }

  .a11y-backdrop.visible {
    opacity: 1;
    pointer-events: auto;
  }

  /* ============================================
     Advanced Color Settings Section
     ============================================ */
  .a11y-color-settings-section {
    margin-top: 4px;
  }

  .a11y-color-section {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .a11y-color-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 8px;
    border: 1px solid var(--border-color);
    border-bottom: none;
    background: var(--bg-card);
    gap: 8px;
  }

  .a11y-color-row:first-child {
    border-radius: var(--border-radius) var(--border-radius) 0 0;
  }

  .a11y-color-row:last-child {
    border-bottom: 1px solid var(--border-color);
    border-radius: 0 0 var(--border-radius) var(--border-radius);
  }

  .a11y-color-row-label {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
    min-width: 80px;
  }

  .a11y-color-row-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    color: var(--text-muted);
  }

  .a11y-color-row-icon svg {
    width: 18px;
    height: 18px;
  }

  .a11y-color-row-text {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-dark);
    white-space: nowrap;
  }

  .a11y-color-swatches {
    display: flex;
    align-items: center;
    gap: 5px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .a11y-color-swatch {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid transparent;
    cursor: pointer;
    transition: transform var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast);
    position: relative;
    padding: 0;
    flex-shrink: 0;
  }

  .a11y-color-swatch:hover {
    transform: scale(1.15);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .a11y-color-swatch:focus-visible {
    outline: 2px solid var(--brand-primary);
    outline-offset: 2px;
  }

  .a11y-color-swatch-bordered {
    border-color: var(--border-color);
  }

  .a11y-color-swatch.active {
    border-color: var(--text-dark);
    box-shadow: 0 0 0 1px var(--bg-card), 0 0 0 3px var(--text-dark);
  }

  .a11y-color-swatch.active::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%) rotate(45deg);
    width: 6px;
    height: 10px;
    border: solid #fff;
    border-width: 0 2px 2px 0;
  }

  .a11y-color-swatch-light.active::after {
    border-color: var(--text-dark);
  }

  /* ============================================
     Collapsible Section (used for Color Settings & Button Settings)
     ============================================ */
  .a11y-collapsible {
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    overflow: hidden;
    background: var(--bg-card);
    box-shadow: var(--shadow-subtle);
    max-width: 100%;
  }

  .a11y-collapsible-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px;
    border: none;
    background: var(--bg-card);
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-dark);
    transition: background var(--transition-fast);
    text-align: right;
  }

  .a11y-collapsible-header:hover {
    background: var(--brand-light);
  }

  .a11y-collapsible-header:focus-visible {
    outline: 2px solid var(--brand-primary);
    outline-offset: -2px;
  }

  .a11y-collapsible-title {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .a11y-collapsible-title-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    color: var(--text-muted);
  }

  .a11y-collapsible-title-icon svg {
    width: 18px;
    height: 18px;
  }

  .a11y-collapsible-chevron {
    font-size: 9px;
    color: var(--text-light);
    transition: transform var(--transition-normal);
  }

  .a11y-collapsible.open .a11y-collapsible-chevron {
    transform: rotate(180deg);
  }

  .a11y-collapsible-body {
    padding: 4px 10px 12px;
    background: var(--bg-main);
    border-top: 1px solid var(--border-color);
    overflow: hidden;
  }

  /* ============================================
     Button Settings Section
     ============================================ */
  .a11y-btnsettings-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 100%;
    overflow: hidden;
  }

  .a11y-btnsettings-subtitle {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    margin-top: 4px;
  }

  /* Position buttons */
  .a11y-btnsettings-pos-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .a11y-btnsettings-pos-btn {
    padding: 8px 12px;
    border-radius: var(--border-radius-sm);
    border: 2px solid var(--border-color);
    background: var(--bg-card);
    color: var(--text-dark);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .a11y-btnsettings-pos-btn:hover {
    border-color: var(--brand-primary);
    background: var(--brand-light);
  }

  .a11y-btnsettings-pos-btn:focus-visible {
    outline: 2px solid var(--brand-primary);
    outline-offset: 2px;
  }

  .a11y-btnsettings-pos-btn.active {
    background: var(--brand-primary);
    border-color: var(--brand-primary);
    color: #fff;
  }

  /* Style cards grid */
  .a11y-btnsettings-style-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
  }

  .a11y-btnsettings-style-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 8px 2px;
    border-radius: var(--border-radius-sm);
    border: 2px solid var(--border-color);
    background: var(--bg-card);
    cursor: pointer;
    transition: all var(--transition-normal);
    min-width: 0;
  }

  .a11y-btnsettings-style-card:hover {
    border-color: var(--brand-primary);
    box-shadow: var(--shadow-hover);
    transform: translateY(-1px);
  }

  .a11y-btnsettings-style-card:focus-visible {
    outline: 2px solid var(--brand-primary);
    outline-offset: 2px;
  }

  .a11y-btnsettings-style-card.active {
    border-color: var(--brand-primary);
    background: var(--brand-light);
    box-shadow: var(--shadow-hover);
  }

  .a11y-btnsettings-style-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    color: var(--text-dark);
  }

  .a11y-btnsettings-style-card.active .a11y-btnsettings-style-preview {
    color: var(--brand-primary);
  }

  .a11y-btnsettings-style-preview svg {
    width: 26px;
    height: 26px;
  }

  .a11y-btnsettings-style-label {
    font-size: 10px;
    font-weight: 600;
    color: var(--text-dark);
    text-align: center;
    line-height: 1.2;
  }

  /* Size buttons */
  .a11y-btnsettings-size-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .a11y-btnsettings-size-btn {
    padding: 8px 12px;
    border-radius: var(--border-radius-sm);
    border: 2px solid var(--border-color);
    background: var(--bg-card);
    color: var(--text-dark);
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .a11y-btnsettings-size-btn:hover {
    border-color: var(--brand-primary);
    background: var(--brand-light);
  }

  .a11y-btnsettings-size-btn:focus-visible {
    outline: 2px solid var(--brand-primary);
    outline-offset: 2px;
  }

  .a11y-btnsettings-size-btn.active {
    background: var(--brand-primary);
    border-color: var(--brand-primary);
    color: #fff;
  }

  /* ============================================
     Responsive — Mobile (viewport ≤ 480px)
     ============================================ */
  @media (max-width: 480px) {

    /* Panel: full-width overlay on mobile */
    .a11y-panel {
      width: 100vw;
      right: -110vw;
      height: 100vh;
      height: 100dvh;
    }

    .a11y-panel-body {
      padding: 12px;
    }

    .a11y-panel-header {
      padding: 14px 16px;
    }

    .a11y-panel-title {
      font-size: 16px;
    }

    .a11y-panel-footer {
      padding: 10px 12px;
    }

    /* Trigger: smaller on mobile, closer to edge */
    .a11y-trigger {
      bottom: 16px;
      right: 16px;
    }

    /* Profiles: 3 columns still works, just tighten */
    .a11y-profile-grid {
      gap: 6px;
    }

    .a11y-profile-btn {
      padding: 10px 2px;
      min-height: 64px;
      gap: 4px;
    }

    .a11y-profile-icon {
      width: 24px;
      height: 24px;
    }

    .a11y-profile-icon svg {
      width: 20px;
      height: 20px;
    }

    /* Feature cards: 3 cols with tighter spacing */
    .a11y-feature-grid {
      gap: 6px;
    }

    .a11y-feature-card {
      padding: 8px 2px;
      gap: 4px;
      border-radius: var(--border-radius-sm);
    }

    .a11y-feature-card-icon {
      width: 26px;
      height: 26px;
    }

    .a11y-feature-card-icon svg {
      width: 22px;
      height: 22px;
    }

    .a11y-feature-card-label {
      font-size: 10px;
    }

    .a11y-aria-badge {
      top: 3px;
      left: 3px;
      padding: 1px 4px;
      font-size: 8px;
    }

    /* Accordion: tighter */
    .a11y-accordion-header {
      padding: 10px 12px;
      font-size: 13px;
    }

    .a11y-accordion-content {
      padding: 4px 6px 6px;
    }

    /* Expanded controls */
    .a11y-expanded-controls {
      padding: 10px;
    }

    .a11y-expanded-title {
      font-size: 12px;
    }

    /* Collapsible: tighter */
    .a11y-collapsible-header {
      padding: 10px 12px;
      font-size: 13px;
    }

    .a11y-collapsible-body {
      padding: 4px 8px 10px;
    }

    /* Color settings rows */
    .a11y-color-row {
      padding: 8px 6px;
      gap: 6px;
    }

    .a11y-color-row-label {
      min-width: 70px;
    }

    .a11y-color-row-text {
      font-size: 12px;
    }

    .a11y-color-swatch {
      width: 22px;
      height: 22px;
    }

    .a11y-color-swatches {
      gap: 4px;
    }

    /* Button settings */
    .a11y-btnsettings-style-grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 4px;
    }

    .a11y-btnsettings-style-card {
      padding: 6px 1px;
      gap: 3px;
      border-radius: 6px;
    }

    .a11y-btnsettings-style-preview {
      width: 24px;
      height: 24px;
    }

    .a11y-btnsettings-style-preview svg {
      width: 22px;
      height: 22px;
    }

    .a11y-btnsettings-style-label {
      font-size: 9px;
    }

    .a11y-btnsettings-pos-row {
      gap: 6px;
    }

    .a11y-btnsettings-pos-btn {
      padding: 8px 8px;
      font-size: 12px;
    }

    .a11y-btnsettings-size-row {
      gap: 6px;
    }

    .a11y-btnsettings-size-btn {
      padding: 8px 8px;
      font-size: 13px;
    }

    /* Legal section */
    .a11y-legal-btn {
      padding: 12px 6px;
      font-size: 11px;
      gap: 6px;
    }

    .a11y-legal-icon {
      width: 24px;
      height: 24px;
    }

    .a11y-legal-icon svg {
      width: 20px;
      height: 20px;
    }

    /* Section dividers & titles */
    .a11y-section-divider {
      margin: 12px 0;
    }

    .a11y-section-title {
      font-size: 12px;
      margin-bottom: 8px;
    }

    /* Modal */
    .a11y-modal {
      width: 95%;
      max-height: 85vh;
      border-radius: 12px;
    }

    .a11y-modal-header {
      padding: 14px 16px;
    }

    .a11y-modal-title {
      font-size: 15px;
    }

    .a11y-modal-body {
      padding: 16px;
    }

    .a11y-form-input {
      padding: 10px;
      font-size: 16px; /* prevents iOS zoom on input focus */
    }
  }

  /* ============================================
     Responsive — Very small screens (≤ 360px)
     ============================================ */
  @media (max-width: 360px) {

    /* Feature grid: 2 columns on very narrow */
    .a11y-feature-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    /* Profile grid: 2 columns with scroll-like feel */
    .a11y-profile-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 4px;
    }

    .a11y-profile-btn {
      padding: 8px 1px;
      min-height: 56px;
    }

    .a11y-profile-name {
      font-size: 9px;
    }

    /* Color swatches smaller */
    .a11y-color-swatch {
      width: 20px;
      height: 20px;
    }

    .a11y-color-row-label {
      min-width: 60px;
    }

    .a11y-color-row-text {
      font-size: 11px;
    }

    /* Button style grid: 2x2 on very narrow */
    .a11y-btnsettings-style-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;
    }

    .a11y-btnsettings-style-card {
      padding: 10px 4px;
      gap: 4px;
    }

    .a11y-btnsettings-style-preview {
      width: 28px;
      height: 28px;
    }

    .a11y-btnsettings-style-preview svg {
      width: 26px;
      height: 26px;
    }

    .a11y-btnsettings-style-label {
      font-size: 10px;
    }

    .a11y-panel-body {
      padding: 10px;
    }
  }
`;
