<template>
  <section class="details">
    <div class="page-header">
      <div>
        <p class="breadcrumb">
          <RouterLink class="breadcrumb-link" to="/links">Payment links</RouterLink>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-current">Details</span>
        </p>
        <h1>{{ linkTitle || "Payment link not found" }}</h1>
        <p class="muted" v-if="link">{{ link.description || "-" }}</p>
      </div>
      <div class="actions" v-if="link">
        <button class="ghost-btn" @click="copyLink(link)">Copy link</button>
        <button class="primary-btn" @click="showEditModal = true">Edit link</button>
        <button
          v-if="link.status !== 'cancelled'"
          class="ghost-btn danger"
          @click="openDeactivateModal(link)"
        >
          Deactivate
        </button>
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
          <span class="pill" :class="statusClass(link.status)">{{ formatStatus(link) }}</span>
        </div>
        <div class="summary">
          <div>
            <div class="label">Amount</div>
            <div class="value">{{ formattedAmount }}</div>
          </div>
          <div>
            <div class="label">Customer</div>
            <div class="value">{{ customerName }}</div>
          </div>
          <div>
            <div class="label">Created</div>
            <div class="value">{{ formattedCreatedAt }}</div>
          </div>
          <div>
            <div class="label">Expires</div>
            <div class="value">{{ formattedExpiresAt }}</div>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <h2>Link details</h2>
        </div>
        <div class="summary">
          <div>
            <div class="label">Link URL</div>
            <div class="value link-text">
              <a v-if="quicklinkUrl" :href="quicklinkUrl" target="_blank" rel="noopener noreferrer">
                {{ quicklinkUrl }}
              </a>
              <span v-else>-</span>
            </div>
          </div>
          <div>
            <div class="label">Status</div>
            <div class="value">{{ formatStatus(link) }}</div>
          </div>
          <div>
            <div class="label">Provider</div>
            <div class="value">{{ providerLabel }}</div>
          </div>
          <div>
            <div class="label">Invoice</div>
            <div class="value">{{ link.invoice || "-" }}</div>
          </div>
          <div>
            <div class="label">Currency</div>
            <div class="value">{{ link.currency || "-" }}</div>
          </div>
        </div>
        <div class="link-actions">
          <button class="ghost-btn" :disabled="!quicklinkUrl" @click="copyLink(link)">
            Copy link
          </button>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <h2>Customer</h2>
        </div>
        <div class="summary">
          <div>
            <div class="label">Name</div>
            <div class="value">{{ customerName }}</div>
          </div>
          <div>
            <div class="label">Email</div>
            <div class="value">{{ link.customerEmail || "-" }}</div>
          </div>
          <div>
            <div class="label">Company</div>
            <div class="value">{{ link.customerCompany || "-" }}</div>
          </div>
          <div>
            <div class="label">Phone</div>
            <div class="value">{{ link.customerPhone || "-" }}</div>
          </div>
        </div>
      </div>


      <div class="panel wide">
        <div class="panel-header">
          <h2>Recent activity</h2>
        </div>
        <div v-if="events.length" class="activity">
          <div
            v-for="event in events"
            :key="event.id || event.createdAt || event.timestamp || event.type"
            class="activity-row"
          >
            <div>
              <div class="title">{{ event.title || event.type || "Event" }}</div>
              <div class="sub">{{ event.description || event.note || event.message || "-" }}</div>
            </div>
            <div class="timestamp">{{ formatDate(event.createdAt || event.timestamp) }}</div>
          </div>
        </div>
        <div v-else class="empty-state compact">
          <p>No activity yet.</p>
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

    <div v-if="showDeactivateModal" class="modal-backdrop" @click.self="closeDeactivateModal">
      <div class="modal">
        <div class="modal-header">
          <h2>Deactivate link</h2>
          <button class="icon-btn" @click="closeDeactivateModal" aria-label="Close">
            <span class="close-icon"></span>
          </button>
        </div>
        <div class="modal-body">
          <p>Deactivate this payment link? It will be marked as cancelled.</p>
        </div>
        <div class="modal-footer">
          <button class="ghost-btn" @click="closeDeactivateModal">Cancel</button>
          <button class="primary-btn" @click="deactivateLink(pendingDeactivate)">Deactivate</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { cancelPaymentLink, getPaymentLink } from "@/services/paymentLinksApi";

const route = useRoute();
const link = ref(null);
const loading = ref(true);
const error = ref("");
const showEditModal = ref(false);
const showDeactivateModal = ref(false);
const pendingDeactivate = ref(null);

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
  if (status === "cancelled") return "danger";
  return "muted-pill";
};

const formatStatus = (item) => {
  if (item?.statusLabel) return item.statusLabel;
  const status = item?.status || item?.link_status || item?.linkStatus || item?.state || "";
  if (status === "cancelled") return "Cancelled";
  if (status === "pending") return "Pending";
  if (status === "paid") return "Paid";
  if (status === "warning") return "Expires soon";
  if (status === "active") return "Active";
  if (status === "draft") return "Draft";
  return status || "-";
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const linkTitle = computed(() => link.value?.linkName || link.value?.name || "Payment link");
const customerName = computed(() => link.value?.customerName || link.value?.customer || "-");
const providerLabel = computed(() => {
  const provider = String(link.value?.provider || "").toLowerCase();
  if (provider === "adyen") return "Adyen";
  if (provider === "dummy") return "Dummy PSP";
  if (provider === "stripe") return "Stripe";
  return provider || "-";
});
const quicklinkUrl = computed(() => {
  if (link.value?.quicklinkUrl) return link.value.quicklinkUrl;
  if (link.value?.linkUrl) return link.value.linkUrl;
  if (link.value?.slug) return `${window.location.origin}/link/${link.value.slug}`;
  return "";
});
const formattedAmount = computed(() => {
  const amount = Number(link.value?.amount ?? 0);
  if (!amount) return "-";
  const currency = link.value?.currency || "USD";
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
});
const formattedCreatedAt = computed(() => formatDate(link.value?.createdAt || link.value?.created));
const formattedExpiresAt = computed(() => formatDate(link.value?.expiresAt || link.value?.expires));
const events = computed(() => (Array.isArray(link.value?.events) ? link.value.events : []));

const copyLink = async (item) => {
  const url = quicklinkUrl.value || item?.quicklinkUrl || item?.linkUrl;
  if (!url) return;
  try {
    await navigator.clipboard.writeText(url);
  } catch (error) {
    console.error("Failed to copy link", error);
  }
};

const openDeactivateModal = (item) => {
  if (!item) return;
  pendingDeactivate.value = item;
  showDeactivateModal.value = true;
};

const closeDeactivateModal = () => {
  showDeactivateModal.value = false;
  pendingDeactivate.value = null;
};

const deactivateLink = async (item) => {
  if (!item?.id) return;
  const response = await cancelPaymentLink(item.id);
  if (response?.error) {
    error.value = response.error;
    return;
  }
  item.status = "cancelled";
  item.statusLabel = "Cancelled";
  closeDeactivateModal();
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

.link-text a {
  color: inherit;
  text-decoration: none;
}

.link-text a:hover {
  text-decoration: underline;
}

.link-actions {
  display: flex;
  justify-content: flex-start;
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

.pill.danger {
  background: var(--danger-bg);
  color: var(--danger-text);
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

.ghost-btn.danger {
  border-color: rgba(239, 68, 68, 0.3);
  color: var(--danger-text);
}

.ghost-btn.danger:hover {
  border-color: rgba(239, 68, 68, 0.6);
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

.empty-state.compact {
  padding: 16px;
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




