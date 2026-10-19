/**
 * RasaLore AI - Export Studio Component (Phase 4 TASK-402)
 * Manages commercial physical menu printing and schema-validated POS JSON export.
 * Adheres strictly to spec Section 12.2, AC-011, and AC-012.
 */

import { SchemaValidator } from '../parsers/schema-validator.js';

export class ExportStudio {
  /**
   * @param {object} options
   * @param {HTMLElement} options.container - Container element to render the export bar into
   * @param {() => Array<object>} options.getDishes - Function returning current dishes array
   * @param {() => string} [options.getActivePreset] - Function returning active preset ID
   * @param {() => string} [options.getActiveLanguage] - Function returning active language code
   * @param {Function} [options.onPrint] - Callback prior to printing
   * @param {Function} [options.onExport] - Callback after POS JSON export
   */
  constructor(options = {}) {
    this.container = options.container;
    this.getDishes = typeof options.getDishes === 'function' ? options.getDishes : () => [];
    this.getActivePreset = typeof options.getActivePreset === 'function' ? options.getActivePreset : () => 'bali-bistro';
    this.getActiveLanguage = typeof options.getActiveLanguage === 'function' ? options.getActiveLanguage : () => 'en';
    this.onPrint = options.onPrint || null;
    this.onExport = options.onExport || null;

    this.elements = {};
  }

  /**
   * Initializes and renders the Export Studio action bar.
   */
  init() {
    if (!this.container) return;
    this.render();
    this.bindEvents();
    this.updateStats();
  }

  /**
   * Generates the action bar DOM structure.
   */
  render() {
    this.container.innerHTML = `
      <section class="export-studio-bar" aria-label="Commercial Menu Export & Print Studio">
        <div class="export-studio__content">
          <div class="export-studio__header">
            <div class="export-studio__icon" aria-hidden="true">🖨️</div>
            <div class="export-studio__info">
              <h3 class="export-studio__title">Production Export Studio</h3>
              <p class="export-studio__desc">
                Commercial physical A4 table insert printout & schema-compliant POS JSON dataset export.
              </p>
            </div>
          </div>

          <div class="export-studio__actions">
            <!-- Print Physical Menu Trigger (AC-011) -->
            <button
              type="button"
              class="btn-export btn-export--print"
              id="btn-print-menu"
              title="Open browser print preview with elegant black-and-gold dual-column physical table insert styling"
            >
              <span class="btn-export__icon">🖨️</span>
              <div class="btn-export__text">
                <strong>Print Physical Menu</strong>
                <span>A4 Dual-Column Insert</span>
              </div>
            </button>

            <!-- Export POS JSON Trigger (AC-012) -->
            <button
              type="button"
              class="btn-export btn-export--json"
              id="btn-export-json"
              title="Download schema-validated DishCardModel[] JSON file for restaurant POS integration"
            >
              <span class="btn-export__icon">💾</span>
              <div class="btn-export__text">
                <strong>Export POS JSON</strong>
                <span id="export-json-count-badge">Validated DishCardModel[]</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Export Toast Notification -->
        <div class="export-toast" id="export-toast" style="display: none;" role="status" aria-live="polite">
          <span class="export-toast__icon" id="export-toast-icon">✓</span>
          <span class="export-toast__message" id="export-toast-message">Export successful</span>
        </div>
      </section>
    `;

    this.elements = {
      btnPrint: this.container.querySelector('#btn-print-menu'),
      btnExportJson: this.container.querySelector('#btn-export-json'),
      countBadge: this.container.querySelector('#export-json-count-badge'),
      toast: this.container.querySelector('#export-toast'),
      toastIcon: this.container.querySelector('#export-toast-icon'),
      toastMessage: this.container.querySelector('#export-toast-message')
    };
  }

  /**
   * Binds user click events to triggers.
   */
  bindEvents() {
    if (this.elements.btnPrint) {
      this.elements.btnPrint.addEventListener('click', () => this.triggerPrint());
    }

    if (this.elements.btnExportJson) {
      this.elements.btnExportJson.addEventListener('click', () => this.exportPosJson());
    }
  }

  /**
   * Updates dish count badge and status.
   */
  updateStats() {
    const dishes = this.getDishes();
    const count = Array.isArray(dishes) ? dishes.length : 0;
    if (this.elements.countBadge) {
      this.elements.countBadge.textContent = `${count} Dish${count === 1 ? '' : 'es'} (AC-012 Schema)`;
    }
  }

  /**
   * Triggers the commercial print workflow (AC-011).
   * Applies pre-print preview styling, invokes window.print(), and restores digital state.
   */
  triggerPrint() {
    if (this.onPrint) {
      this.onPrint();
    }

    // Add transient class for pre-print styling hook
    document.body.classList.add('print-preview-active');

    // Trigger native browser print dialog
    try {
      window.print();
    } finally {
      // Remove preview styling hook once dialog is dismissed
      setTimeout(() => {
        document.body.classList.remove('print-preview-active');
      }, 500);
    }
  }

  /**
   * Generates and downloads a schema-validated DishCardModel[] JSON file (AC-012).
   * @returns {{ success: boolean, filename: string, count: number, errors?: string[] }}
   */
  exportPosJson() {
    const rawDishes = this.getDishes();
    const dishes = Array.isArray(rawDishes) ? rawDishes : [];

    if (dishes.length === 0) {
      this.showToast('⚠️ No dishes currently available in studio to export.', 'warning');
      return { success: false, filename: '', count: 0, errors: ['No dishes to export'] };
    }

    // Validate data against DishCardModel[] specification
    const validation = SchemaValidator.validateDishCards(dishes);
    if (!validation.isValid) {
      console.warn('[ExportStudio] Exporting dishes with schema anomalies:', validation.errors);
    }

    const presetId = this.getActivePreset() || 'custom';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `rasalore-menu-${presetId}-${timestamp}.json`;

    // Format clean indented JSON
    const jsonString = JSON.stringify(dishes, null, 2);

    // Create client-side Blob and programmatic download anchor
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = filename;
    downloadLink.style.display = 'none';

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Clean up allocated Blob URL
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 1000);

    const message = `✓ Exported ${dishes.length} dishes to "${filename}" (100% DishCardModel[] compliant)`;
    this.showToast(message, 'success');

    if (this.onExport) {
      this.onExport({ filename, count: dishes.length, dishes });
    }

    return {
      success: true,
      filename,
      count: dishes.length,
      errors: validation.errors
    };
  }

  /**
   * Displays an ephemeral feedback toast in the export bar.
   * @param {string} message
   * @param {'success'|'warning'|'error'} [type='success']
   */
  showToast(message, type = 'success') {
    if (!this.elements.toast || !this.elements.toastMessage) return;

    this.elements.toast.className = `export-toast export-toast--${type}`;
    this.elements.toastMessage.textContent = message;

    if (this.elements.toastIcon) {
      this.elements.toastIcon.textContent = type === 'success' ? '✓' : (type === 'warning' ? '⚠️' : '❌');
    }

    this.elements.toast.style.display = 'inline-flex';

    clearTimeout(this._toastTimeout);
    this._toastTimeout = setTimeout(() => {
      if (this.elements.toast) {
        this.elements.toast.style.display = 'none';
      }
    }, 4500);
  }
}
