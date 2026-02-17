import { StateStore } from './core/state-store';
import { AccessibilityEngine } from './core/engine';
import { TextResizer } from './modules/text-resizer';
import { ContrastModule } from './modules/contrast';
import { LinksHighlighterModule } from './modules/links-highlighter';
import { ReadableFontModule } from './modules/readable-font';
import { AnimationStopperModule } from './modules/animation-stopper';
import { FocusIndicatorModule } from './modules/focus-indicator';
import { SkipToContentModule } from './modules/skip-to-content';
import { ReadingGuideModule } from './modules/reading-guide';
import { AriaEnhancerModule } from './modules/aria-enhancer';
import { LetterSpacingModule } from './modules/letter-spacing';
import { WordSpacingModule } from './modules/word-spacing';
import { LineHeightModule } from './modules/line-height';
import { TextAlignmentModule } from './modules/text-alignment';
import { BigCursorModule } from './modules/big-cursor';
import { ScreenReaderModule } from './modules/screen-reader';
import { HideImagesModule } from './modules/hide-images';
import { SaturationModule } from './modules/saturation';
import { MagnifierModule } from './modules/magnifier';
import { VirtualKeyboardModule } from './modules/virtual-keyboard';
import { DaltonizationModule } from './modules/daltonization';
import { HighlightHoverModule } from './modules/highlight-hover';
import { AccessibilityStatementModule } from './modules/accessibility-statement';
import { IssueReportingModule } from './modules/issue-reporting';
import { AdvancedColorModule } from './modules/advanced-colors';
import { ButtonSettingsModule } from './modules/button-settings';
import { ProfileManager } from './core/profile-manager';
import { WidgetUI } from './ui/widget-ui';
import { detectClientId, fetchRemoteConfig, applyRemoteConfig } from './core/remote-config';

function bootstrap(): void {
  const store = new StateStore();
  const engine = new AccessibilityEngine(store);

  // Register modules
  engine.registerModule(new TextResizer());
  engine.registerModule(new ContrastModule());
  engine.registerModule(new LinksHighlighterModule());
  engine.registerModule(new ReadableFontModule());
  engine.registerModule(new AnimationStopperModule());
  engine.registerModule(new FocusIndicatorModule());
  engine.registerModule(new SkipToContentModule());
  engine.registerModule(new ReadingGuideModule());
  engine.registerModule(new AriaEnhancerModule());
  engine.registerModule(new LetterSpacingModule());
  engine.registerModule(new WordSpacingModule());
  engine.registerModule(new LineHeightModule());
  engine.registerModule(new TextAlignmentModule());
  engine.registerModule(new BigCursorModule());
  engine.registerModule(new ScreenReaderModule());
  engine.registerModule(new HideImagesModule());
  engine.registerModule(new SaturationModule());
  engine.registerModule(new MagnifierModule());
  engine.registerModule(new VirtualKeyboardModule());
  engine.registerModule(new DaltonizationModule());
  engine.registerModule(new HighlightHoverModule());
  engine.registerModule(new AdvancedColorModule());
  engine.registerModule(new ButtonSettingsModule());
  engine.registerModule(new AccessibilityStatementModule());
  engine.registerModule(new IssueReportingModule());

  // Create profile manager
  const profileManager = new ProfileManager(engine);

  // Mount UI — widget is immediately usable
  const ui = new WidgetUI(engine, profileManager);
  ui.mount();

  // Async: fetch remote config if a client ID is present
  const clientId = detectClientId();
  if (clientId) {
    fetchRemoteConfig(clientId).then((config) => {
      if (config) applyRemoteConfig(config, engine, profileManager, ui);
    });
  }
}

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
