<template>
  <section class="link-created">
    <div class="page-header">
      <div>
        <p class="breadcrumb">
          <RouterLink class="breadcrumb-link" to="/links">Payment links</RouterLink>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-current">Created</span>
        </p>
        <h1>Payment link created</h1>
        <p class="muted">
          Share the link with your customer or jump back to the list to manage it.
        </p>
      </div>
      <RouterLink class="ghost-btn" to="/links/new">Create another</RouterLink>
    </div>

    <div class="grid">
      <div class="panel">
        <div class="panel-header">
          <h2>Summary</h2>
          <span class="pill success">Active</span>
        </div>
        <div class="summary">
          <div>
            <div class="label">Link name</div>
            <div class="value">{{ linkName }}</div>
          </div>
          <div>
            <div class="label">Customer</div>
            <div class="value">{{ customerName }}</div>
          </div>
          <div>
            <div class="label">Amount</div>
            <div class="value">{{ formattedAmount }}</div>
          </div>
          <div>
            <div class="label">Expires</div>
            <div class="value">{{ expiresLabel }}</div>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <h2>Share link</h2>
        </div>
        <div class="share">
          <div class="share-row">
            <span class="label">Link URL</span>
            <a
              v-if="quicklinkUrl || linkUrl"
              class="link-text"
              :href="quicklinkUrl || linkUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ quicklinkUrl || linkUrl }}
            </a>
            <span v-else class="link-text">We will email you the link shortly.</span>
          </div>
          <div class="actions">
            <button class="primary-btn" :disabled="!linkUrl" @click="copyLink">
              Copy link
            </button>
            <RouterLink class="ghost-btn" :to="detailsTarget">
              {{ detailsLabel }}
            </RouterLink>
          </div>
          <p v-if="copyState" class="form-message success">{{ copyState }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const copyState = ref("");

const linkName = computed(() => String(route.query.linkName || "Payment link"));
const customerName = computed(() => String(route.query.customer || "Customer"));
const amount = computed(() => Number(route.query.amount || 0));
const expires = computed(() => String(route.query.expires || ""));
const linkUrl = computed(() => String(route.query.linkUrl || ""));
const quicklinkUrl = computed(() => String(route.query.quicklinkUrl || ""));
const linkId = computed(() => String(route.query.id || ""));

const formattedAmount = computed(() => {
  if (!amount.value) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount.value);
});

const expiresLabel = computed(() => (expires.value ? expires.value : "No expiry"));

const detailsTarget = computed(() => {
  if (linkId.value) {
    return { name: "PaymentLinkDetails", params: { id: linkId.value } };
  }
  return { name: "PaymentLinks" };
});

const detailsLabel = computed(() => (linkId.value ? "View details" : "Back to links"));

const copyLink = async () => {
  const url = quicklinkUrl.value || linkUrl.value;
  if (!url) return;
  try {
    await navigator.clipboard.writeText(url);
    copyState.value = "Link copied to clipboard.";
    window.setTimeout(() => {
      copyState.value = "";
    }, 2500);
  } catch (error) {
    console.error("Failed to copy link", error);
  }
};
</script>

<style scoped>
.link-created {
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

.share {
  display: grid;
  gap: 16px;
}

.share-row {
  display: grid;
  gap: 6px;
}

.link-text {
  font-size: 13px;
  color: var(--accent-700);
  word-break: break-all;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
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

.primary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ghost-btn {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  padding: 8px 14px;
  border-radius: 999px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

.muted {
  color: var(--muted);
}

.form-message {
  margin: 0;
  font-size: 13px;
}

.form-message.success {
  color: var(--success);
}

@media (max-width: 1023px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .summary {
    grid-template-columns: 1fr;
  }
}
</style>
