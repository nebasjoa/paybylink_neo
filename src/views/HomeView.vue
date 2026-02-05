<template>
  <section class="dashboard">
    <div class="page-header">
      <div>
        <h1>Overview</h1>
        <p class="muted">Your payment performance at a glance.</p>
      </div>
      <div class="actions">
        <button class="ghost-btn" :disabled="!reportUrl" @click="downloadReport">
          Download report
        </button>
        <RouterLink class="primary-btn" to="/links/new">Create link</RouterLink>
      </div>
    </div>

    <div v-if="loading" class="panel">
      <p class="muted">Loading dashboard...</p>
    </div>
    <div v-else-if="error" class="panel">
      <p class="muted">{{ error }}</p>
    </div>
    <template v-else>
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="label">Total volume</div>
          <div class="value">{{ formatMoney(kpis.totalVolume, currency) }}</div>
          <div class="delta" :class="kpis.totalVolumeDeltaClass">
            {{ kpis.totalVolumeDelta || "-" }}
          </div>
        </div>
        <div class="kpi-card">
          <div class="label">Active links</div>
          <div class="value">{{ formatNumber(kpis.activeLinks) }}</div>
          <div class="delta info">{{ kpis.activeLinksNote || "-" }}</div>
        </div>
        <div class="kpi-card">
          <div class="label">Conversion rate</div>
          <div class="value">{{ formatPercent(kpis.conversionRate) }}</div>
          <div class="delta warning">{{ kpis.conversionRateDelta || "-" }}</div>
        </div>
        <div class="kpi-card">
          <div class="label">Pending payouts</div>
          <div class="value">{{ formatMoney(kpis.pendingPayouts, currency) }}</div>
          <div class="delta">
            {{ kpis.nextPayoutDate ? `Next payout ${formatDate(kpis.nextPayoutDate)}` : "-" }}
          </div>
        </div>
      </div>

      <div class="grid">
        <div class="panel">
          <div class="panel-header">
            <h2>Recent activity</h2>
            <button class="ghost-btn small" :disabled="!recentActivity.length">View all</button>
          </div>
          <div v-if="!recentActivity.length" class="list empty">
            <p class="muted">No recent activity yet.</p>
          </div>
          <div v-else class="list">
            <div v-for="activity in recentActivity" :key="activity.id || activity.createdAt" class="list-row">
              <div>
                <div class="title">{{ activity.title || activity.customer || "-" }}</div>
                <div class="sub">{{ activity.description || activity.note || "-" }}</div>
              </div>
              <div class="amount" :class="amountClass(activity.amount)">
                {{ formatMoney(activity.amount, currency, true) }}
              </div>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <h2>Top links</h2>
            <button class="ghost-btn small" :disabled="!topLinks.length">Manage</button>
          </div>
          <div v-if="!topLinks.length" class="list empty">
            <p class="muted">No links to show yet.</p>
          </div>
          <div v-else class="list">
            <div v-for="link in topLinks" :key="link.id || link.linkId" class="list-row">
              <div>
                <div class="title">{{ link.title || link.name || link.linkName || "-" }}</div>
                <div class="sub">{{ link.subtitle || link.note || "-" }}</div>
              </div>
              <div class="amount">{{ formatMoney(link.amount, currency) }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="panel wide">
        <div class="panel-header">
          <h2>Payouts</h2>
          <button class="ghost-btn small" :disabled="!payouts.length">View schedule</button>
        </div>
        <div class="table">
          <div class="row header">
            <span>Date</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Destination</span>
          </div>
          <div v-if="!payouts.length" class="row empty-row">
            <div class="cell muted">No payouts available.</div>
          </div>
          <div v-else v-for="payout in payouts" :key="payout.id || payout.date" class="row">
            <div class="cell">{{ formatDate(payout.date) }}</div>
            <div class="cell">{{ formatMoney(payout.amount, currency) }}</div>
            <div class="cell">
              <span class="pill" :class="statusClass(payout.status)">{{ payout.status || "-" }}</span>
            </div>
            <div class="cell">{{ payout.destination || "-" }}</div>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { getDashboard } from "@/services/dashboardApi";

const loading = ref(true);
const error = ref("");
const dashboard = ref(null);

const loadDashboard = async () => {
  loading.value = true;
  error.value = "";
  const response = await getDashboard();
  if (response?.error) {
    error.value = response.error;
    dashboard.value = null;
  } else {
    dashboard.value = response?.data || response || null;
  }
  loading.value = false;
};

onMounted(loadDashboard);

const kpis = computed(() => dashboard.value?.kpis || {});
const recentActivity = computed(() =>
  Array.isArray(dashboard.value?.recentActivity) ? dashboard.value.recentActivity : []
);
const topLinks = computed(() =>
  Array.isArray(dashboard.value?.topLinks) ? dashboard.value.topLinks : []
);
const payouts = computed(() =>
  Array.isArray(dashboard.value?.payouts) ? dashboard.value.payouts : []
);
const reportUrl = computed(() => dashboard.value?.reportUrl || "");
const currency = computed(() => dashboard.value?.currency || "USD");

const formatMoney = (value, currencyCode, showSign = false) => {
  if (value === null || value === undefined || value === "") return "-";
  const amount = Number(value);
  if (Number.isNaN(amount)) return "-";
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode || "USD",
    signDisplay: showSign ? "always" : "auto",
  }).format(amount);
  return formatted;
};

const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  const amount = Number(value);
  if (Number.isNaN(amount)) return "-";
  return new Intl.NumberFormat("en-US").format(amount);
};

const formatPercent = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  const amount = Number(value);
  if (Number.isNaN(amount)) return "-";
  const percent = amount > 1 ? amount : amount * 100;
  return `${percent.toFixed(0)}%`;
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
};

const amountClass = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const amount = Number(value);
  if (Number.isNaN(amount)) return "";
  if (amount < 0) return "danger-text";
  if (amount > 0) return "success-text";
  return "";
};

const statusClass = (status) => {
  const value = String(status || "").toLowerCase();
  if (value === "completed" || value === "paid") return "success";
  if (value === "processing" || value === "pending") return "warning";
  return "muted-pill";
};

const downloadReport = () => {
  if (!reportUrl.value) return;
  window.open(reportUrl.value, "_blank", "noopener,noreferrer");
};
</script>

<style scoped>
.dashboard {
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

.actions {
  display: flex;
  gap: 10px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.kpi-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: 16px;
  box-shadow: var(--shadow-sm);
  display: grid;
  gap: 6px;
}

.label {
  color: var(--muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.value {
  font-size: 22px;
  font-weight: 700;
}

.delta {
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
}

.delta.success {
  color: var(--success);
}

.delta.info {
  color: var(--info);
}

.delta.warning {
  color: var(--warning);
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
  gap: 12px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.list {
  display: grid;
  gap: 12px;
}

.list.empty {
  padding: 8px 0;
}

.list-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px dashed var(--border);
}

.list-row:last-child {
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

.amount {
  font-weight: 600;
}

.success-text {
  color: var(--success);
}

.danger-text {
  color: var(--danger);
}

.table {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1.2fr;
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

.row.empty-row {
  grid-template-columns: 1fr;
}

.row.empty-row .cell {
  grid-column: 1 / -1;
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

.ghost-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
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
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.muted {
  color: var(--muted);
}

@media (max-width: 1200px) {
  .kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 1023px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .row {
    grid-template-columns: 1fr 1fr;
  }

  .row span:nth-child(3),
  .row span:nth-child(4),
  .row .cell:nth-child(3),
  .row .cell:nth-child(4) {
    display: none;
  }
}

@media (max-width: 767px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .kpi-grid {
    grid-template-columns: 1fr;
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
