export type ModuleCategory =
  | 'content'
  | 'vision'
  | 'navigation';

export interface ModuleState {
  enabled: boolean;
  settings: Record<string, unknown>;
}

export interface AccessibilityModule {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly category?: ModuleCategory;

  init(): void;
  activate(): void;
  deactivate(): void;

  getState(): ModuleState;
  setState(state: ModuleState): void;

  renderControls(container: HTMLElement, onStateChange?: () => void): void;
}

export interface StoreData {
  modules: Record<string, ModuleState>;
}

/** Global config set by host page or loader script */
export interface WidgetConfig {
  clientId?: string;
  statementUrl?: string;
  reportEndpoint?: string;
  configEndpoint?: string;
}

/** Remote configuration returned by the SaaS API */
export interface RemoteConfig {
  clientId: string;
  theme?: {
    primaryColor?: string;
    position?: 'left' | 'right';
    buttonSize?: 'small' | 'medium' | 'large';
  };
  modules?: {
    enabled?: string[];
    disabled?: string[];
  };
  defaultProfile?: string;
  statementUrl?: string;
  reportEndpoint?: string;
}

declare global {
  interface Window {
    a11yConfig?: WidgetConfig;
  }
}
