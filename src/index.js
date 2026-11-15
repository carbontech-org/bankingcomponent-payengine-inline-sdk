/**
 * BankingComponent - PayEngine Checkout SDK
 * Integrated with PayEngine Sandbox & Production APIs
 *
 * @version 2.2.0
 */
'use strict';

const STYLE_ID = 'payengine-sdk-styles';

// PayEngine API Base URLs
const PROD_BASE_URL = 'https://api.bankingcomponent.com/payengine/v1';
const SANDBOX_BASE_URL = 'https://sandbox.bankingcomponent.com/payengine/v1'

/**
 * Injects scoped CSS styles into the document head once.
 */
function injectStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
      .ck-overlay {
        position: fixed;
        inset: 0;
        background: rgba(15, 12, 38, 0.75);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2147483647;
        padding: 16px;
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        opacity: 0;
        transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .ck-overlay.ck-visible { opacity: 1; }

      .ck-modal {
        background: #ffffff;
        width: 100%;
        max-width: 430px;
        min-height: 320px;
        border-radius: 20px;
        box-shadow: 0 24px 60px -12px rgba(26, 16, 63, 0.35), 0 0 0 1px rgba(221, 214, 254, 0.45);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: ck-slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        position: relative;
      }
      @keyframes ck-slide-up {
        from { transform: translateY(22px) scale(0.98); opacity: 0; }
        to { transform: translateY(0) scale(1); opacity: 1; }
      }

      /* Merchant Header */
      .ck-header {
        background: linear-gradient(180deg, #faf9ff 0%, #ffffff 100%);
        border-bottom: 1px solid #f0ecfc;
        padding: 18px 22px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .ck-header-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .ck-merchant-logo {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        object-fit: cover;
        background: #ffffff;
        border: 1px solid #ede9fe;
        box-shadow: 0 2px 6px rgba(61, 52, 139, 0.06);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        flex-shrink: 0;
      }
      .ck-merchant-logo svg {
        width: 100%;
        height: 100%;
        display: block;
      }
      .ck-merchant-fallback {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: linear-gradient(135deg, #4c40aa 0%, #3d348b 100%);
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 17px;
        box-shadow: 0 4px 10px rgba(61, 52, 139, 0.25);
        flex-shrink: 0;
      }
      .ck-title {
        font-size: 13px;
        font-weight: 600;
        color: #64748b;
        margin: 0;
        letter-spacing: -0.01em;
      }
      .ck-amount {
        font-size: 22px;
        font-weight: 800;
        color: #1a103c;
        margin-top: 3px;
        letter-spacing: -0.02em;
      }
      .ck-env-pill {
        display: inline-block;
        font-size: 9px;
        font-weight: 800;
        text-transform: uppercase;
        padding: 2px 6px;
        border-radius: 4px;
        background: #fef3c7;
        color: #b45309;
        margin-left: 6px;
        vertical-align: middle;
      }
      .ck-close-btn {
        background: #f5f3ff;
        border: none;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        font-size: 16px;
        color: #64748b;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s ease;
      }
      .ck-close-btn:hover {
        background: #ede9fe;
        color: #1a103c;
        transform: rotate(90deg);
      }

      /* Navigation Tabs */
      .ck-tabs {
        display: flex;
        padding: 6px 16px 0;
        background: #ffffff;
        border-bottom: 1px solid #f1edf9;
        gap: 6px;
      }
      .ck-tab {
        flex: 1;
        position: relative;
        text-align: center;
        padding: 10px 8px;
        font-size: 12.5px;
        font-weight: 700;
        letter-spacing: 0.02em;
        color: #837fa2;
        border: none;
        background: none;
        cursor: pointer;
        border-radius: 8px 8px 0 0;
        border-bottom: 2px solid transparent;
        transition: all 0.2s ease;
      }
      .ck-tab.active {
        color: #3d348b;
        border-bottom-color: #3d348b;
      }
      .ck-tab-tag {
        font-size: 8px;
        font-weight: 700;
        text-transform: uppercase;
        background: #f1edfd;
        color: #6358bf;
        padding: 2px 5px;
        border-radius: 4px;
        margin-left: 4px;
        vertical-align: middle;
      }

      .ck-body { padding: 22px; }

      /* Transfer UI Box */
      .ck-transfer-card {
        background: linear-gradient(180deg, #fbfaff 0%, #f6f3fe 100%);
        border: 1px solid #e5defe;
        border-radius: 14px;
        padding: 18px;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
      }
      .ck-transfer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }
      .ck-badge-live {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: #f0ecfd;
        color: #3d348b;
        padding: 3px 8px;
        border-radius: 100px;
        font-size: 11px;
        font-weight: 600;
      }
      .ck-dot-pulse {
        width: 6px;
        height: 6px;
        background: #3d348b;
        border-radius: 50%;
        box-shadow: 0 0 0 rgba(61, 52, 139, 0.4);
        animation: ck-pulse-dot 1.8s infinite;
      }
      @keyframes ck-pulse-dot {
        0% { box-shadow: 0 0 0 0 rgba(61, 52, 139, 0.6); }
        70% { box-shadow: 0 0 0 5px rgba(61, 52, 139, 0); }
        100% { box-shadow: 0 0 0 0 rgba(61, 52, 139, 0); }
      }
      .ck-timer-badge {
        font-size: 11.5px;
        font-weight: 600;
        color: #8c88a8;
      }
      .ck-timer-countdown {
        color: #dc2626;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
      }
      .ck-acc-box {
        background: #ffffff;
        border: 1px solid #e9e3fe;
        border-radius: 10px;
        padding: 14px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        box-shadow: 0 2px 4px rgba(61, 52, 139, 0.02);
      }
      .ck-acc-label {
        font-size: 11px;
        font-weight: 600;
        color: #837fa2;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        margin-bottom: 3px;
      }
      .ck-acc-num {
        font-size: 23px;
        font-weight: 800;
        color: #1a103c;
        letter-spacing: 1.5px;
        font-variant-numeric: tabular-nums;
      }
      .ck-btn-copy {
        background: #f4f0ff;
        border: 1px solid #e5defe;
        color: #3d348b;
        padding: 6px 12px;
        border-radius: 7px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        transition: all 0.15s ease;
      }
      .ck-btn-copy:hover {
        background: #3d348b;
        border-color: #3d348b;
        color: #ffffff;
      }

      /* Detailed Meta Rows */
      .ck-details-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .ck-detail-row {
        background: #ffffff;
        border: 1px solid #f1edf9;
        border-radius: 8px;
        padding: 9px 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12.5px;
      }
      .ck-detail-label {
        color: #7b7897;
        font-weight: 500;
      }
      .ck-detail-val {
        color: #1a103c;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .ck-mini-copy {
        border: none;
        background: none;
        cursor: pointer;
        padding: 0;
        color: #3d348b;
        opacity: 0.75;
        transition: opacity 0.15s;
      }
      .ck-mini-copy:hover { opacity: 1; }

      /* Primary / Secondary Buttons */
      .ck-btn-submit {
        width: 100%;
        padding: 14px;
        background: linear-gradient(180deg, #4a3fa8 0%, #3d348b 100%);
        color: white;
        font-size: 14px;
        font-weight: 700;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        margin-top: 16px;
        box-shadow: 0 4px 14px rgba(61, 52, 139, 0.28);
        transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
      .ck-btn-submit:hover {
        background: linear-gradient(180deg, #43389a 0%, #352c7c 100%);
        transform: translateY(-1px);
        box-shadow: 0 6px 18px rgba(61, 52, 139, 0.32);
      }
      .ck-btn-submit:active { transform: scale(0.99); }
      .ck-btn-submit:disabled {
        opacity: 0.65;
        cursor: not-allowed;
        transform: none;
      }
      .ck-btn-secondary {
        background: #f4f1ff;
        border: 1px solid #e8e2fd;
        color: #3d348b;
        font-size: 13px;
        font-weight: 700;
        padding: 11px 18px;
        border-radius: 8px;
        cursor: pointer;
        margin-top: 12px;
        transition: all 0.15s ease;
      }
      .ck-btn-secondary:hover { background: #ece6fd; }

      /* Loader / Status Views */
      .ck-center-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 46px 24px;
        text-align: center;
        flex: 1;
      }
      .ck-spinner-wrap {
        position: relative;
        margin-bottom: 18px;
      }
      .ck-spinner {
        width: 44px;
        height: 44px;
        border: 3.5px solid #ede9fe;
        border-top-color: #3d348b;
        border-radius: 50%;
        animation: ck-spin 0.8s linear infinite;
      }
      @keyframes ck-spin { to { transform: rotate(360deg); } }

      .ck-status-icon {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 14px;
      }
      .ck-error-bg { background: #fee2e2; color: #dc2626; }
      .ck-success-bg { background: #edfaf2; color: #15803d; }
      .ck-warn-bg { background: #fff7ed; color: #ea580c; }

      /* Animated Coming Soon UI */
      .ck-coming-soon { text-align: center; padding: 28px 10px; }
      .ck-anim-icon-wrap {
        position: relative;
        width: 64px;
        height: 64px;
        margin: 0 auto 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: #f2edfe;
        color: #3d348b;
      }
      .ck-anim-pulse {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        border: 2px solid #b7a8fa;
        animation: ck-pulse 1.8s ease-out infinite;
      }
      @keyframes ck-pulse {
        0% { transform: scale(0.95); opacity: 0.9; }
        100% { transform: scale(1.4); opacity: 0; }
      }

      /* Footer */
      .ck-footer {
        padding: 13px 20px;
        background: #faf9ff;
        border-top: 1px solid #f0ecfc;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .ck-footer-brand {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 11.5px;
        color: #7b7897;
        text-decoration: none;
        transition: color 0.15s;
      }
      .ck-footer-brand:hover { color: #3d348b; }
      .ck-lock-icon { width: 12px; height: 12px; fill: currentColor; }
      .ck-brand-bold { font-weight: 700; color: #1a103c; }
      .ck-footer-brand:hover .ck-brand-bold { color: #3d348b; }
    `;
  document.head.appendChild(style);
}

/**
 * Generates a compliant 18-digit PayEngine initiation_reference:
 * YYYYMMDDHHMM (12 digits) + 6-digit random suffix[cite: 2].
 */
function generateInitiationReference() {
  const now = new Date();
  const YYYY = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, '0');
  const DD = String(now.getDate()).padStart(2, '0');
  const HH = String(now.getHours()).padStart(2, '0');
  const Min = String(now.getMinutes()).padStart(2, '0');
  const timestamp = `${YYYY}${MM}${DD}${HH}${Min}`;
  const randomSuffix = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  return `${timestamp}${randomSuffix}`;
}

/**
 * Formats amount in major currency units (e.g., 10005 -> ₦10,005.00).
 */
function formatMoney(amount, currency) {
  const symbols = { NGN: '₦', USD: '$', GHS: 'GH₵', KES: 'KSh' };
  const sym = symbols[currency] || currency + ' ';
  return `${sym}${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Safely normalizes a nullable merchant icon/logo value.
 * Returns trimmed string if valid, or null if null/undefined/empty.
 */
function normalizeMerchantIcon(iconValue) {
  if (iconValue === null || iconValue === undefined) return null;
  if (typeof iconValue !== 'string') return null;
  const trimmed = iconValue.trim();
  return trimmed.length > 0 ? trimmed : null;
}

class CheckoutInstance {
  /**
   * @param {Object} config
   * @param {string} config.apiKey - Merchant API key (or `config.key`). If it contains "test_key", uses Sandbox.
   * @param {string} config.walletId - Destination wallet_id to credit (e.g., "WAL-EWDFHP33")[cite: 2].
   * @param {number} config.amount - Checkout amount in major units (e.g., 5000 for ₦5,000)[cite: 2].
   * @param {number} [config.fee=0] - Processing fee charged[cite: 2].
   * @param {string} [config.currency='NGN'] - Currency code[cite: 2].
   * @param {string} [config.narration] - Payment description[cite: 2].
   * @param {string} [config.initiationReference] - Optional custom 17-18 digit reference[cite: 2].
   * @param {string} [config.token] - Optional Bearer token if required by endpoint[cite: 2].
   * @param {string} [config.merchantName='Merchant Store'] - Merchant display name.
   * @param {string|null} [config.icon=null] - Nullable merchant icon/logo (URL, base64 data URI, or inline `<svg>`). Also accepts `logo` or `merchantIcon`.
   * @param {Function} [config.onSuccess] - Callback when payment succeeds.
   * @param {Function} [config.onCancel] - Callback when modal is dismissed.
   * @param {Function} [config.onError] - Callback when API initialization or validation fails.
   */
  constructor(config = {}) {
    this.apiKey = config.apiKey || config.key || '';
    this.token = config.token || null;
    this.walletId = config.walletId || config.wallet_id || '';
    this.amount = Number(config.amount || 0);
    this.fee = Number(config.fee || 0);
    this.currency = (config.currency || 'NGN').toUpperCase();
    this.narration = config.narration || `Checkout Payment - ${config.merchantName || 'Merchant'}`;
    this.initiationReference = config.initiationReference || config.ref || generateInitiationReference();

    // Environment auto-detection: "test_key" -> Sandbox, else Production[cite: 2]
    this.isSandbox = this.apiKey.includes('test_key');
    this.baseUrl = config.baseUrl || (this.isSandbox ? SANDBOX_BASE_URL : PROD_BASE_URL);

    // Nullable merchant icon support (supports `icon`, `logo`, or `merchantIcon`)
    this.icon = normalizeMerchantIcon(
      config.icon !== undefined ? config.icon : (config.logo !== undefined ? config.logo : config.merchantIcon)
    );
    this.merchantName = config.merchantName || 'Merchant Store';
    this.engineUrl = config.engineUrl || 'https://payengine.bankingcomponent.com';

    this.onSuccess = config.onSuccess || function () { };
    this.onCancel = config.onCancel || function () { };
    this.onError = config.onError || function () { };

    this.channels = config.channels || ['transfer', 'card', 'ussd'];
    this.activeTab = 'transfer';
    this.overlay = null;
    this.modalEl = null;
    this.timerInterval = null;
    this.secondsRemaining = 1200; // 20 minutes (20 * 60)
    this.sessionData = null;
  }

  openIframe() { this.open(); }

  open() {
    injectStyles();
    this.mountShell();
    this.initiateCheckoutSession();
  }

  mountShell() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'ck-overlay';
    this.modalEl = document.createElement('div');
    this.modalEl.className = 'ck-modal';
    this.overlay.appendChild(this.modalEl);
    document.body.appendChild(this.overlay);
    requestAnimationFrame(() => this.overlay.classList.add('ck-visible'));
  }

  buildHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'api-key': this.apiKey
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  renderMerchantIconHtml() {
    const initials = (this.merchantName || 'M').trim().charAt(0).toUpperCase() || 'M';
    if (!this.icon) {
      return `<div class="ck-merchant-fallback">${initials}</div>`;
    }
    if (this.icon.startsWith('<svg')) {
      return `<div class="ck-merchant-logo" aria-label="${this.merchantName}">${this.icon}</div>`;
    }
    const safeSrc = this.icon.replace(/"/g, '"');
    return `<img src="${safeSrc}" class="ck-merchant-logo" alt="${this.merchantName}" onerror="this.outerHTML='<div class=\\\'ck-merchant-fallback\\\'>${initials}</div>'"/>`;
  }

  showLoader(title, subtitle) {
    this.modalEl.innerHTML = `
      <div class="ck-center-box">
        <div class="ck-spinner-wrap">
          <div class="ck-spinner"></div>
        </div>
        <p style="font-size:15px; font-weight:700; color:#1a103c; margin:0;">${title}</p>
        <p style="font-size:12.5px; color:#7b7897; margin:5px 0 0;">${subtitle}</p>
      </div>
      ${this.renderFooterHtml()}
    `;
  }

  showError(title, message, requestId = null, canRetry = true) {
    const traceHtml = requestId
      ? `<p style="font-size:11px; color:#94a3b8; margin:-10px 0 14px;">Trace ID: <code>${requestId}</code></p>`
      : '';

    this.modalEl.innerHTML = `
      <div class="ck-center-box">
        <div class="ck-status-icon ck-error-bg">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </div>
        <p style="font-size:16px; font-weight:700; color:#1a103c; margin:0 0 6px;">${title}</p>
        <p style="font-size:13px; color:#7b7897; margin:0 0 18px; max-width:290px; line-height:1.45;">${message}</p>
        ${traceHtml}
        ${canRetry ? '<button type="button" class="ck-btn-submit" id="ck-retry-btn" style="max-width:200px; margin:0 auto 10px;">Retry Connection</button>' : ''}
        <button type="button" class="ck-btn-secondary" id="ck-error-close">Close Window</button>
      </div>
      ${this.renderFooterHtml()}
    `;

    if (canRetry) {
      this.modalEl.querySelector('#ck-retry-btn').onclick = () => {
        this.initiationReference = generateInitiationReference();
        this.initiateCheckoutSession();
      };
    }
    this.modalEl.querySelector('#ck-error-close').onclick = () => this.close(true);
  }

  renderFooterHtml() {
    return `
      <div class="ck-footer">
        <a href="${this.engineUrl}" target="_blank" rel="noopener noreferrer" class="ck-footer-brand">
          <svg class="ck-lock-icon" viewBox="0 0 24 24">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
          <span>Secured by <span class="ck-brand-bold">BankingComponent - PayEngine</span></span>
        </a>
      </div>
    `;
  }

  /**
   * Calls POST {{url}}/payment.initiate with payment_type: "CHECKOUT"[cite: 2]
   */
  async initiateCheckoutSession() {
    const envLabel = this.isSandbox ? 'Sandbox' : 'Production';
    this.showLoader('Initializing Checkout...', `Connecting to PayEngine ${envLabel}`);

    try {
      if (!this.apiKey) {
        throw new Error('Merchant API key (apiKey) is required.');
      }
      if (!this.walletId) {
        throw new Error('Destination walletId is required to initiate checkout.');
      }

      const payload = {
        initiation_reference: this.initiationReference,
        fee: this.fee,
        amount: this.amount,
        wallet_id: this.walletId,
        currency: this.currency,
        narration: this.narration,
        payment_type: 'CHECKOUT'
      };

      const response = await fetch(`${this.baseUrl}/payment.initiate`, {
        method: 'POST',
        headers: this.buildHeaders(),
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok || result.response_status !== 200 || String(result.response_code) !== '00') {
        const errMsg = result.response_description || result.response_message || 'Failed to initialize checkout session.';
        const err = new Error(errMsg);
        err.requestId = result.request_id || null;
        err.code = result.response_code;
        throw err;
      }

      const data = result.data || {};
      this.initiationReference = data.initiation_reference || this.initiationReference;

      // Allow backend response to optionally supply merchant icon if none was passed in config
      if (!this.icon) {
        const apiIcon = normalizeMerchantIcon(data.merchant_icon || data.merchant_logo || data.logo || data.icon);
        if (apiIcon) {
          this.icon = apiIcon;
        }
      }

      // Map PayEngine /payment.initiate response fields
      this.sessionData = {
        amount: data.total_amount ?? data.amount ?? this.amount,
        baseAmount: data.amount ?? this.amount,
        fee: data.fee ?? this.fee,
        vat: data.vat ?? 0,
        accountNumber: data.receiver_account_number || 'Pending',
        bankName: data.receiver_bank_name || 'PayEngine Virtual MFB',
        accountName: data.receiver_account_name || `${this.merchantName.toUpperCase()} / WALLET`,
        initiationReference: this.initiationReference
      };

      // Fixed 20-minute countdown (1200 seconds)
      this.secondsRemaining = 1200;
      this.renderCheckoutScreen();
      this.startCountdown();
    } catch (err) {
      this.showError('Initialization Failed', err.message, err.requestId, true);
      if (typeof this.onError === 'function') {
        this.onError(err);
      }
    }
  }

  renderCheckoutScreen() {
    const iconHtml = this.renderMerchantIconHtml();
    const sandboxBadge = this.isSandbox ? `<span class="ck-env-pill">Sandbox</span>` : '';

    this.modalEl.innerHTML = `
      <div class="ck-header">
        <div class="ck-header-left">
          ${iconHtml}
          <div>
            <p class="ck-title">${this.merchantName} ${sandboxBadge}</p>
            <div class="ck-amount">${formatMoney(this.sessionData.amount, this.currency)}</div>
          </div>
        </div>
        <button class="ck-close-btn" type="button" aria-label="Close modal">✕</button>
      </div>
      <div class="ck-tabs" id="ck-tabs-bar"></div>
      <div class="ck-body" id="ck-main-body"></div>
      ${this.renderFooterHtml()}
    `;

    this.modalEl.querySelector('.ck-close-btn').onclick = () => this.close(true);

    const tabsBar = this.modalEl.querySelector('#ck-tabs-bar');
    this.channels.forEach((channel) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `ck-tab ${this.activeTab === channel ? 'active' : ''}`;
      const label = channel.toUpperCase();
      const badge = channel !== 'transfer' ? '<span class="ck-tab-tag">Soon</span>' : '';
      btn.innerHTML = `${label} ${badge}`;
      btn.onclick = () => {
        this.activeTab = channel;
        this.updateBody();
      };
      tabsBar.appendChild(btn);
    });

    this.updateBody();
  }

  updateBody() {
    const body = this.modalEl.querySelector('#ck-main-body');
    const tabs = this.modalEl.querySelectorAll('.ck-tab');

    tabs.forEach((tab, idx) => {
      tab.classList.toggle('active', this.channels[idx] === this.activeTab);
    });

    if (this.activeTab === 'transfer') {
      body.innerHTML = `
        <div class="ck-transfer-card">
          <div class="ck-transfer-header">
            <div class="ck-badge-live">
              <div class="ck-dot-pulse"></div>
              <span>One-Time Dynamic Account</span>
            </div>
            <div class="ck-timer-badge">
              Expires in <span class="ck-timer-countdown" id="ck-countdown">${this.formatTimer()}</span>
            </div>
          </div>

          <div class="ck-acc-box">
            <div>
              <div class="ck-acc-label">Account Number</div>
              <div class="ck-acc-num">${this.sessionData.accountNumber}</div>
            </div>
            <button class="ck-btn-copy" id="ck-copy-acc-btn" type="button">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <span>Copy</span>
            </button>
          </div>
          
          <div class="ck-details-list">
            <div class="ck-detail-row">
              <span class="ck-detail-label">Bank Name</span>
              <span class="ck-detail-val">${this.sessionData.bankName}</span>
            </div>
            <div class="ck-detail-row">
              <span class="ck-detail-label">Wallet Name</span>
              <span class="ck-detail-val">
                <span>${this.sessionData.accountName}</span>
                <button class="ck-mini-copy" id="ck-copy-name-btn" type="button" title="Copy Wallet Name">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
              </span>
            </div>
            <div class="ck-detail-row">
              <span class="ck-detail-label">Reference</span>
              <span class="ck-detail-val" style="font-size:11.5px; font-weight:600; color:#64748b;">
                ${this.sessionData.initiationReference}
              </span>
            </div>
          </div>
        </div>

        <button type="button" class="ck-btn-submit" id="ck-paid-btn">
          <span>I have transferred the money</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      `;

      const copyAccBtn = body.querySelector('#ck-copy-acc-btn');
      copyAccBtn.onclick = () => {
        navigator.clipboard.writeText(this.sessionData.accountNumber);
        copyAccBtn.innerHTML = `<span>Copied!</span>`;
        setTimeout(() => {
          copyAccBtn.innerHTML = `
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span>Copy</span>`;
        }, 1800);
      };

      const copyNameBtn = body.querySelector('#ck-copy-name-btn');
      copyNameBtn.onclick = () => {
        navigator.clipboard.writeText(this.sessionData.accountName);
        copyNameBtn.innerHTML = `<span style="font-size:10px; color:#3d348b; font-weight:700;">Copied</span>`;
        setTimeout(() => {
          copyNameBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
        }, 1800);
      };

      body.querySelector('#ck-paid-btn').onclick = () => this.verifyPaymentStatus();
    } else {
      const channelName = this.activeTab === 'card' ? 'Debit/Credit Cards' : 'USSD Dial Code';
      const iconSvg = this.activeTab === 'card'
        ? `<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`
        : `<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>`;

      body.innerHTML = `
        <div class="ck-coming-soon">
          <div class="ck-anim-icon-wrap">
            <div class="ck-anim-pulse"></div>
            ${iconSvg}
          </div>
          <h4 style="font-size:16px; font-weight:700; color:#1a103c; margin:0 0 6px;">${channelName}</h4>
          <p style="font-size:13px; color:#7b7897; margin:0 0 18px;">Gateway integration is currently under review for this route.</p>
          <button type="button" class="ck-btn-secondary" id="ck-back-to-transfer">← Back to Bank Transfer</button>
        </div>
      `;

      body.querySelector('#ck-back-to-transfer').onclick = () => {
        this.activeTab = 'transfer';
        this.updateBody();
      };
    }
  }

  formatTimer() {
    const total = Math.max(0, Math.floor(this.secondsRemaining));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  startCountdown() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.secondsRemaining <= 0) {
        clearInterval(this.timerInterval);
        this.showExpiredState();
        return;
      }
      this.secondsRemaining--;
      const timerEl = document.getElementById('ck-countdown');
      if (timerEl) {
        timerEl.textContent = this.formatTimer();
      }
    }, 1000);
  }

  showExpiredState() {
    const body = this.modalEl.querySelector('#ck-main-body');
    if (!body) return;

    body.innerHTML = `
      <div style="text-align:center; padding:18px 10px;">
        <div class="ck-status-icon ck-warn-bg" style="margin: 0 auto 12px;">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <h4 style="font-size:16px; font-weight:700; color:#1a103c; margin:0 0 6px;">Account Window Expired</h4>
        <p style="font-size:13px; color:#7b7897; margin:0 0 16px; line-height:1.45;">
          Transactions are valid for 20 minutes. Generate a fresh checkout session to continue.
        </p>
        <button type="button" class="ck-btn-submit" id="ck-renew-btn">
          Generate Fresh Account
        </button>
      </div>
    `;

    body.querySelector('#ck-renew-btn').onclick = () => {
      this.initiationReference = generateInitiationReference();
      this.initiateCheckoutSession();
    };
  }

  /**
   * Calls POST {{url}}/payment.verifyStatus[cite: 2]
   * Validates:
   * 1. payment_type === 'CHECKOUT' (otherwise shows Invalid Payment error)
   * 2. status === 'SUCCESSFUL' before showing Success screen[cite: 2]
   */
  async verifyPaymentStatus() {
    const body = this.modalEl.querySelector('#ck-main-body');
    const paidBtn = body.querySelector('#ck-paid-btn');
    if (paidBtn) {
      paidBtn.disabled = true;
      paidBtn.innerHTML = `
        <div class="ck-spinner" style="width:16px; height:16px; border-width:2px; border-color:#ffffff; border-top-color:transparent; margin:0;"></div>
        <span>Confirming Interbank Switch...</span>
      `;
    }

    try {
      const response = await fetch(`${this.baseUrl}/payment.verifyStatus`, {
        method: 'POST',
        headers: this.buildHeaders(),
        body: JSON.stringify({
          initiation_reference: this.sessionData.initiationReference
        })
      });

      const result = await response.json();
      const data = result.data || {};
      const code = String(result.response_code || '');
      const txStatus = String(data.status || '').toUpperCase();
      const txType = String(data.payment_type || data.category || '').toUpperCase();

      // 1. Validate that payment_type is CHECKOUT
      if (response.ok && result.response_status === 200 && txType && txType !== 'CHECKOUT') {
        if (this.timerInterval) clearInterval(this.timerInterval);

        const invalidError = new Error(`Invalid payment type "${txType}". Expected CHECKOUT.`);
        invalidError.code = 'INVALID_PAYMENT_TYPE';

        body.innerHTML = `
          <div style="text-align:center; padding:20px 10px;">
            <div class="ck-status-icon ck-error-bg" style="margin:0 auto 12px;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </div>
            <h4 style="font-size:16px; font-weight:700; color:#1a103c; margin:0 0 6px;">Invalid Payment</h4>
            <p style="font-size:13px; color:#7b7897; margin:0 0 18px; line-height:1.45;">
              This reference does not belong to a valid CHECKOUT transaction (${txType}).
            </p>
            <button type="button" class="ck-btn-secondary" id="ck-invalid-close">Close Window</button>
          </div>
        `;

        body.querySelector('#ck-invalid-close').onclick = () => this.close(true);
        if (typeof this.onError === 'function') {
          this.onError(invalidError);
        }
        return;
      }

      // 2. Require status === 'SUCCESSFUL' (and valid response_code) before showing Success screen[cite: 2]
      const isCodeValid = code === '00' || code === '4000' || code === '4414';
      if (response.ok && isCodeValid && txStatus === 'SUCCESSFUL') {
        if (this.timerInterval) clearInterval(this.timerInterval);

        body.innerHTML = `
          <div style="text-align:center; padding:20px 10px;">
            <div class="ck-status-icon ck-success-bg" style="margin:0 auto 12px;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h4 style="font-size:17px; font-weight:700; color:#1a103c; margin:0 0 6px;">Payment Successful</h4>
            <p style="font-size:13px; color:#7b7897; margin:0 0 18px; line-height:1.45;">
              Your transfer of <b>${formatMoney(this.sessionData.amount, this.currency)}</b> has been verified.
            </p>
            <button type="button" class="ck-btn-submit" id="ck-done-btn">Continue</button>
          </div>
        `;

        const successPayload = {
          status: 'SUCCESSFUL',
          initiation_reference: this.sessionData.initiationReference,
          transaction_reference: data.transaction_reference || null,
          amount: this.sessionData.amount,
          currency: this.currency,
          channel: 'transfer',
          raw: result
        };

        body.querySelector('#ck-done-btn').onclick = () => {
          this.close(false);
          this.onSuccess(successPayload);
        };
      } else {
        const statusLabel = txStatus ? ` (Status: ${txStatus})` : '';
        const desc = result.response_description || result.response_message ||
          'Interbank settlements may take up to 2 minutes. If you already sent the funds, please re-query.';

        body.innerHTML = `
          <div style="text-align:center; padding:20px 10px;">
            <div class="ck-status-icon ck-error-bg" style="margin:0 auto 12px;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </div>
            <h4 style="font-size:16px; font-weight:700; color:#1a103c; margin:0 0 6px;">
              ${result.response_message || 'Transfer Not Confirmed Yet'}${statusLabel}
            </h4>
            <p style="font-size:13px; color:#7b7897; margin:0 0 18px; line-height:1.45;">
              ${desc}
            </p>
            <button type="button" class="ck-btn-submit" id="ck-recheck-btn">Re-query Gateway</button>
            <button type="button" class="ck-btn-secondary" id="ck-back-to-acc">View Account Details</button>
          </div>
        `;

        body.querySelector('#ck-recheck-btn').onclick = () => this.verifyPaymentStatus();
        body.querySelector('#ck-back-to-acc').onclick = () => this.updateBody();
      }
    } catch (err) {
      body.innerHTML = `
        <div style="text-align:center; padding:20px 10px;">
          <div class="ck-status-icon ck-error-bg" style="margin:0 auto 12px;">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </div>
          <h4 style="font-size:16px; font-weight:700; color:#1a103c; margin:0 0 6px;">Network Error</h4>
          <p style="font-size:13px; color:#7b7897; margin:0 0 18px; line-height:1.45;">
            ${err.message || 'Could not reach PayEngine verification server.'}
          </p>
          <button type="button" class="ck-btn-submit" id="ck-recheck-btn">Retry Verification</button>
          <button type="button" class="ck-btn-secondary" id="ck-back-to-acc">View Account Details</button>
        </div>
      `;

      body.querySelector('#ck-recheck-btn').onclick = () => this.verifyPaymentStatus();
      body.querySelector('#ck-back-to-acc').onclick = () => this.updateBody();
    }
  }

  close(triggerCancel = true) {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (!this.overlay) return;

    this.overlay.classList.remove('ck-visible');
    setTimeout(() => {
      if (this.overlay && this.overlay.parentNode) {
        this.overlay.parentNode.removeChild(this.overlay);
      }
      this.overlay = null;
      this.modalEl = null;
    }, 250);

    if (triggerCancel && typeof this.onCancel === 'function') {
      this.onCancel();
    }
  }
}

const CheckoutWidget = {
  setup: function (options) {
    return new CheckoutInstance(options);
  }
};

if (typeof window !== 'undefined') {
  window.CheckoutWidget = CheckoutWidget;
}

export default CheckoutWidget;
export { CheckoutWidget };