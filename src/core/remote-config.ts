import type { RemoteConfig } from './types';
import type { AccessibilityEngine } from './engine';
import type { ProfileManager } from './profile-manager';
import type { WidgetUI } from '../ui/widget-ui';

const DEFAULT_API_BASE = 'https://axsible-api.onrender.com';
const CONFIG_TIMEOUT_MS = 15000; // 15s — Render free tier cold starts can take ~10s
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 3000;

/**
 * Detects the client ID (license_key) from:
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
 * Sleeps for the given ms — used between retries.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Single fetch attempt with abort timeout.
 */
async function fetchOnce(url: string): Promise<RemoteConfig | null> {
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
}

/**
 * Fetches remote configuration from the SaaS API.
 * Retries on failure to handle Render free-tier cold starts (sleep mode).
 * Returns null on final failure — widget continues working without config.
 */
export async function fetchRemoteConfig(
  clientId: string,
): Promise<RemoteConfig | null> {
  const baseUrl =
    window.a11yConfig?.configEndpoint ?? DEFAULT_API_BASE;
  const url = `${baseUrl}/api/a11y-config/${encodeURIComponent(clientId)}`;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const config = await fetchOnce(url);
      if (config) return config;
    } catch {
      // Network error, timeout, or abort — retry if attempts remain
    }

    if (attempt < MAX_RETRIES) {
      await sleep(RETRY_DELAY_MS);
    }
  }

  // All attempts failed — widget works normally without remote config
  return null;
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
