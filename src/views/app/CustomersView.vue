<template>
  <section class="customers">
    <div class="page-header">
      <div>
        <h1>Customers</h1>
        <p class="muted">
          Add customers and jump straight into link creation with their details prefilled.
        </p>
      </div>
      <button class="ghost-btn" @click="scrollToForm">Add customer</button>
    </div>

    <div class="layout">
      <div ref="formPanel" class="panel">
        <h2>Add a customer</h2>
        <form class="form" @submit.prevent="addCustomer">
          <label class="field">
            <span>Customer name</span>
            <input v-model="form.name" type="text" placeholder="Alex Rivera" required />
          </label>

          <label class="field">
            <span>Email address</span>
            <input v-model="form.email" type="email" placeholder="alex@studio.io" required />
          </label>

          <div class="two-col">
            <label class="field">
              <span>Company</span>
              <input v-model="form.company" type="text" placeholder="Rivera Studio" />
            </label>
            <label class="field">
              <span>Phone number</span>
              <input v-model="form.phone" type="tel" placeholder="+1 (555) 120-4820" />
            </label>
          </div>

          <label class="field">
            <span>Notes</span>
            <textarea v-model="form.notes" rows="3" placeholder="Preferred billing cadence, context, etc."></textarea>
          </label>

          <button class="primary-btn" type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? "Saving..." : "Save customer" }}
          </button>
          <p v-if="submitError" class="form-message error">{{ submitError }}</p>
          <p v-else-if="submitSuccess" class="form-message success">{{ submitSuccess }}</p>
        </form>
      </div>

      <div class="panel">
        <div class="panel-header">
          <div>
            <h2>Customer list</h2>
            <p class="muted">{{ filteredCustomers.length }} active customers</p>
          </div>
          <label class="search">
            <span class="sr-only">Search customers</span>
            <input v-model="search" type="search" placeholder="Search customers" />
          </label>
        </div>

        <div class="customer-list">
          <div v-if="loading" class="customer-card muted">Loading customers...</div>
          <div v-else-if="loadError" class="customer-card muted">{{ loadError }}</div>
          <div v-else-if="!filteredCustomers.length" class="customer-card muted">No customers yet.</div>
          <div v-else v-for="customer in filteredCustomers" :key="customer.id" class="customer-card">
            <div class="customer-main">
              <div>
                <div class="customer-name">{{ customer.name }}</div>
                <div class="customer-meta">
                  <span>{{ customer.email }}</span>
                  <span v-if="customer.company">• {{ customer.company }}</span>
                </div>
              </div>
              <div class="customer-tags">
                <span class="pill" v-if="customer.phone">{{ customer.phone }}</span>
                <span class="tag">{{ customer.lastActivity }}</span>
              </div>
            </div>
            <p v-if="customer.notes" class="customer-notes">{{ customer.notes }}</p>
            <div class="customer-actions">
              <button class="ghost-btn" @click="createLink(customer)">Create link</button>
              <button class="ghost-btn subtle">View profile</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { createCustomer, listCustomers } from "@/services/customersApi";

export default {
  name: "CustomersView",
  data() {
    return {
      search: "",
      isSubmitting: false,
      submitError: "",
      submitSuccess: "",
      loading: true,
      loadError: "",
      form: {
        name: "",
        email: "",
        company: "",
        phone: "",
        notes: "",
      },
      customers: [],
    };
  },
  mounted() {
    this.loadCustomers();
  },
  computed: {
    filteredCustomers() {
      const query = this.search.trim().toLowerCase();
      if (!query) {
        return this.customers;
      }
      return this.customers.filter((customer) => {
        return [customer.name, customer.email, customer.company, customer.phone]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query));
      });
    },
  },
  methods: {
    async loadCustomers() {
      this.loading = true;
      this.loadError = "";
      const response = await listCustomers();
      if (response?.error) {
        this.loadError = response.error;
        this.customers = [];
      } else {
        this.customers = Array.isArray(response) ? response : response?.data || [];
      }
      this.loading = false;
    },
    async addCustomer() {
      this.isSubmitting = true;
      this.submitError = "";
      this.submitSuccess = "";

      const payload = {
        name: this.form.name.trim(),
        email: this.form.email.trim(),
        company: this.form.company.trim(),
        phone: this.form.phone.trim(),
        notes: this.form.notes.trim(),
      };

      const response = await createCustomer(payload);
      if (response?.error) {
        this.submitError = response.error;
        this.isSubmitting = false;
        return;
      }

      const created = response?.data || response;
      const newCustomer = {
        id: created?.id || Date.now(),
        name: created?.name || payload.name,
        email: created?.email || payload.email,
        company: created?.company || payload.company,
        phone: created?.phone || payload.phone,
        notes: created?.notes || payload.notes,
        lastActivity: created?.lastActivity || "Just added",
      };
      this.customers = [newCustomer, ...this.customers];
      this.form = {
        name: "",
        email: "",
        company: "",
        phone: "",
        notes: "",
      };
      this.submitSuccess = "Customer saved successfully.";
      this.isSubmitting = false;
    },
    createLink(customer) {
      this.$router.push({
        name: "CreateLink",
        query: {
          customerName: customer.name,
          customerEmail: customer.email,
          customerCompany: customer.company,
          customerPhone: customer.phone,
        },
      });
    },
    scrollToForm() {
      if (this.$refs.formPanel) {
        this.$refs.formPanel.scrollIntoView({ behavior: "smooth" });
      }
    },
  },
};
</script>

<style scoped>
.customers {
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
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
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
  margin: 0 0 10px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
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

.two-col {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
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

.primary-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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

.ghost-btn {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  padding: 10px 12px;
  border-radius: 12px;
  cursor: pointer;
}

.ghost-btn.subtle {
  background: var(--surface-2);
}

.search input {
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--surface-2);
}

.customer-list {
  display: grid;
  gap: 14px;
}

.customer-card {
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 16px;
  background: var(--surface-2);
  display: grid;
  gap: 12px;
}

.customer-main {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.customer-name {
  font-weight: 600;
}

.customer-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 13px;
  color: var(--muted);
}

.customer-tags {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.pill {
  background: var(--accent-50);
  border: 1px solid var(--accent-200);
  color: var(--accent-700);
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.tag {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-2);
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.customer-notes {
  margin: 0;
  font-size: 13px;
  color: var(--text-2);
}

.customer-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
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

  .panel-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
