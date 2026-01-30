<template>
  <section class="links">
    <div class="page-header">
      <div>
        <h1>Payment links</h1>
        <p class="muted">Create, share, and track your links in one place.</p>
      </div>
      <div class="actions">
        <button class="ghost-btn">Export</button>
        <button class="primary-btn">New link</button>
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

      <div class="row">
        <div class="cell">
          <div class="title">Website redesign deposit</div>
          <div class="sub">Acme Studio</div>
        </div>
        <div class="cell">$2,500.00</div>
        <div class="cell">
          <span class="pill success">Active</span>
        </div>
        <div class="cell">Jan 24, 2026</div>
        <div class="cell actions">
          <button class="ghost-btn small">Copy link</button>
          <button class="ghost-btn small">View</button>
        </div>
      </div>

      <div class="row">
        <div class="cell">
          <div class="title">Monthly retainer</div>
          <div class="sub">Northwind</div>
        </div>
        <div class="cell">$1,200.00</div>
        <div class="cell">
          <span class="pill warning">Expires soon</span>
        </div>
        <div class="cell">Jan 18, 2026</div>
        <div class="cell actions">
          <button class="ghost-btn small">Copy link</button>
          <button class="ghost-btn small">View</button>
        </div>
      </div>

      <div class="row">
        <div class="cell">
          <div class="title">Brand workshop</div>
          <div class="sub">Studio 47</div>
        </div>
        <div class="cell">$800.00</div>
        <div class="cell">
          <span class="pill muted-pill">Draft</span>
        </div>
        <div class="cell">Jan 10, 2026</div>
        <div class="cell actions">
          <button class="ghost-btn small">Edit</button>
          <button class="ghost-btn small">Delete</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup></script>

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
