<template>
  <section class="dashboard">
    <div class="page-header">
      <div>
        <h1>Overview</h1>
        <p class="muted">Your payment performance at a glance.</p>
      </div>
      <div class="actions">
        <button class="ghost-btn">Download report</button>
        <button class="primary-btn">Create link</button>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="label">Total volume</div>
        <div class="value">$48,920</div>
        <div class="delta success">+18% this month</div>
      </div>
      <div class="kpi-card">
        <div class="label">Active links</div>
        <div class="value">24</div>
        <div class="delta info">6 expiring soon</div>
      </div>
      <div class="kpi-card">
        <div class="label">Conversion rate</div>
        <div class="value">72%</div>
        <div class="delta warning">-3% vs last month</div>
      </div>
      <div class="kpi-card">
        <div class="label">Pending payouts</div>
        <div class="value">$3,240</div>
        <div class="delta">Next payout Feb 2</div>
      </div>
    </div>

    <div class="grid">
      <div class="panel">
        <div class="panel-header">
          <h2>Recent activity</h2>
          <button class="ghost-btn small">View all</button>
        </div>
        <div class="list">
          <div class="list-row">
            <div>
              <div class="title">Acme Studio</div>
              <div class="sub">Website redesign deposit</div>
            </div>
            <div class="amount success-text">+$2,500</div>
          </div>
          <div class="list-row">
            <div>
              <div class="title">Northwind</div>
              <div class="sub">Monthly retainer</div>
            </div>
            <div class="amount success-text">+$1,200</div>
          </div>
          <div class="list-row">
            <div>
              <div class="title">Studio 47</div>
              <div class="sub">Brand workshop</div>
            </div>
            <div class="amount danger-text">-$800</div>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <h2>Top links</h2>
          <button class="ghost-btn small">Manage</button>
        </div>
        <div class="list">
          <div class="list-row">
            <div>
              <div class="title">Website redesign deposit</div>
              <div class="sub">24 payments</div>
            </div>
            <div class="amount">$18,400</div>
          </div>
          <div class="list-row">
            <div>
              <div class="title">Monthly retainer</div>
              <div class="sub">12 payments</div>
            </div>
            <div class="amount">$9,600</div>
          </div>
          <div class="list-row">
            <div>
              <div class="title">Brand workshop</div>
              <div class="sub">6 payments</div>
            </div>
            <div class="amount">$4,800</div>
          </div>
        </div>
      </div>
    </div>

    <div class="panel wide">
      <div class="panel-header">
        <h2>Payouts</h2>
        <button class="ghost-btn small">View schedule</button>
      </div>
      <div class="table">
        <div class="row header">
          <span>Date</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Destination</span>
        </div>
        <div class="row">
          <div class="cell">Feb 2, 2026</div>
          <div class="cell">$3,240.00</div>
          <div class="cell">
            <span class="pill warning">Processing</span>
          </div>
          <div class="cell">Bank •••• 4921</div>
        </div>
        <div class="row">
          <div class="cell">Jan 26, 2026</div>
          <div class="cell">$6,820.00</div>
          <div class="cell">
            <span class="pill success">Completed</span>
          </div>
          <div class="cell">Bank •••• 4921</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup></script>

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
