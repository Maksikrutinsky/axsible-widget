import type { ModuleState, StoreData } from './types';

const STORAGE_KEY = 'a11y-widget-state';

export class StateStore {
  private data: StoreData;

  constructor() {
    this.data = this.load();
  }

  private load(): StoreData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw) as StoreData;
      }
    } catch {
      // corrupted data – start fresh
    }
    return { modules: {} };
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  }

  getModuleState(moduleId: string): ModuleState | null {
    return this.data.modules[moduleId] ?? null;
  }

  setModuleState(moduleId: string, state: ModuleState): void {
    this.data.modules[moduleId] = state;
    this.persist();
  }

  resetAll(): void {
    this.data = { modules: {} };
    this.persist();
  }
}
