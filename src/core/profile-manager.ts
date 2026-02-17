import type { AccessibilityEngine } from './engine';
import { ICONS } from '../ui/icons';

export interface Profile {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  /** Module IDs to activate, with optional preset settings */
  readonly modules: Array<{ id: string; settings?: Record<string, unknown> }>;
}

const PROFILE_STORAGE_KEY = 'a11y-widget-active-profile';

export const PROFILES: Profile[] = [
  {
    id: 'adhd-cognitive',
    name: 'ADHD / קוגניטיבי',
    icon: ICONS.profileBrain,
    modules: [
      { id: 'animation-stopper' },
      { id: 'reading-guide' },
      { id: 'hide-images' },
    ],
  },
  {
    id: 'vision-impaired',
    name: 'לקויי ראייה',
    icon: ICONS.profileEye,
    modules: [
      { id: 'contrast', settings: { mode: 'dark-contrast' } },
      { id: 'text-resizer', settings: { size: 130 } },
      { id: 'big-cursor', settings: { mode: 'dark' } },
    ],
  },
  {
    id: 'seizure-safe',
    name: 'בטוח להתקפים',
    icon: ICONS.profileBolt,
    modules: [
      { id: 'animation-stopper' },
      { id: 'saturation', settings: { value: 0 } },
    ],
  },
  {
    id: 'cognitive',
    name: 'קוגניטיבי',
    icon: ICONS.profileBook,
    modules: [
      { id: 'highlight-hover' },
      { id: 'readable-font' },
      { id: 'line-height', settings: { value: 2.0 } },
    ],
  },
  {
    id: 'blind-users',
    name: 'עיוורים',
    icon: ICONS.profileSpeaker,
    modules: [
      { id: 'screen-reader', settings: { rate: 1.0 } },
      { id: 'aria-enhancer' },
      { id: 'skip-to-content' },
    ],
  },
  {
    id: 'motor-impaired',
    name: 'מוגבלות מוטורית',
    icon: ICONS.profileHand,
    modules: [
      { id: 'virtual-keyboard' },
      { id: 'focus-indicator' },
      { id: 'big-cursor', settings: { mode: 'dark' } },
    ],
  },
];

export class ProfileManager {
  private activeProfileId: string | null = null;
  private engine: AccessibilityEngine;
  private onChangeCallbacks: Array<() => void> = [];

  constructor(engine: AccessibilityEngine) {
    this.engine = engine;
    this.loadPersistedProfile();
  }

  private loadPersistedProfile(): void {
    try {
      this.activeProfileId = localStorage.getItem(PROFILE_STORAGE_KEY);
    } catch {
      this.activeProfileId = null;
    }
  }

  private persistProfile(): void {
    try {
      if (this.activeProfileId) {
        localStorage.setItem(PROFILE_STORAGE_KEY, this.activeProfileId);
      } else {
        localStorage.removeItem(PROFILE_STORAGE_KEY);
      }
    } catch {
      // storage unavailable
    }
  }

  onChange(cb: () => void): void {
    this.onChangeCallbacks.push(cb);
  }

  private notifyChange(): void {
    for (const cb of this.onChangeCallbacks) cb();
  }

  getActiveProfileId(): string | null {
    return this.activeProfileId;
  }

  getProfiles(): readonly Profile[] {
    return PROFILES;
  }

  activateProfile(profileId: string): void {
    const profile = PROFILES.find((p) => p.id === profileId);
    if (!profile) return;

    // If same profile is active, deactivate it
    if (this.activeProfileId === profileId) {
      this.deactivateCurrentProfile();
      return;
    }

    // Deactivate current profile first
    if (this.activeProfileId) {
      this.deactivateCurrentProfile();
    }

    this.activeProfileId = profileId;

    // Activate each module in the profile
    for (const entry of profile.modules) {
      const mod = this.engine.getModule(entry.id);
      if (!mod) continue;

      // Apply preset settings if provided
      if (entry.settings) {
        mod.setState({ enabled: true, settings: entry.settings });
      }

      // Activate if not already active
      if (!mod.getState().enabled) {
        mod.activate();
      }

      this.engine.saveModuleState(entry.id);
    }

    this.persistProfile();
    this.notifyChange();
  }

  /** Called when a user manually changes a module — breaks profile lock */
  markCustom(): void {
    if (!this.activeProfileId) return;
    this.activeProfileId = null;
    this.persistProfile();
    this.notifyChange();
  }

  deactivateCurrentProfile(): void {
    if (!this.activeProfileId) return;

    const profile = PROFILES.find((p) => p.id === this.activeProfileId);
    if (profile) {
      for (const entry of profile.modules) {
        const mod = this.engine.getModule(entry.id);
        if (!mod) continue;
        if (mod.getState().enabled) {
          mod.deactivate();
          this.engine.saveModuleState(entry.id);
        }
      }
    }

    this.activeProfileId = null;
    this.persistProfile();
    this.notifyChange();
  }

  clearAll(): void {
    this.activeProfileId = null;
    this.persistProfile();
    this.engine.resetAll();
    this.notifyChange();
  }
}
