/**
 * Zone.js configuration for passive event listeners
 * 
 * This file configures Zone.js to treat specific events as passive by default,
 * which improves scrolling performance and prevents unnecessary change detection cycles.
 * 
 * This configuration MUST be loaded BEFORE zone.js is imported.
 * The events listed here will automatically be treated as passive by Zone.js,
 * meaning they won't block scrolling and won't trigger change detection.
 * 
 * Best practice for Angular 20 (2025):
 * - Use Zone.js's built-in __zone_symbol__PASSIVE_EVENTS configuration
 * - This is cleaner and more maintainable than manually patching addEventListener
 * - Zone.js will handle the passive flag automatically for these events
 */

if (typeof window !== 'undefined') {
  // Configure Zone.js to treat these events as passive by default
  // This improves scrolling performance and reduces change detection overhead
  (window as any).__zone_symbol__PASSIVE_EVENTS = [
    'scroll',
    'wheel',
    'mousewheel',
    'touchstart',
    'touchmove',
    'touchend',
    'touchcancel'
  ];
}
