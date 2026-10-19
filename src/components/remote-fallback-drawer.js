/**
 * RasaLore AI - Remote Fallback & Ephemeral Token Settings Drawer
 * Implements TASK-303, SEC-002, and AC-003.
 * Stores HF_TOKEN strictly in sessionStorage (never localStorage, cookies, or remote logs).
 */

import { escapeHtml } from './card-studio.js';

export class RemoteFallbackDrawer {
  /**
   * @param {object} options
   * @param {object} options.inferenceAdapter - InferenceAdapter instance
   * @param {Function} [options.onTokenChange] - Callback when token is saved or cleared
   * @param {string} [options.storageKey='rasalore_hf_token']
   */
  constructor(options = {}) {
    this.adapter = options.inferenceAdapter;
    this.onTokenChange = options.onTokenChange || null;
    this.storageKey = options.storageKey || 'rasalore_hf_token';

    this.backdropEl = null;
    this.drawerEl = null;
    this.inputEl = null;
    this.statusValEl = null;
    this.notificationEl = null;
  }

  /**
   * Initializes drawer DOM, binds events, and restores ephemeral token from sessionStorage.
   */
  init() {
    this.render();
    this.bindEvents();
    this.restoreSessionToken();
  }

  /**
   * Restores token from sessionStorage if present in current tab.
   */
  restoreSessionToken() {
    try {
      const stored = sessionStorage.getItem(this.storageKey);
      if (stored && typeof stored === 'string' && stored.trim()) {
        const token = stored.trim();
        if (this.adapter) {
          this.adapter.setHfToken(token);
        }
        if (this.inputEl) {
          this.inputEl.value = token;
        }
        this.updateStatusDisplay(token);
        if (this.onTokenChange) {
          this.onTokenChange(token);
        }
      } else {
        this.updateStatusDisplay(null);
      }
    } catch {
      this.updateStatusDisplay(null);
    }
  }

  /**
   * Renders drawer and backdrop elements into document.body.
   */
  render() {
    // Backdrop
    this.backdropEl = document.createElement('div');
    this.backdropEl.className = 'drawer-backdrop';
    this.backdropEl.setAttribute('aria-hidden', 'true');

    // Drawer container
    this.drawerEl = document.createElement('aside');
    this.drawerEl.className = 'remote-fallback-drawer';
    this.drawerEl.setAttribute('role', 'dialog');
    this.drawerEl.setAttribute('aria-labelledby', 'drawer-heading');

    this.drawerEl.innerHTML = `
      <div class="drawer-header">
        <div class="drawer-title-group">
          <span class="drawer-icon">🔑</span>
          <div>
            <h3 class="drawer-title" id="drawer-heading">Remote Fallback Settings</h3>
            <span class="drawer-subtitle">Hugging Face Serverless Inference (Google Gemma 2)</span>
          </div>
        </div>
        <button type="button" class="btn-drawer-close" id="btn-close-drawer" aria-label="Close settings drawer">✕</button>
      </div>

      <div class="drawer-body">
        <p class="drawer-desc">
          When Local Ollama is offline, custom dishes can be enriched live using <strong>Google Gemma 2 2B</strong> via Hugging Face Serverless Inference.
        </p>

        <!-- Ephemeral Privacy Callout (SEC-002) -->
        <div class="drawer-security-box">
          <span class="sec-icon">🔒</span>
          <div>
            <strong>Ephemeral In-Memory Storage (SEC-002)</strong>
            <span>
              Your token is stored <em>only</em> in <code>sessionStorage</code> for this tab. It is cleared automatically when the tab is closed, and never written to disk, cookies, or remote databases.
            </span>
          </div>
        </div>

        <div id="drawer-notification-box" class="drawer-notification drawer-notification--success">
          ✓ Token saved to sessionStorage for this tab.
        </div>

        <!-- Token Form -->
        <div class="token-form-group">
          <label for="hf-token-input">
            <strong>Hugging Face User Access Token:</strong>
          </label>
          <div class="token-input-wrapper">
            <input
              type="password"
              id="hf-token-input"
              placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxx"
              autocomplete="off"
              spellcheck="false"
            />
            <button type="button" class="btn-toggle-token-mask" id="btn-toggle-mask" title="Show/hide token">
              👁️
            </button>
          </div>
          <a
            href="https://huggingface.co/settings/tokens"
            target="_blank"
            rel="noopener noreferrer"
            class="token-helper-link"
          >
            <span>🔗</span> Get a free Hugging Face token (Read scope)
          </a>
        </div>

        <!-- Token Status Indicator -->
        <div class="token-status-indicator">
          <span class="status-label">Active Engine Status:</span>
          <span class="status-val" id="drawer-token-status">
            <span>⚪</span> No Token Configured
          </span>
        </div>

        <div class="drawer-actions">
          <button type="button" class="btn-save-token" id="btn-save-hf-token">
            <span>💾</span> Save Token
          </button>
          <button type="button" class="btn-clear-token" id="btn-clear-hf-token">
            Clear
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(this.backdropEl);
    document.body.appendChild(this.drawerEl);

    this.inputEl = this.drawerEl.querySelector('#hf-token-input');
    this.statusValEl = this.drawerEl.querySelector('#drawer-token-status');
    this.notificationEl = this.drawerEl.querySelector('#drawer-notification-box');
  }

  /**
   * Binds interaction events for drawer controls.
   */
  bindEvents() {
    // Close Drawer
    const closeBtn = this.drawerEl.querySelector('#btn-close-drawer');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }
    if (this.backdropEl) {
      this.backdropEl.addEventListener('click', () => this.close());
    }

    // Toggle Password Visibility
    const maskBtn = this.drawerEl.querySelector('#btn-toggle-mask');
    if (maskBtn && this.inputEl) {
      maskBtn.addEventListener('click', () => {
        const isPassword = this.inputEl.type === 'password';
        this.inputEl.type = isPassword ? 'text' : 'password';
        maskBtn.textContent = isPassword ? '🙈' : '👁️';
      });
    }

    // Save Token
    const saveBtn = this.drawerEl.querySelector('#btn-save-hf-token');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const token = this.inputEl?.value?.trim() || '';
        if (token) {
          this.saveToken(token);
        } else {
          this.clearToken();
        }
      });
    }

    // Clear Token
    const clearBtn = this.drawerEl.querySelector('#btn-clear-hf-token');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearToken());
    }
  }

  /**
   * Saves token to sessionStorage and updates adapter.
   * @param {string} token
   */
  saveToken(token) {
    const cleanToken = token.trim();
    try {
      sessionStorage.setItem(this.storageKey, cleanToken);
    } catch {
      // Fallback in case sessionStorage is restricted
    }

    if (this.adapter) {
      this.adapter.setHfToken(cleanToken);
    }

    this.updateStatusDisplay(cleanToken);
    this.showNotification('✓ Hugging Face Token active (sessionStorage only).');

    if (this.onTokenChange) {
      this.onTokenChange(cleanToken);
    }
  }

  /**
   * Clears token from sessionStorage and updates adapter.
   */
  clearToken() {
    try {
      sessionStorage.removeItem(this.storageKey);
    } catch {
      // Ignore
    }

    if (this.inputEl) {
      this.inputEl.value = '';
    }

    if (this.adapter) {
      this.adapter.setHfToken(null);
    }

    this.updateStatusDisplay(null);
    this.showNotification('Token cleared from session memory.');

    if (this.onTokenChange) {
      this.onTokenChange(null);
    }
  }

  /**
   * Updates the status badge display inside the drawer.
   * @param {string|null} token
   */
  updateStatusDisplay(token) {
    if (!this.statusValEl) return;
    if (token) {
      const masked = token.length > 8 ? `${token.substring(0, 4)}...${token.slice(-4)}` : 'Active';
      this.statusValEl.innerHTML = `<span>🟢</span> Active (${escapeHtml(masked)})`;
      this.statusValEl.classList.add('active');
    } else {
      this.statusValEl.innerHTML = `<span>⚪</span> No Token Configured`;
      this.statusValEl.classList.remove('active');
    }
  }

  /**
   * Displays temporary feedback notification.
   * @param {string} text
   */
  showNotification(text) {
    if (!this.notificationEl) return;
    this.notificationEl.textContent = text;
    this.notificationEl.style.display = 'block';
    setTimeout(() => {
      if (this.notificationEl) {
        this.notificationEl.style.display = 'none';
      }
    }, 3000);
  }

  /**
   * Opens the slide-over settings drawer.
   */
  open() {
    if (this.backdropEl) this.backdropEl.classList.add('active');
    if (this.drawerEl) this.drawerEl.classList.add('active');
    if (this.inputEl) {
      setTimeout(() => this.inputEl.focus(), 150);
    }
  }

  /**
   * Closes the slide-over settings drawer.
   */
  close() {
    if (this.backdropEl) this.backdropEl.classList.remove('active');
    if (this.drawerEl) this.drawerEl.classList.remove('active');
  }

  /**
   * Returns whether a valid token is currently configured.
   * @returns {boolean}
   */
  hasToken() {
    return Boolean(this.adapter?.hfToken);
  }
}
