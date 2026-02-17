import type { RemoteConfig } from './types';
import type { AccessibilityEngine } from './engine';
import type { ProfileManager } from './profile-manager';
import type { WidgetUI } from '../ui/widget-ui';

const CONFIG_TIMEOUT_MS = 5000;

/**
 * Detects the client ID from:
 * 1. window.a11yConfig.clientId (set by loader or host page)
 * 2. data-client-id attribute on the current script tag
 */
export function detectClientId(): string | null {
  if (window.a11yConfig?.clientId) {
    return window.a11yConfig.clientId;
  }

  const script = document.currentScript as HTMLScriptElement | null;
  if (script?.dataset.clientId) {
    return script.dataset.clientId;
  }

  return null;
}

/**
 * Fetches remote configuration from the SaaS API.
 * Returns null on any failure (timeout, network error, invalid response).
 */
export async function fetchRemoteConfig(
  clientId: string,
): Promise<RemoteConfig | null> {
  const baseUrl =
    window.a11yConfig?.configEndpoint ?? 'https://api.example.com';
  const url = `${baseUrl}/api/a11y-config/${encodeURIComponent(clientId)}`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CONFIG_TIMEOUT_MS);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timer);

    if (!res.ok) return null;

    const data = (await res.json()) as RemoteConfig;
    if (!data || typeof data !== 'object') return null;

    return data;
  } catch {
    // Network error, timeout, or parsing failure — widget works without config
    return null;
  }
}

/**
 * Applies remote configuration as an overlay on top of the running widget.
 * Widget is already mounted and functional — this only overrides specific settings.
 */
export function applyRemoteConfig(
  config: RemoteConfig,
  engine: AccessibilityEngine,
  profileManager: ProfileManager,
  _ui: WidgetUI,
): void {
  // --- Apply global URLs ---
  if (!window.a11yConfig) window.a11yConfig = {};

  if (config.statementUrl) {
    window.a11yConfig.statementUrl = config.statementUrl;
  }
  if (config.reportEndpoint) {
    window.a11yConfig.reportEndpoint = config.reportEndpoint;
  }

  // --- Apply theme overrides (button position/size) ---
  if (config.theme) {
    const btnMod = engine.getModule('button-settings');
    if (btnMod) {
      const current = btnMod.getState();
      const settings = { ...current.settings };

      if (config.theme.position) {
        settings.position = config.theme.position;
      }
      if (config.theme.buttonSize) {
        settings.size = config.theme.buttonSize;
      }

      btnMod.setState({ enabled: true, settings });
      engine.saveModuleState('button-settings');
    }
  }

  // --- Enable / disable specific modules ---
  if (config.modules?.enabled) {
    for (const id of config.modules.enabled) {
      const mod = engine.getModule(id);
      if (mod && !mod.getState().enabled) {
        mod.activate();
        engine.saveModuleState(id);
      }
    }
  }

  if (config.modules?.disabled) {
    for (const id of config.modules.disabled) {
      const mod = engine.getModule(id);
      if (mod && mod.getState().enabled) {
        mod.deactivate();
        engine.saveModuleState(id);
      }
    }
  }

  // --- Activate a default profile ---
  if (config.defaultProfile) {
    profileManager.activateProfile(config.defaultProfile);
  }

  console.log('[A11Y Widget] Remote config applied for client:', config.clientId);
}
