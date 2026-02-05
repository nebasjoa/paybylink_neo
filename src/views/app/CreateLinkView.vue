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
            <input v-model="form.customerName" type="text" placeholder="Customer name" />
          </label>

          <label class="field">
            <span>Customer email</span>
            <input
              v-model="form.customerEmail"
              type="email"
              placeholder="Customer email"
              required
            />
            <span v-if="fieldErrors.customerEmail" class="field-error">{{ fieldErrors.customerEmail }}</span>
          </label>

          <div class="two-col">
            <label class="field">
              <span>Company</span>
              <input v-model="form.customerCompany" type="text" placeholder="Company" />
            </label>
            <label class="field">
              <span>Phone number</span>
              <input v-model="form.customerPhone" type="tel" placeholder="Phone number" />
            </label>
          </div>

          <label class="field">
            <span>Link name</span>
            <input v-model="form.linkName" type="text" placeholder="Link name" />
          </label>

          <label class="field">
            <span>Amount</span>
            <div class="input-row">
              <span class="pill">{{ settings.currency || "USD" }}</span>
              <input v-model="form.amount" type="number" placeholder="Amount" required min="0.01" step="0.01" />
            </div>
            <span v-if="fieldErrors.amount" class="field-error">{{ fieldErrors.amount }}</span>
          </label>

          <label class="field">
            <span>Description</span>
            <textarea v-model="form.description" rows="4" placeholder="Payment description"></textarea>
          </label>

          <div class="two-col">
            <label class="field">
              <span>Expires</span>
              <input v-model="form.expires" type="date" />
            </label>
            <label class="field">
              <span>Invoice #</span>
              <input v-model="form.invoice" type="text" placeholder="Invoice number" />
            </label>
          </div>

          <label class="field">
            <span>Attach PDF invoice (optional)</span>
            <input
              class="file-input"
              type="file"
              accept=".pdf,application/pdf"
              @change="handleInvoiceUpload"
            />
            <span v-if="invoiceError" class="field-error">{{ invoiceError }}</span>
          </label>

          <div class="toggle-row">
            <label class="switch">
              <input v-model="form.requireShipping" type="checkbox" />
              <span class="switch-ui"></span>
              Require shipping address
            </label>
          </div>
        </form>
      </div>

      <div class="panel summary">
        <h2>Summary</h2>
        <div class="summary-card">
          <div class="summary-row">
            <span class="muted">Amount</span>
            <strong>{{ formattedAmount }}</strong>
          </div>
          <div class="summary-row">
            <span class="muted">Processing</span>
            <strong>{{ processingFeeLabel }}</strong>
          </div>
          <div class="summary-row total">
            <span>Total received</span>
            <strong>{{ netAmountLabel }}</strong>
          </div>
        </div>
        <button class="primary-btn" type="button" :disabled="isSubmitting" @click="createLink">
          {{ isSubmitting ? "Creating..." : "Create link" }}
        </button>
        <button class="ghost-btn full">Save draft</button>
        <p v-if="submitError" class="form-message error">{{ submitError }}</p>
        <p v-else-if="submitSuccess" class="form-message success">{{ submitSuccess }}</p>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import { createPaymentLink } from "@/services/paymentLinksApi";
import { getSettings } from "@/services/settingsApi";

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
      },
      isSubmitting: false,
      submitError: "",
      submitSuccess: "",
      invoiceFile: null,
      invoiceError: "",
      fieldErrors: {
        customerEmail: "",
        amount: "",
      },
      settings: {
        currency: "USD",
        provider: "",
        providerConfig: {},
      },
    };
  },
  computed: {
    amountValue() {
      const value = Number(this.form.amount);
      return Number.isNaN(value) ? null : value;
    },
    formattedAmount() {
      if (this.amountValue === null) return "-";
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: this.settings.currency || "USD",
      }).format(this.amountValue);
    },
    processingFeeAmount() {
      if (this.amountValue === null) return null;
      return this.getProcessingFee(this.amountValue);
    },
    processingFeeLabel() {
      if (this.processingFeeAmount === null) return "-";
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: this.settings.currency || "USD",
      }).format(this.processingFeeAmount);
    },
    netAmountLabel() {
      if (this.amountValue === null || this.processingFeeAmount === null) return "-";
      const net = this.amountValue - this.processingFeeAmount;
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: this.settings.currency || "USD",
      }).format(net);
    },
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

    this.loadSettings();
  },
  methods: {
    async loadSettings() {
      const response = await getSettings();
      if (response?.error) return;
      const data = response?.data || response || {};
      const providerName = String(data?.providers?.provider || "").trim();

      this.settings = {
        currency: data?.business?.defaultCurrency || "USD",
        provider: providerName,
        providerConfig: data?.providers || {},
      };
    },
    handleInvoiceUpload(event) {
      const file = event.target.files?.[0] || null;
      if (!file) {
        this.invoiceFile = null;
        this.invoiceError = "";
        return;
      }

      const isPdf =
        file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      const maxBytes = 3 * 1024 * 1024;

      if (!isPdf) {
        this.invoiceFile = null;
        this.invoiceError = "Only PDF files are allowed.";
        event.target.value = "";
        return;
      }

      if (file.size > maxBytes) {
        this.invoiceFile = null;
        this.invoiceError = "PDF must be 3MB or smaller.";
        event.target.value = "";
        return;
      }

      this.invoiceFile = file;
      this.invoiceError = "";
    },
    validateForm() {
      this.fieldErrors.customerEmail = "";
      this.fieldErrors.amount = "";

      const email = String(this.form.customerEmail || "").trim();
      const amountValue = Number(this.form.amount);

      if (!email) {
        this.fieldErrors.customerEmail = "Customer email is required.";
      }

      if (!this.form.amount || Number.isNaN(amountValue) || amountValue <= 0) {
        this.fieldErrors.amount = "Amount is required.";
      }

      return !this.fieldErrors.customerEmail && !this.fieldErrors.amount;
    },
    getProcessingFee(amount) {
      const config = this.settings.providerConfig || {};
      const percentRaw =
        config.processingFeePercent ?? config.processingFeeRate ?? config.feePercent ?? null;
      const flatRaw = config.processingFeeFlat ?? config.feeFlat ?? null;

      const percent = percentRaw !== null ? Number(percentRaw) : null;
      const flat = flatRaw !== null ? Number(flatRaw) : null;

      if (percent === null && flat === null) return null;
      const percentFee = !Number.isNaN(percent) ? amount * (percent / 100) : 0;
      const flatFee = !Number.isNaN(flat) ? flat : 0;
      return percentFee + flatFee;
    },
    async createLink() {
      if (!this.validateForm()) {
        this.submitError = "Please fix the highlighted fields.";
        return;
      }

      this.isSubmitting = true;
      this.submitError = "";
      this.submitSuccess = "";

      const payload = {
        customer: {
          name: this.form.customerName,
          email: this.form.customerEmail,
          company: this.form.customerCompany,
          phone: this.form.customerPhone,
        },
        linkName: this.form.linkName,
        amount: this.form.amount ? Number(this.form.amount) : null,
        description: this.form.description,
        status: "active",
        expires: this.form.expires || null,
        invoice: this.form.invoice || null,
        requireShipping: this.form.requireShipping,
        currency: this.settings.currency,
        provider: this.settings.provider,
        providerConfig: this.settings.providerConfig,
      };

      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
        let response;
        if (this.invoiceFile) {
          const formData = new FormData();
          formData.append("customer", JSON.stringify(payload.customer));
          formData.append("linkName", payload.linkName);
          formData.append("amount", payload.amount ?? "");
          formData.append("description", payload.description);
          formData.append("status", payload.status || "active");
          formData.append("expires", payload.expires ?? "");
          formData.append("invoice", payload.invoice ?? "");
          formData.append("requireShipping", String(payload.requireShipping));
          formData.append("currency", payload.currency || "");
          formData.append("provider", payload.provider || "");
          formData.append("providerConfig", JSON.stringify(payload.providerConfig || {}));
          formData.append("invoiceFile", this.invoiceFile);

          response = await axios.post(`${baseUrl}/api/payment-links`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          response = await createPaymentLink(payload);
        }
        if (response?.error) {
          throw new Error(response.error);
        }
        const created = response?.data || response || {};
        const createdId = created.id || created._id || created.linkId || "";
        const createdUrl =
          created.quicklinkUrl || created.linkUrl || created.url || created.paymentLinkUrl || "";

        this.submitSuccess = "Payment link created successfully.";
        this.$router.push({
          name: "LinkCreated",
          query: {
            id: createdId ? String(createdId) : "",
            linkName: this.form.linkName || "",
            amount: this.form.amount ? String(this.form.amount) : "",
            customer: this.form.customerName || "",
            linkUrl: createdUrl ? String(createdUrl) : "",
            quicklinkUrl: created.quicklinkUrl ? String(created.quicklinkUrl) : "",
            expires: this.form.expires || "",
          },
        });
      } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Request failed";
        this.submitError = message;
      } finally {
        this.isSubmitting = false;
      }
    },
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
.field textarea,
.field select {
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  font-size: 14px;
}

.file-input {
  padding: 8px;
  cursor: pointer;
  color: var(--text-2);
}

.file-input::file-selector-button {
  margin-right: 12px;
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text);
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.file-input::file-selector-button:hover {
  border-color: var(--border-2);
}

.field input:focus,
.field textarea:focus,
.field select:focus {
  border-color: var(--accent-400);
  box-shadow: 0 0 0 3px var(--focus);
}

.field-error {
  font-size: 12px;
  color: var(--danger);
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

.primary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
