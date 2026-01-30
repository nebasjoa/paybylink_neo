<template>
  <section class="transactions">
    <div class="page-header">
      <div>
        <h1>Transactions</h1>
        <p class="muted">Track payments, refunds, and payout status.</p>
      </div>
      <div class="actions">
        <button class="ghost-btn">Filter</button>
        <button class="primary-btn">Export CSV</button>
      </div>
    </div>

    <div class="summary">
      <div class="summary-card">
        <div class="label">Today</div>
        <div class="value">$4,280</div>
        <div class="delta success">+12% vs yesterday</div>
      </div>
      <div class="summary-card">
        <div class="label">This week</div>
        <div class="value">$18,940</div>
        <div class="delta info">+5% vs last week</div>
      </div>
      <div class="summary-card">
        <div class="label">Refunds</div>
        <div class="value">$320</div>
        <div class="delta warning">3 pending</div>
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

      <div class="row">
        <div class="cell">
          <div class="title">Acme Studio</div>
          <div class="sub">Web redesign deposit</div>
        </div>
        <div class="cell">$2,500.00</div>
        <div class="cell">
          <span class="pill success">Paid</span>
        </div>
        <div class="cell">Jan 30, 2026</div>
        <div class="cell">Visa •••• 4242</div>
      </div>

      <div class="row">
        <div class="cell">
          <div class="title">Northwind</div>
          <div class="sub">Monthly retainer</div>
        </div>
        <div class="cell">$1,200.00</div>
        <div class="cell">
          <span class="pill pending">Pending</span>
        </div>
        <div class="cell">Jan 29, 2026</div>
        <div class="cell">ACH transfer</div>
      </div>

      <div class="row">
        <div class="cell">
          <div class="title">Studio 47</div>
          <div class="sub">Brand workshop</div>
        </div>
        <div class="cell">$800.00</div>
        <div class="cell">
          <span class="pill refund">Refunded</span>
        </div>
        <div class="cell">Jan 27, 2026</div>
        <div class="cell">Mastercard •••• 1182</div>
      </div>
    </div>
  </section>
</template>

<script setup></script>

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
