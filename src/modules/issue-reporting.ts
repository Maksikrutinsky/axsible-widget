import type { AccessibilityModule, ModuleState } from '../core/types';
import { ICONS } from '../ui/icons';

export interface IssueReport {
  fullName: string;
  email: string;
  category: string;
  description: string;
  pageUrl: string;
  timestamp: string;
}

export class IssueReportingModule implements AccessibilityModule {
  readonly id = 'issue-reporting';
  readonly name = 'דיווח על תקלה';
  readonly icon = ICONS.issueReport;

  private enabled = false;

  init(): void {
    // noop
  }

  activate(): void {
    this.enabled = true;
  }

  deactivate(): void {
    this.enabled = false;
  }

  getState(): ModuleState {
    return { enabled: this.enabled, settings: {} };
  }

  setState(state: ModuleState): void {
    this.enabled = state.enabled;
  }

  /**
   * Builds the issue report form into the given container.
   * Call `onClose` to signal the modal should close.
   */
  buildForm(container: HTMLElement, onClose: () => void): void {
    container.innerHTML = '';

    const form = document.createElement('form');
    form.className = 'a11y-report-form';
    form.setAttribute('novalidate', '');

    // ── Full Name ──
    form.appendChild(this.createField('text', 'fullName', 'שם מלא', true));

    // ── Email ──
    form.appendChild(this.createField('email', 'email', 'אימייל', true));

    // ── Category ──
    const catGroup = document.createElement('div');
    catGroup.className = 'a11y-form-group';
    const catLabel = document.createElement('label');
    catLabel.className = 'a11y-form-label';
    catLabel.textContent = 'קטגוריה';
    catLabel.setAttribute('for', 'a11y-report-category');
    const select = document.createElement('select');
    select.className = 'a11y-form-input';
    select.id = 'a11y-report-category';
    select.name = 'category';
    select.required = true;

    const options = [
      { value: '', label: 'בחר קטגוריה...' },
      { value: 'navigation', label: 'ניווט' },
      { value: 'visual', label: 'ויזואלי' },
      { value: 'screen-reader', label: 'קורא מסך' },
      { value: 'other', label: 'אחר' },
    ];
    for (const opt of options) {
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.label;
      if (!opt.value) option.disabled = true;
      select.appendChild(option);
    }
    catGroup.append(catLabel, select);
    form.appendChild(catGroup);

    // ── Description ──
    const descGroup = document.createElement('div');
    descGroup.className = 'a11y-form-group';
    const descLabel = document.createElement('label');
    descLabel.className = 'a11y-form-label';
    descLabel.textContent = 'תיאור התקלה';
    descLabel.setAttribute('for', 'a11y-report-desc');
    const textarea = document.createElement('textarea');
    textarea.className = 'a11y-form-input a11y-form-textarea';
    textarea.id = 'a11y-report-desc';
    textarea.name = 'description';
    textarea.rows = 4;
    textarea.required = true;
    textarea.placeholder = 'תאר את הבעיה שנתקלת בה...';
    descGroup.append(descLabel, textarea);
    form.appendChild(descGroup);

    // ── Hidden page URL ──
    const hiddenUrl = document.createElement('input');
    hiddenUrl.type = 'hidden';
    hiddenUrl.name = 'pageUrl';
    hiddenUrl.value = window.location.href;
    form.appendChild(hiddenUrl);

    // ── Error area ──
    const errorEl = document.createElement('div');
    errorEl.className = 'a11y-form-error';
    errorEl.setAttribute('role', 'alert');
    form.appendChild(errorEl);

    // ── Submit button ──
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'a11y-form-submit';
    submitBtn.textContent = 'שלח דיווח';
    form.appendChild(submitBtn);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      errorEl.textContent = '';

      const data = new FormData(form);
      const fullName = (data.get('fullName') as string ?? '').trim();
      const email = (data.get('email') as string ?? '').trim();
      const category = (data.get('category') as string ?? '').trim();
      const description = (data.get('description') as string ?? '').trim();

      // Validation
      if (!fullName || !email || !category || !description) {
        errorEl.textContent = 'יש למלא את כל השדות.';
        return;
      }
      if (!this.isValidEmail(email)) {
        errorEl.textContent = 'כתובת האימייל אינה תקינה.';
        return;
      }

      const report: IssueReport = {
        fullName,
        email,
        category,
        description,
        pageUrl: hiddenUrl.value,
        timestamp: new Date().toISOString(),
      };

      this.handleFormSubmit(report, container, onClose);
    });

    container.appendChild(form);
  }

  private createField(
    type: string,
    name: string,
    labelText: string,
    required: boolean,
  ): HTMLElement {
    const group = document.createElement('div');
    group.className = 'a11y-form-group';
    const label = document.createElement('label');
    label.className = 'a11y-form-label';
    label.textContent = labelText;
    label.setAttribute('for', `a11y-report-${name}`);
    const input = document.createElement('input');
    input.className = 'a11y-form-input';
    input.type = type;
    input.id = `a11y-report-${name}`;
    input.name = name;
    input.required = required;
    group.append(label, input);
    return group;
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private handleFormSubmit(
    report: IssueReport,
    container: HTMLElement,
    onClose: () => void,
  ): void {
    // Log for now — will be connected to backend later
    console.log('[A11Y Widget] Issue report submitted:', report);

    const endpoint =
      window.a11yConfig?.reportEndpoint ?? '/api/a11y-report';

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    }).catch(() => {
      // Silently fail — the console log above is the primary record for now
    });

    // Show thank you message
    container.innerHTML = '';
    const thanks = document.createElement('div');
    thanks.className = 'a11y-report-thanks';

    const icon = document.createElement('div');
    icon.className = 'a11y-report-thanks-icon';
    icon.textContent = '✅';

    const title = document.createElement('h3');
    title.className = 'a11y-report-thanks-title';
    title.textContent = 'תודה על הדיווח!';

    const msg = document.createElement('p');
    msg.className = 'a11y-report-thanks-msg';
    msg.textContent = 'הדיווח שלך התקבל ויטופל בהקדם.';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'a11y-form-submit';
    closeBtn.textContent = 'סגור';
    closeBtn.addEventListener('click', onClose);

    thanks.append(icon, title, msg, closeBtn);
    container.appendChild(thanks);
  }

  renderControls(_container: HTMLElement, _onStateChange?: () => void): void {
    // No inline controls – uses modal
  }
}
