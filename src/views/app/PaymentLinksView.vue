<template>
  <section class="links">
    <div class="page-header">
      <div>
        <h1>Payment links</h1>
        <p class="muted">Create, share, and track your links in one place.</p>
      </div>
      <div class="actions">
        <button class="ghost-btn">Export</button>
        <button class="primary-btn" @click="showNewModal = true">New link</button>
      </div>
    </div>

    <div class="filters">
      <label class="search">
        <span class="sr-only">Search</span>
        <input type="search" placeholder="Search by name, customer, or status" />
      </label>
      <div class="chips">
        <button class="chip active">All</button>
        <button class="chip">Active</button>
        <button class="chip">Expired</button>
        <button class="chip">Drafts</button>
      </div>
    </div>

    <div class="table">
      <div class="row header">
        <span>Name</span>
        <span>Amount</span>
        <span>Status</span>
        <span>Created</span>
        <span>Actions</span>
      </div>

      <div v-if="loading" class="row empty-row">
        <div class="cell muted">Loading payment links...</div>
      </div>

      <div v-else-if="error" class="row empty-row">
        <div class="cell muted">{{ error }}</div>
      </div>

      <div v-else-if="!links.length" class="row empty-row">
        <div class="cell muted">No payment links yet.</div>
      </div>

      <div v-else v-for="link in links" :key="link.id" class="row">
        <div class="cell">
          <div class="title">{{ link.name }}</div>
          <div class="sub">{{ link.customer }}</div>
        </div>
        <div class="cell">{{ link.amount }}</div>
        <div class="cell">
          <span class="pill" :class="statusClass(link.status)">{{ link.statusLabel }}</span>
        </div>
        <div class="cell">{{ link.created }}</div>
        <div class="cell actions">
          <button class="ghost-btn small" @click="copyLink(link)">Copy link</button>
          <button class="ghost-btn small" @click="goToDetails(link.id)">View</button>
        </div>
      </div>
    </div>

    <div v-if="showNewModal" class="modal-backdrop" @click.self="showNewModal = false">
      <div class="modal">
        <div class="modal-header">
          <h2>Create payment link</h2>
          <button class="icon-btn" @click="showNewModal = false" aria-label="Close">
            <span class="close-icon"></span>
          </button>
        </div>
        <div class="modal-body">
          <div class="field">
            <label>Name</label>
            <input type="text" placeholder="e.g. Website redesign deposit" />
          </div>
          <div class="field">
            <label>Customer</label>
            <input type="text" placeholder="e.g. Acme Studio" />
          </div>
          <div class="field">
            <label>Amount</label>
            <input type="text" placeholder="$0.00" />
          </div>
          <div class="field">
            <label>Expires</label>
            <input type="date" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="ghost-btn" @click="showNewModal = false">Cancel</button>
          <button class="primary-btn">Create link</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { listPaymentLinks } from "@/services/paymentLinksApi";

const router = useRouter();
const links = ref([]);
const loading = ref(true);
const error = ref("");
const showNewModal = ref(false);

const loadLinks = async () => {
  loading.value = true;
  error.value = "";
  const response = await listPaymentLinks();
  if (response?.error) {
    error.value = response.error;
    links.value = [];
  } else {
    links.value = Array.isArray(response) ? response : response?.data || [];
  }
  loading.value = false;
};

onMounted(loadLinks);

const statusClass = (status) => {
  if (status === "active") return "success";
  if (status === "warning") return "warning";
  return "muted-pill";
};

const copyLink = async (link) => {
  if (!link?.linkUrl) return;
  try {
    await navigator.clipboard.writeText(link.linkUrl);
  } catch (error) {
    console.error("Failed to copy link", error);
  }
};

const goToDetails = (id) => {
  router.push({ name: "PaymentLinkDetails", params: { id } });
};
</script>

<style scoped>
.links {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.actions {
  display: flex;
  gap: 10px;
}

.filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.search input {
  min-width: 280px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  font-size: 14px;
}

.search input:focus {
  border-color: var(--accent-400);
  box-shadow: 0 0 0 3px var(--focus);
}

.chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.chip {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-2);
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  cursor: pointer;
}

.chip.active {
  background: var(--accent-50);
  border-color: var(--accent-200);
  color: var(--accent-700);
}

.table {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
}

.row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.2fr;
  gap: 12px;
  padding: 14px 18px;
  align-items: center;
  border-top: 1px solid var(--border);
}

.row.header {
  background: var(--surface-2);
  border-top: none;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--muted);
  font-weight: 600;
}

.title {
  font-weight: 600;
}

.sub {
  font-size: 12px;
  color: var(--muted);
  margin-top: 2px;
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

.ghost-btn.small {
  padding: 6px 10px;
  font-size: 12px;
}

.primary-btn {
  background: var(--accent-600);
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
}

.muted {
  color: var(--muted);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.empty-row {
  grid-template-columns: 1fr;
}

.empty-row .cell {
  grid-column: 1 / -1;
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

.field input {
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
  .row {
    grid-template-columns: 1.6fr 1fr 1fr;
  }

  .row span:nth-child(4),
  .row span:nth-child(5),
  .row .cell:nth-child(4),
  .row .cell:nth-child(5) {
    display: none;
  }
}

@media (max-width: 767px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .search input {
    min-width: 100%;
  }

  .row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .row.header {
    display: none;
  }
}
</style>
