/**
 * Lightweight loader script.
 * Clients embed: <script src="https://cdn.example.com/a11y-loader.js" data-client-id="my-site"></script>
 * This script passes the client ID to the widget and dynamically injects the full bundle.
 */
(function () {
  if ((window as any).__a11yWidgetLoaded) return;
  (window as any).__a11yWidgetLoaded = true;

  const loaderScript = document.currentScript as HTMLScriptElement | null;

  const WIDGET_BUNDLE_URL = loaderScript?.dataset.src ?? 'a11y-widget.js';

  // Pass data-client-id from loader to the widget via window.a11yConfig
  const clientId = loaderScript?.dataset.clientId;
  if (clientId) {
    (window as any).a11yConfig = (window as any).a11yConfig || {};
    (window as any).a11yConfig.clientId = clientId;
  }

  const script = document.createElement('script');
  script.src = WIDGET_BUNDLE_URL;
  script.async = true;
  script.onload = () => {
    console.log('[A11Y Widget] loaded successfully.');
  };
  script.onerror = () => {
    console.error('[A11Y Widget] failed to load bundle from', WIDGET_BUNDLE_URL);
  };
  document.head.appendChild(script);
})();
