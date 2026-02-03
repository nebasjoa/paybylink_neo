<template>
  <section class="settings">
    <div class="page-header">
      <div>
        <h1>Settings</h1>
        <p class="muted">Manage your workspace preferences and payouts.</p>
      </div>
      <button class="ghost-btn" :disabled="saving" @click="handleSave">
        {{ saving ? "Saving..." : "Save changes" }}
      </button>
    </div>

    <div class="grid">
      <div class="panel">
        <h2>Profile</h2>
        <div class="form">
          <label class="field">
            <span>Full name</span>
            <input v-model="form.profile.fullName" type="text" placeholder="Nebojsa Stojanovic" />
          </label>
          <label class="field">
            <span>Email</span>
            <input v-model="form.profile.email" type="email" placeholder="nebojsa@paybylink.com" />
          </label>
          <label class="field">
            <span>Role</span>
            <input v-model="form.profile.role" type="text" placeholder="Owner" />
          </label>
        </div>
      </div>

      <div class="panel">
        <h2>Business</h2>
        <div class="form">
          <label class="field">
            <span>Business name</span>
            <input v-model="form.business.name" type="text" placeholder="PayByLink LLC" />
          </label>
          <label class="field">
            <span>Support email</span>
            <input v-model="form.business.supportEmail" type="email" placeholder="support@paybylink.com" />
          </label>
          <label class="field">
            <span>Default currency</span>
            <select v-model="form.business.defaultCurrency">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </label>
        </div>
      </div>

      <div class="panel">
        <h2>Payouts</h2>
        <div class="form">
          <label class="field">
            <span>Bank account</span>
            <input v-model="form.payouts.bankAccount" type="text" placeholder="**** 4921" />
          </label>
          <label class="field">
            <span>Payout schedule</span>
            <select v-model="form.payouts.schedule">
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </label>
          <label class="field">
            <span>Statement descriptor</span>
            <input
              v-model="form.payouts.statementDescriptor"
              type="text"
              placeholder="PAYBYLINK*STUDIO"
            />
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
            <select v-model="form.providers.provider">
              <option>Stripe</option>
              <option>Adyen</option>
              <option>PayPal</option>
              <option>Dummy PSP</option>
            </select>
          </label>
          <label class="field">
            <span>Merchant account ID</span>
            <input v-model="form.providers.merchantAccountId" type="text" placeholder="acct_1234..." />
          </label>
          <label class="field">
            <span>API key</span>
            <input v-model="form.providers.apiKey" type="password" placeholder="sk_live_********" />
          </label>
          <label v-if="isDev" class="field">
            <span>Display ID (dev only)</span>
            <input v-model="form.providers.displayId" type="text" placeholder="test-display-id" />
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
            <select v-model="form.linkDelivery.sendVia">
              <option value="Email">Email</option>
              <option value="SMS">SMS</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Copy link">Copy link</option>
            </select>
          </label>
          <label class="field">
            <span>Fallback channel</span>
            <select v-model="form.linkDelivery.fallbackChannel">
              <option value="None">None</option>
              <option value="Email">Email</option>
              <option value="SMS">SMS</option>
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
            <input v-model="form.notifications.payoutsCompleted" type="checkbox" />
            <span class="switch-ui"></span>
            Payouts completed
          </label>
          <label class="switch">
            <input v-model="form.notifications.newPaymentReceived" type="checkbox" />
            <span class="switch-ui"></span>
            New payment received
          </label>
          <label class="switch">
            <input v-model="form.notifications.weeklySummary" type="checkbox" />
            <span class="switch-ui"></span>
            Weekly performance summary
          </label>
        </div>
      </div>
    </div>

    <p v-if="error" class="form-message error">{{ error }}</p>
    <p v-else-if="success" class="form-message success">{{ success }}</p>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { getSettings, saveSettings } from "@/services/settingsApi";

const saving = ref(false);
const error = ref("");
const success = ref("");
const isDev = import.meta.env.VITE_ENV === "development";

const defaultSettings = () => ({
  profile: {
    fullName: "",
    email: "",
    role: "",
  },
  business: {
    name: "",
    supportEmail: "",
    defaultCurrency: "USD",
  },
  payouts: {
    bankAccount: "",
    schedule: "Weekly",
    statementDescriptor: "",
  },
  providers: {
    provider: "Stripe",
    merchantAccountId: "",
    apiKey: "",
    displayId: "",
  },
  linkDelivery: {
    sendVia: "Email",
    fallbackChannel: "None",
  },
  notifications: {
    payoutsCompleted: true,
    newPaymentReceived: true,
    weeklySummary: false,
  },
});

const form = reactive(defaultSettings());

const applySettings = (data) => {
  const safe = data || {};
  form.profile.fullName = safe.profile?.fullName ?? "";
  form.profile.email = safe.profile?.email ?? "";
  form.profile.role = safe.profile?.role ?? "";

  form.business.name = safe.business?.name ?? "";
  form.business.supportEmail = safe.business?.supportEmail ?? "";
  form.business.defaultCurrency = safe.business?.defaultCurrency ?? "USD";

  form.payouts.bankAccount = safe.payouts?.bankAccount ?? "";
  form.payouts.schedule = safe.payouts?.schedule ?? "Weekly";
  form.payouts.statementDescriptor = safe.payouts?.statementDescriptor ?? "";

  form.providers.provider = safe.providers?.provider ?? "Stripe";
  form.providers.merchantAccountId = safe.providers?.merchantAccountId ?? "";
  form.providers.apiKey = safe.providers?.apiKey ?? "";
  form.providers.displayId = safe.providers?.displayId ?? "";

  form.linkDelivery.sendVia = safe.linkDelivery?.sendVia ?? "Email";
  form.linkDelivery.fallbackChannel = safe.linkDelivery?.fallbackChannel ?? "None";

  form.notifications.payoutsCompleted = safe.notifications?.payoutsCompleted ?? true;
  form.notifications.newPaymentReceived = safe.notifications?.newPaymentReceived ?? true;
  form.notifications.weeklySummary = safe.notifications?.weeklySummary ?? false;
};

const loadSettings = async () => {
  error.value = "";
  const response = await getSettings();
  if (response?.error) {
    error.value = response.error;
    return;
  }
  applySettings(response?.data || response);
};

const handleSave = async () => {
  saving.value = true;
  error.value = "";
  success.value = "";

  const payload = {
    profile: { ...form.profile },
    business: { ...form.business },
    payouts: { ...form.payouts },
    providers: { ...form.providers },
    linkDelivery: { ...form.linkDelivery },
    notifications: { ...form.notifications },
  };

  const response = await saveSettings(payload);
  if (response?.error) {
    error.value = response.error;
  } else {
    success.value = "Settings saved successfully.";
    applySettings(response?.data || payload);
  }
  saving.value = false;
};

onMounted(loadSettings);
</script>

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
  color: var(--text);
}

.field select option {
  color: var(--text);
  background: var(--surface);
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

.form-message {
  margin: 0;
  font-size: 13px;
}

.form-message.error {
  color: var(--danger);
}

.form-message.success {
  color: var(--success);
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



