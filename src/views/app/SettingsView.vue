<template>
  <section class="settings">
    <div class="page-header">
      <div>
        <h1>Settings</h1>
        <p class="muted">Manage your workspace preferences and payouts.</p>
      </div>
      <button class="ghost-btn">Save changes</button>
    </div>

    <div class="grid">
      <div class="panel">
        <h2>Profile</h2>
        <div class="form">
          <label class="field">
            <span>Full name</span>
            <input type="text" placeholder="Nebojsa Stojanovic" />
          </label>
          <label class="field">
            <span>Email</span>
            <input type="email" placeholder="nebojsa@paybylink.com" />
          </label>
          <label class="field">
            <span>Role</span>
            <input type="text" placeholder="Owner" />
          </label>
        </div>
      </div>

      <div class="panel">
        <h2>Business</h2>
        <div class="form">
          <label class="field">
            <span>Business name</span>
            <input type="text" placeholder="PayByLink LLC" />
          </label>
          <label class="field">
            <span>Support email</span>
            <input type="email" placeholder="support@paybylink.com" />
          </label>
          <label class="field">
            <span>Default currency</span>
            <select>
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>
          </label>
        </div>
      </div>

      <div class="panel">
        <h2>Payouts</h2>
        <div class="form">
          <label class="field">
            <span>Bank account</span>
            <input type="text" placeholder="**** 4921" />
          </label>
          <label class="field">
            <span>Payout schedule</span>
            <select>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </label>
          <label class="field">
            <span>Statement descriptor</span>
            <input type="text" placeholder="PAYBYLINK*STUDIO" />
          </label>
        </div>
      </div>

      <div class="panel">
        <h2>Payment service providers</h2>
        <p class="panel-subtitle">
          Add providers to route payments and manage processing credentials.
        </p>
        <div class="form">
          <label class="field">
            <span>Provider</span>
            <select>
              <option>Stripe</option>
              <option>Adyen</option>
              <option>PayPal</option>
            </select>
          </label>
          <label class="field">
            <span>Merchant account ID</span>
            <input type="text" placeholder="acct_1234..." />
          </label>
          <label class="field">
            <span>API key</span>
            <input type="password" placeholder="sk_live_••••••••" />
          </label>
          <button class="ghost-btn inline-btn" type="button">Add provider</button>
        </div>
      </div>

      <div class="panel">
        <h2>Link delivery</h2>
        <p class="panel-subtitle">
          Choose how payment links are sent to customers.
        </p>
        <div class="form">
          <label class="field">
            <span>Send link via</span>
            <select>
              <option>Email</option>
              <option>SMS</option>
              <option>WhatsApp</option>
              <option>Copy link</option>
            </select>
          </label>
          <label class="field">
            <span>Fallback channel</span>
            <select>
              <option>None</option>
              <option>Email</option>
              <option>SMS</option>
            </select>
          </label>
        </div>
      </div>

      <div class="panel">
        <h2>Email template management</h2>
        <p class="panel-subtitle">
          Control the messaging for new links, reminders, and receipts.
        </p>
        <div class="template-list">
          <div class="template-item">
            <div>
              <h3>Payment link created</h3>
              <p class="muted">Sent when a new link is generated.</p>
            </div>
            <button class="ghost-btn inline-btn" type="button">Edit</button>
          </div>
          <div class="template-item">
            <div>
              <h3>Payment reminder</h3>
              <p class="muted">Used for scheduled nudges.</p>
            </div>
            <button class="ghost-btn inline-btn" type="button">Edit</button>
          </div>
          <div class="template-item">
            <div>
              <h3>Receipt confirmation</h3>
              <p class="muted">Sent after successful payment.</p>
            </div>
            <button class="ghost-btn inline-btn" type="button">Edit</button>
          </div>
        </div>
      </div>

      <div class="panel">
        <h2>Notifications</h2>
        <div class="toggle-list">
          <label class="switch">
            <input type="checkbox" checked />
            <span class="switch-ui"></span>
            Payouts completed
          </label>
          <label class="switch">
            <input type="checkbox" checked />
            <span class="switch-ui"></span>
            New payment received
          </label>
          <label class="switch">
            <input type="checkbox" />
            <span class="switch-ui"></span>
            Weekly performance summary
          </label>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: 20px;
  box-shadow: var(--shadow-sm);
}

.panel h2 {
  margin: 0 0 16px;
}

.panel-subtitle {
  margin: -8px 0 16px;
  color: var(--muted);
  font-size: 13px;
}

.form {
  display: grid;
  gap: 14px;
}

.field {
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: var(--text-2);
}

.field input,
.field select {
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  font-size: 14px;
}

.field input:focus,
.field select:focus {
  border-color: var(--accent-400);
  box-shadow: 0 0 0 3px var(--focus);
}

.inline-btn {
  justify-self: flex-start;
}

.template-list {
  display: grid;
  gap: 12px;
}

.template-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: var(--surface-2);
}

.template-item h3 {
  margin: 0 0 4px;
  font-size: 14px;
}

.template-item p {
  margin: 0;
}

.toggle-list {
  display: grid;
  gap: 12px;
}

.switch {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--text-2);
}

.switch input {
  display: none;
}

.switch-ui {
  width: 36px;
  height: 20px;
  border-radius: 999px;
  background: var(--surface-2);
  position: relative;
  border: 1px solid var(--border);
  transition: background 0.2s ease;
}

.switch-ui::after {
  content: "";
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  position: absolute;
  top: 2px;
  left: 2px;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease;
}

.switch input:checked + .switch-ui {
  background: var(--accent-500);
  border-color: var(--accent-500);
}

.switch input:checked + .switch-ui::after {
  transform: translateX(16px);
}

.ghost-btn {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  padding: 10px 14px;
  border-radius: 999px;
  cursor: pointer;
}

.ghost-btn:hover {
  border-color: var(--border-2);
}

.muted {
  color: var(--muted);
}

@media (max-width: 1023px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
