/**
 * RasaLore AI - Connection Health & CORS Guidance Banner
 * Probes local Ollama daemon, displays connection status, and provides copyable CORS remediation.
 */

export class ConnectionBanner {
  /**
   * @param {object} options
   * @param {object} options.inferenceAdapter - InferenceAdapter instance
   * @param {HTMLElement} options.statusPillEl - Header status pill element
   * @param {HTMLElement} options.bannerContainerEl - Container where CORS guidance banner renders
   * @param {Function} [options.onStatusChange] - Optional status change callback
   */
  constructor(options) {
    this.adapter = options.inferenceAdapter;
    this.statusPillEl = options.statusPillEl;
    this.bannerContainerEl = options.bannerContainerEl;
    this.onStatusChange = options.onStatusChange;
    this.lastHealth = null;
    this.isBannerDismissed = false;
  }

  /**
   * Initializes probing and binds events.
   */
  async init() {
    await this.probeConnection();
  }

  /**
   * Probes Ollama health endpoint and updates UI.
   * @returns {Promise<{ isAvailable: boolean, message: string, isCorsError?: boolean }>}
   */
  async probeConnection() {
    this.updateStatusPill({
      status: 'probing',
      text: 'Probing Local Ollama...'
    });

    try {
      const health = await this.adapter.checkHealth(3000);
      this.lastHealth = health;

      if (health.isAvailable) {
        this.updateStatusPill({
          status: 'connected',
          text: health.message || 'Connected (Local Ollama: gemma2:2b)'
        });
        this.hideBanner();
      } else {
        this.updateStatusPill({
          status: 'fallback',
          text: 'Fallback Active (Pre-Cached / Web)'
        });
        if (!this.isBannerDismissed) {
          this.renderCorsGuidance(health);
        }
      }

      if (this.onStatusChange) {
        this.onStatusChange(health);
      }

      return health;
    } catch (err) {
      const fallbackHealth = {
        isAvailable: false,
        isCorsError: true,
        message: err.message
      };
      this.lastHealth = fallbackHealth;

      this.updateStatusPill({
        status: 'fallback',
        text: 'Fallback Active (Pre-Cached / Web)'
      });

      if (!this.isBannerDismissed) {
        this.renderCorsGuidance(fallbackHealth);
      }

      if (this.onStatusChange) {
        this.onStatusChange(fallbackHealth);
      }

      return fallbackHealth;
    }
  }

  /**
   * Updates the header status indicator pill styling and text.
   * @param {object} param0
   * @param {'probing'|'connected'|'fallback'} param0.status
   * @param {string} param0.text
   */
  updateStatusPill({ status, text }) {
    if (!this.statusPillEl) return;

    this.statusPillEl.classList.remove('status-probing', 'status-connected', 'status-fallback');
    this.statusPillEl.classList.add(`status-${status}`);

    const statusTextEl = this.statusPillEl.querySelector('#status-text') || this.statusPillEl;
    if (statusTextEl) {
      statusTextEl.textContent = text;
    }
  }

  /**
   * Renders the non-blocking CORS guidance banner with copyable terminal command.
   * @param {object} health
   */
  renderCorsGuidance(health) {
    if (!this.bannerContainerEl) return;

    const commandText = 'OLLAMA_ORIGINS="*" ollama serve';

    this.bannerContainerEl.innerHTML = `
      <div class="cors-guidance-banner" role="alert" aria-live="polite">
        <div class="cors-banner__content">
          <div class="cors-banner__icon">💡</div>
          <div class="cors-banner__body">
            <div class="cors-banner__title">
              <strong>Local Ollama Offline or CORS Blocked</strong>
              <span class="cors-banner__tag">Air-Gapped Local Mode</span>
            </div>
            <p class="cors-banner__desc">
              Browser security requires allowed origins to connect to local Ollama (<code>http://localhost:11434</code>).
              Pre-cached golden presets remain 100% functional. To enable live inference on custom dishes, launch Ollama with CORS origins enabled:
            </p>
            <div class="cors-banner__command-box">
              <code class="cors-command-code" id="ollama-cors-command">${commandText}</code>
              <button type="button" class="btn-copy-command" id="btn-copy-cors" title="Copy command to clipboard">
                <span class="copy-icon">📋</span>
                <span class="copy-text">Copy Command</span>
              </button>
            </div>
          </div>
        </div>

        <div class="cors-banner__actions">
          <button type="button" class="btn-recheck" id="btn-recheck-ollama">
            <span>🔄</span> Recheck Connection
          </button>
          <button type="button" class="btn-dismiss-banner" id="btn-dismiss-cors" aria-label="Dismiss banner">
            ✕
          </button>
        </div>
      </div>
    `;

    // Bind Copy Command
    const copyBtn = this.bannerContainerEl.querySelector('#btn-copy-cors');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(commandText);
          const copyText = copyBtn.querySelector('.copy-text');
          if (copyText) {
            copyText.textContent = '✓ Copied!';
            setTimeout(() => { copyText.textContent = 'Copy Command'; }, 2500);
          }
        } catch {
          // Fallback if clipboard API is restricted
          const input = document.createElement('input');
          input.value = commandText;
          document.body.appendChild(input);
          input.select();
          document.execCommand('copy');
          document.body.removeChild(input);
          const copyText = copyBtn.querySelector('.copy-text');
          if (copyText) {
            copyText.textContent = '✓ Copied!';
            setTimeout(() => { copyText.textContent = 'Copy Command'; }, 2500);
          }
        }
      });
    }

    // Bind Recheck
    const recheckBtn = this.bannerContainerEl.querySelector('#btn-recheck-ollama');
    if (recheckBtn) {
      recheckBtn.addEventListener('click', () => {
        recheckBtn.disabled = true;
        recheckBtn.innerHTML = '<span>⏳</span> Checking...';
        this.probeConnection().finally(() => {
          recheckBtn.disabled = false;
          recheckBtn.innerHTML = '<span>🔄</span> Recheck Connection';
        });
      });
    }

    // Bind Dismiss
    const dismissBtn = this.bannerContainerEl.querySelector('#btn-dismiss-cors');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => {
        this.isBannerDismissed = true;
        this.hideBanner();
      });
    }
  }

  /**
   * Hides the CORS banner.
   */
  hideBanner() {
    if (this.bannerContainerEl) {
      this.bannerContainerEl.innerHTML = '';
    }
  }

  /**
   * Displays the AC-003A Non-Blocking Guided UX Modal for remote evaluators.
   * @param {Function} onSelectPreset - Callback to switch to a verified preset
   * @param {Function} onOpenSettings - Callback to open settings drawer for HF_TOKEN
   */
  showTokenRequirementsModal(onSelectPreset, onOpenSettings) {
    const modalId = 'hf-token-guidance-modal';
    let modal = document.getElementById(modalId);
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'token-guidance-backdrop';
    modal.innerHTML = `
      <div class="token-guidance-dialog" role="dialog" aria-labelledby="token-modal-title">
        <div class="token-guidance-header">
          <div class="token-icon">🔑</div>
          <h3 id="token-modal-title">Live Remote Fallback Requires Token</h3>
        </div>
        <div class="token-guidance-body">
          <p>
            You are in <strong>Remote Web Fallback</strong> mode. Analyzing custom ad-hoc dishes via Hugging Face Serverless Inference requires an ephemeral user access token (<code>HF_TOKEN</code>).
          </p>
          <div class="token-guidance-box">
            <span class="box-icon">💡</span>
            <div>
              <strong>Instant Zero-Config Evaluation:</strong>
              <p>You can instantly explore our 3 curated presets (12 authentic dishes) with verified high-fidelity golden records without entering any token.</p>
            </div>
          </div>
        </div>
        <div class="token-guidance-footer">
          <button type="button" class="btn btn--preset-switch" id="btn-modal-switch-preset">
            <span>🌴</span> Switch to Curated Presets (Instant)
          </button>
          <button type="button" class="btn btn--open-token" id="btn-modal-enter-token">
            <span>⚙️</span> Enter HF Token
          </button>
          <button type="button" class="btn btn--close-modal" id="btn-modal-close">
            Cancel
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => modal.remove();

    modal.querySelector('#btn-modal-close').addEventListener('click', closeModal);

    modal.querySelector('#btn-modal-switch-preset').addEventListener('click', () => {
      closeModal();
      if (onSelectPreset) onSelectPreset('bali-bistro');
    });

    modal.querySelector('#btn-modal-enter-token').addEventListener('click', () => {
      closeModal();
      if (onOpenSettings) onOpenSettings();
    });
  }
}
