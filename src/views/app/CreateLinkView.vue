<template>
  <section class="create-link">
    <div class="page-header">
      <div>
        <h1>Create a payment link</h1>
        <p class="muted">
          Customize a link and share it with your customer in seconds.
        </p>
      </div>
      <button class="ghost-btn">Preview</button>
    </div>

    <div class="layout">
      <div class="panel">
        <h2>Link details</h2>
        <form class="form">
          <label class="field">
            <span>Customer name</span>
            <input v-model="form.customerName" type="text" placeholder="Alex Rivera" />
          </label>

          <label class="field">
            <span>Customer email</span>
            <input v-model="form.customerEmail" type="email" placeholder="alex@studio.io" />
          </label>

          <div class="two-col">
            <label class="field">
              <span>Company</span>
              <input v-model="form.customerCompany" type="text" placeholder="Rivera Studio" />
            </label>
            <label class="field">
              <span>Phone number</span>
              <input v-model="form.customerPhone" type="tel" placeholder="+1 (555) 120-4820" />
            </label>
          </div>

          <label class="field">
            <span>Link name</span>
            <input v-model="form.linkName" type="text" placeholder="Website redesign deposit" />
          </label>

          <label class="field">
            <span>Amount</span>
            <div class="input-row">
              <span class="pill">USD</span>
              <input v-model="form.amount" type="number" placeholder="2500" />
            </div>
          </label>

          <label class="field">
            <span>Description</span>
            <textarea v-model="form.description" rows="4" placeholder="What is this payment for?"></textarea>
          </label>

          <div class="two-col">
            <label class="field">
              <span>Expires</span>
              <input v-model="form.expires" type="date" />
            </label>
            <label class="field">
              <span>Invoice #</span>
              <input v-model="form.invoice" type="text" placeholder="INV-2041" />
            </label>
          </div>

          <div class="toggle-row">
            <label class="switch">
              <input v-model="form.requireShipping" type="checkbox" />
              <span class="switch-ui"></span>
              Require shipping address
            </label>
            <label class="switch">
              <input v-model="form.allowTips" type="checkbox" />
              <span class="switch-ui"></span>
              Allow tips
            </label>
          </div>
        </form>
      </div>

      <div class="panel summary">
        <h2>Summary</h2>
        <div class="summary-card">
          <div class="summary-row">
            <span class="muted">Amount</span>
            <strong>$2,500.00</strong>
          </div>
          <div class="summary-row">
            <span class="muted">Processing</span>
            <strong>$72.50</strong>
          </div>
          <div class="summary-row total">
            <span>Total received</span>
            <strong>$2,427.50</strong>
          </div>
        </div>
        <button class="primary-btn">Create link</button>
        <button class="ghost-btn full">Save draft</button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "CreateLinkView",
  data() {
    return {
      form: {
        customerName: "",
        customerEmail: "",
        customerCompany: "",
        customerPhone: "",
        linkName: "",
        amount: "",
        description: "",
        expires: "",
        invoice: "",
        requireShipping: true,
        allowTips: false,
      },
    };
  },
  mounted() {
    const { query } = this.$route;
    const prefillMap = {
      customerName: query.customerName,
      customerEmail: query.customerEmail,
      customerCompany: query.customerCompany,
      customerPhone: query.customerPhone,
    };

    Object.entries(prefillMap).forEach(([key, value]) => {
      if (typeof value === "string" && value.trim()) {
        this.form[key] = value;
      }
    });
  },
};
</script>

<style scoped>
.create-link {
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

.layout {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
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
.field textarea {
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  font-size: 14px;
}

.field input:focus,
.field textarea:focus {
  border-color: var(--accent-400);
  box-shadow: 0 0 0 3px var(--focus);
}

.input-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pill {
  background: var(--accent-50);
  border: 1px solid var(--accent-200);
  color: var(--accent-700);
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.two-col {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.toggle-row {
  display: grid;
  gap: 10px;
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

.summary {
  display: grid;
  gap: 14px;
  align-content: start;
}

.summary-card {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 16px;
  display: grid;
  gap: 10px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-row.total {
  border-top: 1px dashed var(--border-2);
  padding-top: 10px;
}

.primary-btn {
  background: var(--accent-600);
  color: #fff;
  border: none;
  padding: 11px 12px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
}

.ghost-btn {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  padding: 10px 12px;
  border-radius: 12px;
  cursor: pointer;
}

.ghost-btn.full {
  width: 100%;
}

.muted {
  color: var(--muted);
}

@media (max-width: 1023px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .two-col {
    grid-template-columns: 1fr;
  }
}
</style>
