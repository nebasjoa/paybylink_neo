<template>
  <section class="details">
    <div class="page-header">
      <div>
        <p class="breadcrumb">
          <RouterLink class="breadcrumb-link" to="/links">Payment links</RouterLink>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-current">Details</span>
        </p>
        <h1>{{ link?.name || "Payment link not found" }}</h1>
        <p class="muted" v-if="link">{{ link.description }}</p>
      </div>
      <div class="actions" v-if="link">
        <button class="ghost-btn" @click="copyLink(link)">Copy link</button>
        <button class="primary-btn" @click="showEditModal = true">Edit link</button>
      </div>
    </div>

    <div v-if="loading" class="empty-state">
      <p>Loading payment link...</p>
    </div>

    <div v-else-if="error" class="empty-state">
      <p>{{ error }}</p>
      <RouterLink class="primary-btn" to="/links">Back to payment links</RouterLink>
    </div>

    <div v-else-if="!link" class="empty-state">
      <p>We could not find this payment link. Return to the list to choose another.</p>
      <RouterLink class="primary-btn" to="/links">Back to payment links</RouterLink>
    </div>

    <div v-else class="grid">
      <div class="panel">
        <div class="panel-header">
          <h2>Summary</h2>
          <span class="pill" :class="statusClass(link.status)">{{ link.statusLabel }}</span>
        </div>
        <div class="summary">
          <div>
            <div class="label">Amount</div>
            <div class="value">{{ link.amount }}</div>
          </div>
          <div>
            <div class="label">Customer</div>
            <div class="value">{{ link.customer }}</div>
          </div>
          <div>
            <div class="label">Created</div>
            <div class="value">{{ link.created }}</div>
          </div>
          <div>
            <div class="label">Expires</div>
            <div class="value">{{ link.expires }}</div>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <h2>Performance</h2>
        </div>
        <div class="summary">
          <div>
            <div class="label">Payments</div>
            <div class="value">{{ link.payments }}</div>
          </div>
          <div>
            <div class="label">Collected</div>
            <div class="value">{{ link.totalCollected }}</div>
          </div>
          <div>
            <div class="label">Link URL</div>
            <div class="value link-text">{{ link.linkUrl }}</div>
          </div>
        </div>
      </div>

      <div class="panel wide">
        <div class="panel-header">
          <h2>Recent activity</h2>
        </div>
        <div class="activity">
          <div class="activity-row">
            <div>
              <div class="title">Link opened</div>
              <div class="sub">Marketing email campaign</div>
            </div>
            <div class="timestamp">Jan 29, 2026</div>
          </div>
          <div class="activity-row">
            <div>
              <div class="title">Payment completed</div>
              <div class="sub">Card ending 1442</div>
            </div>
            <div class="timestamp">Jan 27, 2026</div>
          </div>
          <div class="activity-row">
            <div>
              <div class="title">Reminder sent</div>
              <div class="sub">Automated reminder</div>
            </div>
            <div class="timestamp">Jan 25, 2026</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showEditModal && link" class="modal-backdrop" @click.self="showEditModal = false">
      <div class="modal">
        <div class="modal-header">
          <h2>Edit payment link</h2>
          <button class="icon-btn" @click="showEditModal = false" aria-label="Close">
            <span class="close-icon"></span>
          </button>
        </div>
        <div class="modal-body">
          <div class="field">
            <label>Name</label>
            <input type="text" :value="link.name" />
          </div>
          <div class="field">
            <label>Customer</label>
            <input type="text" :value="link.customer" />
          </div>
          <div class="field">
            <label>Amount</label>
            <input type="text" :value="link.amount" />
          </div>
          <div class="field">
            <label>Status</label>
            <select :value="link.status">
              <option value="active">Active</option>
              <option value="warning">Expires soon</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="ghost-btn" @click="showEditModal = false">Cancel</button>
          <button class="primary-btn">Save changes</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { getPaymentLink } from "@/services/paymentLinksApi";

const route = useRoute();
const link = ref(null);
const loading = ref(true);
const error = ref("");
const showEditModal = ref(false);

const loadLink = async (id) => {
  loading.value = true;
  error.value = "";
  const response = await getPaymentLink(id);
  if (response?.error) {
    error.value = response.error;
    link.value = null;
  } else {
    link.value = response?.data || response || null;
  }
  loading.value = false;
};

watch(
  () => route.params.id,
  (id) => loadLink(id),
  { immediate: true }
);

const statusClass = (status) => {
  if (status === "active") return "success";
  if (status === "warning") return "warning";
  return "muted-pill";
};

const copyLink = async (item) => {
  if (!item?.linkUrl) return;
  try {
    await navigator.clipboard.writeText(item.linkUrl);
  } catch (error) {
    console.error("Failed to copy link", error);
  }
};
</script>

<style scoped>
.details {
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

.breadcrumb {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  margin: 0 0 10px;
}

.breadcrumb-link {
  color: var(--accent-700);
  text-decoration: none;
  font-weight: 600;
}

.breadcrumb-sep {
  color: var(--muted);
}

.breadcrumb-current {
  color: var(--muted);
}

.actions {
  display: flex;
  gap: 10px;
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
  display: grid;
  gap: 16px;
}

.panel.wide {
  grid-column: span 2;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.label {
  color: var(--muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.value {
  font-size: 16px;
  font-weight: 600;
  margin-top: 4px;
}

.link-text {
  font-size: 13px;
  color: var(--accent-700);
  word-break: break-all;
}

.activity {
  display: grid;
  gap: 12px;
}

.activity-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px dashed var(--border);
}

.activity-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.title {
  font-weight: 600;
}

.sub {
  font-size: 12px;
  color: var(--muted);
  margin-top: 2px;
}

.timestamp {
  font-size: 12px;
  color: var(--muted);
}

.pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.pill.success {
  background: var(--success-bg);
  color: var(--success-text);
}

.pill.warning {
  background: var(--warning-bg);
  color: var(--warning-text);
}

.pill.muted-pill {
  background: var(--surface-2);
  color: var(--muted);
}

.ghost-btn {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
}

.primary-btn {
  background: var(--accent-600);
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.muted {
  color: var(--muted);
}

.empty-state {
  background: var(--surface);
  border: 1px dashed var(--border);
  border-radius: var(--r-lg);
  padding: 24px;
  display: grid;
  gap: 12px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: grid;
  place-items: center;
  z-index: 50;
  padding: 20px;
}

.modal {
  width: min(520px, 100%);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-lg, 0 20px 40px rgba(15, 23, 42, 0.2));
  display: grid;
  gap: 16px;
  padding: 20px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.modal-body {
  display: grid;
  gap: 12px;
}

.field {
  display: grid;
  gap: 6px;
}

.field label {
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.field input,
.field select {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  font-size: 14px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--surface);
  display: grid;
  place-items: center;
  cursor: pointer;
}

.close-icon,
.close-icon::before {
  content: "";
  width: 12px;
  height: 2px;
  background: var(--text);
  display: block;
  transform: rotate(45deg);
}

.close-icon::before {
  transform: rotate(-90deg);
}

@media (max-width: 1023px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .panel.wide {
    grid-column: span 1;
  }

  .summary {
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
