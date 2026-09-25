/**
 * Global Plyr Video Streaming Wrapper & Media Architecture
 * Obsidian Epicure / wow Food Recipes
 * 
 * Provides an embedded, visually isolated video streaming infrastructure
 * using hidden HTML5 data attributes (data-plyr-provider, data-plyr-embed-id)
 * with design system CSS custom properties and exact card container border-radius geometry.
 */
(function (window, document) {
  'use strict';

  var PlyrWrapper = {
    instances: new Map(),
    defaultOptions: {
      controls: [
        'play-large',
        'play',
        'progress',
        'current-time',
        'mute',
        'volume',
        'fullscreen'
      ],
      youtube: {
        noCookie: true,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        modestbranding: 1
      },
      hideControls: true,
      resetOnEnd: true,
      ratio: '16:9'
    },

    /**
     * Finds all container nodes injected with Plyr data attributes
     * @param {string} [selector]
     * @returns {NodeListOf<HTMLElement>}
     */
    getHooks: function (selector) {
      var sel = selector || '[data-plyr-provider], [data-plyr-embed-id]';
      return document.querySelectorAll(sel);
    },

    /**
     * Initializes an embedded, visually isolated streaming player inside target container
     * @param {HTMLElement|string} target 
     * @param {Object} [customOptions] 
     * @returns {Object|null}
     */
    init: function (target, customOptions) {
      var el = typeof target === 'string' ? document.querySelector(target) : target;
      if (!el) return null;

      if (this.instances.has(el)) {
        return this.instances.get(el);
      }

      var provider = el.getAttribute('data-plyr-provider') || 'youtube';
      var embedId = el.getAttribute('data-plyr-embed-id') || '3AAdKl1UYZs';

      if (typeof window.Plyr === 'undefined') {
        console.info('[PlyrWrapper] Standby: Plyr core engine ready for provider:', provider, 'ID:', embedId);
        return null;
      }

      // Create visually isolated embedded player container layer to preserve parent overlays & poster
      var playerLayer = el.querySelector('.plyr-stream-layer');
      if (!playerLayer) {
        playerLayer = document.createElement('div');
        playerLayer.className = 'plyr-stream-layer';
        playerLayer.setAttribute('data-plyr-provider', provider);
        playerLayer.setAttribute('data-plyr-embed-id', embedId);
        playerLayer.style.position = 'absolute';
        playerLayer.style.inset = '0';
        playerLayer.style.width = '100%';
        playerLayer.style.height = '100%';
        playerLayer.style.zIndex = '5';
        playerLayer.style.borderRadius = window.getComputedStyle(el).borderRadius || '12px';
        playerLayer.style.overflow = 'hidden';

        // Insert behind overlays (top-nav, badges) but above background poster
        var poster = el.querySelector('.media-cover-img, .step-photo-img, img');
        if (poster && poster.nextSibling) {
          el.insertBefore(playerLayer, poster.nextSibling);
        } else {
          el.appendChild(playerLayer);
        }
      }

      var opts = Object.assign({}, this.defaultOptions, customOptions || {});
      try {
        var player = new window.Plyr(playerLayer, opts);
        this.instances.set(el, player);
        return player;
      } catch (err) {
        console.error('[PlyrWrapper] Stream mount error:', err);
        return null;
      }
    },

    /**
     * Retrieves an active player instance
     * @param {HTMLElement|string} target 
     * @returns {Object|null}
     */
    getPlayer: function (target) {
      var el = typeof target === 'string' ? document.querySelector(target) : target;
      return this.instances.get(el) || null;
    },

    /**
     * Destroys an active player instance and cleans up DOM layer
     * @param {HTMLElement|string} target 
     */
    destroy: function (target) {
      var el = typeof target === 'string' ? document.querySelector(target) : target;
      if (!el || !this.instances.has(el)) return;

      var player = this.instances.get(el);
      try {
        player.destroy();
      } catch (e) {}
      this.instances.delete(el);

      var playerLayer = el.querySelector('.plyr-stream-layer');
      if (playerLayer && playerLayer.parentNode) {
        playerLayer.parentNode.removeChild(playerLayer);
      }
    }
  };

  window.PlyrWrapper = PlyrWrapper;
})(window, document);
