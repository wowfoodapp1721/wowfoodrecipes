/**
 * ══════════════════════════════════════════════════════════════════════════
 * GLOBAL VIEWPORT CONTROLLER & NAVIGATION SHELL MANAGER
 * Design System: "wow Food Recipes" Mobile OS Architecture
 * ══════════════════════════════════════════════════════════════════════════
 */

(function (global) {
  'use strict';

  // Base Controller Mode Class
  class ViewportMode {
    constructor(name) {
      this.name = name;
    }
    apply(controller) {
      throw new Error('apply() must be implemented by subclass');
    }
  }

  /**
   * 1. Class StandardStatusBarView:
   * Target Layouts: Apply to all core utility feeds, shopping lists, setup wizards,
   * profile dashboards, calendars, menus, data grids, transaction receipts, and settings screens.
   * Styling: Sleek background canvas layout updating dynamically to match active screen theme
   * (e.g. solid charcoal-black on dashboard feed, solid crimson-red on AI Personalization views).
   * Status bar text strings (9:41) and status icons (cellular network signal, Wi-Fi wave nodes,
   * battery fill cells) visible and cast in crisp, high-contrast white.
   */
  class StandardStatusBarView extends ViewportMode {
    constructor(theme = 'auto') {
      super('StandardStatusBarView');
      this.theme = theme;
    }

    apply(controller) {
      const { viewport, statusBar } = controller;
      if (!viewport || !statusBar) return;

      viewport.classList.remove('viewport-immersive');
      viewport.classList.add('viewport-standard');
      statusBar.classList.remove('status-bar--hidden');
      statusBar.style.display = 'flex';
      statusBar.style.visibility = 'visible';

      // Clear previous theme classes
      statusBar.classList.remove(
        'status-bar--charcoal',
        'status-bar--black',
        'status-bar--crimson',
        'status-bar--crimson-dark',
        'status-bar--amber-dark',
        'status-bar--glass',
        'status-bar--transparent'
      );

      // Determine active screen theme
      let targetTheme = this.theme;
      if (targetTheme === 'auto') {
        const path = (window.location.pathname || '').toLowerCase();
        if (path.includes('onboarding')) {
          targetTheme = 'crimson-dark';
        } else if (path.includes('auth')) {
          targetTheme = 'amber-dark';
        } else if (path.includes('social-feed') || path.includes('grocery')) {
          targetTheme = 'black';
        } else if (path.includes('recipe-detail')) {
          targetTheme = 'glass';
        } else {
          targetTheme = 'charcoal';
        }
      }

      statusBar.classList.add(`status-bar--${targetTheme}`);
    }
  }

  /**
   * 2. Class ImmersiveFullScreenView:
   * Target Layouts: Apply to all active step-by-step hands-free voice cooking guides (Phase 6 step variants),
   * real-time machine vision AI Live Camera scanner interfaces, full-bleed delivery tracking maps,
   * and print preview document engines.
   * Styling: Inject a conditional hide flag that completely removes the status bar container element
   * from the display layout view array. Allow the main background context layers, camera frames,
   * and graphics to occupy 100% of the viewport height boundaries for a clean, borderless immersive aesthetic.
   */
  class ImmersiveFullScreenView extends ViewportMode {
    constructor() {
      super('ImmersiveFullScreenView');
    }

    apply(controller) {
      const { viewport, statusBar } = controller;
      if (!viewport) return;

      viewport.classList.remove('viewport-standard');
      viewport.classList.add('viewport-immersive');

      if (statusBar) {
        statusBar.classList.add('status-bar--hidden');
        statusBar.style.display = 'none';
        statusBar.style.visibility = 'hidden';
      }
    }
  }

  /**
   * 3. Class InheritedDrawerOverlayView:
   * Target Layouts: Apply to all dynamic pop-up menus, slide-up notification context sheets,
   * system microphone interruption drawers, and option selectors.
   * Styling: Maintain background stack continuity. Do not alter the status bar structure;
   * allow it to cleanly mirror the visibility and coloring state of the screen layer currently
   * rendering directly behind the dialog box stack.
   */
  class InheritedDrawerOverlayView extends ViewportMode {
    constructor(parentMode) {
      super('InheritedDrawerOverlayView');
      this.parentMode = parentMode;
    }

    apply(controller) {
      const { viewport, statusBar } = controller;
      if (!viewport) return;

      viewport.classList.add('viewport-drawer-active');

      // If the underlying layer was immersive, keep it immersive; if standard, keep standard
      if (this.parentMode instanceof ImmersiveFullScreenView) {
        viewport.classList.add('drawer-immersive-behind');
        if (statusBar) {
          statusBar.style.display = 'none';
        }
      } else {
        viewport.classList.remove('drawer-immersive-behind');
        if (statusBar) {
          statusBar.style.display = 'flex';
        }
      }
    }

    remove(controller) {
      const { viewport } = controller;
      if (viewport) {
        viewport.classList.remove('viewport-drawer-active', 'drawer-immersive-behind');
      }
      if (this.parentMode) {
        this.parentMode.apply(controller);
      }
    }
  }

  /**
   * Global Viewport Controller Core Class
   */
  class GlobalViewportControllerClass {
    constructor() {
      this.viewport = null;
      this.statusBar = null;
      this.currentMode = null;
      this.previousMode = null;
      this.StandardStatusBarView = StandardStatusBarView;
      this.ImmersiveFullScreenView = ImmersiveFullScreenView;
      this.InheritedDrawerOverlayView = InheritedDrawerOverlayView;
    }

    init() {
      // Locate viewport container
      this.viewport = document.getElementById('viewport') ||
                      document.querySelector('.mobile-viewport') ||
                      document.querySelector('main') ||
                      document.body;

      // Find or inject mock status bar
      this.statusBar = document.getElementById('global-status-bar') ||
                       document.querySelector('.mock-status-bar') ||
                       document.querySelector('header.status-bar');

      if (!this.statusBar) {
        this.statusBar = this.createStatusBar();
        if (this.viewport && this.viewport.firstChild) {
          this.viewport.insertBefore(this.statusBar, this.viewport.firstChild);
        } else if (this.viewport) {
          this.viewport.appendChild(this.statusBar);
        }
      }

      // Initialize route mode
      this.autoDetectRouteMode();
      this.bindSystemClock();
    }

    createStatusBar() {
      const bar = document.createElement('header');
      bar.id = 'global-status-bar';
      bar.className = 'mock-status-bar';
      bar.setAttribute('role', 'region');
      bar.setAttribute('aria-label', 'System Status Bar');

      bar.innerHTML = `
        <span class="status-bar-time" id="status-bar-clock">9:41</span>
        <div class="status-bar-icons" aria-hidden="true">
          <span class="material-symbols-outlined status-icon">signal_cellular_alt</span>
          <span class="material-symbols-outlined status-icon">wifi</span>
          <span class="material-symbols-outlined status-icon status-icon--battery">battery_full</span>
        </div>
      `;
      return bar;
    }

    bindSystemClock() {
      // Keep crisp default or update if live clock is requested
      const clockEl = document.getElementById('status-bar-clock');
      if (!clockEl) return;
      
      // Default standard mobile presentation string
      if (!clockEl.textContent || clockEl.textContent.trim() === '') {
        clockEl.textContent = '9:41';
      }
    }

    autoDetectRouteMode() {
      const path = (window.location.pathname || '').toLowerCase();
      const explicitMode = document.body.getAttribute('data-viewport-mode') ||
                           (this.viewport ? this.viewport.getAttribute('data-viewport-mode') : null);

      if (explicitMode === 'immersive' ||
          path.includes('cooking-guide') ||
          path.includes('scanner') ||
          path.includes('calibration') ||
          path.includes('recipe-print')) {
        this.setMode(new ImmersiveFullScreenView());
      } else {
        const theme = document.body.getAttribute('data-viewport-theme') || 'auto';
        this.setMode(new StandardStatusBarView(theme));
      }
    }

    setMode(mode) {
      if (!mode) return;
      this.previousMode = this.currentMode;
      this.currentMode = mode;
      mode.apply(this);
    }

    openDrawer(drawerElement) {
      const drawerMode = new InheritedDrawerOverlayView(this.currentMode);
      this.setMode(drawerMode);
      if (drawerElement) {
        drawerElement.classList.add('drawer-active');
      }
      return drawerMode;
    }

    closeDrawer(drawerElement) {
      if (this.currentMode instanceof InheritedDrawerOverlayView) {
        this.currentMode.remove(this);
        this.currentMode = this.previousMode || new StandardStatusBarView();
      }
      if (drawerElement) {
        drawerElement.classList.remove('drawer-active');
      }
    }
  }

  // Export singleton instance and classes
  const controller = new GlobalViewportControllerClass();
  global.GlobalViewportController = controller;
  global.StandardStatusBarView = StandardStatusBarView;
  global.ImmersiveFullScreenView = ImmersiveFullScreenView;
  global.InheritedDrawerOverlayView = InheritedDrawerOverlayView;

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => controller.init());
  } else {
    controller.init();
  }

})(typeof window !== 'undefined' ? window : this);
