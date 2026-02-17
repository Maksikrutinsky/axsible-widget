import type { AccessibilityModule, ModuleState } from '../core/types';
import { ICONS } from '../ui/icons';

export class AccessibilityStatementModule implements AccessibilityModule {
  readonly id = 'accessibility-statement';
  readonly name = 'הצהרת נגישות';
  readonly icon = ICONS.accessibilityStatement;

  private enabled = false;

  init(): void {
    // noop – purely UI-driven
  }

  activate(): void {
    this.enabled = true;
    this.openStatement();
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

  private resolveUrl(): string {
    // 1. Check global config
    if (window.a11yConfig?.statementUrl) {
      return window.a11yConfig.statementUrl;
    }

    // 2. Check data attribute on the widget's script tag
    const scripts = document.querySelectorAll('script[data-statement-url]');
    if (scripts.length > 0) {
      const url = scripts[scripts.length - 1].getAttribute('data-statement-url');
      if (url) return url;
    }

    // 3. Fallback
    return '/accessibility-statement';
  }

  private openStatement(): void {
    const url = this.resolveUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
    // Immediately deactivate — this is a one-shot action, not a toggle
    this.enabled = false;
  }

  renderControls(_container: HTMLElement, _onStateChange?: () => void): void {
    // No controls – single action button
  }
}
