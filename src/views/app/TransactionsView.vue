<template>
  <section class="transactions">
    <div class="page-header">
      <div>
        <h1>Transactions</h1>
        <p class="muted">Track payments, refunds, and payout status.</p>
      </div>
      <div class="actions">
        <button class="ghost-btn" :disabled="!transactions.length">Filter</button>
        <button class="primary-btn" :disabled="!transactions.length">Export CSV</button>
      </div>
    </div>

    <div v-if="loading" class="panel">
      <p class="muted">Loading transactions...</p>
    </div>
    <div v-else-if="error" class="panel">
      <p class="muted">{{ error }}</p>
    </div>
    <template v-else>
      <div class="summary">
        <div class="summary-card">
          <div class="label">Today</div>
          <div class="value">{{ formatMoney(summary.todayTotal, currency) }}</div>
          <div class="delta success">{{ summary.todayDelta || "-" }}</div>
        </div>
        <div class="summary-card">
          <div class="label">This week</div>
          <div class="value">{{ formatMoney(summary.weekTotal, currency) }}</div>
          <div class="delta info">{{ summary.weekDelta || "-" }}</div>
        </div>
        <div class="summary-card">
          <div class="label">Refunds</div>
          <div class="value">{{ formatMoney(summary.refundTotal, currency) }}</div>
          <div class="delta warning">{{ summary.refundNote || "-" }}</div>
        </div>
      </div>

      <div class="table">
        <div class="row header">
          <span>Customer</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Date</span>
          <span>Method</span>
        </div>

        <div v-if="!transactions.length" class="row empty-row">
          <div class="cell muted">No transactions yet.</div>
        </div>

        <div v-else v-for="transaction in transactions" :key="transaction.id || transaction.createdAt" class="row">
          <div class="cell">
            <div class="title">{{ transaction.customer || transaction.customerName || "-" }}</div>
            <div class="sub">{{ transaction.description || transaction.note || "-" }}</div>
          </div>
          <div class="cell">{{ formatMoney(transaction.amount, currency) }}</div>
          <div class="cell">
            <span class="pill" :class="statusClass(transaction.status)">
              {{ transaction.status || "-" }}
            </span>
          </div>
          <div class="cell">{{ formatDate(transaction.createdAt || transaction.date) }}</div>
          <div class="cell">{{ transaction.method || "-" }}</div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { listTransactions } from "@/services/transactionsApi";

const loading = ref(true);
const error = ref("");
const transactions = ref([]);
const summary = ref({
  todayTotal: null,
  todayDelta: "",
  weekTotal: null,
  weekDelta: "",
  refundTotal: null,
  refundNote: "",
});
const currency = ref("USD");

const loadTransactions = async () => {
  loading.value = true;
  error.value = "";
  const response = await listTransactions();
  if (response?.error) {
    error.value = response.error;
    transactions.value = [];
  } else {
    const data = response?.data || response || {};
    if (Array.isArray(data.transactions)) {
      transactions.value = data.transactions;
    } else if (Array.isArray(data.data)) {
      transactions.value = data.data;
    } else if (Array.isArray(data)) {
      transactions.value = data;
    } else {
      transactions.value = [];
    }
    summary.value = data.summary || summary.value;
    currency.value = data.currency || currency.value;
  }
  loading.value = false;
};

onMounted(loadTransactions);

const formatMoney = (value, currencyCode) => {
  if (value === null || value === undefined || value === "") return "-";
  const amount = Number(value);
  if (Number.isNaN(amount)) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode || "USD",
  }).format(amount);
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
};

const statusClass = (status) => {
  const value = String(status || "").toLowerCase();
  if (value === "paid" || value === "completed") return "success";
  if (value === "pending" || value === "processing") return "pending";
  if (value === "refunded" || value === "refund") return "refund";
  return "";
};
</script>

<style scoped>
.transactions {
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

.summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.summary-card {
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

.row.empty-row {
  grid-template-columns: 1fr;
}

.row.empty-row .cell {
  grid-column: 1 / -1;
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

.pill.pending {
  background: var(--info-bg);
  color: var(--info-text);
}

.pill.refund {
  background: var(--danger-bg);
  color: var(--danger-text);
}

.ghost-btn {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
}

.ghost-btn:disabled,
.primary-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
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

@media (max-width: 1023px) {
  .summary {
    grid-template-columns: 1fr;
  }

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

  .row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .row.header {
    display: none;
  }
}
</style>
