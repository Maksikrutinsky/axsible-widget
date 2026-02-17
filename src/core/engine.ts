import type { AccessibilityModule } from './types';
import { StateStore } from './state-store';

export class AccessibilityEngine {
  private modules: Map<string, AccessibilityModule> = new Map();
  private store: StateStore;

  constructor(store: StateStore) {
    this.store = store;
  }

  registerModule(module: AccessibilityModule): void {
    this.modules.set(module.id, module);

    module.init();

    // Restore persisted state
    const saved = this.store.getModuleState(module.id);
    if (saved) {
      module.setState(saved);
      if (saved.enabled) {
        module.activate();
      }
    }
  }

  getModule(id: string): AccessibilityModule | undefined {
    return this.modules.get(id);
  }

  getAllModules(): AccessibilityModule[] {
    return Array.from(this.modules.values());
  }

  toggleModule(id: string): boolean {
    const module = this.modules.get(id);
    if (!module) return false;

    const wasEnabled = module.getState().enabled;

    if (wasEnabled) {
      module.deactivate();
    } else {
      module.activate();
    }

    const newState = module.getState();
    this.store.setModuleState(id, newState);
    return newState.enabled;
  }

  saveModuleState(id: string): void {
    const module = this.modules.get(id);
    if (!module) return;
    this.store.setModuleState(id, module.getState());
  }

  resetAll(): void {
    for (const module of this.modules.values()) {
      module.deactivate();
      module.setState({ enabled: false, settings: {} });
    }
    this.store.resetAll();
  }
}
